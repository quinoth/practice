import os
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.document import Document


def upload_document(db: Session, file, user_id, mime):
    file_id = str(uuid.uuid4())
    _, ext = os.path.splitext(file.filename)
    file_path = os.path.join(STORAGE_DIR, f"{file_id}{ext}")

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    doc = Document(
        user_id=user_id,
        file_name=file.filename,
        file_path=file_path,
        mime_type=mime,
        size=os.path.getsize(file_path)
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {"id": doc.id, "file_name": doc.file_name, "uploaded_at": doc.uploaded_at}


def get_user_documents(db: Session, user_id: int):
    return db.query(Document).filter(Document.user_id == user_id).all()


def delete_document(db: Session, doc: Document):
    try:
        os.remove(doc.file_path)
    except Exception:
        pass  # Игнорируем ошибку удаления файла

    db.delete(doc)
    db.commit()