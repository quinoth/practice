from fastapi import APIRouter, Depends, HTTPException
from fastapi.websockets import WebSocket
from app.services.bbb_integration import handle_bbb_connection
from shared.utils.logger import log_event
from shared.utils.permissions import require_permission, Permission


router = APIRouter(prefix="/video", tags=["Video"])


@router.websocket("/ws/{meeting_id}/{user_id}")
async def websocket_room(
    websocket: WebSocket,
    meeting_id: str,
    user_id: int,
    current_user: dict = Depends(require_permission(Permission.VIDEO_CALL))
):
    await handle_bbb_connection(websocket, meeting_id, user_id)