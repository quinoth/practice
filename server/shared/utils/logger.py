import json
from datetime import datetime
from functools import wraps
from typing import Callable, Optional, Dict, Any
from fastapi import Request, Response
from confluent_kafka import Producer, KafkaException
from logging import getLogger, ERROR


# === Настройки ===
KAFKA_BOOTSTRAP_SERVERS = "kafka:9092"
KAFKA_TOPIC = "cprk_events"
LOGGER_NAME = "event-logger"

# Инициализация логгера
logger = getLogger(LOGGER_NAME)


# === Инициализация Kafka Producer ===
def init_kafka_producer():
    conf = {
        'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS,
        'client.id': 'cprk-logger',
        'message.timeout.ms': 1000,   # Таймаут на отправку сообщения
        'enable.idempotence': True   # Защита от дублей
    }
    try:
        return Producer(conf)
    except KafkaException as e:
        logger.error("Не удалось подключиться к Kafka", exc_info=e)
        return None


kafka_producer = init_kafka_producer()


# === Логирование событий в Kafka ===
def log_event(event_type: str, user_id: Optional[int] = None, meta: Dict[str, Any] = {}):
    """
    Отправляет событие в Kafka.
    """

    if not kafka_producer:
        logger.warning("Kafka не доступен. Событие не будет залогировано.")
        return

    payload = {
        "event_type": event_type,
        "user_id": user_id,
        "timestamp": datetime.utcnow().isoformat(),
        "meta": meta
    }

    def delivery_report(err, msg):
        if err:
            logger.error(f"Ошибка доставки Kafka: {err} для события '{event_type}'")
        else:
            logger.debug(f"Событие '{event_type}' доставлено в Kafka: {msg.topic()} [{msg.partition()}] @ {msg.offset()}")

    try:
        kafka_producer.produce(
            KAFKA_TOPIC,
            key=event_type,
            value=json.dumps(payload),
            callback=delivery_report
        )
        kafka_producer.poll(0)
    except Exception as e:
        logger.error(f"Ошибка при отправке события '{event_type}': {str(e)}", exc_info=True)


# === Middleware для FastAPI ===
async def log_request(request: Request, call_next: Callable) -> Response:
    start_time = datetime.utcnow()
    response = await call_next(request)
    duration = (datetime.utcnow() - start_time).total_seconds() * 1000  # мс

    log_event(
        event_type="request_completed",
        meta={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "client_ip": request.client.host,
            "duration_ms": f"{duration:.2f}"
        }
    )

    return response


def setup_request_logging(app):
    """
    Подключает middleware к FastAPI-приложению.
    """

    @app.middleware("http")
    async def request_middleware(request: Request, call_next: Callable):
        return await log_request(request, call_next)

    return app


# === Декоратор для логирования вызова функций ===
def log_function_call(logger_name: str = "function-logger"):
    local_logger = getLogger(logger_name)

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            local_logger.info(f"Вызов функции: {func.__name__}", extra={"fn": func.__name__, "args": args, "kwargs": kwargs})
            try:
                result = func(*args, **kwargs)
                local_logger.info(f"Функция {func.__name__} завершена успешно", extra={"result": result})
                return result
            except Exception as e:
                local_logger.error(f"Ошибка в функции {func.__name__}: {str(e)}", exc_info=True)
                log_event(
                    event_type=f"{func.__name__}_failed",
                    meta={
                        "error": str(e),
                        "args": args,
                        "kwargs": kwargs
                    }
                )
                raise
        return wrapper
    return decorator