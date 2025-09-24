from sqlalchemy import Column, Integer, String, DateTime, Enum as SqlEnum
from sqlalchemy.orm import declarative_base
from enum import Enum

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
    birth_date = Column(DateTime)
    role = Column(SqlEnum(UserRole), default=UserRole.client, nullable=False)
    telegram_id = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def check_permissions(self, required_role: UserRole):
        # superuser может всё
        if self.role == UserRole.superuser:
            return True
        # admin может всё, кроме управления superuser
        if self.role == UserRole.admin and required_role != UserRole.superuser:
            return True
        # психолог — только свои действия
        if self.role == UserRole.psychologist and required_role in [UserRole.psychologist, UserRole.client]:
            return True
        # родитель — ограниченный доступ
        if self.role == UserRole.parent and required_role in [UserRole.client, UserRole.parent]:
            return True
        # клиент — только к себе
        if self.role == UserRole.client and required_role == UserRole.client:
            return True
        return False