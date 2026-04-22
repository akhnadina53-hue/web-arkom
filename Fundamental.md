# 🎓 Fren-Edu — AI-Powered Learning Platform

**VoiceScribe AI** untuk mahasiswa/pelajar yang memungkinkan:
- 🎙️ Merekam suara berdurasi panjang (unlimited)
- 📝 Transkripsi otomatis (Whisper STT)
- 🧠 Ringkasan AI terstruktur (Claude / OpenAI)
- ❓ Q&A interaktif dari materi
- 🔊 Regenerasi audio dengan kustomisasi suara (Coqui TTS)

---

## 🏗️ TECH STACK (WAJIB IKUTI)

```
Frontend     : Next.js 15 (App Router) + React 19 + Tailwind CSS v4
Styling      : Tailwind CSS + shadcn/ui
State Mgmt   : Zustand
Recording    : Web Audio API + MediaRecorder API (chunked streaming)
Client Store : IndexedDB (via idb library) — penyimpanan sementara audio
Backend      : Next.js API Routes (App Router)
AI Service   : Python 3.11 + FastAPI (microservice terpisah, port 8000)
STT          : OpenAI Whisper (via whisper library, model: medium/large-v3)
LLM          : Anthropic Claude API (claude-sonnet) — summarization & Q&A
TTS          : Coqui TTS (xtts_v2 model) — voice regeneration
Database     : PostgreSQL + Prisma ORM
Auth         : NextAuth.js v5 (credentials + Google OAuth)
File Storage : Supabase Storage (audio chunks sementara, auto-delete 24 jam)
Deployment   : Docker Compose (dev), Vercel (frontend) + Railway (Python service)
```

---

## 📁 PROJECT STRUCTURE

```
voicescribe-ai/
├── .env.local                        # Environment variables
├── .env.example                      # Template env
├── docker-compose.yml                # Dev environment
├── README.md
│
├── apps/
│   ├── web/                          # Next.js 15 App (Frontend + Backend API)
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Daftar semua rekaman
│   │   │   │   └── layout.tsx
│   │   │   ├── record/
│   │   │   │   └── page.tsx          # Halaman recording utama
│   │   │   ├── session/
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Hasil transkrip + summary
│   │   │   │       ├── qa/page.tsx   # Mode Q&A review
│   │   │   │       └── audio/page.tsx # Halaman TTS regenerasi
│   │   │   └── api/
│   │   │       ├── auth/[...nextauth]/route.ts
│   │   │       ├── sessions/
│   │   │       │   ├── route.ts      # GET all, POST new session
│   │   │       │   └── [id]/route.ts # GET, PUT, DELETE session
│   │   │       ├── upload/
│   │   │       │   └── chunk/route.ts # Upload audio chunk ke Supabase
│   │   │       └── ai/
│   │   │           ├── transcribe/route.ts   # Trigger Whisper via Python service
│   │   │           ├── summarize/route.ts    # Trigger Claude summarization
│   │   │           ├── qa/route.ts           # Generate + evaluate Q&A
│   │   │           └── tts/route.ts          # Trigger Coqui TTS
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── recorder/
│   │   │   │   ├── RecorderButton.tsx       # Tombol record utama
│   │   │   │   ├── WaveformVisualizer.tsx   # Animasi gelombang suara
│   │   │   │   ├── RecordingTimer.tsx       # Timer durasi rekaman
│   │   │   │   └── ChunkUploader.tsx        # Upload chunk ke storage
│   │   │   ├── transcript/
│   │   │   │   ├── TranscriptView.tsx       # Tampilan full transkrip
│   │   │   │   ├── SummaryCard.tsx          # Kartu ringkasan AI
│   │   │   │   ├── KeyPointsList.tsx        # Poin-poin penting
│   │   │   │   └── MindMapView.tsx          # Visualisasi mind map
│   │   │   ├── qa/
│   │   │   │   ├── QASession.tsx            # Sesi tanya jawab interaktif
│   │   │   │   ├── QuestionCard.tsx         # Kartu pertanyaan
│   │   │   │   ├── AnswerEvaluator.tsx      # Evaluasi jawaban user
│   │   │   │   └── ProgressTracker.tsx      # Progress pemahaman
│   │   │   └── audio-gen/
│   │   │       ├── VoiceSelector.tsx        # Pilih gaya suara
│   │   │       ├── LanguageStylePicker.tsx  # Pilih gaya bahasa
│   │   │       └── AudioPlayer.tsx          # Player audio hasil TTS
│   │   │
│   │   ├── lib/
│   │   │   ├── audio/
│   │   │   │   ├── recorder.ts       # Web Audio API wrapper
│   │   │   │   ├── chunker.ts        # Chunk audio ke blob 30 detik
│   │   │   │   └── indexeddb.ts      # IndexedDB operations (idb)
│   │   │   ├── api/
│   │   │   │   └── client.ts         # API client (fetch wrapper)
│   │   │   ├── store/
│   │   │   │   ├── recordingStore.ts  # Zustand: recording state
│   │   │   │   ├── sessionStore.ts    # Zustand: session data
│   │   │   │   └── qaStore.ts         # Zustand: Q&A state
│   │   │   └── utils/
│   │   │       ├── format.ts          # Format time, text, dll
│   │   │       └── constants.ts       # App constants
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   │
│   │   ├── types/
│   │   │   └── index.ts               # Global TypeScript types
│   │   │
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ai-service/                   # Python FastAPI Microservice
│       ├── main.py                   # FastAPI entry point
│       ├── requirements.txt
│       ├── Dockerfile
│       ├── routers/
│       │   ├── transcribe.py         # POST /transcribe — Whisper STT
│       │   ├── summarize.py          # POST /summarize — Claude API call
│       │   ├── qa.py                 # POST /qa/generate, POST /qa/evaluate
│       │   └── tts.py                # POST /tts — Coqui TTS
│       ├── services/
│       │   ├── whisper_service.py    # Whisper model loader + inference
│       │   ├── claude_service.py     # Anthropic SDK wrapper
│       │   ├── tts_service.py        # Coqui TTS wrapper
│       │   └── storage_service.py   # Download audio dari Supabase
│       ├── models/
│       │   ├── request_models.py     # Pydantic request schemas
│       │   └── response_models.py    # Pydantic response schemas
│       └── config.py                 # Env config + model paths
│
└── packages/
    └── shared-types/                 # Shared TypeScript types (optional monorepo)
        └── index.ts
```

