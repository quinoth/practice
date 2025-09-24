from fastapi import APIRouter
from app.utils.backup import backup_events, restore_events

router = APIRouter(prefix="/backup", tags=["Backup"])

@router.post("/create")
def create_backup():
    path = backup_events()
    return {"status": "ok", "backup_path": path}

@router.post("/restore/{filename}")
def restore_backup(filename: str):
    path = os.path.join("backups", filename)
    if not os.path.exists(path):
        return {"error": "Файл не найден"}

    restore_events(path)
    return {"status": "ok", "message": f"{filename} восстановлен"}