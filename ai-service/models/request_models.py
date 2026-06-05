from pydantic import BaseModel, Field
from typing import Optional, List

class TranscribeRequest(BaseModel):
    audio_url: str = Field(..., description="URL or path to audio file")
    language: Optional[str] = Field("id", description="Language code (e.g., 'id', 'en')")
    model: Optional[str] = Field("base", description="Whisper model size")

class SummarizeRequest(BaseModel):
    transcript: str = Field(..., description="Full transcript text to summarize")
    max_sentences: Optional[int] = Field(5, description="Maximum sentences in summary")
    language: Optional[str] = Field("id", description="Language of transcript")

class QAGenerateRequest(BaseModel):
    transcript: str = Field(..., description="Full transcript text")
    question_count: Optional[int] = Field(5, description="Number of questions to generate")
    difficulty: Optional[str] = Field("medium", description="Question difficulty level")

class QAEvaluateRequest(BaseModel):
    question: str = Field(..., description="The question")
    correct_answer: str = Field(..., description="The correct answer")
    user_answer: str = Field(..., description="User's answer")
    context: Optional[str] = Field(None, description="Additional context from transcript")

class TTSRequest(BaseModel):
    text: str = Field(..., description="Text to convert to speech")
    voice: str = Field("default", description="Voice ID or name")
    language_style: Optional[str] = Field("formal", description="Language style")
    speed: Optional[float] = Field(1.0, description="Speech speed (0.5 - 2.0)")
    language: Optional[str] = Field("id", description="Language code")

class RoadmapRequest(BaseModel):
    transcript: str = Field(..., description="Full transcript text to generate roadmap from")
    language: Optional[str] = Field("id", description="Language of transcript")
    content_type: Optional[str] = Field("auto", description="Type of content (academic, seminar, motivation, etc)")
