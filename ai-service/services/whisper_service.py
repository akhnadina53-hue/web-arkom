"""Whisper Service for Speech-to-Text transcription"""

import os
from typing import Optional
from config import WHISPER_PROVIDER, WHISPER_MODEL, OPENAI_API_KEY

class WhisperService:
    def __init__(self):
        self.provider = WHISPER_PROVIDER
        self.model = WHISPER_MODEL
    
    async def transcribe(
        self,
        audio_path: str,
        language: Optional[str] = None,
        model: Optional[str] = None
    ) -> dict:
        """
        Transcribe audio file using Whisper
        
        Args:
            audio_path: Path to audio file
            language: Language code (optional)
            model: Model size (base, small, medium, large)
        
        Returns:
            dict with transcript, language, confidence, duration
        """
        
        if self.provider == "openai":
            return await self._transcribe_openai(audio_path, language)
        elif self.provider == "local":
            return await self._transcribe_local(audio_path, language, model)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")
    
    async def _transcribe_openai(
        self,
        audio_path: str,
        language: Optional[str] = None
    ) -> dict:
        """Transcribe using OpenAI Whisper API"""
        try:
            import openai
            openai.api_key = OPENAI_API_KEY
            
            with open(audio_path, "rb") as audio_file:
                transcript = await openai.Audio.atranscribe(
                    model="whisper-1",
                    file=audio_file,
                    language=language,
                )
            
            return {
                "transcript": transcript["text"],
                "language": language or "auto",
                "confidence": 0.95,  # OpenAI doesn't provide confidence
                "duration": 0,  # Will be computed separately
            }
        except Exception as e:
            raise Exception(f"OpenAI Whisper error: {str(e)}")
    
    async def _transcribe_local(
        self,
        audio_path: str,
        language: Optional[str] = None,
        model: Optional[str] = None
    ) -> dict:
        """Transcribe using local Whisper model"""
        try:
            import whisper
            
            model_name = model or self.model or "base"
            model_obj = whisper.load_model(model_name)
            
            result = model_obj.transcribe(
                audio_path,
                language=language,
                verbose=False,
            )
            
            return {
                "transcript": result["text"],
                "language": result.get("language", language or "id"),
                "confidence": 0.85,  # Approximation
                "duration": 0,
            }
        except Exception as e:
            raise Exception(f"Local Whisper error: {str(e)}")

# Singleton instance
whisper_service = WhisperService()
