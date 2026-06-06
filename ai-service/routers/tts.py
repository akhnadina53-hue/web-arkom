from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.tts_service import generate_speech
import os
from fastapi.responses import FileResponse

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    voice_style: str = "id-ID-ArdiNeural"
    language: str = "id"
    speed: float = 1.0

class TTSResponse(BaseModel):
    audio_url: str
    duration: float

@router.post("/")
async def tts(req: TTSRequest):
    try:
        audio_filepath = await generate_speech(
            text=req.text,
            voice=req.voice_style
        )

        return FileResponse(audio_filepath, media_type="audio/mpeg", filename="tts_output.mp3")

    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))
