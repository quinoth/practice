from enum import Enum
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from shared.config.database import get_db
from app.models.user import User, UserRole

class Permission(str, Enum):
    CREATE_USER = "create_user"
    EDIT_USER = "edit_user"
    DELETE_USER = "delete_user"

    MANAGE_TESTS = "manage_tests"
    VIEW_TESTS = "view_tests"

    SCHEDULE_CONSULTATION = "schedule_consultation"
    VIEW_CONSULTATIONS = "view_consultations"

    ACCESS_DOCUMENTS = "access_documents"
    EDIT_DOCUMENTS = "edit_documents"

    USE_AI_ANALYSIS = "use_ai_analysis"

    CHAT_WITH_PSYCHOLOGIST = "chat_with_psychologist"

    EMERGENCY_ACCESS = "emergency_access"
    VIDEO_CALL = "video_call"


PERMISSIONS_MAP = {
    UserRole.superuser: [p.value for p in Permission],
    UserRole.admin: [
        Permission.MANAGE_TESTS,
        Permission.EDIT_DOCUMENTS,
        Permission.SCHEDULE_CONSULTATION,
        Permission.CREATE_USER,
        Permission.EDIT_USER,
    ],
    UserRole.psychologist: [
        Permission.VIEW_TESTS,
        Permission.VIEW_CONSULTATIONS,
        Permission.USE_AI_ANALYSIS,
        Permission.CHAT_WITH_PSYCHOLOGIST,
    ],
    UserRole.parent: [
        Permission.VIEW_TESTS,
        Permission.EMERGENCY_ACCESS,
        Permission.VIDEO_CALL,
    ],
    UserRole.child: [
        Permission.VIEW_TESTS,
        Permission.VIDEO_CALL,
    ],
}


def has_permission(user: User, required_permission: Permission):
    """
    Проверяет, есть ли у пользователя нужное разрешение.
    """
    if user.role == UserRole.superuser:
        return True

    allowed_permissions = PERMISSIONS_MAP.get(user.role, [])
    return required_permission in allowed_permissions


def require_permission(required_permission: Permission):
    """
    Декоратор / зависимость FastAPI для проверки прав.
    """
    def dependency(current_user: User = Depends(get_current_user)):
        if not has_permission(current_user, required_permission):
            raise HTTPException(
                status_code=403,
                detail=f"Нет прав для выполнения этого действия ({required_permission})"
            )
        return current_user
    return dependency