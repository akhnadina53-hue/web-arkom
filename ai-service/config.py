import os
from dotenv import load_dotenv

load_dotenv()
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
API_ENV = os.getenv("API_ENV", "development")

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "anthropic/claude-3-5-sonnet") 

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

INTERNAL_API_SECRET = os.getenv("INTERNAL_API_SECRET", "fren-edu-super-secret-key-2026")

ENABLE_CACHING = os.getenv("ENABLE_CACHING", "true").lower() == "true"
MAX_AUDIO_DURATION = int(os.getenv("MAX_AUDIO_DURATION", "3600"))
