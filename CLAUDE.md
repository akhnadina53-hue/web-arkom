# CLAUDE.md — VoiceScribe AI
> Master development reference for AI Agents (Claude, GPT-5, Copilot, Cursor, etc.)
> Read this file entirely before writing any code, making any architectural decision, or suggesting any change.

---

## TABLE OF CONTENTS

1. [Project Identity](#1-project-identity)
2. [Architecture Overview](#2-architecture-overview)
3. [Repository Structure](#3-repository-structure)
4. [Service Responsibilities](#4-service-responsibilities)
5. [AI Voice Infrastructure](#5-ai-voice-infrastructure)
6. [API Endpoints & Contract](#6-api-endpoints--contract)
7. [Inter-Service Communication](#7-inter-service-communication)
8. [Security System](#8-security-system)
9. [Logging & Observability](#9-logging--observability)
10. [Database & State](#10-database--state)
11. [Environment Variables](#11-environment-variables)
12. [Error Handling Standard](#12-error-handling-standard)
13. [Development Rules](#13-development-rules)
14. [Docker & Infrastructure](#14-docker--infrastructure)
15. [Student Identity & Edu Email Strategy](#15-student-identity--edu-email-strategy)

---

## 1. PROJECT IDENTITY

```
Product Name  : VoiceScribe AI
Purpose       : Long-duration voice recording platform for students.
                Records lectures → transcribes → summarizes → Q&A review → regenerates audio.
Target Users  : University students, researchers, professionals
Core Value    : Zero-effort note-taking powered by AI
```

### Guiding Principles
- **Reliability over speed** — audio data must never be lost, even on network failure
- **Privacy by default** — user audio is ephemeral; no permanent storage unless explicitly requested
- **Graceful degradation** — if AI pipeline fails, raw transcript must still be delivered
- **Observability first** — every action, error, and state change must be logged and traceable

---

## 2. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                             │
│   Next.js 15 (App Router) · React 19 · Tailwind CSS · Zustand      │
│   Web Audio API · MediaRecorder · IndexedDB (idb) · SSE Client     │
└────────────────────────┬────────────────────────────────────────────┘
                         │ HTTPS · REST · SSE
┌────────────────────────▼────────────────────────────────────────────┐
│                     NODE.JS BACKEND (Express.js)                    │
│   Port: 4000   Auth · Orchestration · Rate Limiting · Audit Logs   │
│   JWT + OAuth2 · RBAC · API Gateway to AI Service                  │
└──────────┬──────────────────────────────────────┬───────────────────┘
           │ Internal HTTPS (mTLS)                │ PostgreSQL (Prisma)
           │ Shared Secret Header                 │
┌──────────▼──────────────────────────┐  ┌────────▼──────────────────┐
│     PYTHON AI SERVICE (FastAPI)     │  │   PostgreSQL Database     │
│     Port: 8000                      │  │   (Primary data store)    │
│     Whisper STT · Streaming STT     │  │                           │
│     Voice Style Customization       │  │   Redis (Session cache +  │
│     Audio Processing Pipeline       │  │   Rate limit counters)    │
└──────────────────────────────────────┘  └───────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│     SUPABASE STORAGE                │
│     Ephemeral audio chunks (TTL 24h)│
│     Generated audio outputs         │
└──────────────────────────────────────┘
```

### Communication Rules
- **Frontend → Backend**: Always via HTTPS REST. No direct calls to Python service from browser.
- **Backend → Python**: Internal HTTP with shared `X-Internal-Secret` header + mTLS in production.
- **Real-time updates**: Server-Sent Events (SSE) from Backend to Frontend for pipeline status.
- **No WebSockets** unless real-time bidirectional communication is explicitly required.

---

## 3. REPOSITORY STRUCTURE

```
voicescribe-ai/                         ← monorepo root
│
├── CLAUDE.md                           ← THIS FILE (agent reference)
├── .env.example                        ← all env vars with descriptions
├── docker-compose.yml                  ← full dev stack (all services)
├── docker-compose.prod.yml             ← production overrides
├── .gitignore
├── README.md
│
├── apps/
│   │
│   ├── web/                            ← NEXT.JS FRONTEND (port 3000)
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                ← Landing page
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── callback/page.tsx   ← OAuth2 callback handler
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx            ← Session list
│   │   │   ├── record/
│   │   │   │   └── page.tsx            ← CORE: recording interface
│   │   │   └── session/
│   │   │       └── [id]/
│   │   │           ├── page.tsx        ← Transcript + summary view
│   │   │           ├── qa/page.tsx     ← Q&A review mode
│   │   │           └── audio/page.tsx  ← Voice regeneration
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                     ← shadcn/ui base components
│   │   │   ├── recorder/
│   │   │   │   ├── RecorderButton.tsx
│   │   │   │   ├── WaveformVisualizer.tsx   ← Canvas API waveform
│   │   │   │   ├── RecordingTimer.tsx
│   │   │   │   ├── ChunkUploader.tsx        ← Background chunk upload
│   │   │   │   └── StatusIndicator.tsx      ← SSE pipeline status
│   │   │   ├── transcript/
│   │   │   │   ├── TranscriptView.tsx
│   │   │   │   ├── SummaryCard.tsx
│   │   │   │   ├── KeyPointsList.tsx
│   │   │   │   └── SegmentTimeline.tsx      ← Clickable timestamp nav
│   │   │   ├── qa/
│   │   │   │   ├── QASession.tsx
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   ├── AnswerInput.tsx
│   │   │   │   └── ProgressTracker.tsx
│   │   │   └── voice/
│   │   │       ├── VoiceStylePicker.tsx
│   │   │       ├── LanguageSelector.tsx
│   │   │       └── AudioPlayer.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── audio/
│   │   │   │   ├── recorder.ts         ← MediaRecorder wrapper + chunking
│   │   │   │   ├── waveform.ts         ← AnalyserNode → canvas draw
│   │   │   │   └── indexeddb.ts        ← idb: temporary chunk storage
│   │   │   ├── api/
│   │   │   │   ├── client.ts           ← Typed fetch wrapper
│   │   │   │   └── sse.ts              ← SSE connection manager
│   │   │   └── store/
│   │   │       ├── recordingStore.ts   ← Zustand
│   │   │       ├── sessionStore.ts
│   │   │       └── uiStore.ts
│   │   │
│   │   ├── middleware.ts               ← Next.js middleware (auth guard)
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── backend/                        ← NODE.JS EXPRESS BACKEND (port 4000)
│   │   ├── src/
│   │   │   ├── app.ts                  ← Express app init + middleware chain
│   │   │   ├── server.ts               ← HTTP server entry point
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── env.ts              ← Zod-validated env schema
│   │   │   │   ├── cors.ts             ← CORS whitelist config
│   │   │   │   └── oauth.ts            ← OAuth2 provider configs
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── index.ts            ← Route aggregator
│   │   │   │   ├── auth.routes.ts      ← /api/v1/auth/*
│   │   │   │   ├── sessions.routes.ts  ← /api/v1/sessions/*
│   │   │   │   ├── upload.routes.ts    ← /api/v1/upload/*
│   │   │   │   ├── pipeline.routes.ts  ← /api/v1/pipeline/*
│   │   │   │   ├── sse.routes.ts       ← /api/v1/events/:sessionId
│   │   │   │   └── health.routes.ts    ← /health, /ready
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── sessions.controller.ts
│   │   │   │   ├── upload.controller.ts
│   │   │   │   ├── pipeline.controller.ts
│   │   │   │   └── sse.controller.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── authenticate.ts     ← JWT verification
│   │   │   │   ├── authorize.ts        ← RBAC role check
│   │   │   │   ├── rateLimiter.ts      ← Redis-backed rate limiting
│   │   │   │   ├── auditLog.ts         ← Every req → audit table
│   │   │   │   ├── requestId.ts        ← Inject X-Request-ID
│   │   │   │   ├── sanitize.ts         ← Input sanitization (OWASP)
│   │   │   │   ├── helmet.ts           ← Security headers
│   │   │   │   └── errorHandler.ts     ← Global error handler
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── session.service.ts
│   │   │   │   ├── upload.service.ts   ← Supabase Storage operations
│   │   │   │   ├── pipeline.service.ts ← Orchestrate AI pipeline calls
│   │   │   │   ├── sse.service.ts      ← SSE broadcaster
│   │   │   │   ├── redis.service.ts    ← Redis client + helpers
│   │   │   │   └── aiGateway.service.ts ← HTTP client → Python service
│   │   │   │
│   │   │   ├── db/
│   │   │   │   ├── prisma.ts           ← Prisma client singleton
│   │   │   │   └── migrations/
│   │   │   │
│   │   │   ├── types/
│   │   │   │   ├── express.d.ts        ← Augment req.user
│   │   │   │   └── index.ts            ← Shared types
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── logger.ts           ← Winston structured logger
│   │   │       ├── asyncHandler.ts     ← Wrap async route handlers
│   │   │       ├── apiError.ts         ← Custom error classes
│   │   │       └── crypto.ts           ← Token hashing helpers
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── fixtures/
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ai-service/                     ← PYTHON FASTAPI SERVICE (port 8000)
│       ├── main.py                     ← FastAPI app entry point
│       ├── requirements.txt
│       ├── Dockerfile
│       │
│       ├── config.py                   ← Pydantic BaseSettings
│       │
│       ├── routers/
│       │   ├── transcribe.py           ← POST /transcribe
│       │   ├── stream.py               ← POST /transcribe/stream (SSE)
│       │   └── voice.py                ← POST /voice/customize
│       │
│       ├── services/
│       │   ├── whisper_service.py      ← Whisper model + inference
│       │   ├── streaming_service.py    ← Real-time chunked STT
│       │   ├── voice_style_service.py  ← Voice customization pipeline
│       │   └── storage_service.py      ← Download audio from Supabase
│       │
│       ├── models/
│       │   ├── requests.py             ← Pydantic input schemas
│       │   └── responses.py            ← Pydantic output schemas
│       │
│       ├── middleware/
│       │   ├── auth.py                 ← Validate X-Internal-Secret
│       │   └── logging.py              ← Structured JSON logs
│       │
│       └── utils/
│           ├── audio.py                ← ffmpeg wrappers
│           └── chunker.py              ← Audio file splitter
```

---

## 4. SERVICE RESPONSIBILITIES

### Frontend (Next.js) — ONLY responsible for:
- UI rendering and user interactions
- Chunked audio recording via Web Audio API
- Temporary chunk storage in IndexedDB
- Uploading chunks to Backend `/api/v1/upload/chunk`
- Listening to SSE stream for pipeline status updates
- Displaying transcript, summary, Q&A, and generated audio
- **NEVER** calls Python AI service directly
- **NEVER** stores sensitive tokens in localStorage (use httpOnly cookies)

### Backend (Express.js) — ONLY responsible for:
- Authentication (OAuth2 + JWT issuing)
- Authorization (RBAC enforcement)
- Request validation, sanitization, rate limiting
- Audit logging of all user actions
- Orchestrating the AI pipeline (calling Python service)
- Broadcasting SSE events to connected frontend clients
- Proxying Supabase Storage operations (presigned URLs)
- **NEVER** performs ML inference directly
- **NEVER** stores audio files locally

### AI Service (Python/FastAPI) — ONLY responsible for:
- Loading and serving Whisper STT model
- Processing audio files for transcription
- Real-time streaming transcription via chunked inference
- Voice style customization of audio output
- **NEVER** accessible directly from the internet (internal only)
- **NEVER** handles auth or user sessions

---

## 5. AI VOICE INFRASTRUCTURE

### 5.1 Speech-to-Text Pipeline (Whisper)

```
FLOW:
Audio chunks (Supabase) → Download → Merge/Validate → Whisper inference → Segments → Return

IMPLEMENTATION RULES:
- Use openai-whisper library, model: large-v3 (production) / medium (dev)
- Lazy-load model: load on first request, cache in memory afterward
- For audio > 30 minutes: split into 25-min segments, process sequentially, merge results
- Always detect language automatically unless user specifies (parameter: language="auto")
- Return: full transcript text + segments array with start/end timestamps
- Use float16 compute type on GPU, int8 on CPU for memory efficiency
- Timeout: 10 minutes max per transcription job. Raise TimeoutError if exceeded.
```

```python
# REQUIRED response structure from Whisper service
{
  "transcript": "full text...",
  "language_detected": "id",
  "duration_seconds": 7200,
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 4.2,
      "text": "segment text...",
      "confidence": 0.94
    }
  ],
  "processing_time_seconds": 42.1
}
```

### 5.2 Real-Time Streaming STT

```
FLOW:
Frontend records → 30-second chunk → Upload to Supabase → 
Backend triggers stream endpoint → Python processes chunk → 
Partial transcript sent via SSE → Frontend appends to live view

IMPLEMENTATION RULES:
- Each chunk is independently processable (no dependency on previous chunks)
- Chunks must be overlapped by 2 seconds to avoid word cutoff at boundaries
- Backend maintains chunk ordering via sequence number (chunk_index)
- SSE event format: { event: "transcript_chunk", data: { chunk_index, text, is_final } }
- After all chunks processed: merge transcripts, deduplicate overlap regions
- Maximum chunk size: 30 seconds / ~3MB WebM audio
```

### 5.3 Voice Style Customization

```
PURPOSE:
Transform the AI-generated summary text into audio with a customizable voice style.
This is NOT cloning the original speaker's voice — it transforms the written summary
into a new audio narration with selected characteristics.

SUPPORTED STYLE PARAMETERS:
- voice_gender: "male" | "female" | "neutral"
- speech_style: "formal" | "casual" | "child_friendly" | "storytelling" | "academic"
- language: "id" | "en" | "auto" (matches original transcript language)
- speed: 0.7 – 1.5 (float, default 1.0)
- emphasis_level: "low" | "medium" | "high" (affects pause and intonation)

IMPLEMENTATION:
- Use Coqui XTTS-v2 model for multilingual TTS
- Input: polished summary text (not raw transcript)
- Load speaker embeddings from curated sample bank (./assets/speaker_samples/)
- Speaker samples must be pre-recorded, licensed, non-real-person voices
- Output: WAV file → convert to MP3 (192kbps) via ffmpeg → upload to Supabase
- Timeout: 5 minutes per generation

STYLE PROMPT INJECTION (prepended to text before TTS):
child_friendly  → Simplify vocabulary. Use analogies. Max sentence length: 12 words.
storytelling    → Use narrative transitions. Add dramatic pauses via [pause] markers.
academic        → Maintain technical terms. Structured delivery. Clear enumeration.
casual          → Conversational tone. Contractions allowed. Natural flow.
```

### 5.4 Audio Processing Utilities

```python
# All audio operations MUST use these utilities (apps/ai-service/utils/audio.py)

def validate_audio(file_path: str) -> AudioMetadata:
    """Validate format (WebM/WAV/MP3), sample rate, channels, duration"""

def convert_to_wav(input_path: str, output_path: str) -> None:
    """Convert any audio format to 16kHz mono WAV for Whisper"""

def merge_chunks(chunk_paths: list[str], output_path: str) -> None:
    """Merge ordered audio chunks with overlap deduplication"""

def split_long_audio(file_path: str, segment_minutes: int = 25) -> list[str]:
    """Split audio > threshold into segments for batch processing"""

def trim_silence(file_path: str, threshold_db: float = -40.0) -> str:
    """Remove leading/trailing silence from audio"""
```

---

## 6. API ENDPOINTS & CONTRACT

> All backend endpoints are prefixed: `/api/v1`
> All responses follow the standard envelope below.

### Standard Response Envelope

```typescript
// SUCCESS
{
  "success": true,
  "data": <payload>,
  "meta": {
    "request_id": "req_01J...",
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "1.0"
  }
}

// ERROR
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",       // machine-readable
    "message": "Audio file too large", // human-readable
    "details": { "max_size_mb": 500 }, // optional context
    "request_id": "req_01J..."
  }
}
```

---

### AUTH ROUTES (`/api/v1/auth`)

```
POST   /api/v1/auth/register
       Body: { email, password, name }
       Action: Create account → detect edu domain → send verification email
       Returns: { user, requires_verification: true }
       Rate limit: 5 req/hour per IP
       Note: Do NOT issue tokens until email is verified

POST   /api/v1/auth/login
       Body: { email, password }
       Returns: { user, access_token, refresh_token }
       Rate limit: 10 req/15min per IP

POST   /api/v1/auth/refresh
       Body: { refresh_token }
       Returns: { access_token, refresh_token }
       Note: Rotate refresh token on every use (refresh token rotation)

POST   /api/v1/auth/logout
       Auth: Bearer token required
       Action: Blacklist current access token in Redis (until expiry)

POST   /api/v1/auth/verify-email
       Body: { token }                  ← token from verification email link
       Action: Mark email_verified=true, detect student domain, issue JWT
       Returns: { user, access_token, refresh_token, is_student, institution? }

POST   /api/v1/auth/resend-verification
       Body: { email }
       Rate limit: 3 req/hour per email
       Returns: { sent: true }

─── OAuth2 ROUTES ──────────────────────────────────────────────────────

GET    /api/v1/auth/oauth/:provider
       Provider: "google" | "microsoft"
       Action: Redirect to OAuth2 provider (PKCE flow)
       Query: ?redirect_uri=<frontend_callback_url>

GET    /api/v1/auth/oauth/:provider/callback
       Action:
         1. Exchange code for provider tokens (PKCE)
         2. Fetch user profile from provider
         3. Detect edu domain from email → classify as student
         4. Upsert user in DB (link provider to existing account if email matches)
         5. Issue JWT access + refresh tokens
       Returns: Redirect to frontend with tokens in URL fragment (#)
                e.g. /auth/callback#access_token=...&refresh_token=...

─── STUDENT VERIFICATION ROUTES ────────────────────────────────────────

POST   /api/v1/auth/verify-student
       Auth: Required (logged-in user)
       Body: { edu_email }             ← user submits their .ac.id / .edu email
       Action:
         1. Validate domain against EDU_DOMAIN_REGISTRY
         2. Send 6-digit OTP to that edu email
         3. Store OTP in Redis: student_otp:{userId} TTL 10min
       Returns: { sent: true, domain_recognized: true, institution: "UNNES" }
       Rate limit: 3 req/hour per user

POST   /api/v1/auth/verify-student/confirm
       Auth: Required
       Body: { edu_email, otp }
       Action:
         1. Validate OTP from Redis
         2. Mark user as STUDENT role
         3. Record verified institution domain
         4. Delete OTP from Redis
       Returns: { user, new_role: "student", institution }

GET    /api/v1/auth/me
       Auth: Bearer token required
       Returns: { user, is_student, institution?, student_verified_at? }
```

---

### SESSION ROUTES (`/api/v1/sessions`)

```
GET    /api/v1/sessions
       Auth: Required
       Query: ?page=1&limit=20&status=DONE&sort=createdAt:desc
       Returns: { sessions[], pagination }

POST   /api/v1/sessions
       Auth: Required
       Body: { title?, language? }
       Action: Create new session, return session ID
       Returns: { session }

GET    /api/v1/sessions/:id
       Auth: Required + ownership check
       Returns: { session } (full object including transcript, summary)

PATCH  /api/v1/sessions/:id
       Auth: Required + ownership check
       Body: { title? }
       Returns: { session }

DELETE /api/v1/sessions/:id
       Auth: Required + ownership check
       Action: Soft delete, schedule audio cleanup from Supabase
       Returns: { success: true }
```

---

### UPLOAD ROUTES (`/api/v1/upload`)

```
POST   /api/v1/upload/chunk
       Auth: Required
       Content-Type: multipart/form-data
       Body: { session_id, chunk_index, total_chunks, audio: File }
       Constraints:
         - max file size per chunk: 10MB
         - allowed MIME: audio/webm, audio/wav, audio/ogg
       Action:
         1. Validate chunk
         2. Upload to Supabase Storage at path: chunks/{session_id}/{chunk_index}.webm
         3. Record chunk receipt in Redis: SET chunk:{session_id}:{chunk_index} "received"
         4. Return presigned URL for verification
       Returns: { chunk_index, storage_path, chunks_received }

POST   /api/v1/upload/finalize
       Auth: Required
       Body: { session_id, total_chunks }
       Action:
         1. Verify all chunks received (check Redis)
         2. Trigger AI pipeline (async, non-blocking)
         3. Return pipeline job ID
       Returns: { job_id, session_id, status: "PROCESSING" }

GET    /api/v1/upload/presigned/:session_id
       Auth: Required + ownership check
       Action: Generate Supabase presigned download URL for session audio
       Returns: { url, expires_at }
```

---

### PIPELINE ROUTES (`/api/v1/pipeline`)

```
GET    /api/v1/pipeline/:job_id/status
       Auth: Required
       Returns: { job_id, status, progress_percent, current_step, error? }

POST   /api/v1/pipeline/:session_id/retry
       Auth: Required + ownership check
       Constraint: Only allowed if status is ERROR
       Action: Re-trigger pipeline from failed step
       Returns: { job_id, status }
```

---

### SSE ROUTE (`/api/v1/events`)

```
GET    /api/v1/events/:session_id
       Auth: Required (token via query param: ?token=<jwt>)
       Protocol: text/event-stream
       
       Events emitted:
         { event: "pipeline_status",    data: { step, status, progress } }
         { event: "transcript_chunk",   data: { chunk_index, text, is_final } }
         { event: "pipeline_complete",  data: { session_id, redirect_url } }
         { event: "pipeline_error",     data: { step, error_code, message } }
         { event: "heartbeat",          data: { timestamp } }  ← every 30s

       SSE connection rules:
         - Heartbeat every 30 seconds to prevent proxy timeout
         - Client must reconnect on disconnect (EventSource auto-reconnects)
         - Max connection duration: 3 hours (covers longest possible recording)
         - On reconnect: replay last 10 events from Redis stream
```

---

### HEALTH ROUTES

```
GET    /health
       No auth required
       Returns: { status: "ok", version, uptime_seconds }

GET    /ready
       No auth required
       Checks: DB connection, Redis connection, AI service reachability
       Returns: { ready: true, checks: { db, redis, ai_service } }
       Used by: Docker healthcheck, load balancers
```

---

### PYTHON AI SERVICE ROUTES (Internal Only)

```
POST   /transcribe
       Internal auth: X-Internal-Secret header
       Body: { audio_url, session_id, language, chunk_metadata[] }
       Returns: { transcript, language_detected, duration_seconds, segments[] }

POST   /transcribe/stream
       Internal auth: X-Internal-Secret header
       Body: { chunk_url, chunk_index, session_id, language }
       Returns: SSE stream of partial transcript events

POST   /voice/customize
       Internal auth: X-Internal-Secret header
       Body: { text, voice_gender, speech_style, language, speed, session_id }
       Returns: { audio_url, duration_seconds, file_size_bytes }

GET    /health
       Returns: { status, model_loaded, gpu_available, model_name }
```

---

## 7. INTER-SERVICE COMMUNICATION

### Backend → Python AI Service (aiGateway.service.ts)

```typescript
// REQUIRED implementation pattern
class AIGatewayService {
  private readonly baseUrl: string;
  private readonly secret: string;
  private readonly timeout: number = 600_000; // 10 minutes

  async transcribe(payload: TranscribeRequest): Promise<TranscribeResponse> {
    return this.post('/transcribe', payload);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': this.secret,
        'X-Request-ID': getCurrentRequestId(),
        'X-Source-Service': 'backend',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      throw new AIServiceError(response.status, await response.json());
    }

    return response.json();
  }
}
```

### Pipeline Orchestration (pipeline.service.ts)

```typescript
// AI pipeline steps — executed sequentially, status broadcast via SSE after each step
async function runAIPipeline(sessionId: string, jobId: string): Promise<void> {
  const steps = [
    { name: 'DOWNLOADING',    fn: downloadAndMergeChunks },
    { name: 'TRANSCRIBING',   fn: transcribeAudio },
    { name: 'SUMMARIZING',    fn: generateSummary },      // via Claude API
    { name: 'INDEXING',       fn: saveToDatabase },
    { name: 'CLEANUP',        fn: deleteTemporaryChunks },
  ];

  for (const step of steps) {
    await broadcastStatus(sessionId, { step: step.name, status: 'RUNNING' });
    try {
      await step.fn(sessionId);
      await broadcastStatus(sessionId, { step: step.name, status: 'DONE' });
    } catch (error) {
      await broadcastStatus(sessionId, { step: step.name, status: 'ERROR', error });
      await updateSessionStatus(sessionId, 'ERROR');
      throw error; // halt pipeline
    }
  }
}
```

---

## 8. SECURITY SYSTEM

> Standard: Enterprise-grade · OWASP Top 10 compliant

### 8.1 Authentication

```
JWT Configuration:
  - Access token:  15 minutes expiry, HS256 signed
  - Refresh token: 7 days expiry, stored in DB, rotated on every use
  - Token blacklist: Redis SET with TTL matching token expiry
  - Payload: { sub: userId, role, email, is_student, iat, exp }

OAuth2 Providers:
  ┌──────────────────────────────────────────────────────────────────┐
  │  Provider    │ Use Case                  │ Library              │
  │──────────────│───────────────────────────│──────────────────────│
  │  Google      │ Gmail + Google Workspace  │ passport-google-oauth20│
  │  Microsoft   │ Microsoft 365 + Azure AD  │ passport-azure-ad    │
  │  Email+Pass  │ Fallback for all users    │ bcrypt + nodemailer  │
  └──────────────────────────────────────────────────────────────────┘

  - PKCE flow mandatory for both OAuth providers (no implicit flow)
  - State parameter: cryptographically random nonce, validated on callback
  - Store provider access/refresh tokens encrypted in DB (AES-256-GCM)
  - On OAuth callback: if email already exists via different provider,
    LINK accounts (do not create duplicate user) — match by email address
  - Google scopes requested: openid, email, profile (MINIMUM — no Drive/Calendar)
  - Microsoft scopes requested: openid, email, profile, User.Read (MINIMUM)

Password Policy (for credential auth):
  - Minimum 12 characters
  - Must contain uppercase, lowercase, digit, special char
  - bcrypt hashing: cost factor 12
  - Breach detection: check against HaveIBeenPwned API on registration
  - Email must be verified before account is active (verification email sent on register)

Email Verification Flow:
  1. Register → generate secure token (crypto.randomBytes(32).toString('hex'))
  2. Hash token with SHA-256 → store hash in DB (never store raw token)
  3. Send email with link: /verify-email?token=<raw_token>
  4. On verify: hash incoming token → compare with DB hash → mark verified
  5. Token expires in 24 hours
  6. OAuth logins: email_verified = true automatically (provider already verified)
```

### 8.2 Authorization (RBAC)

```typescript
// Roles and permissions
enum Role {
  USER    = 'user',    // standard account (unverified)
  STUDENT = 'student', // verified edu email → unlocks student features
  PRO     = 'pro',     // paid tier
  ADMIN   = 'admin',   // platform admin
}

const permissions = {
  // Available to all authenticated users
  'sessions:read':         [Role.USER, Role.STUDENT, Role.PRO, Role.ADMIN],
  'sessions:write':        [Role.USER, Role.STUDENT, Role.PRO, Role.ADMIN],
  'sessions:delete':       [Role.USER, Role.STUDENT, Role.PRO, Role.ADMIN],

  // Student-exclusive features (free, but requires edu verification)
  'qa:generate':           [Role.STUDENT, Role.PRO, Role.ADMIN],
  'qa:evaluate':           [Role.STUDENT, Role.PRO, Role.ADMIN],
  'sessions:export':       [Role.STUDENT, Role.PRO, Role.ADMIN],

  // Pro-tier features
  'voice:customize':       [Role.PRO, Role.ADMIN],
  'sessions:unlimited':    [Role.PRO, Role.ADMIN],

  // Admin only
  'admin:users':           [Role.ADMIN],
  'admin:audit_logs':      [Role.ADMIN],
};

// Usage in routes
router.post('/qa/generate',
  authenticate,
  authorize('qa:generate'),          // blocks Role.USER
  asyncHandler(controller.generateQA)
);
```

### 8.3 Rate Limiting

```typescript
// Redis-backed rate limits (per user ID for authenticated, per IP for public)
const rateLimits = {
  'POST /auth/register':      { window: '1h',   max: 5 },
  'POST /auth/login':         { window: '15m',  max: 10 },
  'POST /upload/chunk':       { window: '1m',   max: 60 },   // 1 chunk/second
  'POST /upload/finalize':    { window: '1h',   max: 20 },
  'POST /pipeline/*/retry':   { window: '1h',   max: 5 },
  'DEFAULT':                  { window: '15m',  max: 200 },
};

// Response headers (always include):
// X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
// Return 429 Too Many Requests with Retry-After header when exceeded
```

### 8.4 Security Headers (Helmet.js configuration)

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      mediaSrc:    ["'self'", process.env.SUPABASE_URL],
      connectSrc:  ["'self'", process.env.SUPABASE_URL],
      frameSrc:    ["'none'"],
      objectSrc:   ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

### 8.5 Input Validation & Sanitization (OWASP)

```typescript
// EVERY route handler MUST validate input with Zod before processing
// apps/backend/src/middleware/sanitize.ts

// SQL Injection: Prisma ORM parameterized queries (never raw SQL with user input)
// XSS: Sanitize all string inputs with DOMPurify equivalent (isomorphic-dompurify)
// Path Traversal: Validate all file paths, reject '../' patterns
// File Upload: Validate MIME type via magic bytes, NOT file extension
// Request size: 50MB global limit, 10MB for audio chunks

const uploadChunkSchema = z.object({
  session_id:   z.string().cuid(),
  chunk_index:  z.number().int().min(0).max(10000),
  total_chunks: z.number().int().min(1).max(10000),
});
```

### 8.6 Audit Logging (MANDATORY for all state-changing operations)

```typescript
// Every request to authenticated routes is logged to `audit_logs` table
// apps/backend/src/middleware/auditLog.ts

interface AuditLogEntry {
  id:          string;   // cuid
  user_id:     string;
  action:      string;   // e.g., "session.delete", "auth.login"
  resource:    string;   // e.g., "session:clx123..."
  ip_address:  string;   // hashed (SHA-256), never raw
  user_agent:  string;
  request_id:  string;
  status_code: number;
  duration_ms: number;
  created_at:  Date;
}

// Retention: 90 days for regular events, 1 year for security events
// Security events: failed logins, role changes, deletions, admin actions
```

### 8.7 Internal Service Security

```
Python AI Service protection:
  - Bind to 0.0.0.0:8000 in Docker network only (NOT exposed to host in production)
  - Validate X-Internal-Secret header on every request
  - X-Internal-Secret: 64-byte random hex, rotated every 30 days
  - In production: enforce mTLS between backend and AI service containers
  - AI service has NO database access (stateless, results returned to backend)
```

---

## 9. LOGGING & OBSERVABILITY

### 9.1 Log Levels & When to Use

```
ERROR   — Unhandled exceptions, failed external calls, data integrity issues
WARN    — Rate limit approached, deprecated API usage, slow queries (>1s)
INFO    — Request lifecycle, pipeline step completion, user actions
DEBUG   — Function entry/exit, variable states (disabled in production)
```

### 9.2 Structured Log Format (JSON, all services)

```json
{
  "timestamp":   "2025-01-15T10:30:00.123Z",
  "level":       "info",
  "service":     "backend",
  "version":     "1.2.0",
  "request_id":  "req_01JKXYZ...",
  "user_id":     "usr_01JABC...",
  "session_id":  "ses_01JDEF...",
  "action":      "pipeline.transcribe.complete",
  "duration_ms": 42150,
  "message":     "Transcription completed successfully",
  "meta": {
    "audio_duration_s": 7200,
    "language": "id",
    "model": "whisper-large-v3"
  }
}
```

### 9.3 Winston Logger Setup (Backend)

```typescript
// apps/backend/src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'backend', version: process.env.npm_package_version },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// NEVER log: passwords, tokens, audio content, PII
// ALWAYS log: request_id, user_id (anonymized), action, duration
```

### 9.4 Python Logging (AI Service)

```python
# apps/ai-service/middleware/logging.py
import structlog

log = structlog.get_logger()

# Usage in services:
log.info("transcription_started",
    session_id=session_id,
    audio_duration=duration,
    model=WHISPER_MODEL,
    language=language
)

log.error("transcription_failed",
    session_id=session_id,
    error=str(e),
    step="whisper_inference"
)
```

### 9.5 Performance Monitoring

```
Track and log these metrics on every pipeline run:
  - Total pipeline duration
  - Per-step duration (download, transcribe, summarize, save)
  - Audio duration : processing time ratio
  - Memory usage at peak (Python service)
  - Whisper model inference time per minute of audio

Alert thresholds (log WARN):
  - Transcription > 2x audio duration
  - Any pipeline step > 5 minutes
  - Memory usage > 80% of container limit
  - Error rate > 5% in any 5-minute window
```

---

## 10. DATABASE & STATE

### 10.1 Prisma Schema

```prisma
// apps/backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  email_verified        Boolean   @default(false)
  name                  String?
  image                 String?
  password_hash         String?   // null for OAuth-only users
  role                  Role      @default(USER)

  // Student identity fields (populated after edu email verification)
  is_student            Boolean   @default(false)
  student_email         String?   // the verified .ac.id / .edu email
  student_domain        String?   // e.g. "students.unnes.ac.id"
  institution_name      String?   // e.g. "Universitas Negeri Semarang"
  institution_code      String?   // e.g. "UNNES"
  student_verified_at   DateTime?

  sessions              Session[]
  audit_logs            AuditLog[]
  oauth_accounts        OAuthAccount[]
  email_verifications   EmailVerification[]
  created_at            DateTime  @default(now())
  updated_at            DateTime  @updatedAt
  deleted_at            DateTime? // soft delete
}

enum Role { USER STUDENT PRO ADMIN }

model OAuthAccount {
  id              String   @id @default(cuid())
  user_id         String
  user            User     @relation(fields: [user_id], references: [id])
  provider        String   // "google" | "microsoft"
  provider_id     String   // sub claim from provider
  access_token    String   // encrypted (AES-256-GCM)
  refresh_token   String?  // encrypted
  expires_at      DateTime?
  created_at      DateTime @default(now())
  @@unique([provider, provider_id])
}

// Used for both email address verification and student OTP verification
model EmailVerification {
  id              String    @id @default(cuid())
  user_id         String
  user            User      @relation(fields: [user_id], references: [id])
  type            VerificationType
  email           String    // the email being verified
  token_hash      String    @unique  // SHA-256 of raw token/OTP
  expires_at      DateTime
  used_at         DateTime?
  created_at      DateTime  @default(now())
}

enum VerificationType {
  EMAIL_VERIFY    // standard email address verification on register
  STUDENT_OTP     // 6-digit OTP sent to .ac.id / .edu email
  PASSWORD_RESET
}

model Session {
  id              String         @id @default(cuid())
  user_id         String
  user            User           @relation(fields: [user_id], references: [id])
  title           String         @default("Untitled Recording")
  status          SessionStatus  @default(RECORDING)
  language        String?
  duration_s      Int?
  audio_url       String?        // Supabase Storage URL
  transcript      String?        @db.Text
  summary         Json?
  key_points      String[]
  total_chunks    Int            @default(0)
  qa_items        QAItem[]
  generated_audios GeneratedAudio[]
  created_at      DateTime       @default(now())
  updated_at      DateTime       @updatedAt
  deleted_at      DateTime?
}

enum SessionStatus {
  RECORDING PROCESSING DOWNLOADING TRANSCRIBING
  SUMMARIZING INDEXING DONE ERROR
}

model QAItem {
  id              String   @id @default(cuid())
  session_id      String
  session         Session  @relation(fields: [session_id], references: [id])
  question        String   @db.Text
  correct_answer  String   @db.Text
  hint            String?
  difficulty      String   @default("medium")
  user_answer     String?  @db.Text
  score           Int?
  feedback        String?  @db.Text
  created_at      DateTime @default(now())
}

model GeneratedAudio {
  id              String   @id @default(cuid())
  session_id      String
  session         Session  @relation(fields: [session_id], references: [id])
  voice_style     String
  language        String
  speed           Float    @default(1.0)
  audio_url       String
  duration_s      Int?
  created_at      DateTime @default(now())
}

model AuditLog {
  id              String   @id @default(cuid())
  user_id         String?
  user            User?    @relation(fields: [user_id], references: [id])
  action          String
  resource        String?
  ip_hash         String   // SHA-256 of IP, never raw IP
  user_agent      String?
  request_id      String
  status_code     Int
  duration_ms     Int
  created_at      DateTime @default(now())
}

model RefreshToken {
  id              String   @id @default(cuid())
  user_id         String
  token_hash      String   @unique  // SHA-256 of token
  expires_at      DateTime
  revoked_at      DateTime?
  created_at      DateTime @default(now())
}
```

### 10.2 Redis Key Patterns

```
# Session data
pipeline:job:{job_id}           → Hash: { status, step, progress, error }  TTL: 24h
pipeline:session:{session_id}   → String: job_id                            TTL: 24h

# Chunk tracking
chunk:{session_id}:{index}      → String: "received"                        TTL: 48h
chunk:count:{session_id}        → String: received_count                    TTL: 48h

# Auth
blacklist:token:{jti}           → String: "revoked"                         TTL: token expiry
session:user:{userId}           → String: session data                      TTL: 15m

# Rate limiting
rl:{endpoint}:{identifier}      → String: count                             TTL: window duration

# SSE replay buffer
sse:events:{session_id}         → List: last 10 events (JSON)               TTL: 4h
```

---

## 11. ENVIRONMENT VARIABLES

```bash
# ============================================================
# apps/web/.env.local
# ============================================================
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# ============================================================
# apps/backend/.env
# ============================================================

# Server
NODE_ENV=development
PORT=4000
LOG_LEVEL=info
API_VERSION=1.0

# Database
DATABASE_URL=postgresql://voicescribe:password@localhost:5432/voicescribe_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=<64-byte-random-hex>           # openssl rand -hex 64
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OAuth2
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=                      # Azure App Registration → Application (client) ID
MICROSOFT_CLIENT_SECRET=                  # Azure App Registration → Client secret
MICROSOFT_TENANT_ID=common               # "common" = any Microsoft account (personal + org)
OAUTH_CALLBACK_BASE_URL=http://localhost:4000/api/v1/auth/oauth

# Email (for verification emails + student OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@voicescribe.app
SMTP_PASS=
EMAIL_FROM="VoiceScribe AI <noreply@voicescribe.app>"

# Student verification
EDU_DOMAIN_REGISTRY_PATH=./data/edu_domains.json   # maintained JSON list of known .ac.id domains
STUDENT_OTP_EXPIRY_MINUTES=10

# Supabase (service role for server-side ops)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_AUDIO_BUCKET=voicescribe-audio
SUPABASE_CHUNK_TTL_HOURS=24

# Internal service
AI_SERVICE_URL=http://ai-service:8000     # Docker internal hostname
AI_SERVICE_SECRET=<64-byte-random-hex>    # openssl rand -hex 64

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://voicescribe.app

# Security
ENCRYPTION_KEY=<32-byte-hex>             # For OAuth token encryption
HAVEIBEENPWNED_API_KEY=

# ============================================================
# apps/ai-service/.env
# ============================================================

# Server
PORT=8000
ENVIRONMENT=development
LOG_LEVEL=info

# Internal auth
INTERNAL_SECRET=<same-as-AI_SERVICE_SECRET-above>

# Models
WHISPER_MODEL=large-v3                   # large-v3 | medium | small
WHISPER_DEVICE=cuda                      # cuda | cpu
WHISPER_COMPUTE_TYPE=float16             # float16 (GPU) | int8 (CPU)
COQUI_MODEL_PATH=./models/xtts_v2
SPEAKER_SAMPLES_PATH=./assets/speaker_samples

# Supabase (for downloading audio)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJ...

# Processing
MAX_AUDIO_DURATION_HOURS=4
CHUNK_OVERLAP_SECONDS=2
PROCESSING_TIMEOUT_MINUTES=10
```

---

## 12. ERROR HANDLING STANDARD

### Error Code Reference

```typescript
// apps/backend/src/utils/apiError.ts

// 4xx — Client errors
VALIDATION_ERROR         = 400   // Invalid request body/params
AUTHENTICATION_REQUIRED  = 401   // No or invalid token
INSUFFICIENT_PERMISSIONS = 403   // Valid token, wrong role
RESOURCE_NOT_FOUND       = 404   // Session/user not found
CONFLICT                 = 409   // Email already exists
PAYLOAD_TOO_LARGE        = 413   // Audio chunk > 10MB
UNSUPPORTED_MEDIA_TYPE   = 415   // Invalid audio MIME type
RATE_LIMIT_EXCEEDED      = 429   // Too many requests

// 5xx — Server errors
INTERNAL_ERROR           = 500   // Unexpected error
AI_SERVICE_UNAVAILABLE   = 503   // Python service unreachable
AI_SERVICE_TIMEOUT       = 504   // Transcription timed out
PIPELINE_FAILED          = 500   // AI pipeline step failed
```

### Async Handler Pattern (MANDATORY in all routes)

```typescript
// NEVER use try-catch in route handlers directly
// ALWAYS wrap with asyncHandler — it forwards errors to global handler

router.get('/sessions/:id', authenticate, asyncHandler(async (req, res) => {
  const session = await sessionService.findById(req.params.id, req.user.id);
  if (!session) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Session not found');
  res.json(successResponse(session));
}));
```

---

## 13. DEVELOPMENT RULES

> These rules are NON-NEGOTIABLE. Every line of code must comply.

### Code Quality
1. **TypeScript strict mode** — `"strict": true` in all tsconfig.json files. No `any` types.
2. **Zod validation** — ALL external input (request bodies, env vars, API responses) validated with Zod.
3. **No raw SQL** — Use Prisma ORM exclusively. Never `$queryRaw` with user-provided data.
4. **Async/await** — No callback-style async code. No floating Promises (always await or handle).
5. **Pydantic everywhere** — All Python FastAPI endpoints must have request and response Pydantic models.

### Security
6. **No secrets in code** — All secrets via environment variables. No hardcoded values, ever.
7. **Ownership checks** — Every resource access must verify `resource.user_id === req.user.id`.
8. **Sanitize before store** — All user-generated text content sanitized before DB insertion.
9. **Log, don't expose** — Internal errors logged with full detail, client receives only error code + safe message.
10. **httpOnly cookies** for refresh tokens in browser. Never localStorage for sensitive tokens.

### Architecture
11. **Frontend never calls AI service** — All AI requests go through Backend.
12. **Backend is stateless** — No in-memory state between requests. Redis for all shared state.
13. **Idempotent uploads** — Chunk upload with same `session_id + chunk_index` must not create duplicate.
14. **Non-blocking pipeline** — `/upload/finalize` returns immediately. Pipeline runs async. Status via SSE.
15. **Graceful shutdown** — All services handle `SIGTERM`: drain connections, complete in-flight requests, then exit.

### Testing
16. **Unit tests** for all service functions (Jest for Node, pytest for Python).
17. **Integration tests** for all API routes using real DB (test container).
18. **Never mock the database** in integration tests — use a dedicated test PostgreSQL instance.

---

## 14. DOCKER & INFRASTRUCTURE

```yaml
# docker-compose.yml (development)
version: '3.9'
services:

  web:
    build: ./apps/web
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
    depends_on: [backend]

  backend:
    build: ./apps/backend
    ports: ["4000:4000"]
    env_file: ./apps/backend/.env
    depends_on:
      db:        { condition: service_healthy }
      redis:     { condition: service_healthy }
      ai-service: { condition: service_healthy }
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  ai-service:
    build: ./apps/ai-service
    ports: ["8000:8000"]        # NOT exposed in production (internal only)
    env_file: ./apps/ai-service/.env
    volumes:
      - ./models:/app/models    # Mount pre-downloaded model files
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s         # Allow time for model loading

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: voicescribe_db
      POSTGRES_USER: voicescribe
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U voicescribe"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes: [redis_data:/data]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

### First-Time Setup Commands

```bash
# 1. Clone and install
git clone https://github.com/your-org/voicescribe-ai
cd voicescribe-ai
cp .env.example apps/backend/.env
cp .env.example apps/ai-service/.env
cp .env.example apps/web/.env.local

# 2. Install dependencies
cd apps/web && npm install
cd ../backend && npm install
cd ../ai-service && pip install -r requirements.txt

# 3. Database setup
cd apps/backend
npx prisma migrate dev --name init
npx prisma db seed

# 4. Download Whisper model (run once)
python -c "import whisper; whisper.load_model('large-v3')"

# 5. Start all services
cd ../../
docker-compose up --build

# Services running at:
# Frontend:    http://localhost:3000
# Backend API: http://localhost:4000
# AI Service:  http://localhost:8000 (internal only)
# DB:          localhost:5432
# Redis:       localhost:6379
```

---

## 15. STUDENT IDENTITY & EDU EMAIL STRATEGY

> This section documents the complete approach to student verification.
> Read carefully before implementing any auth or identity-related feature.

### 15.1 The Core Problem

University email addresses like `@students.unnes.ac.id` can be hosted on three different
infrastructures, and you CANNOT know which one without checking:

```
CASE A — Google Workspace for Education
  Email domain managed by Google. Google OAuth2 works, BUT:
  → University IT admin may have blocked third-party OAuth apps
  → User gets "Admin has disabled third-party app access" error
  → You cannot fix this from your side without campus approval

CASE B — Microsoft 365 Education
  Email domain managed by Microsoft / Azure AD.
  → Google OAuth2 does NOT work for these accounts
  → Requires Microsoft OAuth2 (Azure AD / Entra ID)
  → MICROSOFT_TENANT_ID=common covers personal + org accounts

CASE C — Self-hosted mail server
  Email managed by campus IT on their own infrastructure.
  → Neither Google nor Microsoft OAuth works
  → Only option: send OTP to that email address and verify receipt
  → This is the most reliable fallback for ALL cases
```

### 15.2 What You CAN and CANNOT Access

```
VIA OAUTH2 (Google or Microsoft) — data you CAN get:
  ✅ Email address
  ✅ Full name
  ✅ Profile picture
  ✅ Whether email is verified by the provider

DATA YOU CANNOT GET from OAuth (not available via any public API):
  ❌ Student ID / NIM
  ❌ Faculty / department / major
  ❌ Year of enrollment / graduation
  ❌ Academic transcript or grades
  ❌ Current enrollment status
  ❌ Any data from SIAKAD, SIAK, or campus academic systems

These systems are isolated internal university databases.
Access requires formal MOU/partnership with each university IT department.
Do NOT attempt to access them. Do NOT promise users you can retrieve this data.
```

### 15.3 Chosen Strategy: Domain-Based Student Detection

**Philosophy**: Verify that the user can receive email at an edu domain,
which proves institutional affiliation without requiring any campus API access.

```
STEP 1 — Domain Registry
  Maintain a JSON file: apps/backend/data/edu_domains.json
  Format:
  [
    {
      "domain": "students.unnes.ac.id",
      "institution": "Universitas Negeri Semarang",
      "code": "UNNES",
      "city": "Semarang",
      "provider_hint": "google"   // "google" | "microsoft" | "unknown"
    },
    {
      "domain": "student.ui.ac.id",
      "institution": "Universitas Indonesia",
      "code": "UI",
      "city": "Depok",
      "provider_hint": "google"
    }
    // ... add more as discovered
  ]

  This file is maintained manually. New domains added via pull request.
  Fallback: any email ending in .ac.id or .edu is treated as potential student,
  but only gets STUDENT role after OTP confirmation.

STEP 2 — Automatic detection on login
  When user logs in (any method), backend checks:
    if email.endsWith('.ac.id') || email.endsWith('.edu'):
      → flag account as potential student
      → prompt user in UI: "Looks like you have a student email! Verify it to unlock features."

STEP 3 — OTP Verification flow (works for ALL cases A, B, C)
  1. User already logged in (any method)
  2. User goes to Settings → Student Verification
  3. User enters their edu email (may be different from login email)
  4. Backend sends 6-digit OTP via nodemailer to that edu address
  5. User retrieves OTP from their campus inbox
  6. User submits OTP on platform
  7. Backend validates → upgrades role to STUDENT
  8. Stores: student_email, student_domain, institution_name, student_verified_at
```

### 15.4 OAuth Login Behavior by Provider

```typescript
// apps/backend/src/services/auth.service.ts

async function handleOAuthCallback(provider: 'google' | 'microsoft', profile: OAuthProfile) {
  const { email, name, picture, sub: providerId } = profile;

  // 1. Check if user already exists
  let user = await db.user.findUnique({ where: { email } });

  if (user) {
    // 2a. Link this OAuth account to existing user (account linking)
    await db.oAuthAccount.upsert({
      where: { provider_providerId: { provider, providerId } },
      create: { userId: user.id, provider, providerId, ...encryptedTokens },
      update: { ...encryptedTokens },
    });
  } else {
    // 2b. Create new user
    const isEduEmail = isStudentEmail(email);   // domain check
    user = await db.user.create({
      data: {
        email,
        name,
        image: picture,
        email_verified: true,                   // OAuth = pre-verified
        role: 'USER',                            // STUDENT role only after OTP
        oauth_accounts: { create: { provider, providerId, ...encryptedTokens } },
      },
    });
  }

  // 3. Issue JWT
  return issueTokenPair(user);
}

function isStudentEmail(email: string): boolean {
  const domain = email.split('@')[1];
  return domain?.endsWith('.ac.id') || domain?.endsWith('.edu') || 
         EDU_DOMAIN_REGISTRY.some(entry => entry.domain === domain);
}
```

### 15.5 Known Challenges & Mitigations

```
CHALLENGE 1: Google Workspace Admin blocks OAuth
  → Symptom: User gets "access_denied" from Google despite correct credentials
  → Mitigation: Show clear error message, redirect to OTP flow as fallback
  → Long-term: Apply for Google Workspace Marketplace listing (formal review process)
  → Error to catch: OAuth error code "admin_policy_enforced"

CHALLENGE 2: Microsoft multi-tenant complexity
  → Using TENANT_ID=common allows ANY Microsoft account (personal @outlook + org)
  → Risk: non-student personal accounts with .com email could sign in
  → Mitigation: domain check post-OAuth. Only edu domains get STUDENT role.
  → Do NOT restrict to specific tenant unless you have partnership with that university.

CHALLENGE 3: Edu email ≠ primary login email
  → A student might log in with personal Gmail but have @students.unnes.ac.id
  → Mitigation: Student verification is separate from login (Section 6 auth routes)
  → Allow any logged-in user to verify a DIFFERENT email as their student address

CHALLENGE 4: Graduated students still have edu emails
  → Domain check cannot tell if student is currently enrolled
  → Mitigation: Add re-verification every 12 months (student_verified_at TTL check)
  → Future: Add optional manual review for edge cases

CHALLENGE 5: Email OTP delivery to campus mail
  → Campus spam filters may block external senders
  → Mitigation: Use reputable SMTP provider (SendGrid / Resend), configure SPF+DKIM
  → Show message: "Check spam folder if OTP not received within 5 minutes"
  → Provide resend option with rate limit (3 per hour)
```

### 15.6 Future: LTI 1.3 Integration (Post-MVP)

```
LTI (Learning Tools Interoperability) 1.3 is the industry standard for
SSO between edtech apps and university LMS platforms (Moodle, Canvas, Blackboard).

If VoiceScribe AI gains traction with universities, implement:
  - LTI 1.3 Provider (Tool) interface
  - Allows campus to embed VoiceScribe inside their LMS
  - Provides: verified student ID, course enrollment, instructor context
  - Requires: formal contract/MOU with each university
  - Library: ltijs (Node.js)

This is out of scope for MVP. Do NOT implement until user base justifies it.
```

---

*CLAUDE.md — VoiceScribe AI · Last updated: 2025 · Version 1.1*
*This document is the single source of truth. When in doubt, refer here first.*