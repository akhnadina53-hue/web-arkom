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
    mermaid_flowchart: str | None = None
    comparison_table: dict | None = None
    mind_map: dict | None = None
    important_terms: list | None = None
    accessibility_note: str | None = None

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
            mermaid_flowchart=response_json.get("mermaid_flowchart", ""),
            comparison_table=response_json.get("comparison_table", {}),
            mind_map=response_json.get("mind_map", {}),
            important_terms=response_json.get("important_terms", []),
            accessibility_note=response_json.get("accessibility_note", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
