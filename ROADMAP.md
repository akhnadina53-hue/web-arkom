# ROADMAP.md — Fren-Edu: Learning Roadmap dari Transkripsi Audio

> Dokumen riset & desain fitur **Roadmap Generator** untuk Fren-Edu.
> Terinspirasi dari [roadmap.sh](https://roadmap.sh) — tujuannya agar output transkripsi audio bukan hanya teks, 
> tapi juga menghasilkan **peta pembelajaran terstruktur** yang runtut dan enak dipelajari.

---

## DAFTAR ISI

1. [Hasil Riset: Bagaimana Roadmap.sh Bekerja](#1-hasil-riset-bagaimana-roadmapsh-bekerja)
2. [Analisis Screenshot AI & Data Scientist Roadmap](#2-analisis-screenshot-ai--data-scientist-roadmap)
3. [Konsep Fitur: Audio → Learning Roadmap](#3-konsep-fitur-audio--learning-roadmap)
4. [Arsitektur Teknis & Data Model](#4-arsitektur-teknis--data-model)
5. [Prompt Engineering untuk LLM](#5-prompt-engineering-untuk-llm)
6. [Desain UI/UX Komponen Roadmap](#6-desain-uiux-komponen-roadmap)
7. [Rencana Implementasi](#7-rencana-implementasi)

---

## 1. HASIL RISET: BAGAIMANA ROADMAP.SH BEKERJA

### 1.1 Struktur Data (Graph-Based)

Roadmap.sh menyimpan setiap roadmap sebagai **graph** (nodes + edges) dalam format JSON:

```
ARSITEKTUR DATA ROADMAP.SH:
┌──────────────────────────────────────────────────┐
│  roadmap.json                                    │
│  ├── nodes[]          ← Topik/skill individual   │
│  │   ├── id           ← Unique identifier        │
│  │   ├── label        ← Nama topik (tampil)      │
│  │   ├── type         ← "topic" | "subtopic"     │
│  │   │                  | "resource" | "section"  │
│  │   ├── position     ← { x, y } untuk layout    │
│  │   ├── style        ← warna, border, dll       │
│  │   ├── isOptional   ← boolean                  │
│  │   └── metadata     ← link resource, deskripsi │
│  │                                               │
│  └── edges[]          ← Hubungan antar node      │
│      ├── source       ← node id asal             │
│      ├── target       ← node id tujuan           │
│      └── type         ← "default" | "optional"   │
└──────────────────────────────────────────────────┘
```

### 1.2 Hierarki Konten

```
CONTOH HIRARKI (AI & Data Scientist Roadmap):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 AI and Data Scientist
 │
 ├─ 1. Mathematics
 │   ├── Linear Algebra, Calculus, Mathematical Analysis
 │   ├── Mathematics for Machine Learning          [Course]
 │   ├── Differential Calculus
 │   └── Coursera: Algebra and Differential Calculus [Course]
 │
 ├─ 2. Statistics
 │   ├── Statistics, CLT
 │   ├── Coursera: Introduction to Statistics      [Course]
 │   ├── Hypothesis Testing
 │   ├── Coursera: Hypothesis Testing              [Course]
 │   └── Probability and Sampling
 │
 ├─ 3. Econometrics
 │   ├── Pre-requisites of Econometrics
 │   ├── Fundamentals of Econometrics              [Book]
 │   ├── Regression, Timeseries, Fitting Distributions
 │   ├── Intro to Econometrics
 │   └── Kaggle Learn Time Series Basics           [Tutorial]
 │
 ├─ 4. Coding
 │   ├── Learn Python Programming Language
 │   ├── Learn Python: Kaggle                      [Course]
 │   ├── Google Python Class                       [Course]
 │   ├── Data Structures and Algorithms (Python)
 │   ├── Algorithmic Exercises                     [Tutorial + Challenges]
 │   ├── Learn SQL
 │   └── SQL Tutorial                              [Course]
 │
 ├─ 5. Exploratory Data Analysis
 │   ├── Data understanding, Data Analysis and Visualization
 │   ├── Exploratory Data Analysis with Python     [Course]
 │   └── Exploratory Data Analysis for Machine Learning [Course]
 │
 ├─ 6. Machine Learning
 │   ├── Classic ML (Sup, Unsup), Advanced ML (Ensembles, NNs)
 │   ├── Open Machine Learning Course              [Course]
 │   ├── Pattern Recognition & ML (Bishop)         [eBook]
 │   └── GitHub repository with code               [Resource]
 │
 ├─ 7. Deep Learning
 │   ├── Fully Connected, CNN, RNN, LSTM, Transformers, TL
 │   ├── Deep Learning Specialization              [Course]
 │   ├── Deep Learning Book                        [eBook]
 │   ├── Attention is all you need                 [Paper]
 │   └── The Illustrated Transformer               [Article]
 │
 ├─ 8. MLOps
 │   ├── Deployment Models, CI/CD
 │   └── MLOps Specialization                      [Course]
 │
 ├─ 9. AI Engineering
 │   ├── Prompt Engineering, LLMs, RAG, Agents, Fine-tuning
 │   ├── Google AI Courses                         [Course]
 │   ├── Hugging Face NLP                          [Course]
 │   └── Prompt Engineering Guide                  [Article]
 │
 └── Continue Learning with following tracks:
     ├── Claude Code    → [Link]
     ├── AI Engineer    → [Link]
     └── Data Analyst   → [Link]
```

### 1.3 Fitur Kunci Roadmap.sh

| Fitur | Detail | Relevansi untuk Fren-Edu |
|-------|--------|--------------------------|
| **Numbered Sections** | Setiap topik besar diberi nomor urut (1-9+) | ✅ Penting — urutan belajar jelas |
| **Resource Links** | Setiap subtopik punya link course/book/article | ✅ Bisa auto-generate dari web search |
| **Color-coded Tags** | Course (kuning), Book (hijau), Article (biru), dll | ✅ Visual differentiation |
| **Progress Tracking** | User bisa check/uncheck topik | ✅ Gamifikasi learning path |
| **Two-Column Layout** | Topik & subtopik side-by-side | ✅ Efisien di desktop |
| **FAQ Section** | Pertanyaan umum terkait roadmap | ✅ Bisa generate dari Q&A |
| **Related Roadmaps** | Rekomendasi roadmap lanjutan | ✅ Cross-session linking |

### 1.4 Visual Design System Roadmap.sh

```
VISUAL LANGUAGE:
━━━━━━━━━━━━━━━━━
• Layout      → Vertical flowchart dengan numbered sections
• Nodes       → Rounded rectangles, color-coded by type
• Connectors  → Vertical/horizontal lines antar sections  
• Tags        → Pill-shaped badges: Course, Book, Article, Paper, Tutorial
• Colors      → 
    - Section headers: bg-yellow/bg-purple/bg-blue (solid, bold)
    - Topic items: bg-white/light-gray, border-gray
    - Resource tags: 
        • Course  → yellow pill
        • Book    → green pill  
        • Article → blue pill
        • Paper   → purple pill
        • Tutorial→ teal pill
• Typography  → Clean sans-serif, hierarchy via weight (not size)
• Spacing     → Generous whitespace antara sections
```

---

## 2. ANALISIS SCREENSHOT AI & DATA SCIENTIST ROADMAP

Dari screenshot `FireShot Capture 001`, berikut pola visual yang ditemukan:

### 2.1 Struktur Visual

```
┌─────────────────────────────────────────────────────┐
│  🎯 HEADER                                         │
│  "AI and Data Scientist Roadmap"                    │
│  Subtitle + action buttons (Subscribe, Download)    │
│  Tabs: Roadmap | Projects | AI Tutor | Personalize  │
├─────────────────────────────────────────────────────┤
│  ℹ️  CONTEXTUAL BANNER                              │
│  "What is a data scientist?"                        │
│  Related roadmaps sidebar                           │
├─────────────────────────────────────────────────────┤
│       │                                             │
│  ┌────┴────┐    ┌─────────┐                        │
│  │ 1.Math  │    │2.Stats  │     ← Two-column       │
│  │ section │    │ section │        section layout   │
│  └────┬────┘    └────┬────┘                        │
│       │              │                              │
│  ┌────┴────┐    ┌────┴────┐                        │
│  │3.Econo  │    │ 4.Code  │                        │
│  │ metrics │    │         │                        │
│  └────┬────┘    └────┬────┘                        │
│       │              │                              │
│    (continues numbered sections...)                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ❓ FAQ Section                                     │
│  Accordion-style questions                          │
├─────────────────────────────────────────────────────┤
│  🔗 Continue Learning                               │
│  Related roadmap links as buttons                   │
└─────────────────────────────────────────────────────┘
```

### 2.2 Pola Interaksi

1. **Click pada topic** → Muncul sidebar/modal dengan penjelasan + resources
2. **Progress tracking** → Checkbox pada setiap item (done/in-progress/skip)
3. **Download** → Export sebagai PNG/PDF
4. **Personalize** → Filter berdasarkan level (beginner/advanced)

---

## 3. KONSEP FITUR: AUDIO → LEARNING ROADMAP

### 3.1 User Flow

```
FLOW PENGGUNA:
━━━━━━━━━━━━━━

  📤 Upload Audio
     │  (rekaman kuliah, seminar, meeting, podcast, dll)
     ▼
  🎙️ Whisper Transcription
     │  (teks mentah dari audio)
     ▼
  🧠 AI Analysis & Structuring
     │  ├── Summary (sudah ada ✅)
     │  ├── Q&A (sudah ada ✅)
     │  ├── Mind Map (sudah ada ✅)
     │  └── 🆕 LEARNING ROADMAP ← FITUR BARU
     │       │
     │       ├── Ekstraksi topik-topik kunci
     │       ├── Penyusunan urutan belajar logis  
     │       ├── Penambahan resource recommendations
     │       ├── Difficulty grading per topik
     │       └── Progress tracking per user
     ▼
  📊 Roadmap Visualization  
     │  (interactive flowchart ala roadmap.sh)
     ▼
  📚 Structured Learning Path
     (user bisa follow step-by-step)
```

### 3.2 Contoh Output

**Input audio:** Rekaman kuliah "Introduction to Neural Networks"

**Output Roadmap yang di-generate:**

```
🗺️ LEARNING ROADMAP: Introduction to Neural Networks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ PREREQUISITE: Dasar Matematika
   ├── Linear Algebra: Vectors & Matrices         [📘 Wajib]
   ├── Kalkulus: Derivatif & Chain Rule            [📘 Wajib]
   └── Probability: Distribusi & Bayesian Basics   [📙 Opsional]

2️⃣ KONSEP DASAR: Perceptron & Activation
   ├── Single Perceptron Model                     [📗 Dari Materi]
   ├── Activation Functions (ReLU, Sigmoid, Tanh)  [📗 Dari Materi]  
   └── Linear vs Non-linear Classification         [📗 Dari Materi]

3️⃣ ARSITEKTUR: Feed-Forward Network
   ├── Input Layer, Hidden Layer, Output Layer      [📗 Dari Materi]
   ├── Weight Initialization                        [📙 Opsional]
   └── Hyperparameter Tuning Basics                 [📙 Opsional]

4️⃣ TRAINING: Backpropagation
   ├── Loss Functions (MSE, Cross-Entropy)          [📗 Dari Materi]
   ├── Gradient Descent (SGD, Adam, RMSprop)        [📗 Dari Materi]
   └── Overfitting & Regularization                 [📘 Wajib]

5️⃣ PRAKTEK: Implementasi
   ├── Build Simple NN from Scratch (NumPy)         [📕 Latihan]
   ├── TensorFlow/Keras Quick Start                 [📕 Latihan]
   └── Mini Project: Digit Classification           [📕 Latihan]

6️⃣ LANJUTAN: Apa Selanjutnya?
   ├── CNN untuk Computer Vision                    [🔗 Roadmap Lanjutan]
   ├── RNN untuk Sequence Data                      [🔗 Roadmap Lanjutan]
   └── Transformers & Attention Mechanism           [🔗 Roadmap Lanjutan]

LEGEND:
📗 Dari Materi   — Topik yang dibahas langsung di audio
📘 Wajib         — Prerequisite yang AI rekomendasikan
📙 Opsional      — Nice-to-have, bisa dilewati
📕 Latihan       — Hands-on exercise / project
🔗 Lanjutan      — Topik untuk dipelajari selanjutnya
```

### 3.3 Keunggulan vs Fitur Existing

| Fitur Existing | Apa yang Kurang | Roadmap Feature Menambahkan |
|----------------|-----------------|------------------------------|
| Summary | Hanya ringkasan teks | Struktur urutan belajar |
| Key Points | Flat list, tidak ada order | Ordered learning path |
| Mind Map | Bagus untuk overview, tapi tanpa sequence | Step-by-step progression |
| Mermaid Flowchart | Teknis, sulit dibaca non-developer | Visual roadmap yang intuitif |
| Q&A | Testing pengetahuan | Roadmap menunjukkan apa yang perlu dipelajari |

---

## 4. ARSITEKTUR TEKNIS & DATA MODEL

### 4.1 Data Model — Roadmap JSON Schema

```typescript
// types/roadmap.ts

interface RoadmapNode {
  id: string;                          // unique id: "node_1", "node_2"
  label: string;                       // "Linear Algebra: Vectors & Matrices"
  type: "prerequisite" | "core" | "practice" | "advanced" | "optional";
  source: "from_audio" | "ai_recommended" | "community";
  description: string;                 // penjelasan singkat 1-2 kalimat
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime?: string;              // "2 jam", "1 minggu"
  resources?: ResourceLink[];          // link belajar yang direkomendasikan
  isCompleted?: boolean;               // progress tracking
  order: number;                       // urutan dalam section
}

interface ResourceLink {
  title: string;
  url: string;
  type: "course" | "book" | "article" | "video" | "paper" | "tutorial";
  isPaid: boolean;
  platform?: string;                   // "Coursera", "YouTube", "Khan Academy"
}

interface RoadmapSection {
  id: string;
  number: number;                      // 1, 2, 3, ...
  title: string;                       // "Dasar Matematika"
  emoji: string;                       // "1️⃣"
  description: string;
  nodes: RoadmapNode[];
  dependsOn?: string[];                // section ids yang harus selesai dulu
}

interface LearningRoadmap {
  id: string;
  sessionId: string;                   // link ke session transkripsi
  title: string;                       // "Introduction to Neural Networks"
  generatedAt: string;                 // ISO datetime
  totalSections: number;
  totalNodes: number;
  estimatedTotalTime: string;          // "8-12 jam"
  sections: RoadmapSection[];
  metadata: {
    audioTitle: string;
    audioDuration: number;
    transcriptWordCount: number;
    topics_extracted: string[];        // topik yang diekstrak dari audio
  };
  legend: LegendItem[];
}

interface LegendItem {
  type: RoadmapNode["type"];
  emoji: string;
  label: string;
  color: string;                       // hex color
}
```

### 4.2 Backend API — Endpoint Baru

```python
# ai-service/routers/roadmap.py  ← FILE BARU

@router.post("/generate")
async def generate_roadmap(req: RoadmapRequest) -> RoadmapResponse:
    """
    Input:  transcript (str) + summary (str, optional)
    Output: LearningRoadmap JSON
    
    Pipeline:
    1. Ekstraksi topik dari transkrip
    2. Identifikasi prerequisite & dependencies
    3. Susun urutan belajar (topological sort)
    4. Generate resource recommendations
    5. Return structured roadmap
    """
    pass
```

### 4.3 Backend Pipeline

```
PIPELINE PROCESSING:
━━━━━━━━━━━━━━━━━━

[Transcript Text]
       │
       ▼
┌─────────────────┐
│ STEP 1: EXTRACT │ ← LLM: Identifikasi semua topik & konsep
│ Topics & Concepts│   dari transkrip audio
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ STEP 2: CLASSIFY│ ← LLM: Kategorikan setiap topik
│ & Categorize     │   (prerequisite/core/practice/advanced)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ STEP 3: ORDER   │ ← LLM: Tentukan urutan belajar yang logis
│ & Dependency     │   berdasarkan dependency antar topik
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ STEP 4: ENRICH  │ ← LLM: Tambahkan deskripsi, estimasi waktu,
│ with Resources   │   dan rekomendasi resource belajar
└────────┬────────┘
         │
         ▼
[Learning Roadmap JSON]
```

---

## 5. PROMPT ENGINEERING UNTUK LLM

### 5.1 System Prompt

```
SYSTEM PROMPT (untuk generate_roadmap di llm_service.py):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Anda adalah 'Fren-Edu Roadmap AI', ahli dalam menyusun peta pembelajaran
(learning roadmap) dari materi audio/kuliah.

TUGAS ANDA:
Analisis transkrip audio berikut dan susun menjadi LEARNING ROADMAP yang
terstruktur, logis, dan mudah diikuti. Roadmap harus menjawab pertanyaan:
"Kalau saya mau benar-benar paham materi ini, saya harus belajar apa saja,
dan dalam urutan apa?"

ATURAN PENYUSUNAN:
1. Identifikasi SEMUA topik & konsep yang dibahas dalam audio
2. Tambahkan prerequisite yang diperlukan (walaupun tidak dibahas di audio)
3. Susun dalam urutan belajar yang LOGIS (fondasi dulu, baru aplikasi)
4. Setiap section harus punya 2-5 node/topik
5. Setiap node harus punya deskripsi singkat (1-2 kalimat)
6. Tandai mana yang "dari materi audio" vs "rekomendasi AI"
7. Berikan estimasi waktu belajar per node
8. Rekomendasikan 1-2 resource belajar per topik (yang gratis/open)
9. Akhiri dengan section "Apa Selanjutnya?" untuk continuous learning

KLASIFIKASI NODE:
- "prerequisite" → Dasar yang harus dipahami sebelum materi utama
- "core"         → Topik inti yang dibahas dalam audio
- "practice"     → Latihan/implementasi hands-on
- "advanced"     → Topik lanjutan untuk pendalaman
- "optional"     → Nice-to-have, boleh dilewati

CATATAN INKLUSIVITAS:
- Gunakan bahasa yang sederhana dan tidak ambigu
- Hindari jargon tanpa penjelasan
- Buat deskripsi yang bisa dipahami tanpa context audio
```

### 5.2 User Prompt Template

```python
PROMPT_TEMPLATE = """
Analisis transkrip materi berikut dan susun menjadi Learning Roadmap.
Bahasa: {language}

FORMAT OUTPUT HARUS JSON MURNI:
{{
    "title": "Judul Roadmap yang Deskriptif",
    "estimatedTotalTime": "X-Y jam",
    "sections": [
        {{
            "number": 1,
            "title": "Nama Section",
            "emoji": "1️⃣",
            "description": "Penjelasan singkat section ini",
            "nodes": [
                {{
                    "id": "node_1_1",
                    "label": "Nama Topik",
                    "type": "prerequisite|core|practice|advanced|optional",
                    "source": "from_audio|ai_recommended",
                    "description": "Penjelasan 1-2 kalimat",
                    "difficulty": "beginner|intermediate|advanced",
                    "estimatedTime": "X jam/menit",
                    "resources": [
                        {{
                            "title": "Nama Resource",
                            "url": "https://...",
                            "type": "course|book|article|video|paper|tutorial",
                            "isPaid": false,
                            "platform": "YouTube/Coursera/dll"
                        }}
                    ]
                }}
            ]
        }}
    ],
    "topics_extracted": ["topik1", "topik2", ...],
    "legend": [
        {{"type": "core", "emoji": "📗", "label": "Dari Materi", "color": "#52B788"}},
        {{"type": "prerequisite", "emoji": "📘", "label": "Wajib Dipahami", "color": "#5B9BD5"}},
        {{"type": "optional", "emoji": "📙", "label": "Opsional", "color": "#F4A261"}},
        {{"type": "practice", "emoji": "📕", "label": "Latihan", "color": "#E05C5C"}},
        {{"type": "advanced", "emoji": "🔗", "label": "Lanjutan", "color": "#A89BD9"}}
    ]
}}

Transkrip:
{transcript}

{summary_context}
"""
```

---

## 6. DESAIN UI/UX KOMPONEN ROADMAP

### 6.1 Halaman Roadmap (`/session/[id]/roadmap`)

```
LAYOUT DESIGN:
━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│  ← Back to Session          [Export PDF] [Share]            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🗺️ Learning Roadmap                                        │
│  ━━━━━━━━━━━━━━━━━━━                                        │
│  "Introduction to Neural Networks"                          │
│  Generated from 42-min lecture recording                    │
│  📅 Estimated: 8-12 hours of study                          │
│                                                             │
│  ┌──── PROGRESS BAR ────────────────────── 3/15 done ───┐   │
│  │  ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  20%          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ LEGEND ──────────────────────────────────────────────┐  │
│  │ 📗 Dari Materi  📘 Wajib  📙 Opsional  📕 Latihan  🔗 Lanjutan │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1️⃣  PREREQUISITE: Dasar Matematika                  │    │
│  │  ─────────────────────────────────────────────       │    │
│  │  Fondasi matematika yang diperlukan sebelum          │    │
│  │  mempelajari Neural Networks                         │    │
│  │                                                      │    │
│  │  ☐ Linear Algebra: Vectors & Matrices    📘 ~2jam   │    │
│  │    └ Dasar vektor dan operasi matriks               │    │
│  │      🔗 3Blue1Brown: Essence of Linear Algebra      │    │
│  │                                                      │    │
│  │  ☐ Kalkulus: Derivatif & Chain Rule      📘 ~2jam   │    │
│  │    └ Aturan rantai untuk backpropagation            │    │
│  │      🔗 Khan Academy: Calculus                      │    │
│  │                                                      │    │
│  │  ☐ Probability Basics                    📙 ~1jam   │    │
│  │    └ Distribusi probabilitas dasar                  │    │
│  │      🔗 StatQuest YouTube                           │    │
│  └─────────────────────────────────────────────────────┘    │
│              │                                              │
│              ▼ (connector line)                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  2️⃣  KONSEP DASAR: Perceptron & Activation          │    │
│  │  ─────────────────────────────────────────────       │    │
│  │  Konsep fundamental yang dibahas dalam materi        │    │
│  │                                                      │    │
│  │  ☑ Single Perceptron Model               📗 ~30m   │    │
│  │    └ Model neuron tunggal dan cara kerjanya         │    │
│  │                                                      │    │
│  │  ☑ Activation Functions                  📗 ~45m   │    │
│  │    └ ReLU, Sigmoid, Tanh dan kapan digunakan        │    │
│  │                                                      │    │
│  │  ☐ Linear vs Non-linear Classification   📗 ~30m   │    │
│  │    └ Mengapa non-linearitas diperlukan              │    │
│  └─────────────────────────────────────────────────────┘    │
│              │                                              │
│              ▼                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  3️⃣  ... (sections continue)                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Komponen React yang Dibutuhkan

```
COMPONENT TREE:
━━━━━━━━━━━━━━━

RoadmapPage
├── RoadmapHeader
│   ├── Title & metadata
│   ├── ProgressBar (animated)
│   └── ActionButtons (Export, Share)
│
├── RoadmapLegend
│   └── Legend pills with colors
│
├── RoadmapTimeline
│   ├── RoadmapSection (repeating)
│   │   ├── SectionHeader (number, title, emoji)
│   │   ├── SectionDescription
│   │   └── NodeList
│   │       └── RoadmapNodeCard (repeating)
│   │           ├── Checkbox (progress)
│   │           ├── NodeTitle + TypeBadge
│   │           ├── NodeDescription
│   │           ├── DifficultyBadge
│   │           ├── TimeEstimate
│   │           └── ResourceLinks
│   │
│   └── SectionConnector (visual line between sections)
│
└── RoadmapFooter
    └── "What to learn next?" suggestions
```

### 6.3 Warna & Styling (sesuai CLAUDE-DESIGN.md "Smurf Forest")

```css
/* Roadmap-specific tokens (extends globals.css) */

:root {
  /* Node Type Colors */
  --roadmap-core: var(--color-smurf-400);        /* #74B49B — hijau moss */
  --roadmap-prerequisite: var(--info);            /* #5B9BD5 — sky blue */
  --roadmap-optional: var(--color-snitch-400);    /* #F4A261 — golden */
  --roadmap-practice: var(--error);               /* #E05C5C — coral */
  --roadmap-advanced: #A89BD9;                    /* lavender */
  
  /* Section connector */
  --roadmap-connector: var(--color-smurf-200);    /* soft moss */
  --roadmap-connector-active: var(--color-smurf-400);
  
  /* Progress */
  --roadmap-progress-bg: var(--color-smurf-100);
  --roadmap-progress-fill: linear-gradient(90deg, var(--color-smurf-300), var(--color-smurf-400));
}
```

---

## 7. RENCANA IMPLEMENTASI

### 7.1 Phase Breakdown

```
PHASE 1: Backend (Hari 1-2)
━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Tambah generate_roadmap() di llm_service.py
☐ Buat router baru: ai-service/routers/roadmap.py  
☐ Register router di main.py (/roadmap prefix)
☐ Test endpoint dengan sample transcript
☐ Tambah RoadmapRequest & RoadmapResponse models

PHASE 2: Frontend - Core Components (Hari 3-4)  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Buat types/roadmap.ts (TypeScript types)
☐ Buat components/roadmap/ folder:
    ☐ RoadmapHeader.tsx
    ☐ RoadmapLegend.tsx  
    ☐ RoadmapSection.tsx
    ☐ RoadmapNodeCard.tsx
    ☐ RoadmapProgressBar.tsx
    ☐ RoadmapConnector.tsx
☐ Buat halaman /session/[id]/roadmap/page.tsx

PHASE 3: Integration & Polish (Hari 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Connect frontend ke backend API
☐ Add "Learning Roadmap" button di session detail page
☐ Animasi: staggered reveal per section
☐ Progress tracking (localStorage / database)
☐ Export as PDF/PNG support
☐ Responsive design untuk mobile
```

### 7.2 File Changes Summary

```
FILES TO CREATE:
  ai-service/routers/roadmap.py          ← New router
  apps/web/types/roadmap.ts              ← TypeScript types
  apps/web/components/roadmap/           ← Component folder
    RoadmapHeader.tsx
    RoadmapLegend.tsx
    RoadmapSection.tsx
    RoadmapNodeCard.tsx
    RoadmapProgressBar.tsx
    RoadmapConnector.tsx
  apps/web/app/session/[id]/roadmap/
    page.tsx                             ← Roadmap page

FILES TO MODIFY:
  ai-service/main.py                     ← Register roadmap router
  ai-service/services/llm_service.py     ← Add generate_roadmap()
  apps/web/app/session/[id]/page.tsx     ← Add "Roadmap" button
  apps/web/app/globals.css               ← Add roadmap CSS tokens
```

### 7.3 Prioritas Fitur

```
MUST HAVE (MVP):
  ✅ Generate roadmap dari transcript
  ✅ Tampilan visual sections + nodes
  ✅ Legend & color coding
  ✅ Responsive layout
  
SHOULD HAVE:
  ⬜ Progress tracking (checkbox)
  ⬜ Export PDF
  ⬜ Animasi staggered reveal
  
NICE TO HAVE (Future):
  ⬜ Interactive flowchart (drag & zoom)
  ⬜ Community resource suggestions
  ⬜ Cross-session roadmap linking
  ⬜ Spaced repetition integration
```

---

## APPENDIX: REFERENSI

| Sumber | URL | Catatan |
|--------|-----|---------|
| Roadmap.sh | https://roadmap.sh | Inspirasi utama |
| AI & Data Scientist Roadmap | https://roadmap.sh/ai-data-scientist | Contoh spesifik |
| GitHub Repo | https://github.com/kamranahmedse/developer-roadmap | Source code & data structure |
| Fren-Edu Design System | [CLAUDE-DESIGN.md](./CLAUDE-DESIGN.md) | Panduan visual |
| Existing LLM Service | [llm_service.py](./ai-service/services/llm_service.py) | Service yang akan ditambah |
| Session Detail Page | [session/[id]/page.tsx](./apps/web/app/session/[id]/page.tsx) | Halaman yang akan dimodifikasi |

---

*Dokumen ini dibuat berdasarkan riset terhadap roadmap.sh (scraped 6 Juni 2026) dan analisis arsitektur existing Fren-Edu.*
