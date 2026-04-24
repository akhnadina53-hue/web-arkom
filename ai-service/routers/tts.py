from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.tts_service import generate_speech
import os
from fastapi.responses import FileResponse

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    voice_style: str = "id-ID-ArdiNeural" # Edge-TTS voice style
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
        
        # Disini kita mengembalikan filenya utuh via API untuk diputar oleh Frontend
        # Bisa juga diupload ke Supabase terlebih dahulu, namun FastAPI serving secara langsung lebih efisien untuk temporary preview
        return FileResponse(audio_filepath, media_type="audio/mpeg", filename="tts_output.mp3")

    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))
