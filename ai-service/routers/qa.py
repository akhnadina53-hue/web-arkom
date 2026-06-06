from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_service import generate_qa

router = APIRouter()

class QAGenerateRequest(BaseModel):
    transcript: str
    summary: str | None = None
    difficulty: str = "medium"
    count: int = 5
    style: str = "academic"

class QuestionItem(BaseModel):
    question: str
    options: list[str] | None = None
    correct_answer: str
    explanation: str | None = None
    hint: str | None = None

class QAGenerateResponse(BaseModel):
    questions: list[QuestionItem]

@router.post("/generate", response_model=QAGenerateResponse)
async def generate(req: QAGenerateRequest):
    try:
        combined_text = f"Tingkat kesulitan: {req.difficulty}\n\nTranskrip:\n{req.transcript}\n\nRingkasan:\n{req.summary or ''}"
        response_json = await generate_qa(
            transcript=req.transcript,
            summary_text=combined_text,
            count=req.count,
            style=req.style
        )
        
        # Mapping properties
        questions = []
        for q in response_json.get("questions", []):
             questions.append(QuestionItem(
                 question=q.get("question", ""),
                 options=q.get("options", []),
                 correct_answer=q.get("correct_answer", ""),
                 explanation=q.get("explanation", ""),
                 hint=q.get("hint", "")
             ))

        return QAGenerateResponse(questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class QAEvaluateRequest(BaseModel):
    question: str
    correct_answer: str
    user_answer: str

class QAEvaluateResponse(BaseModel):
    score: int
    feedback: str

@router.post("/evaluate", response_model=QAEvaluateResponse)
async def evaluate(req: QAEvaluateRequest):
    # Dummy evaluator logic to evaluate the correctness using simple algorithm
    # Dalam produksi bisa memakai OpenRouter, namun untuk real-time ini sudah cepat dan gratis.
    score = 0
    if req.user_answer and req.correct_answer:
        common = set(req.user_answer.lower().split()) & set(req.correct_answer.lower().split())
        score = min(100, int(len(common) / max(1, len(req.correct_answer.split())) * 100))
    feedback = "Jawaban perlu penambahan detail agar relevan dengan inti konsep." if score < 60 else "Pemahaman Anda cukup baik."
    return QAEvaluateResponse(score=score, feedback=feedback)
