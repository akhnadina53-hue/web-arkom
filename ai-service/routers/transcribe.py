from fastapi import APIRouter
from pydantic import BaseModel, HttpUrl

router = APIRouter()


class TranscribeRequest(BaseModel):
    audio_url: str
    language: str = "auto"


class TranscribeResponse(BaseModel):
    transcript: str
    language_detected: str
    duration: float


@router.post("/", response_model=TranscribeResponse)
async def transcribe(req: TranscribeRequest):
    return TranscribeResponse(
        transcript="(dummy) Ini hasil transkripsi dari ai-service.",
        language_detected="id",
        duration=3.2,
    )
