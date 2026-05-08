import os
import aiohttp
from openai import AsyncOpenAI
import json

from config import OPENROUTER_API_KEY, OPENROUTER_MODEL

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

def clean_json_string(text: str) -> str:
    """Helper to remove markdown code blocks from AI response."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

async def generate_summary(transcript: str, language: str = "id", style: str = "academic"):
    """
    Generate structured academic summary with focus on accessibility and clarity.
    """
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is missing.")

    prompt_content = f"""
    Anda adalah 'Fren-Edu AI', asisten pendidikan inklusif yang ahli dalam membantu mahasiswa (termasuk yang memiliki hambatan pendengaran).
    
    Tugas Anda: Analisis transkrip materi kuliah berikut dan susun menjadi ringkasan yang sangat terstruktur, jelas, dan mudah dipahami.
    Bahasa: {language}
    Gaya: {style} (tetap ramah dan edukatif).

    FORMAT OUTPUT HARUS JSON MURNI:
    {{
        "title": "Judul Materi yang Menarik",
        "summary": "Ringkasan dalam 2-3 paragraf padat. Gunakan bahasa yang inklusif dan mudah dipahami.",
        "key_points": ["Point penting 1", "Point penting 2", ...],
        "mermaid_flowchart": "graph TD; ... (Sintaks Mermaid.js untuk membuat roadmap/alur materi)",
        "comparison_table": {{
            "headers": ["Aspek", "Kategori A", "Kategori B"],
            "rows": [
                ["Definisi", "...", "..."],
                ["Kelebihan", "...", "..."]
            ]
        }},
        "mind_map": {{
            "center": "Topik Utama",
            "branches": [
                {{"label": "Sub-topik A", "children": ["Penjelasan detail 1", "2"]}},
                {{"label": "Sub-topik B", "children": ["Penjelasan detail 3"]}}
            ]
        }},
        "important_terms": [
            {{"term": "Istilah Teknis", "definition": "Penjelasan sederhana agar mudah dipahami"}}
        ],
        "accessibility_note": "Catatan singkat khusus untuk membantu pemahaman.",
    }}

    Transkrip:
    {transcript}
    """

    try:
        response = await client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": "Anda adalah AI asisten pengajar yang hanya memberikan output dalam format JSON murni."},
                {"role": "user", "content": prompt_content}
            ],
            response_format={"type": "json_object"}
        )
        
        raw_text = response.choices[0].message.content
        cleaned_text = clean_json_string(raw_text)
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        raise e

async def generate_qa(transcript: str, summary_text: str, count: int = 5):
    """
    Generate interactive and educational Q&A based on the material.
    """
    if not OPENROUTER_API_KEY:
          raise ValueError("OPENROUTER_API_KEY is missing.")

    prompt = f"""
    Berdasarkan materi kuliah ini, buatlah {count} pertanyaan interaktif untuk menguji pemahaman mahasiswa.
    Pastikan pertanyaan bervariasi (konseptual dan aplikasi).

    FORMAT OUTPUT JSON MURNI:
    {{
        "questions": [
            {{
                "question": "Pertanyaan yang menantang...",
                "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
                "correct_answer": "Pilihan yang benar",
                "explanation": "Penjelasan mengapa jawaban tersebut benar.",
                "hint": "Petunjuk jika mahasiswa kesulitan."
            }}
        ]
    }}

    Materi:
    {summary_text}
    """

    try:
        response = await client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": "Hanya kembalikan output JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        raw_text = response.choices[0].message.content
        cleaned_text = clean_json_string(raw_text)
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"Error generating QA: {str(e)}")
        raise e
