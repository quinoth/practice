from fastapi import FastAPI
from app.routes import video

app = FastAPI(title="Video Consultation Service")
app.include_router(video.router)