from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class TranscribeResponse(BaseModel):
    transcript: str = Field(..., description="Transcribed text")
    language: str = Field(..., description="Detected language")
    confidence: float = Field(..., description="Confidence score (0-1)")
    duration: float = Field(..., description="Audio duration in seconds")
    timestamp: datetime = Field(default_factory=datetime.now)

class KeyPoint(BaseModel):
    text: str
    importance: float

class SummaryData(BaseModel):
    text: str
    key_points: List[KeyPoint]
    sections: Optional[List[Dict[str, Any]]] = None

class SummarizeResponse(BaseModel):
    summary: SummaryData
    original_length: int = Field(..., description="Word count of original transcript")
    summary_length: int = Field(..., description="Word count of summary")
    compression_ratio: float = Field(..., description="Compression ratio")

class QuestionItem(BaseModel):
    id: str
    question: str
    correct_answer: str
    difficulty: str

class QAGenerateResponse(BaseModel):
    questions: List[QuestionItem]
    total_generated: int
    timestamp: datetime = Field(default_factory=datetime.now)

class EvaluationResult(BaseModel):
    is_correct: bool
    score: float = Field(..., description="Score 0-100")
    feedback: str
    correct_answer: str

class QAEvaluateResponse(BaseModel):
    evaluation: EvaluationResult
    learning_notes: Optional[str] = None

class TTSResponse(BaseModel):
    audio_url: str = Field(..., description="URL to generated audio file")
    duration: float = Field(..., description="Audio duration in seconds")
    voice_used: str = Field(..., description="Voice ID used")
    file_size: int = Field(..., description="File size in bytes")
    timestamp: datetime = Field(default_factory=datetime.now)

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None
