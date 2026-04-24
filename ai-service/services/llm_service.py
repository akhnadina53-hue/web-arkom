import os
import aiohttp
from openai import AsyncOpenAI
import json

from config import OPENROUTER_API_KEY, OPENROUTER_MODEL

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

async def generate_summary(transcript: str, language: str = "id", style: str = "academic"):
    """
    Generate summary, key points, and mind map items from a transcript using OpenRouter.
    """
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is missing.")

    prompt_content = f"""
    Kamu adalah asisten pengajar yang ahli dalam menstrukturkan materi kelas.
    Tolong baca transkrip berikut (berbahasa {language}) dengan gaya {style}.
    Keluarkan format JSON murni TANPA markdown blocks (```json) sama sekali, agar langsung bisa di-parse.

    Struktur yang diharapkan:
    {{
        "title": "Judul Materi",
        "summary": "Ringkasan komprehensif dalam 3 paragraf.",
        "key_points": ["Poin penting 1", "Poin penting 2", "Poin penting 3", ...],
        "mind_map": {{
            "center": "Topik Utama",
            "branches": [
                {{"label": "Sub 1", "children": ["Detil A", "Detil B"]}},
                {{"label": "Sub 2", "children": ["Detil C"]}}
            ]
        }},
        "important_terms": [
            {{"term": "Istilah 1", "definition": "Definisi istilah 1"}},
            {{"term": "Istilah 2", "definition": "Definisi istilah 2"}}
        ]
    }}

    Transkrip:
    {transcript}
    """

    try:
        response = await client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": "You are a highly capable AI assistant that strictly returns JSON output."},
                {"role": "user", "content": prompt_content}
            ]
        )
        # Ambil kontens dan bersihkan dari markdown apabila tidak patuh (fallback)
        raw_text = response.choices[0].message.content
        cleaned_text = raw_text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith("```"):
             cleaned_text = cleaned_text[:-3]

        return json.loads(cleaned_text.strip())
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        raise e

async def generate_qa(transcript: str, summary_text: str, count: int = 5):
    """
    Generate interactive Q&A evaluations based on transcript / summary.
    """
    if not OPENROUTER_API_KEY:
          raise ValueError("OPENROUTER_API_KEY is missing.")

    prompt = f"""
    Berdasarkan transkrip dan ringkasan di bawah, buatlah {count} pertanyaan kuis edukatif.
    Keluarkan format output sebagai JSON murni:
    {{
        "questions": [
            {{
                "question": "Pertanyaan 1...",
                "correct_answer": "Jawaban yang benar...",
                "hint": "Petunjuk membantu untuk menjawab..."
            }}
        ]
    }}

    Transcript/Summary:
    {summary_text}
    """

    try:
        response = await client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": "You strictly return JSON output."},
                {"role": "user", "content": prompt}
            ]
        )
        raw_text = response.choices[0].message.content
        cleaned_text = raw_text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith("```"):
             cleaned_text = cleaned_text[:-3]

        return json.loads(cleaned_text.strip())
    except Exception as e:
        print(f"Error generating QA: {str(e)}")
        raise e
