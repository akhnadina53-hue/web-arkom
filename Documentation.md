# 📚 Master Documentation: Fren-Edu (VoiceScribe AI)

## 🛠 The Ultimate Technical Manual & Development Roadmap

**Version:** 1.0.0-PRO  
**Sprint Duration:** 4-Hour Rapid Intensity  
**Lead AI Architect:** Antigravity (Google Deepmind)

**Dikombinasikan oleh pemikiran dari Gavin + Claude Sonnet 4.6 + Gemini 3.1 Pro**

---

## 📖 TABLE OF CONTENTS

1. [Project Identity & Vision](#1-project-identity--vision)
2. [Technical Stack Specifications](#2-technical-stack-specifications)
3. [Architecture: The Audio Ingestion Pipeline](#3-architecture-the-audio-ingestion-pipeline)
4. [Security: NextAuth & Google OAuth 2.0](#4-security-nextauth--google-oauth-20)
5. [UI/UX Engine: Fluid & Adaptive Design](#5-uiux-engine-fluid--adaptive-design)
6. [State Management: Zustand Stores](#6-state-management-zustand-stores)
7. [API Reference & Contract](#7-api-reference--contract)
8. [Folder Restructuring & Clean Architecture](#8-folder-restructuring--clean-architecture)
9. [DevOps: Cloudflare Tunnels & Git Optimization](#9-devops-cloudflare-tunnels--git-optimization)
10. [Getting Started: Setup Guide](#10-getting-started-setup-guide)
11. [Troubleshooting FAQ](#11-troubleshooting-faq)

---

## 1. PROJECT IDENTITY & VISION

Fren-Edu adalah platform _AI-Powered Learning_ yang dirancang untuk menjembatani kesenjangan antara rekaman audio (kuliah, rapat, seminar) dengan pengetahuan terstruktur. Fokus utamanya adalah mengubah suara menjadi aset digital yang bisa dipelajari kembali melalui ringkasan otomatis, mind maps, dan sesi tanya jawab interaktif.

---

## 2. TECHNICAL STACK SPECIFICATIONS

Pemilihan stack ini didasarkan pada kebutuhan akan kecepatan (_performance_), keamanan, dan kemudahan skalabilitas:

- **Frontend:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS 3.4 (Modern JIT Engine)
- **Animations:** Framer Motion (Orchestration & Micro-interactions)
- **Authentication:** NextAuth.js v5 (Auth.js)
- **Icons:** Lucide React
- **State Management:** Zustand (Immutable & Fast)
- **Backend:** Next.js Serverless Routes
- **Infrastruktur:** Cloudflare Tunnels (Edge Proxy)
- **Database (Planned):** Supabase / Prisma with PostgreSQL

---

## 3. ARCHITECTURE: THE AUDIO INGESTION PIPELINE

### A. Frontend Logic (`AudioUploader.tsx`)

Komponen ini menggunakan sistem _event-driven_ untuk menangani siklus hidup file:

1. **Drag-and-Drop Handler:** Menggunakan state `isDragging` untuk mengubah UI secara dinamis saat file berada di atas area drop.
2. **Pre-Flight Validation:**
   - Cek `file.size` < 200MB.
   - Cek `file.type` (hanya `audio/*`).
3. **Chunking Concept:** Untuk file besar, data dipecah menjadi bagian-bagian kecil sebelum dikirim via `ChunkUploader.tsx`.

### B. Secure Validation Layer (`/api/upload/audio/route.ts`)

Kami menerapkan keamanan "Zero Trust" di level biner:

- **Magic Bytes Signature:** Server membaca byte awal file untuk memastikan integritas data.
- **Payload Verification:** Memastikan metadata session user valid sebelum memproses file biner.

```typescript
// Contoh Logika Magic Bytes di Backend
const buffer = await file.arrayBuffer();
const uint8 = new Uint8Array(buffer).slice(0, 12);
let header = "";
for (let i = 0; i < uint8.length; i++) {
  header += uint8[i].toString(16);
}
// Cek ID3 (MP3), ftyp (M4A), dll.
```

---

## 4. SECURITY: NEXTAUTH & GOOGLE OAUTH 2.0

### A. OAuth Flow

Integrasi Google Auth dikonfigurasi untuk mendukung ekosistem pendidikan:

- **Client Credentials:** `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`.
- **Redirect URIs:** Harus menyertakan URL `trycloudflare.com/api/auth/callback/google` saat dalam mode tunnel.
- **Session Strategy:** Menggunakan JWT (JSON Web Tokens) untuk manajemen sesi yang ringan dan aman di sisi klien.

### B. Konfigurasi .env (Mandatori)

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=pasti_rahasia_banget_jangan_disebar
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
```

---

## 5. UI/UX ENGINE: FLUID & ADAPTIVE DESIGN

### A. Tipografi Global (`app/layout.tsx`)

Kami mengintegrasikan `next/font/google` untuk efisiensi loading:

- **Plus Jakarta Sans:** Font modern dengan _kerning_ luas untuk kenyamanan membaca teks panjang (summary).
- **Space Grotesk:** Memberikan kesan teknis pada angka-angka timer dan metrik data.

### B. Adaptive Navigation Bar (The "Masterpiece")

Masalah umum web app adalah sidebar yang mengganggu di mobile. Solusi kami:

- **Desktop Mode:** Sidebar 240px dengan fitur _collapse_ ke 72px menggunakan `framer-motion`.
- **Mobile Mode:** Menghilangkan sidebar sepenuhnya. Menggantinya dengan **Floating Bottom Nav** bergaya _glassmorphism_.
- **Safe Area:** Konten utama diberi margin bawah yang cukup agar tidak terhalang oleh navigasi bawah.

### C. Glassmorphism CSS Utility

```css
.glass {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 6. STATE MANAGEMENT: ZUSTAND STORES

Kami memisahkan state berdasarkan domain untuk mencegah _re-render_ yang tidak perlu:

1. **UI Store (`uiStore.ts`):** Menangani sidebar state, theme, dan notifikasi.
2. **QA Store (`qaStore.ts`):** Menangani data pertanyaan interaktif dan skor user.
3. **Language Store:** Menangani preferensi bahasa transkripsi (Indonesian/English).

---

## 7. API REFERENCE & CONTRACT

### POST `/api/upload/audio`

**Request:**

- `Content-Type`: `multipart/form-data`
- `file`: `File (Audio)`
- `sessionId`: `string`

**Response (Success 200):**

```json
{
  "success": true,
  "message": "Upload complete",
  "data": { "fileId": "abc-123" }
}
```

**Response (Error 401):**

```json
{
  "success": false,
  "error": "Unauthorized Access"
}
```

---

## 8. FOLDER RESTRUCTURING & CLEAN ARCHITECTURE

Project ini direstrukturisasi mengikuti prinsip **Separation of Concerns (SoC)**:

### A. Folder `components/recorder/`

Semua komponen yang berhubungan dengan "Suara" ada di sini:

- `AudioUploader.tsx`: Pintu masuk file eksternal.
- `RecordingTimer.tsx`: Komponen presisi waktu.
- `StatusIndicator.tsx`: Feedback visual proses AI (Transcribing, Summarizing).

### B. Folder `lib/`

Pusat dari semua "Utility" dan "Logic":

- `lib/api/`: Client API wrapper.
- `lib/store/`: Zustand global state.
- `lib/utils.ts`: Helper CSS class merging.

### C. Folder `legacy/` & `prototype/`

Tempat mengarsipkan kode lama (HTML/CSS statis) agar tidak mengotori codebase utama di `/apps/web`.

---

## 9. DEVOPS: CLOUDFLARE TUNNELS & GIT OPTIMIZATION

### A. Tunneling untuk Demo Publik

Gunakan perintah ini untuk membuat tunnel instan:

```powershell
npx cloudflared tunnel --url http://localhost:3000
```

_Catatan: Pastikan Redirect URI di Google Cloud Console diupdate setiap kali URL tunnel berubah._

### B. Mengatasi Error "Remote Disconnected"

Jika `git push` gagal karena database membengkak:

1. **Garbage Collection:** `git gc --aggressive --prune=now`.
2. **Push Per-Commit:** `git push origin HEAD~1:nama-branch`.
3. **Cek File Besar:** Selalu gunakan `.gitignore` untuk folder `node_modules` dan `.next`.

---

## 10. GETTING STARTED: SETUP GUIDE

1. **Clone Repository:**
   `git clone https://github.com/username/web-arkom.git`
2. **Install Dependencies:**
   `npm install`
3. **Setup Environment:**
   Salin `.env.example` menjadi `.env` dan isi semua API Key.
4. **Run Development Server:**
   `npm run dev`
5. **Open Browser:**
   Akses `http://localhost:3000`.

---

## 11. TROUBLESHOOTING FAQ

**Q: Kenapa Login Google muncul error "Invalid Client"?**
A: Pastikan `GOOGLE_CLIENT_ID` di `.env` sudah sama dengan yang di Google Cloud Console, dan URL kamu sudah terdaftar di "Authorized Redirect URIs".

**Q: Kenapa file Audio saya ditolak padahal formatnya .mp3?**
A: Server kami mengecek isi file biner. Jika file tersebut aslinya adalah dokumen teks yang diganti ekstensinya menjadi `.mp3`, server akan menolaknya demi keamanan.

**Q: Kenapa tampilan di HP berantakan?**
A: Coba _refresh_ browser. Kami sudah mengimplementasikan Bottom Nav adaptif yang hanya muncul di lebar layar < 768px.

---

## 📜 CLOSING STATEMENT

Dokumentasi ini adalah bukti komitmen kami terhadap kualitas kode dan transparansi pengembangan. Fren-Edu bukan sekadar aplikasi, tapi sebuah ekosistem pembelajaran masa depan.

**Copyright © 2026 Fren-Edu Team.**  
_Built with ❤️, TypeScript, and AI Intelligence._

---

_EOF (End of File) - Documentation generated by Antigravity AI._
