from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
import os
import uuid
import tempfile
from services.whisper_service import transcribe_audio
from dependencies import verify_api_key

router = APIRouter()

class TranscribeResponse(BaseModel):
    transcript: str
    language_detected: str
    duration: float

@router.post("/", response_model=TranscribeResponse, dependencies=[Depends(verify_api_key)])
async def transcribe(file: UploadFile = File(...)):
    """
    Receive an audio file upload directly, save to temp, transcribe, return result.
    Protected by X-Api-Key header.
    """
    temp_dir = tempfile.mkdtemp()
    ext = os.path.splitext(file.filename or "audio")[1] or ".mp3"
    temp_file = os.path.join(temp_dir, f"{uuid.uuid4()}{ext}")

    try:
        content = await file.read()
        with open(temp_file, "wb") as f:
            f.write(content)

        result = await transcribe_audio(temp_file)

        return TranscribeResponse(
            transcript=result["transcript"],
            language_detected="auto",
            duration=result["duration"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)
        try:
            os.rmdir(temp_dir)
        except:
            pass
