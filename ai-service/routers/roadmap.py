from fastapi import APIRouter, HTTPException
from models.request_models import RoadmapRequest
from models.response_models import RoadmapResponse, RoadmapSection, RoadmapNode, RoadmapResource, RoadmapLegend
from services.llm_service import generate_roadmap

router = APIRouter()

@router.post("/generate", response_model=RoadmapResponse)
async def create_roadmap(req: RoadmapRequest):
    try:
        response_json = await generate_roadmap(
            transcript=req.transcript,
            language=req.language or "id",
            content_type=req.content_type or "auto"
        )
        
        return RoadmapResponse(**response_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
