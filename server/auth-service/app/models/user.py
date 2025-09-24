from sqlalchemy import Column, Integer, String, DateTime, Enum as SqlEnum
from sqlalchemy.orm import declarative_base
from enum import Enum
from datetime import datetime 
Base = declarative_base()


class UserRole(str, Enum):
    client = 'client'
    parent = 'parent'
    psychologist = 'psychologist'
    admin = 'admin'
    superuser = 'superuser'


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    birth_date = Column(String)  
    role = Column(SqlEnum(UserRole), default=UserRole.client, nullable=False)
    telegram_id = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)