from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class TTSRequest(BaseModel):
    text: str
    voice_style: str = "female_warm"
    language: str = "id"
    speed: float = 1.0


class TTSResponse(BaseModel):
    audio_url: str
    duration: float


@router.post("/", response_model=TTSResponse)
async def tts(req: TTSRequest):
    return TTSResponse(audio_url="https://example.com/dummy-audio.mp3", duration=2.4)
