from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import transcribe, summarize, qa, tts, roadmap

app = FastAPI(title="Fren-Edu AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcribe.router, prefix="/transcribe")
app.include_router(summarize.router, prefix="/summarize")
app.include_router(qa.router, prefix="/qa")
app.include_router(tts.router, prefix="/tts")
app.include_router(roadmap.router, prefix="/roadmap")


@app.get("/")
async def root():
    return {"status": "ok", "service": "Fren-Edu AI (prototype)"}
