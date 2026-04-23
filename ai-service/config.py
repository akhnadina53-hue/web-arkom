import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
API_ENV = os.getenv("API_ENV", "development")

# AI Providers
WHISPER_PROVIDER = os.getenv("WHISPER_PROVIDER", "openai")
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "anthropic")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

TTS_PROVIDER = os.getenv("TTS_PROVIDER", "coqui")

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Model Paths (for local models)
WHISPER_MODEL_PATH = os.getenv("WHISPER_MODEL_PATH", "./models/whisper")
COQUI_TTS_MODEL_PATH = os.getenv("COQUI_TTS_MODEL_PATH", "./models/coqui")

# Feature Flags
ENABLE_CACHING = os.getenv("ENABLE_CACHING", "true").lower() == "true"
MAX_AUDIO_DURATION = int(os.getenv("MAX_AUDIO_DURATION", "3600"))  # 1 hour
