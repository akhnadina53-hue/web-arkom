"""Storage Service for Supabase file operations"""

import os
from typing import Optional
from config import SUPABASE_URL, SUPABASE_KEY

class StorageService:
    def __init__(self):
        self.supabase_url = SUPABASE_URL
        self.supabase_key = SUPABASE_KEY
    
    async def upload_audio_chunk(
        self,
        file_path: str,
        session_id: str,
        chunk_index: int
    ) -> dict:
        """
        Upload audio chunk to Supabase Storage
        
        Args:
            file_path: Local file path
            session_id: Session ID
            chunk_index: Chunk number
        
        Returns:
            dict with remote_url, file_size
        """
        try:
            from supabase import create_client, Client
            
            supabase: Client = create_client(self.supabase_url, self.supabase_key)
            
            # Read file
            with open(file_path, "rb") as f:
                file_data = f.read()
            
            # Generate remote path
            remote_path = f"audio-chunks/{session_id}/chunk_{chunk_index:04d}.wav"
            
            # Upload
            response = supabase.storage.from_("audio-bucket").upload(
                remote_path,
                file_data
            )
            
            return {
                "remote_url": response.json()["Key"],
                "file_size": len(file_data),
            }
        except Exception as e:
            raise Exception(f"Supabase upload error: {str(e)}")
    
    async def download_audio(
        self,
        remote_path: str
    ) -> bytes:
        """Download audio from Supabase Storage"""
        try:
            from supabase import create_client, Client
            
            supabase: Client = create_client(self.supabase_url, self.supabase_key)
            
            response = supabase.storage.from_("audio-bucket").download(remote_path)
            
            return response
        except Exception as e:
            raise Exception(f"Supabase download error: {str(e)}")

# Singleton instance
storage_service = StorageService()
