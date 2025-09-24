from fastapi import APIRouter
from app.services.clickhouse_client import get_clickhouse_client

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/daily-users")
def daily_users():
    client = get_clickhouse_client()
    result = client.query(
        "SELECT toDate(timestamp) AS day, count(DISTINCT user_id) AS users FROM events GROUP BY day ORDER BY day DESC LIMIT 30"
    )
    return result.named_results()