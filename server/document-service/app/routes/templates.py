from fastapi import APIRouter, Depends
from app.services.document_service import get_template_list
from shared.utils.permissions import require_permission, Permission

router = APIRouter(prefix="/templates", tags=["Templates"])

@router.get("/")
def list_templates(current_user: dict = Depends(require_permission(Permission.VIEW_DOCUMENTS))):
    return get_template_list(current_user.role)