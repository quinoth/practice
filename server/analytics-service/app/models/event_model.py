from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class EventModel(BaseModel):
    event_type: str
    user_id: Optional[int] = None
    timestamp: datetime
    meta: Dict[str, object] = {}