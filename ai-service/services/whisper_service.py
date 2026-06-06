import os
import asyncio
import subprocess
import imageio_ffmpeg
from groq import AsyncGroq
from config import GROQ_API_KEY
import tempfile

client = AsyncGroq(api_key=GROQ_API_KEY)

MAX_FILE_SIZE_BYTES = 24 * 1024 * 1024  # artinya 24 MB safe limit

async def transcribe_chunk(file_path: str, chunk_index: int):
    """Transcribe a single audio chunk."""
    with open(file_path, "rb") as file:
        file_content = file.read()
    
    try:
        transcription = await client.audio.transcriptions.create(
            file=(f"chunk_{chunk_index}.mp3", file_content),
            model="whisper-large-v3",
            response_format="verbose_json",
        )
        return {
            "index": chunk_index,
            "transcript": transcription.text,
            "duration": getattr(transcription, 'duration', 0) if hasattr(transcription, 'duration') else 0,
            "segments": getattr(transcription, 'segments', []) if hasattr(transcription, 'segments') else []
        }
    except Exception as e:
        print(f"[Whisper] Error transcribing chunk {chunk_index}: {e}")
        return {
            "index": chunk_index,
            "transcript": f" [Error in chunk {chunk_index}] ",
            "duration": 0,
            "segments": []
        }

async def transcribe_audio(file_path: str):
    """
    Transcribe audio file. Automatically chunks if file size > 24MB.
    """
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is missing. Harap set variable di .env")

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Audio file not found: {file_path}")

    file_size = os.path.getsize(file_path)

    if file_size <= MAX_FILE_SIZE_BYTES:
        return await transcribe_chunk(file_path, 0)

    print(f"[Whisper] Audio size {file_size/1024/1024:.2f}MB exceeds 24MB limit. Starting chunking process...")
    temp_dir = tempfile.mkdtemp()
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    cmd = [
        ffmpeg_exe, "-y",
        "-i", file_path,
        "-f", "segment",
        "-segment_time", "600",
        "-b:a", "64k",
        "-c:a", "libmp3lame",
        os.path.join(temp_dir, "chunk_%03d.mp3")
    ]
    
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"FFmpeg chunking failed: {e}")
        
    chunk_files = sorted([
        os.path.join(temp_dir, f) 
        for f in os.listdir(temp_dir) 
        if f.startswith("chunk_") and f.endswith(".mp3")
    ])

    print(f"[Whisper] Audio split into {len(chunk_files)} chunks. Starting concurrent transcription...")
    tasks = [transcribe_chunk(path, i) for i, path in enumerate(chunk_files)]
    results = await asyncio.gather(*tasks)

    for path in chunk_files:
        try:
            os.remove(path)
        except:
            pass
    try:
        os.rmdir(temp_dir)
    except:
        pass

    results.sort(key=lambda x: x["index"])

    full_transcript = " ".join([res["transcript"] for res in results])
    total_duration = sum([res["duration"] for res in results])
   
    all_segments = []
    time_offset = 0
    for res in results:
        for seg in res["segments"]:
            seg["start"] += time_offset
            seg["end"] += time_offset
            all_segments.append(seg)
        time_offset += res["duration"]

    print("[Whisper] Concurrent transcription complete!")

    return {
        "transcript": full_transcript.strip(),
        "duration": total_duration,
        "segments": all_segments
    }
