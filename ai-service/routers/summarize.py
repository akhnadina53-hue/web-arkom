from fastapi import APIRouter
from pydantic import BaseModel

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


@router.post("/", response_model=SummarizeResponse)
async def summarize(req: SummarizeRequest):
    return SummarizeResponse(
        title="(dummy) Judul ringkasan",
        summary="(dummy) Ini adalah ringkasan singkat untuk tujuan pengujian.",
        key_points=["Poin 1", "Poin 2", "Poin 3"],
        mind_map={"center": "Topik", "branches": []},
    )
