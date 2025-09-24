import asyncio
from confluent_kafka import Consumer, KafkaException
import json
from app.services.clickhouse_client import save_event_to_clickhouse


KAFKA_BOOTSTRAP_SERVERS = "kafka:9092"
KAFKA_TOPIC = "cprk_events"
GROUP_ID = "analytics-group"


def create_kafka_consumer():
    conf = {
        'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS,
        'group.id': GROUP_ID,
        'auto.offset.reset': 'earliest',
        'enable.auto.commit': False
    }
    return Consumer(conf)


def start_kafka_consumer():
    loop = asyncio.get_event_loop()
    loop.create_task(run_kafka_consumer())


async def run_kafka_consumer():
    consumer = create_kafka_consumer()
    try:
        consumer.subscribe([KAFKA_TOPIC])

        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                raise KafkaException(msg.error())

            # Парсим событие
            try:
                event = json.loads(msg.value().decode('utf-8'))
                await save_event_to_clickhouse(event)
                consumer.commit(msg)
            except Exception as e:
                print(f"Ошибка обработки сообщения: {e}")

    except Exception as e:
        print(f"Критическая ошибка Kafka: {e}")
    finally:
        consumer.close()