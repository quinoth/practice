from fastapi import FastAPI
from app.routes import stats, reports
from app.services.kafka_consumer import start_kafka_consumer

app = FastAPI(title="Analytics Service")

# Роуты
app.include_router(stats.router)
app.include_router(reports.router)

# При старте запускаем Kafka consumer
@app.on_event("startup")
def startup_event():
    start_kafka_consumer()