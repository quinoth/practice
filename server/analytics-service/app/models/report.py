# Это можно использовать как Pydantic модели, если нужно возвращать типизированные данные

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DailyReport(BaseModel):
    day: datetime
    count: int

class PsychologistOnlineReport(BaseModel):
    user_id: int
    hours_online: float