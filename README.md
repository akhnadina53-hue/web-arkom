# Fren-Edu 🎓

Fren-Edu adalah platform pembelajaran interaktif berbasis AI yang dirancang khusus untuk mempermudah mahasiswa dalam memahami materi kompleks. Aplikasi ini menyediakan fitur perekaman catatan, transkripsi pintar, hingga penyusunan *learning roadmap* dan peta konsep secara otomatis.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Framer Motion
- **AI Service Backend:** FastAPI (Python)
- **Database:** Prisma ORM
- **Visualisasi:** Mermaid.js

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini berjalan dengan dua *service* utama yang perlu diaktifkan secara bersamaan:

### 1. AI Service (Python)
Buka terminal, masuk ke folder `ai-service`, lalu jalankan server FastAPI:

```bash
cd ai-service
python -m venv .venv

# Aktifkan virtual environment
# Windows: .\.venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Web (Next.js)
Buka terminal baru, masuk ke folder `apps/web`, lalu jalankan server Next.js:

```bash
cd apps/web
npm install
npx prisma db push   # Sinkronisasi database lokal
npm run dev
```

Aplikasi siap diakses melalui browser di **[http://localhost:3000](http://localhost:3000)**.

---

## ⚙️ Konfigurasi Environment

Pastikan kamu memiliki file `.env` di dalam folder `apps/web` yang berisi konfigurasi minimal berikut:

```env
# Database & Authentication
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="secret-key-rahasia"
NEXTAUTH_URL="http://localhost:3000"

# AI Service Connection
AI_SERVICE_URL="http://localhost:8000"
```

*(Catatan: Jangan pernah melakukan commit kunci API sensitif ke dalam repositori).*