---

## 🗄️ DATABASE SCHEMA (Prisma)

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  image     String?
  sessions  Session[]
  createdAt DateTime  @default(now())
}

model Session {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  title         String      @default("Untitled Recording")
  status        SessionStatus @default(RECORDING)
  duration      Int?        // dalam detik
  language      String      @default("id") // deteksi otomatis
  audioUrl      String?     // Supabase storage URL
  transcript    String?     // full transcript text
  summary       Json?       // structured summary dari Claude
  keyPoints     String[]    // array poin penting
  mindMap       Json?       // data mind map
  qaHistory     QAItem[]
  generatedAudios GeneratedAudio[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum SessionStatus {
  RECORDING
  PROCESSING
  TRANSCRIBING
  SUMMARIZING
  DONE
  ERROR
}

model QAItem {
  id          String   @id @default(cuid())
  sessionId   String
  session     Session  @relation(fields: [sessionId], references: [id])
  question    String
  correctAnswer String
  userAnswer  String?
  score       Int?     // 0-100
  feedback    String?
  createdAt   DateTime @default(now())
}

model GeneratedAudio {
  id          String   @id @default(cuid())
  sessionId   String
  session     Session  @relation(fields: [sessionId], references: [id])
  voiceStyle  String   // "female_formal", "child_friendly", dll
  language    String
  audioUrl    String
  createdAt   DateTime @default(now())
}
```

---

## 🔌 API CONTRACT

### Next.js → Python AI Service

**POST `/transcribe`**
```json
// Request
{ "audio_url": "https://supabase.../audio.webm", "language": "auto" }

// Response
{ "transcript": "...", "language_detected": "id", "duration": 7200, "segments": [...] }
```

**POST `/summarize`**
```json
// Request
{ "transcript": "...", "language": "id", "style": "academic" }

// Response
{
  "title": "...",
  "summary": "...",
  "key_points": ["...", "..."],
  "mind_map": { "center": "...", "branches": [...] },
  "important_terms": [{ "term": "...", "definition": "..." }]
}
```

**POST `/qa/generate`**
```json
// Request
{ "transcript": "...", "summary": "...", "difficulty": "medium", "count": 10 }

// Response
{ "questions": [{ "id": "...", "question": "...", "answer": "...", "hint": "..." }] }
```

**POST `/qa/evaluate`**
```json
// Request
{ "question": "...", "correct_answer": "...", "user_answer": "..." }

// Response
{ "score": 85, "feedback": "...", "suggestion": "..." }
```

**POST `/tts`**
```json
// Request
{ "text": "...", "voice_style": "female_warm", "language": "id", "speed": 1.0 }

// Response
{ "audio_url": "...", "duration": 320 }
```

---

## 🎙️ CORE LOGIC — CHUNKED RECORDING

```
User klik Record
    → MediaRecorder.start(30000)  // chunk tiap 30 detik
    → ondataavailable → simpan ke IndexedDB (sementara)
    → setiap chunk → upload ke Supabase Storage
    
User klik Stop
    → gabungkan semua chunk URL
    → kirim ke /api/ai/transcribe
    → status: PROCESSING → TRANSCRIBING → SUMMARIZING → DONE
    → hapus data IndexedDB (cleanup)
```

---

## 🎨 UI/UX DESIGN PRINCIPLES

- **Color palette**: Deep navy `#0a0f1e` + Electric teal `#00d4aa` + Warm white `#f5f0eb`
- **Font**: `Sora` (heading) + `JetBrains Mono` (transcript/code) + `Nunito` (body)
- **Tema**: Dark, futuristic tapi tetap hangat — seperti "command center untuk belajar"
- **Animasi**: Waveform gelombang suara real-time saat recording, smooth transitions
- **Layout**: Sidebar navigation + main content area, responsive mobile-first

---

## ⚙️ ENVIRONMENT VARIABLES

```env
# Next.js
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/voicescribe

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Python AI Service
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_SECRET=  # shared secret untuk validasi request

# Python service (.env)
ANTHROPIC_API_KEY=
WHISPER_MODEL=large-v3
COQUI_MODEL_PATH=./models/xtts_v2
SUPABASE_URL=
SUPABASE_KEY=
```

---

## 📋 DEVELOPMENT PHASES & TASKS

### Phase 1 — Foundation (Minggu 1-2)
- [ ] Init Next.js 15 project + Tailwind + shadcn/ui
- [ ] Setup PostgreSQL + Prisma schema + migrations
- [ ] Setup NextAuth.js (login/register)
- [ ] Init FastAPI Python service + Docker Compose
- [ ] Setup Supabase project + storage bucket

### Phase 2 — Recording Core (Minggu 3-4)
- [ ] Implementasi Web Audio API + MediaRecorder chunking
- [ ] IndexedDB wrapper untuk temporary storage
- [ ] Upload chunk ke Supabase via API Route
- [ ] Waveform visualizer real-time
- [ ] Recording timer + status indicator

### Phase 3 — AI Pipeline (Minggu 5-6)
- [ ] Whisper STT service (Python)
- [ ] Claude summarization service (Python)
- [ ] Next.js API routes yang mengorkestrasi pipeline
- [ ] Real-time status updates via Server-Sent Events (SSE)
- [ ] Tampilan hasil transkrip + summary

### Phase 4 — Q&A Mode (Minggu 7)
- [ ] Generate pertanyaan dari materi via Claude
- [ ] UI sesi Q&A interaktif
- [ ] Evaluasi jawaban + scoring
- [ ] Progress tracker pemahaman

### Phase 5 — TTS Regeneration (Minggu 8)
- [ ] Coqui TTS integration (Python)
- [ ] Voice style options UI
- [ ] Language/style picker
- [ ] Audio player untuk hasil regenerasi

---

## 🚨 IMPORTANT RULES UNTUK AGENT

1. **Selalu gunakan TypeScript** — no plain JavaScript di Next.js
2. **Semua API call ke Python service** wajib ada error handling + retry logic
3. **Jangan simpan audio di Next.js server** — semua file lewat Supabase Storage
4. **Chunked upload wajib async** — jangan block UI saat upload
5. **Setiap komponen wajib ada loading + error state**
6. **Python service wajib pakai Pydantic** untuk validasi input/output
7. **Whisper harus lazy-load** — jangan load model saat startup, load saat pertama kali dipakai
8. **Claude prompt harus dalam Bahasa Indonesia** kecuali user ganti bahasa
9. **Semua environment variable** wajib ada di `.env.example` dengan placeholder
10. **Docker Compose** harus bisa dijalankan dengan satu perintah `docker-compose up`

---

## 💬 PROMPT KHUSUS PER FITUR

### Saat kamu diminta buat Recording Page:
> "Buat halaman recording di `app/record/page.tsx`. Halaman ini harus punya: tombol record besar di tengah, waveform visualizer real-time menggunakan Canvas API, timer yang menampilkan durasi rekaman, indikator status upload chunk, dan tombol stop yang muncul saat recording aktif. Gunakan Zustand store dari `lib/store/recordingStore.ts`. Styling dark theme dengan accent teal."

### Saat kamu diminta buat Whisper Service:
> "Buat `ai-service/services/whisper_service.py`. Service ini harus: lazy-load model Whisper saat pertama kali dipanggil, support download audio dari URL Supabase, proses audio dalam chunks jika durasi > 30 menit, return transcript lengkap beserta segments dengan timestamp, handle error gracefully dengan logging."

### Saat kamu diminta buat Claude Summarization:
> "Buat `ai-service/services/claude_service.py`. Gunakan Anthropic Python SDK. Buat prompt yang menginstruksikan Claude untuk menghasilkan: judul materi, ringkasan 3 paragraf, 5-10 poin penting, daftar istilah penting + definisi, dan struktur mind map dalam format JSON. Output harus dalam bahasa yang sama dengan transcript input."

### Saat kamu diminta buat Q&A System:
> "Buat sistem Q&A di `ai-service/routers/qa.py`. Ada dua endpoint: (1) generate — buat 10 pertanyaan dari transcript dengan 3 level kesulitan (easy/medium/hard), (2) evaluate — evaluasi jawaban user menggunakan Claude, berikan skor 0-100 dan feedback konstruktif dalam bahasa Indonesia."

---

*VoiceScribe AI — Built for students, powered by AI*

---

## Local prototype (quick start)

This repository contains a lightweight `ai-service` prototype (FastAPI) that exposes stub endpoints for `/transcribe`, `/summarize`, `/qa` and `/tts` to help local development.

Run the service locally (preferably inside a venv):

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

After the service runs, point frontend fetch calls to `http://localhost:8000` or adapt `AI_SERVICE_URL`.
