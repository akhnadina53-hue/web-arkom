import edge_tts
import uuid
import os

async def generate_speech(text: str, voice: str = "id-ID-ArdiNeural") -> str:
    """
    Generate speech dari teks menggunakan Microsoft Edge TTS (gratis).
    Mengembalikan absolute path ke file audio yang di-generate.
    Voice default: Indonesia (ArdiNeural - Male atau GadisNeural - Female)
    """
    # Gunakan directory temporary
    output_dir = os.getenv("TEMP_AUDIO_DIR", "./temp_audio")
    os.makedirs(output_dir, exist_ok=True)
    
    output_filename = os.path.join(output_dir, f"{uuid.uuid4()}.mp3")
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_filename)
    
    return output_filename
