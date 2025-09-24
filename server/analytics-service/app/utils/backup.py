import os
import json
from datetime import datetime
from app.services.clickhouse_client import get_clickhouse_client

BACKUP_DIR = "backups"
os.makedirs(BACKUP_DIR, exist_ok=True)


def backup_events():
    """Сохраняет все события в файл"""
    client = get_clickhouse_client()
    result = client.query("SELECT * FROM events")

    filename = os.path.join(BACKUP_DIR, f"events_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json")

    with open(filename, "w") as f:
        json.dump(result.named_results(), f, indent=2)

    print(f"Создан бэкап: {filename}")
    return filename


def restore_events(filepath: str):
    """Восстанавливает данные из файла"""
    with open(filepath, "r") as f:
        events = json.load(f)

    client = get_clickhouse_client()
    rows = [
        (
            event["event_type"],
            event["user_id"],
            event["timestamp"],
            json.dumps(event["meta"])
        ) for event in events
    ]

    try:
        client.insert("events", rows, column_names=["event_type", "user_id", "timestamp", "meta"])
        print("Данные успешно восстановлены")
    except Exception as e:
        print(f"Ошибка восстановления: {e}")