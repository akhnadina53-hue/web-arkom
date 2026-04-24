from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import uuid
import aiohttp
from services.whisper_service import transcribe_audio

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
    # Simpan URL ke file temporary lokal
    temp_dir = os.getenv("TEMP_AUDIO_DIR", "./temp_audio")
    os.makedirs(temp_dir, exist_ok=True)
    temp_file = os.path.join(temp_dir, f"{uuid.uuid4()}.m4a")

    try:
        if req.audio_url.startswith("http"):
             async with aiohttp.ClientSession() as session:
                  async with session.get(req.audio_url) as resp:
                      if resp.status != 200:
                           raise HTTPException(status_code=400, detail="Failed to download audio")
                      with open(temp_file, "wb") as f:
                           f.write(await resp.read())
        else:
             # Assume it's a local file path for testing
             temp_file = req.audio_url
             if not os.path.exists(temp_file):
                 raise HTTPException(status_code=400, detail="Local audio file not found")

        result = await transcribe_audio(temp_file)

        return TranscribeResponse(
            transcript=result["transcript"],
            language_detected="id", # Groq Whisper detect id automatically or via text
            duration=result["duration"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temporary audio
        if os.path.exists(temp_file) and req.audio_url.startswith("http"):
             os.remove(temp_file)
