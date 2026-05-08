import asyncio
import os
import sys
from dotenv import load_dotenv

# Menambahkan path ke ai-service agar bisa import config & services
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ai-service')))

from services.llm_service import generate_summary, generate_qa

async def test_llm():
    print("--- Memulai Test LLM (Claude 3.5 Sonnet via OpenRouter) ---")
    
    sample_transcript = """
    Selamat pagi semuanya. Hari ini kita akan membahas tentang arsitektur komputer Von Neumann. 
    Arsitektur ini terdiri dari tiga bagian utama: Central Processing Unit atau CPU, memori utama, dan input output. 
    Yang unik dari Von Neumann adalah instruksi dan data disimpan di memori yang sama. 
    Ini berbeda dengan arsitektur Harvard yang memisahkan memori instruksi dan data.
    Penting bagi kalian untuk memahami letak bottleneck dalam sistem ini, yang sering disebut Von Neumann Bottleneck.
    """
    
    print("\n1. Menguji Summarization...")
    try:
        summary = await generate_summary(sample_transcript)
        print("Judul:", summary.get("title"))
        print("Ringkasan:", summary.get("summary"))
        print("Poin Penting:", summary.get("key_points"))
        print("Aksesibilitas:", summary.get("accessibility_note"))
    except Exception as e:
        print("Error Summarize:", e)

    print("\n2. Menguji Q&A Generation...")
    try:
        qa = await generate_qa(sample_transcript, str(summary))
        print("Pertanyaan Pertama:", qa.get("questions")[0] if qa.get("questions") else "No data")
    except Exception as e:
        print("Error QA:", e)

if __name__ == "__main__":
    asyncio.run(test_llm())
