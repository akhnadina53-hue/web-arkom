from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class QAGenerateRequest(BaseModel):
    transcript: str
    summary: str | None = None
    difficulty: str = "medium"
    count: int = 5


class QuestionItem(BaseModel):
    id: str
    question: str
    answer: str
    hint: str | None = None


class QAGenerateResponse(BaseModel):
    questions: list[QuestionItem]


@router.post("/generate", response_model=QAGenerateResponse)
async def generate(req: QAGenerateRequest):
    sample = [
        QuestionItem(id=str(i), question=f"Jelaskan poin {i}", answer=f"Jawaban {i}")
        for i in range(1, req.count + 1)
    ]
    return QAGenerateResponse(questions=sample)


class QAEvaluateRequest(BaseModel):
    question: str
    correct_answer: str
    user_answer: str


class QAEvaluateResponse(BaseModel):
    score: int
    feedback: str


@router.post("/evaluate", response_model=QAEvaluateResponse)
async def evaluate(req: QAEvaluateRequest):
    score = 0
    if req.user_answer and req.correct_answer:
        common = set(req.user_answer.lower().split()) & set(req.correct_answer.lower().split())
        score = min(100, int(len(common) / max(1, len(req.correct_answer.split())) * 100))
    feedback = "Coba tambahkan detail terkait poin utama." if score < 60 else "Jawaban cukup baik."
    return QAEvaluateResponse(score=score, feedback=feedback)
