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

async def generate_qa(transcript: str, summary_text: str, count: int = 5, style: str = "academic"):
    """
    Generate interactive and educational Q&A based on the material.
    """
    if not OPENROUTER_API_KEY:
          raise ValueError("OPENROUTER_API_KEY is missing.")

    prompt = f"""
    Berdasarkan materi kuliah ini, buatlah {count} pertanyaan interaktif untuk menguji pemahaman mahasiswa.
    Gaya bahasa: {style} (gunakan gaya bahasa ini dalam memberikan 'hint' dan 'explanation').
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

async def generate_roadmap(transcript: str, language: str = "id", content_type: str = "auto", style: str = "academic"):
    """
    Generate structured learning roadmap from the transcript.
    """
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is missing.")

    prompt = f"""
    Anda adalah 'Fren-Edu Roadmap AI', ahli dalam menyusun peta pembelajaran (learning roadmap) 
    dari transkripsi audio. Transkripsi ini bisa berupa materi kuliah akademis, seminar, motivasi, atau penjelasan umum.

    TUGAS ANDA:
    Analisis transkrip berikut dan susun menjadi LEARNING ROADMAP yang terstruktur, logis, 
    dan memiliki ALUR SIRKULAR (misalnya ada tahapan pengenalan, pemahaman inti, praktik/penerapan, 
    dan diakhiri dengan refleksi/review yang menyambungkan kembali ke awal atau topik lanjutan).
    
    Tipe Konten: {content_type}
    Bahasa: {language}
    Gaya Bahasa: {style} (gunakan gaya ini dalam penjelasan node dan description)

    ATURAN PENYUSUNAN:
    1. Identifikasi SEMUA topik & konsep dari transkrip.
    2. Tambahkan prerequisite (pengetahuan dasar) jika diperlukan.
    3. Susun dalam urutan belajar yang beralur sirkular (berkesinambungan).
    4. Setiap section harus punya 2-5 node/topik.
    5. Berikan rekomendasi resource belajar per topik.
    6. Buat juga `mermaid_flowchart` berupa sintaks Mermaid.js tipe `graph TD` atau `mindmap` yang memvisualisasikan prioritas belajar, relasi konsep, dan alur belajarnya. Pastikan sintaks Mermaid-nya valid.

    FORMAT OUTPUT HARUS JSON MURNI:
    {{
        "title": "Judul Roadmap yang Deskriptif",
        "estimatedTotalTime": "X-Y jam",
        "sections": [
            {{
                "number": 1,
                "title": "Nama Section (Misal: Fondasi / Refleksi)",
                "emoji": "1️⃣",
                "description": "Penjelasan singkat section ini",
                "nodes": [
                    {{
                        "id": "node_1_1",
                        "label": "Nama Topik",
                        "type": "prerequisite|core|practice|advanced|optional|reflection",
                        "source": "from_audio|ai_recommended",
                        "description": "Penjelasan detail dan komprehensif, minimal 3-4 kalimat.",
                        "difficulty": "beginner|intermediate|advanced",
                        "estimatedTime": "X jam/menit",
                        "order": 1,
                        "resources": [
                            {{
                                "title": "Nama Resource (Harus Spesifik)",
                                "url": "https://www.youtube.com/results?search_query=kata+kunci+topik",
                                "type": "course|book|article|video|paper|tutorial",
                                "isPaid": false,
                                "platform": "YouTube/Coursera/Wikipedia"
                            }}
                        ]
                    }}
                ]
            }}
        ],
        "topics_extracted": ["topik1", "topik2"],
        "legend": [
            {{"type": "core", "emoji": "📗", "label": "Dari Materi", "color": "#52B788"}},
            {{"type": "prerequisite", "emoji": "📘", "label": "Wajib Dipahami", "color": "#5B9BD5"}},
            {{"type": "practice", "emoji": "📕", "label": "Latihan/Aplikasi", "color": "#E05C5C"}},
            {{"type": "reflection", "emoji": "🔄", "label": "Refleksi", "color": "#F4A261"}},
            {{"type": "advanced", "emoji": "🔗", "label": "Lanjutan", "color": "#A89BD9"}}
        ],
        "mermaid_flowchart": "graph TD;\\n  A[Topik Dasar] --> B[Topik Lanjutan];\\n  style A fill:#5B9BD5,stroke:#fff;"
    }}

    PENTING: 
    - Penjelasan (description) pada setiap node harus detail, informatif, dan tidak terpotong. Berikan penjelasan yang bermakna.
    - DILARANG KERAS menggunakan URL dummy/contoh seperti `https://example.com/...`. 
    - Untuk kolom `url`, berikan link pencarian nyata ke YouTube (misal: `https://www.youtube.com/results?search_query=konsep+ai`), Wikipedia, atau platform belajar lain yang valid.

    Transkrip:
    {transcript}
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
        print(f"Error generating roadmap: {str(e)}")
        raise e
