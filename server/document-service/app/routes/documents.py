from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.models.document import Document
from app.services.document_service import upload_document, get_user_documents, delete_document
from shared.utils.logger import log_event
from shared.utils.permissions import require_permission, Permission
from app.config.settings import STORAGE_DIR, ALLOWED_MIME_TYPES
from shared.config.database import get_db


router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_permission(Permission.ACCESS_DOCUMENTS))
):
    content = file.file.read()
    file.file.seek(0)

    # Проверяем MIME тип
    import magic
    mime = magic.from_buffer(content, mime=True)

    if mime not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Недопустимый формат файла")

    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Файл больше {MAX_FILE_SIZE_MB} MB")

    return upload_document(db=db, file=file, user_id=current_user.id, mime=mime)


@router.get("/list")
def list_documents(db: Session = Depends(get_db), current_user: dict = Depends(require_permission(Permission.VIEW_DOCUMENTS))):
    docs = get_user_documents(db=db, user_id=current_user.id)
    return docs


@router.get("/download/{doc_id}")
def download_document(doc_id: int, db: Session = Depends(get_db), current_user: dict = Depends(require_permission(Permission.VIEW_DOCUMENTS))):
    doc = db.query(Document).get(doc_id)

    if not doc:
        raise HTTPException(status_code=404, detail="Документ не найден")

    if doc.user_id != current_user.id and not current_user.is_admin():
        raise HTTPException(status_code=403, detail="Нет прав на скачивание")

    log_event("document_downloaded", user_id=current_user.id, meta={"doc_id": doc_id, "file_name": doc.file_name})
    
    return FileResponse(
        path=doc.file_path,
        filename=doc.file_name,
        media_type=doc.mime_type
    )


@router.delete("/delete/{doc_id}")
def remove_document(doc_id: int, db: Session = Depends(get_db), current_user: dict = Depends(require_permission(Permission.DELETE_DOCUMENTS))):
    doc = db.query(Document).get(doc_id)

    if not doc:
        raise HTTPException(status_code=404, detail="Документ не найден")

    if doc.user_id != current_user.id and not current_user.is_admin():
        raise HTTPException(status_code=403, detail="Нет прав на удаление")

    delete_document(db, doc)
    log_event("document_deleted", user_id=current_user.id, meta={"doc_id": doc_id, "file_name": doc.file_name})

    return {"status": "ok", "message": "Документ удалён"}
@router.get("/search")
def search_documents(name: str, db: Session = Depends(get_db), current_user: dict = Depends(require_permission(Permission.VIEW_DOCUMENTS))):
    docs = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.file_name.ilike(f"%{name}%")
    ).all()

    return docs