"""TTS Service for Text-to-Speech audio generation"""

import os
import io
from typing import Optional
from config import TTS_PROVIDER

class TTSService:
    def __init__(self):
        self.provider = TTS_PROVIDER
    
    async def generate_speech(
        self,
        text: str,
        voice: str = "default",
        language_style: str = "formal",
        speed: float = 1.0,
        language: str = "id"
    ) -> dict:
        """
        Generate speech from text
        
        Args:
            text: Text to convert to speech
            voice: Voice ID
            language_style: formal, casual, academic
            speed: Speech speed (0.5 - 2.0)
            language: Language code
        
        Returns:
            dict with audio_url, duration, voice_used, file_size
        """
        
        if self.provider == "coqui":
            return await self._generate_coqui(text, voice, speed, language)
        elif self.provider == "elevenlabs":
            return await self._generate_elevenlabs(text, voice, speed, language)
        else:
            raise ValueError(f"Unsupported TTS provider: {self.provider}")
    
    async def _generate_coqui(
        self,
        text: str,
        voice: str = "default",
        speed: float = 1.0,
        language: str = "id"
    ) -> dict:
        """Generate using Coqui TTS (local/free)"""
        try:
            from TTS.api import TTS
            
            model_name = "tts_models/multilingual/multi-dataset/xtts_v2"
            tts = TTS(model_name=model_name, progress_bar=True, gpu=True)
            
            # Coqui TTS output
            wav_path = f"/tmp/output_{id(text)}.wav"
            tts.tts_to_file(
                text=text,
                file_path=wav_path,
                speaker="default",
                language=language
            )
            
            # Read file and get size
            with open(wav_path, "rb") as f:
                audio_data = f.read()
            
            file_size = len(audio_data)
            
            # In real implementation, upload to storage and get URL
            audio_url = f"file://{wav_path}"  # Placeholder
            
            return {
                "audio_url": audio_url,
                "duration": 0,  # Will be computed separately
                "voice_used": voice,
                "file_size": file_size,
            }
        except Exception as e:
            raise Exception(f"Coqui TTS error: {str(e)}")
    
    async def _generate_elevenlabs(
        self,
        text: str,
        voice: str = "default",
        speed: float = 1.0,
        language: str = "id"
    ) -> dict:
        """Generate using ElevenLabs API"""
        try:
            import elevenlabs
            
            audio = elevenlabs.generate(
                text=text,
                voice=voice,
                model="eleven_monolingual_v1"
            )
            
            return {
                "audio_url": "https://elevenlabs.io/...",  # Placeholder
                "duration": 0,
                "voice_used": voice,
                "file_size": len(audio),
            }
        except Exception as e:
            raise Exception(f"ElevenLabs TTS error: {str(e)}")

# Singleton instance
tts_service = TTSService()
