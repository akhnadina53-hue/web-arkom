from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_service import generate_summary

router = APIRouter()

class SummarizeRequest(BaseModel):
    transcript: str
    language: str = "id"
    style: str = "academic"

class SummarizeResponse(BaseModel):
    title: str
    summary: str
    key_points: list
    mind_map: dict | None = None
    important_terms: list | None = None

@router.post("/", response_model=SummarizeResponse)
async def summarize(req: SummarizeRequest):
    try:
        response_json = await generate_summary(
            transcript=req.transcript,
            language=req.language,
            style=req.style
        )
        return SummarizeResponse(
            title=response_json.get("title", "Untitled Summary"),
            summary=response_json.get("summary", ""),
            key_points=response_json.get("key_points", []),
            mind_map=response_json.get("mind_map", {}),
            important_terms=response_json.get("important_terms", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
