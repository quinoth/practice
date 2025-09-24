from fastapi import APIRouter
from app.services.clickhouse_client import get_clickhouse_client

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/users-by-period")
def users_by_period(period: str = "day"):
    client = get_clickhouse_client()

    if period == "week":
        group_by = "toStartOfWeek(timestamp)"
    elif period == "month":
        group_by = "toStartOfMonth(timestamp)"
    else:
        group_by = "toDate(timestamp)"

    result = client.query(
        f"SELECT {group_by} AS period, count(*) AS total FROM events WHERE event_type='login' GROUP BY period"
    )
    return result.named_results()