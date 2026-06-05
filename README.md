# Fren-Edu (web-arkom)

Panduan cepat untuk menjalankan project (frontend Next.js, proxy Node, dan AI service FastAPI).

## Ringkasan arsitektur

- Frontend: `apps/web` (Next.js + Tailwind)
- Proxy: `server/proxy.js` (Express) — meneruskan permintaan ke AI service
- AI service: `ai-service` (FastAPI / Uvicorn)
- Database: `db` (opsional jika menggunakan docker-compose)

## Prasyarat

- Node.js >= 18
- npm
- Python 3.10+
- pip
- (Opsional) Docker & docker-compose

## Port Default

- Frontend: 3000 (Next.js dev). Jika 3000 sibuk, Next akan memilih port lain (mis. 3001).
- Proxy: 4000
- AI service: 8000

## Environment

Salin dan edit file `apps/web/.env.local` sesuai kebutuhan. Contoh minimal:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
AI_SERVICE_URL=http://localhost:4000
NEXT_PUBLIC_WHISPER_PROVIDER=local
NEXT_PUBLIC_LLM_PROVIDER=anthropic
NEXT_PUBLIC_TTS_PROVIDER=coqui
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

> Untuk development lokal saya merekomendasikan `AI_SERVICE_URL=http://localhost:4000` karena ada proxy di `server/`.

## Menjalankan Lokal (tanpa Docker) — Recommended for dev

Berikut langkah terpisah agar mudah di-debug. Jalankan setiap langkah di terminal terpisah.

1. Jalankan AI service (FastAPI)

Windows / PowerShell:

```powershell
cd ai-service
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Mac / Linux:

```bash
cd ai-service
python3 -m pip install -r requirements.txt
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. Jalankan Proxy (Express)

```bash
cd server
npm install
node proxy.js
# atau npm run start
```

Proxy mendengarkan pada port 4000 dan meneruskan ke AI service (8000) secara default.

3. Jalankan Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

Buka aplikasi di browser: `http://localhost:3000` (atau port lain jika Next memilih port alternatif seperti 3001).

## Menjalankan dengan Docker Compose (opsional)

Jika ingin semua service dijalankan dalam container:

```bash
docker-compose up --build
```

Service akan tersedia di port yang didefinisikan di `docker-compose.yml` (frontend:3000, ai-service:8000, proxy:4000).

## Skrip bantu (Windows)

Ada beberapa skrip `.bat` di root repo untuk memudahkan startup (opsional):

- `start-ai-service.bat` — install & start FastAPI
- `start-proxy.bat` — install & start proxy
- `start-frontend.bat` — install & start Next.js
- `RUN_ALL.bat` — buka 3 window dan jalankan semua service

## Verifikasi End-to-end

1. Buka `http://localhost:3000` (atau port Next memberi tahu di terminal).
2. Gunakan fitur perekam pada UI, kirim audio untuk transcribe, lalu klik summarize.
3. Anda bisa juga tes langsung endpoint melalui proxy:

```bash
curl -X POST http://localhost:4000/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Ini teks untuk diringkas."}'
```

Response seharusnya berasal dari AI service (FastAPI).

## Troubleshooting umum

- Error: `EADDRINUSE` / port in use — cari proses yang memakai port dan hentikan:

PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 4000 | Format-List
Stop-Process -Id <PID> -Force
```

- Jika `node proxy.js` mengeluh `Cannot find package 'express'` — jalankan `npm install` di folder `server`.
- Jika `npm install` gagal karena network (ECONNRESET / ETARGET) — coba ulang dengan registry resmi:

```bash
npm install --registry=https://registry.npmjs.org
```

- Jika Next memilih port lain (mis. 3001) karena 3000 sibuk — cukup buka URL port yang diterbitkan di terminal Next.

## Tailwind & shadcn notes

- `apps/web/tailwind.config.ts` sudah mengarah ke `./app`, `./components`, `./lib`. Pastikan component baru menggunakan `className` Tailwind bukan `style={{}}` untuk konsistensi.
- Jika menggunakan `shadcn/ui`, jalankan inisialisasi:

```bash
cd apps/web
npx shadcn-ui@latest init
```

## Catatan tentang environment kunci API

- Jangan commit API keys ke repo. Letakkan di `.env.local` atau secrets manager.

## Jika masih ada masalah

- Kumpulkan log dari tiga terminal (frontend, proxy, ai-service) dan kirimkan ke tim. Saya juga menyediakan skrip `RUN_ALL.bat` untuk startup otomatis pada Windows.

---

Jika mau, saya bisa juga membuat `apps/web/.env.local.example` dan menambahkan instruksi commit. Mau saya tambahkan file contoh `.env` sekarang?
