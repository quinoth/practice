import clickhouse_connect
from shared.config.settings import CLICKHOUSE_CONFIG


def get_clickhouse_client():
    return clickhouse_connect.get_client(
        host=CLICKHOUSE_CONFIG["host"],
        port=CLICKHOUSE_CONFIG["port"],
        username=CLICKHOUSE_CONFIG["username"],
        password=CLICKHOUSE_CONFIG.get("password", "")
    )


async def save_event_to_clickhouse(event: dict):
    client = get_clickhouse_client()

    event_type = event.get("event_type", "unknown")
    user_id = event.get("user_id")
    timestamp = event.get("timestamp")
    meta = event.get("meta", {})

    try:
        client.insert(
            'events',
            [[event_type, user_id, timestamp, json.dumps(meta)]],
            column_names=['event_type', 'user_id', 'timestamp', 'meta']
        )
    except Exception as e:
        print(f"[ClickHouse] Ошибка записи: {e}")