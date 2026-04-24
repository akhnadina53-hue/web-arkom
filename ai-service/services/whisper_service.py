import os
from groq import AsyncGroq
from config import GROQ_API_KEY

client = AsyncGroq(api_key=GROQ_API_KEY)

async def transcribe_audio(file_path: str):
    """
    Transcribe audio file using Groq's high-speed Whisper-large-v3 API.
    """
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is missing. Harap set variable di .env")

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Audio file not found: {file_path}")

    with open(file_path, "rb") as file:
        file_content = file.read()
    
    # We pass the file tuple (filename, content) as expected by Groq client
    transcription = await client.audio.transcriptions.create(
        file=(os.path.basename(file_path), file_content),
        model="whisper-large-v3",
        response_format="verbose_json",
    )
    
    return {
        "transcript": transcription.text,
        "duration": getattr(transcription, 'duration', 0) if hasattr(transcription, 'duration') else 0,
        "segments": getattr(transcription, 'segments', []) if hasattr(transcription, 'segments') else []
    }
