import os
import asyncio
from pydub import AudioSegment
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
    audio = AudioSegment.from_file(file_path)
   
    CHUNK_LENGTH_MS = 10 * 60 * 1000 
    
    chunks = []
    for i in range(0, len(audio), CHUNK_LENGTH_MS):
        chunk = audio[i:i + CHUNK_LENGTH_MS]
        chunks.append(chunk)

    print(f"[Whisper] Audio split into {len(chunks)} chunks.")

    temp_dir = tempfile.mkdtemp()
    chunk_files = []

    for i, chunk in enumerate(chunks):
        chunk_path = os.path.join(temp_dir, f"chunk_{i}.mp3")
        chunk.export(chunk_path, format="mp3", parameters=["-b:a", "64k"])
        chunk_files.append(chunk_path)

    print(f"[Whisper] Starting concurrent transcription for {len(chunks)} chunks...")
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
