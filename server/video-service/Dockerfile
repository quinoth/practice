FROM python:3.11-slim

WORKDIR /app

# Установка shared как пакета
COPY shared /app/shared
RUN pip install -e /app/shared

# Копируем код сервиса
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8005"]