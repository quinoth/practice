import asyncio
import websockets
import json
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.room import RoomStatus
from shared.utils.logger import log_event
from app.models.consultation import update_consultation_status
from shared.config.database import get_db


BBB_WS_URL = "wss://demo.bigbluebutton.org/html5client/Ngrok"
BBB_ROOM_TIMEOUT = 3600  # 1 час максимум


async def handle_bbb_connection(ws: WebSocket, meeting_id: str, user_id: int):
    """
    Обрабатывает подключение к BBB через WebSocket.
    При завершении соединения обновляет статус консультации.
    """
    await ws.accept()

    # Начинаем подключение к BBB
    try:
        async with websockets.connect(f"{BBB_WS_URL}?meetingID={meeting_id}&userID={user_id}") as bbb_ws:
            # Отправляем событие о начале звонка
            await log_event("video_call_started", user_id, {
                "meeting_id": meeting_id,
                "timestamp": datetime.utcnow().isoformat()
            })

            # Запускаем трансляцию между клиентом и BBB
            async def forward_client():
                while True:
                    data = await ws.receive_text()
                    if data == "end_call":
                        await bbb_ws.send(json.dumps({"type": "leave", "meeting_id": meeting_id}))
                        break
                    await bbb_ws.send(data)

            async def forward_bbb():
                while True:
                    try:
                        msg = await bbb_ws.recv()
                        event = json.loads(msg)

                        # Проверяем завершение звонка
                        if event.get("type") == "room-ended" or event.get("status") == "ended":
                            await log_event("video_call_ended", user_id, {
                                "meeting_id": meeting_id,
                                "ended_at": datetime.utcnow().isoformat()
                            })
                            await update_consultation_status(meeting_id, status="completed")
                            await ws.send_text(json.dumps({"status": "ended"}))
                            break

                        # Передаём сообщение клиенту
                        await ws.send_text(msg)

                    except Exception as e:
                        await ws.send_text(json.dumps({"error": str(e)}))
                        break

            # Запускаем обмен
            await asyncio.gather(forward_client(), forward_bbb())

    except websockets.exceptions.ConnectionClosed:
        await log_event("video_call_disconnected", user_id, {"meeting_id": meeting_id})
        await update_consultation_status(meeting_id, status="missed")
    except Exception as e:
        await log_event("video_call_error", user_id, {"meeting_id": meeting_id, "error": str(e)})
        await update_consultation_status(meeting_id, status="cancelled")