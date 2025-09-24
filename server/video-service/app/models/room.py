from enum import Enum
from pydantic import BaseModel
from datetime import datetime


class RoomStatus(str, Enum):
    active = "active"
    ended = "ended"
    cancelled = "cancelled"
    disconnected = "disconnected"


class RoomCreate(BaseModel):
    psychologist_id: int
    client_id: int
    consultation_id: int


class Room(RoomCreate):
    meeting_id: str
    status: RoomStatus = RoomStatus.active
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None