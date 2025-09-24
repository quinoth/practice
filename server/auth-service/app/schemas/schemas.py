from enum import Enum
from pydantic import BaseModel
from datetime import datetime

class UserRole(str, Enum):
    client = 'client'
    parent = 'parent'
    psychologist = 'psychologist'
    admin = 'admin'
    superuser = 'superuser'

class UserBase(BaseModel):
    email: str
    role: UserRole

class UserCreate(UserBase):
    password: str
    first_name: str | None = None
    last_name: str | None = None
    birth_date: str | None = None

class UserUpdate(BaseModel):
    role: UserRole

class UserInDB(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: UserRole