from fastapi import FastAPI
from app.routes import documents, templates

app = FastAPI(title="Document Service")

app.include_router(documents.router)
app.include_router(templates.router)