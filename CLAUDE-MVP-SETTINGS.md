# CLAUDE-MVP-SETTINGS.md — Fren-Edu
> Dedicated reference for MVP Phase 1: Settings & User Profile Personalization
> Read this file entirely before writing any code related to settings or profile features.
> This file is a companion to CLAUDE.md — both must be read together.

---

## TABLE OF CONTENTS

1. [Scope & Boundaries](#1-scope--boundaries)
2. [Settings Architecture](#2-settings-architecture)
3. [Profile Data Model](#3-profile-data-model)
4. [Settings Data Model](#4-settings-data-model)
5. [API Endpoints](#5-api-endpoints)
6. [Frontend Structure](#6-frontend-structure)
7. [Badge & Verification System](#7-badge--verification-system)
8. [Accessibility Requirements](#8-accessibility-requirements)
9. [File Upload Rules](#9-file-upload-rules)
10. [Internationalization (i18n)](#10-internationalization-i18n)
11. [Agent Task Instructions](#11-agent-task-instructions)(#10-agent-task-instructions)

---

## 1. SCOPE & BOUNDARIES

### What is IN scope for MVP Phase 1

```
✅ Profile page (public-facing)
✅ Profile edit form (all fields)
✅ Photo profil upload
✅ Banner / cover image upload
✅ Student edu email verification (OTP flow)
✅ Badge system (Student, Verified, Early Adopter)
✅ Settings page with 4 categories:
     → Account & Security
     → AI & Recording Preferences
     → Appearance
     → Privacy & Data
✅ Danger zone (delete account, clear data)
```

### What is NOT in scope for MVP (defer to Phase 2+)

```
❌ Forum / community features
❌ Study groups or collaboration rooms
❌ Follower / following system
❌ Direct messaging
❌ Notification preferences (Phase 2)
❌ Billing / subscription management UI (Phase 2)
❌ Admin dashboard
❌ Public API for profile data
```

### Non-negotiable MVP constraints

```
- Settings and profile must work fully on mobile (375px viewport minimum)
- Every interactive element must be keyboard navigable (tunarungu accessibility)
- All form submissions must show clear success/error feedback
- Photo and banner upload must validate before hitting the server
- Edu verification OTP must expire in 10 minutes, max 3 attempts
- Unsaved changes must show a "You have unsaved changes" warning on page leave
```

---

## 2. SETTINGS ARCHITECTURE

### Settings page layout

```
/settings                         ← root redirect → /settings/account

/settings/account                 ← Account & Security
/settings/ai                      ← AI & Recording Preferences
/settings/appearance              ← Appearance & Accessibility
/settings/privacy                 ← Privacy & Data

/profile/[username]               ← Public profile page (read-only)
/profile/edit                     ← Profile edit page (authenticated)
```

### Settings sidebar navigation (desktop) / bottom tabs (mobile)

```
Sidebar items (in order):
  1. Account & Security      icon: ti-shield-lock
  2. AI & Recording          icon: ti-microphone
  3. Appearance              icon: ti-palette
  4. Privacy & Data          icon: ti-lock
  ─────────────────────
  5. Edit Profile            icon: ti-user-edit   ← links to /profile/edit
  ─────────────────────
  6. Danger Zone             icon: ti-alert-triangle  (red text, bottom)
```

### Page-level component tree

```
SettingsLayout
  ├── SettingsSidebar          ← sticky left nav, highlights active section
  ├── SettingsContent          ← main scrollable area
  │   ├── SectionHeader        ← title + description per settings page
  │   ├── SettingsGroup        ← visual grouping with subtle separator
  │   │   ├── SettingsRow      ← label + description + control (toggle/input/select)
  │   │   └── ...
  │   └── SaveButton           ← sticky bottom bar with Save + discard
  └── UnsavedChangesGuard      ← warns before navigation if unsaved
```

---

## 3. PROFILE DATA MODEL

### Prisma schema additions (add to existing schema.prisma)

```prisma
model UserProfile {
  id                  String    @id @default(cuid())
  user_id             String    @unique
  user                User      @relation(fields: [user_id], references: [id], onDelete: Cascade)

  // ── IDENTITY ────────────────────────────────────────────────
  username            String    @unique               // lowercase, alphanumeric + underscore, 3-24 chars
  display_name        String                          // 2-50 chars, any unicode
  bio                 String?   @db.VarChar(160)      // hard cap at 160 chars
  avatar_url          String?                         // Supabase Storage URL
  banner_url          String?                         // Supabase Storage URL

  // ── ACADEMIC IDENTITY ────────────────────────────────────────
  institution_name    String?   @db.VarChar(100)      // e.g. "Universitas Negeri Semarang"
  institution_code    String?   @db.VarChar(20)       // e.g. "UNNES"
  faculty             String?   @db.VarChar(100)      // e.g. "Fakultas Teknik"
  major               String?   @db.VarChar(100)      // e.g. "Teknik Informatika"
  degree_level        DegreeLevel?                    // D3, S1, S2, S3, Profesi
  enrollment_year     Int?                            // e.g. 2022 (used for display only)
  current_status      AcademicStatus @default(STUDENT)

  // ── INTERESTS ────────────────────────────────────────────────
  interests           String[]  @db.Text              // array of tags, max 5 items enforced in app
  social_link         String?   @db.VarChar(200)      // one external URL (portfolio, LinkedIn, etc.)

  // ── VERIFICATION & BADGES ────────────────────────────────────
  student_verified    Boolean   @default(false)
  student_email       String?                         // verified .ac.id / .edu email
  student_verified_at DateTime?
  badges              Badge[]

  // ── META ─────────────────────────────────────────────────────
  profile_public      Boolean   @default(true)        // can be seen by non-logged-in users
  joined_at           DateTime  @default(now())       // display-only, never editable
  updated_at          DateTime  @updatedAt
}

enum DegreeLevel {
  D3
  S1
  S2
  S3
  PROFESI
}

enum AcademicStatus {
  STUDENT
  ALUMNI
  LECTURER
  RESEARCHER
  OTHER
}

model Badge {
  id            String        @id @default(cuid())
  profile_id    String
  profile       UserProfile   @relation(fields: [profile_id], references: [id], onDelete: Cascade)
  type          BadgeType
  awarded_at    DateTime      @default(now())
  expires_at    DateTime?     // null = permanent
  metadata      Json?         // e.g. { "institution": "UNNES" }

  @@unique([profile_id, type])
}

enum BadgeType {
  STUDENT_VERIFIED    // has verified .ac.id / .edu email → awarded on OTP confirm
  EARLY_ADOPTER       // joined in first 6 months of platform → permanent
  ACCESSIBILITY       // self-declared disability accessibility mode → optional
}
```

### Profile field validation rules (enforce in both frontend and backend)

```
username
  - 3–24 characters
  - Lowercase alphanumeric + underscore only: /^[a-z0-9_]{3,24}$/
  - Must be unique (realtime check on input, debounce 500ms)
  - Cannot be changed more than once every 30 days
  - Reserved words: admin, api, settings, profile, login, register, help, support

display_name
  - 2–50 characters
  - Any unicode allowed (supports Indonesian, Javanese, etc.)
  - Strip leading/trailing whitespace

bio
  - Max 160 characters (hard cap, enforce at DB level with @db.VarChar(160))
  - Character counter shown in real-time on frontend
  - No HTML, strip all tags

interests (tags)
  - Max 5 tags
  - Each tag: 2–30 characters
  - Lowercase only, strip special chars except hyphen
  - Preset list of 50 suggested tags (shown as autocomplete)
  - Custom tags allowed within char limits

social_link
  - Must be valid URL: starts with https://
  - Max 200 chars
  - Allowed domains: unlimited (user can link anything)
  - Show warning (not block) for known short-link domains

enrollment_year
  - Integer, min 1990, max current_year + 1
  - Optional — used for display ("Angkatan 2022")

institution_name
  - Max 100 chars
  - Free text — do NOT restrict to dropdown (too many universities in Indonesia)
  - Show autocomplete suggestions from edu_domains.json institution list
```

---

## 4. SETTINGS DATA MODEL

```prisma
model UserSettings {
  id                    String    @id @default(cuid())
  user_id               String    @unique
  user                  User      @relation(fields: [user_id], references: [id], onDelete: Cascade)

  // ── AI & RECORDING ───────────────────────────────────────────
  transcription_language  String    @default("auto")     // "auto" | "id" | "en" | "jv" | etc.
  whisper_quality         WhisperQuality @default(BALANCED)
  audio_quality           AudioQuality   @default(HIGH)
  auto_summarize          Boolean   @default(true)       // summarize immediately after recording stops
  summary_length          SummaryLength  @default(MEDIUM)
  summary_format          SummaryFormat  @default(BULLET)
  chunk_interval_seconds  Int       @default(30)         // 15 | 30 | 60
  noise_cancellation      Boolean   @default(true)

  // ── APPEARANCE ────────────────────────────────────────────────
  theme                   Theme     @default(SYSTEM)     // DARK | LIGHT | SYSTEM
  accent_color            String    @default("#00d4aa")  // hex color, from preset list only
  font_size               FontSize  @default(MEDIUM)     // affects transcript & summary display
  sidebar_collapsed       Boolean   @default(false)
  interface_language      String    @default("id")       // "id" | "en"
  reduced_motion          Boolean   @default(false)      // accessibility

  // ── PRIVACY ──────────────────────────────────────────────────
  profile_public          Boolean   @default(true)
  show_institution        Boolean   @default(true)
  show_interests          Boolean   @default(true)
  audio_retention_days    Int       @default(1)          // 1 | 7 | 30 | 0 (keep forever)
  ai_data_consent         Boolean   @default(false)      // consent for AI training use of data

  updated_at              DateTime  @updatedAt
}

enum WhisperQuality {
  FAST        // model: small  — faster, less accurate
  BALANCED    // model: medium — default
  ACCURATE    // model: large-v3 — slower, most accurate
}

enum AudioQuality {
  LOW         // 64kbps — saves storage
  MEDIUM      // 128kbps
  HIGH        // 192kbps — default
}

enum SummaryLength {
  SHORT       // 3 bullet points max
  MEDIUM      // 5-7 bullet points — default
  DETAILED    // full structured summary with sections
}

enum SummaryFormat {
  BULLET      // bullet point list — default
  PARAGRAPH   // flowing prose paragraphs
  STRUCTURED  // headers + bullets (most detailed)
}

enum Theme {
  DARK
  LIGHT
  SYSTEM
}

enum FontSize {
  SMALL       // 14px base
  MEDIUM      // 16px base — default
  LARGE       // 18px base
  XLARGE      // 20px base — accessibility
}
```

---

## 5. API ENDPOINTS

> All endpoints under `/api/v1/` — require authentication unless noted.
> Follow standard response envelope from CLAUDE.md.

### Profile endpoints

```
GET    /api/v1/profile/:username
       Auth: Optional (public profiles accessible without auth)
       Returns: { profile } — excludes private fields if not owner
       Cache: 60s public CDN cache for non-owner requests

GET    /api/v1/profile/me
       Auth: Required
       Returns: { profile, badges, settings_summary }
       Note: Full profile including private fields for owner

PATCH  /api/v1/profile/me
       Auth: Required
       Body: Partial<UserProfile> — any subset of editable fields
       Validation: All field rules enforced server-side (Zod)
       Returns: { profile }
       Note: username change → check 30-day cooldown

GET    /api/v1/profile/me/username-available?q=:username
       Auth: Required
       Returns: { available: boolean, suggestions?: string[] }
       Rate limit: 30 req/min per user
       Note: Debounce on frontend — do not call on every keystroke

POST   /api/v1/profile/me/avatar
       Auth: Required
       Content-Type: multipart/form-data
       Body: { avatar: File }
       Constraints: max 5MB, MIME: image/jpeg | image/png | image/webp
       Action: Validate → resize to 400×400 → upload to Supabase → update avatar_url
       Returns: { avatar_url }

DELETE /api/v1/profile/me/avatar
       Auth: Required
       Action: Delete from Supabase → set avatar_url = null
       Returns: { success: true }

POST   /api/v1/profile/me/banner
       Auth: Required
       Content-Type: multipart/form-data
       Body: { banner: File }
       Constraints: max 10MB, MIME: image/jpeg | image/png | image/webp
       Action: Validate → resize to 1200×300 → upload to Supabase → update banner_url
       Returns: { banner_url }

DELETE /api/v1/profile/me/banner
       Auth: Required
       Action: Delete from Supabase → set banner_url = null
       Returns: { success: true }
```

### Settings endpoints

```
GET    /api/v1/settings
       Auth: Required
       Returns: { settings } — full UserSettings object

PATCH  /api/v1/settings
       Auth: Required
       Body: Partial<UserSettings> — any subset of settings fields
       Returns: { settings }
       Note: Changes take effect immediately — no restart required
       Side effect: If theme changes, respond with new theme value for
                    immediate frontend application without page reload

PATCH  /api/v1/settings/ai
       Auth: Required
       Body: { transcription_language?, whisper_quality?, audio_quality?,
               auto_summarize?, summary_length?, summary_format?,
               chunk_interval_seconds?, noise_cancellation? }
       Returns: { settings }

PATCH  /api/v1/settings/appearance
       Auth: Required
       Body: { theme?, accent_color?, font_size?, sidebar_collapsed?,
               interface_language?, reduced_motion? }
       Returns: { settings }

PATCH  /api/v1/settings/privacy
       Auth: Required
       Body: { profile_public?, show_institution?, show_interests?,
               audio_retention_days?, ai_data_consent? }
       Returns: { settings }
```

### Verification endpoints

```
POST   /api/v1/profile/me/verify-student
       Auth: Required
       Body: { edu_email: string }
       Validation:
         - Email must end with .ac.id or .edu or be in edu_domains.json
         - Cannot be same as primary account email
         - Cannot already be verified by another account
       Action:
         1. Check domain against registry
         2. Generate 6-digit OTP
         3. Hash OTP (SHA-256) → store in EmailVerification table (TTL 10min)
         4. Send OTP email via nodemailer
       Returns: { sent: true, institution: string | null, expires_in_seconds: 600 }
       Rate limit: 3 req/hour per user

POST   /api/v1/profile/me/verify-student/confirm
       Auth: Required
       Body: { edu_email: string, otp: string }
       Validation:
         - OTP must match hash in DB
         - OTP must not be expired
         - Max 3 failed attempts (lock after 3rd: require re-send)
       Action:
         1. Validate OTP
         2. Set student_verified = true, student_email, student_verified_at
         3. Award STUDENT_VERIFIED badge
         4. Delete OTP from EmailVerification table
         5. Upgrade user role to STUDENT (if currently USER)
       Returns: { verified: true, badge: BadgeType.STUDENT_VERIFIED, new_role: "student" }

DELETE /api/v1/profile/me/verify-student
       Auth: Required
       Action: Remove student verification, revoke STUDENT_VERIFIED badge,
               downgrade role to USER if not PRO
       Returns: { success: true }
       Note: Irreversible without re-verifying
```

### Danger zone endpoints

```
POST   /api/v1/settings/danger/clear-data
       Auth: Required
       Body: { confirm_text: "DELETE MY DATA" }   ← exact string match required
       Action: Delete all sessions, transcripts, audio files. Keep account.
       Returns: { success: true, deleted_sessions: number }

POST   /api/v1/settings/danger/delete-account
       Auth: Required
       Body: { confirm_text: "DELETE MY ACCOUNT", password?: string }
       Note: If OAuth-only user, password not required
       Action:
         1. Validate confirm_text
         2. Validate password (if credential user)
         3. Soft delete user (set deleted_at = now())
         4. Schedule hard delete job for 30 days later (grace period)
         5. Invalidate all tokens
         6. Send confirmation email
       Returns: { success: true, deletion_scheduled_at: datetime }

POST   /api/v1/settings/danger/cancel-deletion
       Auth: NOT required (user may not be able to log in)
       Body: { email: string, cancellation_token: string }
       Note: Cancellation token sent in deletion confirmation email
       Action: Remove deleted_at, restore account
       Returns: { success: true }
```

---

## 6. FRONTEND STRUCTURE

### File structure (within apps/web)

```
app/
  profile/
    [username]/
      page.tsx              ← Public profile page (SSR, cacheable)
      loading.tsx           ← Skeleton loader
      not-found.tsx         ← 404 if profile_public=false or not found
    edit/
      page.tsx              ← Profile edit (CSR, auth-guarded)
  settings/
    layout.tsx              ← Settings shell with sidebar
    page.tsx                ← Redirect to /settings/account
    account/
      page.tsx
    ai/
      page.tsx
    appearance/
      page.tsx
    privacy/
      page.tsx

components/
  profile/
    ProfileHeader.tsx        ← Banner + avatar + name + badges + bio
    ProfileBadges.tsx        ← Badge display row
    ProfileStats.tsx         ← Sessions count, study hours (from library)
    ProfileInterests.tsx     ← Tag chips for interests
    AvatarUploader.tsx       ← Drag & drop + crop modal for avatar
    BannerUploader.tsx       ← Drag & drop + preview for banner
    UsernameInput.tsx        ← Realtime availability check
    VerifyStudentModal.tsx   ← Full OTP flow modal (3 steps)
  settings/
    SettingsSidebar.tsx
    SettingsGroup.tsx        ← Labeled section wrapper
    SettingsRow.tsx          ← Single setting item (label + control)
    ToggleRow.tsx            ← SettingsRow with toggle switch
    SelectRow.tsx            ← SettingsRow with select dropdown
    DangerZone.tsx           ← Red-bordered danger actions section
    UnsavedChangesBar.tsx    ← Sticky bottom bar (Save / Discard)
    ThemePicker.tsx          ← 3-option visual theme selector
    AccentColorPicker.tsx    ← Preset color swatches (6 options)
    FontSizePreview.tsx      ← Live preview of font size change
```

### State management (Zustand stores)

```typescript
// lib/store/profileStore.ts
interface ProfileStore {
  profile: UserProfile | null;
  isDirty: boolean;                    // true if unsaved changes exist
  isSaving: boolean;
  errors: Record<string, string>;      // field-level validation errors
  setField: (key: keyof UserProfile, value: unknown) => void;
  save: () => Promise<void>;
  discard: () => void;
  checkUsername: (username: string) => Promise<boolean>;
}

// lib/store/settingsStore.ts
interface SettingsStore {
  settings: UserSettings | null;
  isDirty: boolean;
  isSaving: boolean;
  setField: (key: keyof UserSettings, value: unknown) => void;
  save: () => Promise<void>;
  discard: () => void;
  applyTheme: (theme: Theme) => void;  // instant visual update
}
```

### Key UX behaviors

```
UNSAVED CHANGES GUARD
  - Track isDirty state on every field change
  - Show sticky bottom bar: "You have unsaved changes" + Save + Discard buttons
  - On navigate away: show browser confirm dialog OR custom modal
  - On save success: isDirty = false, show toast "Profile updated"

USERNAME AVAILABILITY CHECK
  - Debounce 500ms after last keystroke
  - Show spinner while checking
  - Show green checkmark if available
  - Show red X + suggestion if taken
  - Do NOT submit form if username is taken or unchecked

AVATAR UPLOAD FLOW
  1. User clicks avatar → file picker opens (accept: image/*)
  2. Selected image → open crop modal (square, 1:1 ratio)
  3. User crops → preview shown
  4. On confirm → upload to /api/v1/profile/me/avatar
  5. On success → update avatar_url in store → re-render immediately

BANNER UPLOAD FLOW
  1. Drag & drop OR click to upload
  2. Validate client-side: size ≤ 10MB, type image/*
  3. Show preview in banner area before saving
  4. Save only on form submit (not immediate upload)
  5. Upload to /api/v1/profile/me/banner

THEME CHANGE
  - Apply immediately on toggle (no save required for theme)
  - Persist to DB in background (PATCH /settings/appearance)
  - If DB save fails: revert visual to previous theme + show error toast

FONT SIZE CHANGE
  - Live preview: update CSS variable --base-font-size immediately
  - Show preview text: "Ini contoh teks transkrip dengan ukuran ini"
  - Persist on Save button click
```

---

## 7. BADGE & VERIFICATION SYSTEM

### Badge types (MVP)

```
STUDENT_VERIFIED
  Label    : "Mahasiswa Terverifikasi"
  Icon     : graduation cap (ti-school)
  Color    : teal (#00d4aa)
  Awarded  : Automatically when OTP edu email verification succeeds
  Expires  : Re-verify every 12 months (cron job checks student_verified_at)
  Display  : Always visible on profile if active
  Benefit  : Unlocks Q&A feature + export sessions

EARLY_ADOPTER
  Label    : "Early Adopter"
  Icon     : rocket (ti-rocket)
  Color    : amber (#f4a261)
  Awarded  : Automatically to first 1000 registered users
  Expires  : Never (permanent)
  Display  : Visible on profile
  Benefit  : Cosmetic only (for now)

ACCESSIBILITY
  Label    : "Accessible User"
  Icon     : accessibility (ti-accessible)
  Color    : blue (#4a90d9)
  Awarded  : Self-declared in profile edit (checkbox)
  Expires  : Never
  Display  : Optional — user can hide this badge in privacy settings
  Benefit  : Flags account for accessibility-first features (future)
```

### Badge display component

```typescript
// components/profile/ProfileBadges.tsx

interface BadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md';     // sm = icon only + tooltip, md = icon + label
  showTooltip?: boolean;
}

// Render order on profile: STUDENT_VERIFIED → EARLY_ADOPTER → ACCESSIBILITY
// Max 3 badges visible, no horizontal scrolling
// On mobile: sm size (icon only), tooltip on long press
// On desktop: md size with label
```

### OTP Verification flow (3 steps — implemented as multi-step modal)

```
STEP 1 — Enter edu email
  UI     : Input field + "Send OTP" button
  Note   : Show institution name if domain recognized
           e.g. "Terdeteksi: Universitas Negeri Semarang (UNNES)"
  Error  : "Domain email tidak dikenali sebagai institusi pendidikan"

STEP 2 — Enter OTP
  UI     : 6-digit OTP input (split into 6 boxes, auto-advance)
           Countdown timer: "OTP berlaku 9:47 lagi"
           "Kirim ulang" link (disabled until 60s cooldown)
  Error  : "OTP salah. Sisa percobaan: 2"
           "OTP kedaluwarsa. Silakan kirim ulang."
           "Terlalu banyak percobaan. Kirim ulang OTP." (after 3 fails)

STEP 3 — Success
  UI     : Checkmark animation
           "Email edu kamu berhasil diverifikasi!"
           Badge preview: STUDENT_VERIFIED badge displayed
           "Kamu sekarang mendapat akses fitur pelajar gratis selama 1 tahun."
  Action : Auto-close modal after 3 seconds OR manual close
```

### 12-month re-verification reminder

```
- Cron job runs daily: SELECT profiles WHERE student_verified = true
  AND student_verified_at < NOW() - INTERVAL '11 months'
- Send email reminder: "Verifikasi pelajar kamu akan kedaluwarsa dalam 1 bulan"
- At 12 months: set student_verified = false, revoke badge, downgrade role
- User must re-verify to restore (same OTP flow)
```

---

## 8. ACCESSIBILITY REQUIREMENTS

> Non-negotiable — enforced for ALL settings and profile components.
> Primary concern: tunarungu (deaf/hard of hearing) users.

```
VISUAL NOTIFICATIONS ONLY
  - No sound-based alerts of any kind
  - All toast notifications: visible text + icon, min display 5 seconds
  - All status changes (saving, success, error): visual indicator
  - Progress states: show text percentage OR step indicator, not just spinner

KEYBOARD NAVIGATION
  - Every interactive element reachable via Tab
  - Logical tab order (follows visual flow, left-to-right, top-to-bottom)
  - Focus indicator always visible (never outline: none without replacement)
  - Modal dialogs: focus trapped inside when open, returns to trigger on close
  - OTP input boxes: Tab advances to next box, Backspace returns to previous

FORM ACCESSIBILITY
  - Every input has associated <label> (not just placeholder)
  - Error messages linked to input via aria-describedby
  - Required fields marked with aria-required="true"
  - Character counters (bio, etc.): aria-live="polite" for screen reader updates

IMAGE UPLOAD
  - File drop zones: keyboard activatable (Enter/Space to open file picker)
  - Upload progress: text percentage, not just visual bar
  - Crop modal: fully keyboard operable

ARIA ATTRIBUTES (required on these components)
  - SettingsSidebar nav: role="navigation" aria-label="Settings menu"
  - Active settings page link: aria-current="page"
  - Toggle switches: role="switch" aria-checked={value}
  - Badge tooltips: role="tooltip" linked via aria-describedby
  - OTP input group: role="group" aria-label="Kode OTP"
  - Loading states: aria-busy="true" on the section being updated
  - Success/error toasts: role="status" or role="alert" (alert for errors)

COLOR & CONTRAST
  - All text: minimum contrast ratio 4.5:1 (WCAG AA)
  - Interactive elements: minimum contrast ratio 3:1 for boundaries
  - Do not rely on color alone to convey information
  - Badge icons always paired with label or tooltip text
  - Error states: red color + icon + text (never color alone)

REDUCED MOTION
  - Respect prefers-reduced-motion media query
  - Also respect settings.reduced_motion = true (user preference override)
  - When reduced_motion = true: disable all CSS transitions and animations,
    replace with instant state changes
```

---

## 9. FILE UPLOAD RULES

### Storage paths (Supabase Storage)

```
Bucket: fren-edu-profiles      (public read, authenticated write)

Avatar : profiles/avatars/{user_id}/{timestamp}.webp
Banner : profiles/banners/{user_id}/{timestamp}.webp

Old files MUST be deleted when replaced:
  - On new avatar upload: delete previous avatar_url from storage
  - On new banner upload: delete previous banner_url from storage
  - On account delete: delete all profile files (cascade cleanup job)
```

### Image processing (Sharp library — Node.js backend)

```typescript
// Upload pipeline — MUST follow this exact order

// AVATAR
async function processAvatar(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(400, 400, {
      fit: 'cover',           // crop to square, center focus
      position: 'centre',
    })
    .webp({ quality: 85 })    // always convert to WebP
    .toBuffer();
}

// BANNER
async function processBanner(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(1200, 300, {
      fit: 'cover',
      position: 'centre',
    })
    .webp({ quality: 85 })
    .toBuffer();
}

// VALIDATION (run BEFORE processing)
function validateImage(file: Express.Multer.File, maxSizeMB: number): void {
  // 1. Check actual MIME type from magic bytes (NOT from file.mimetype)
  //    Use 'file-type' npm package: const type = await fileTypeFromBuffer(buffer)
  // 2. Ensure type?.mime is 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
  // 3. Ensure file.size <= maxSizeMB * 1024 * 1024
  // 4. Throw ApiError(415) if invalid MIME
  // 5. Throw ApiError(413) if too large
}
```

### Client-side validation (before any upload request)

```typescript
// Validate immediately on file select — do NOT wait for server
function validateImageClient(file: File, maxSizeMB: number): string | null {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return 'Format tidak didukung. Gunakan JPG, PNG, atau WebP.';
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.`;
  }
  return null; // valid
}
```

---

## 11. AGENT TASK INSTRUCTIONS

> When asked to implement any feature in this document, follow these task-specific prompts.

### Task: Build the Profile Edit page

```
Build /profile/edit page (apps/web/app/profile/edit/page.tsx).

Requirements:
- Auth-guarded (redirect to /login if not authenticated)
- Fetch current profile from GET /api/v1/profile/me on mount
- Form fields: avatar, banner, display_name, username (with availability check),
  bio (160 char counter), institution_name (autocomplete), faculty, major,
  degree_level (select), enrollment_year (number), current_status (select),
  interests (tag input, max 5), social_link
- Unsaved changes guard: show sticky bottom bar + browser beforeunload warning
- On save: PATCH /api/v1/profile/me with only changed fields (diff before sending)
- Show field-level validation errors inline (below each input)
- Avatar: AvatarUploader component (crop modal, immediate upload on confirm)
- Banner: BannerUploader component (preview before save)
- Username: UsernameInput component (500ms debounce availability check)
- Student verification: "Verifikasi Email Pelajar" button → VerifyStudentModal
- Badges section: read-only display of current badges
```

### Task: Build the Settings pages

```
Build all settings pages under /settings/*.

For each page, implement SettingsGroup + SettingsRow pattern.
All settings load from GET /api/v1/settings.
Changes auto-save on blur OR on explicit Save button — use Save button pattern.

/settings/account:
  Group "Informasi Akun": email (read-only + change email flow), display name shortcut
  Group "Login & Keamanan": change password, connected OAuth (Google/Microsoft), 2FA toggle
  Group "Verifikasi": student email verification status + button to open VerifyStudentModal

/settings/ai:
  Group "Transkripsi": language select, whisper_quality (3 radio options with description)
  Group "Rekaman": audio_quality select, chunk_interval select, noise_cancellation toggle
  Group "Ringkasan AI": auto_summarize toggle, summary_length select, summary_format select

/settings/appearance:
  Group "Tema": ThemePicker (Dark/Light/System visual selector)
  Group "Aksen Warna": AccentColorPicker (6 preset color swatches)
  Group "Teks": FontSizePreview (4 options with live preview)
  Group "Antarmuka": interface_language select, sidebar_collapsed toggle, reduced_motion toggle

/settings/privacy:
  Group "Profil": profile_public toggle, show_institution toggle, show_interests toggle
  Group "Data Rekaman": audio_retention_days select (Hapus setelah: 1 hari / 7 hari / 30 hari / Simpan selamanya)
  Group "AI & Data": ai_data_consent toggle with explicit description of what this means
  Group "Danger Zone": DangerZone component (clear data + delete account)
```

### Task: Build the Public Profile page

```
Build /profile/[username]/page.tsx.

Requirements:
- Server-side rendered (use Next.js generateMetadata for OG tags)
- Fetch from GET /api/v1/profile/:username
- If profile_public = false AND viewer is not owner: show 404
- Layout top to bottom:
  1. Banner image (full width, 1200x300, fallback: gradient placeholder)
  2. Avatar (positioned overlapping bottom of banner, left-aligned)
  3. Display name + username + badges row
  4. Bio
  5. Academic info row: institution, major, degree, enrollment year, status
  6. Interests tag chips
  7. Social link (external icon)
  8. Stats row: Total Sessions, Total Study Hours (from sessions data)
  9. "Joined" date (formatted: "Bergabung sejak Januari 2025")
- If viewer is profile owner: show "Edit Profile" button top right
- OG meta: title = display_name, description = bio, image = avatar_url
```

### Task: Build the OTP Verification Modal

```
Build VerifyStudentModal component (components/profile/VerifyStudentModal.tsx).

3-step modal — do not use separate pages.
Controlled by parent via isOpen/onClose props.
Step state managed internally with useState.

Step 1 — Email input:
  - Input for edu email
  - On submit: POST /api/v1/profile/me/verify-student
  - If domain recognized: show institution name below input (teal text)
  - If not recognized: show error, block submit
  - On success: advance to Step 2

Step 2 — OTP input:
  - 6 individual single-character inputs (auto-advance on type, backspace goes back)
  - Countdown: "OTP berlaku X:XX lagi" (10 minutes, counts down live)
  - "Kirim ulang OTP" link: disabled for 60s after send, then enabled
  - On resend: reset countdown, clear inputs, show "OTP baru telah dikirim"
  - On submit: POST /api/v1/profile/me/verify-student/confirm
  - On wrong OTP: show "OTP salah. Sisa percobaan: N" (do not clear inputs)
  - On expired: show "OTP kedaluwarsa" + enable resend immediately
  - On 3 fails: disable submit, force resend
  - On success: advance to Step 3

Step 3 — Success:
  - Show checkmark (CSS animation, skip if reduced_motion)
  - Show badge preview (STUDENT_VERIFIED badge component)
  - Auto-close after 3 seconds OR button "Tutup"
  - On close: parent refreshes profile data
```

---

## 10. INTERNATIONALIZATION (i18n)

> Fren-Edu targets global users including deaf/hard-of-hearing communities worldwide.
> i18n infrastructure MUST be set up in MVP even if only 5 languages ship at launch.
> Retrofitting i18n into a non-i18n codebase later is extremely costly — do it right from day one.

### The two independent i18n layers

```
LAYER 1 — UI Language (interface_language in UserSettings)
  What    : All static text in the app — buttons, labels, errors, onboarding,
            settings page copy, toast messages, email templates
  How     : next-intl library + JSON message files per locale
  Scope   : Controlled by user setting, stored in UserSettings.interface_language
  Default : "id" (Indonesian) — detected from browser Accept-Language on first visit

LAYER 2 — Content Language (transcription_language in UserSettings)
  What    : Language of the audio being recorded and transcribed
  How     : Whisper large-v3 (auto-detect or user override)
  Scope   : Independent from UI language — can record in Japanese while UI is Indonesian
  Default : "auto" — Whisper detects language from audio automatically
  Supported: 99 languages (full Whisper language list)

These two layers are FULLY INDEPENDENT.
Never assume UI language == content language.
User from Indonesia may record a lecture in English, French, or Mandarin.
```

### Language tier rollout strategy

```
TIER 1 — Launch (MVP, human-translated, 100% complete)
  id   Indonesian  ← primary language, all copy written here first
  en   English     ← second priority, most global reach
  ar   Arabic      ← RTL, large Muslim student population globally
  ms   Malay       ← close to Indonesian, low translation effort
  jv   Javanese    ← regional, relevant to UNNES/Jawa Tengah user base

TIER 2 — Phase 2 (AI-translated + community review via Crowdin)
  ja   Japanese         zh-Hans  Chinese Simplified
  ko   Korean           zh-Hant  Chinese Traditional
  fr   French           de       German
  es   Spanish          pt-BR    Portuguese (Brazil)
  hi   Hindi            th       Thai
  vi   Vietnamese       tl       Filipino/Tagalog
  bn   Bengali          sw       Swahili

TIER 3 — Community-driven (Crowdin open contributions, 50+ languages)
  tr   Turkish    pl   Polish     nl   Dutch      sv   Swedish
  ru   Russian    uk   Ukrainian  it   Italian    el   Greek
  fa   Persian    he   Hebrew     ur   Urdu       pa   Punjabi
  ta   Tamil      te   Telugu     ml   Malayalam  si   Sinhala
  mn   Mongolian  km   Khmer      lo   Lao        my   Burmese
  am   Amharic    ha   Hausa      yo   Yoruba     ig   Igbo
  zu   Zulu       af   Afrikaans  ro   Romanian   cs   Czech
  sk   Slovak     hu   Hungarian  fi   Finnish    no   Norwegian
  da   Danish     bg   Bulgarian  hr   Croatian   sr   Serbian
  + others via community contribution
```

### Tech stack for i18n

```
Frontend (Next.js):
  Library       : next-intl (https://next-intl-docs.vercel.app/)
  Why           : Native App Router support, type-safe with TypeScript,
                  server component support, ICU message format, no runtime overhead
  Config file   : apps/web/i18n.ts
  Message files : apps/web/messages/{locale}.json   (e.g. id.json, en.json, ar.json)
  Routing       : /[locale]/... URL structure  OR  cookie/header-based (no URL change)
                  RECOMMENDATION: cookie-based — do not pollute URLs with locale prefix

  RTL support   : Tailwind CSS rtl: modifier + <html dir="rtl"> for Arabic/Hebrew/Urdu/Farsi
  Font          : Noto Sans (Google Fonts) — covers 99%+ of world scripts including CJK,
                  Arabic, Devanagari, Thai, Armenian, Georgian, etc.
                  Import subsets only — do NOT load all Noto variants (huge bundle)

Translation management:
  Platform      : Crowdin (free for open source projects)
  Workflow      : Developer writes English strings → Crowdin notifies translators →
                  translators submit → auto-PR to repository
  Integration   : crowdin/github-action for CI sync

Backend (Express.js):
  Error messages: All API error messages use error CODES, not human strings
                  Frontend translates the code using i18n system
                  NEVER return human-readable error text from backend directly
                  Example: { "code": "VALIDATION_ERROR", "field": "username" }
                  Frontend maps → "Username tidak valid" (id) or "Invalid username" (en)

  Email templates: Nodemailer + template per locale
                   File structure: apps/backend/emails/{locale}/{template}.html
                   Fallback chain: user locale → "en" → hardcoded English
```

### File structure for i18n

```
apps/web/
  i18n.ts                           ← next-intl config (supported locales, default)
  messages/
    id.json                         ← Indonesian (source of truth, written first)
    en.json                         ← English
    ar.json                         ← Arabic
    ms.json                         ← Malay
    jv.json                         ← Javanese
    [locale].json                   ← added per tier rollout

apps/backend/
  emails/
    id/
      verify-email.html
      student-otp.html
      delete-account.html
      re-verify-reminder.html
    en/
      verify-email.html
      ...
    ar/
      verify-email.html             ← RTL email template
      ...
```

### Message file structure (id.json as source of truth)

```json
{
  "common": {
    "save": "Simpan",
    "cancel": "Batal",
    "delete": "Hapus",
    "loading": "Memuat...",
    "error": "Terjadi kesalahan",
    "success": "Berhasil"
  },
  "settings": {
    "title": "Pengaturan",
    "nav": {
      "account": "Akun & Keamanan",
      "ai": "AI & Rekaman",
      "appearance": "Tampilan",
      "privacy": "Privasi & Data"
    },
    "appearance": {
      "theme": {
        "label": "Tema",
        "dark": "Gelap",
        "light": "Terang",
        "system": "Ikuti sistem"
      },
      "language": {
        "label": "Bahasa antarmuka",
        "description": "Bahasa yang digunakan untuk tampilan aplikasi"
      },
      "fontSize": {
        "label": "Ukuran teks",
        "preview": "Ini contoh teks transkrip dengan ukuran ini"
      }
    },
    "ai": {
      "transcriptionLanguage": {
        "label": "Bahasa transkripsi",
        "auto": "Deteksi otomatis",
        "description": "Bahasa rekaman audio kamu"
      }
    }
  },
  "profile": {
    "edit": {
      "title": "Edit Profil",
      "username": {
        "label": "Username",
        "available": "Username tersedia",
        "taken": "Username sudah dipakai",
        "checking": "Mengecek...",
        "hint": "3–24 karakter, huruf kecil, angka, dan garis bawah"
      },
      "bio": {
        "label": "Bio",
        "placeholder": "Ceritakan sedikit tentang dirimu...",
        "counter": "{count}/160 karakter"
      },
      "interests": {
        "label": "Minat & Bakat",
        "hint": "Maksimal 5 tag"
      },
      "verifyStudent": {
        "button": "Verifikasi Email Pelajar",
        "verified": "Terverifikasi sebagai {institution}",
        "benefit": "Akses fitur pelajar gratis selama 1 tahun"
      }
    }
  },
  "verification": {
    "step1": {
      "title": "Masukkan email kampus",
      "label": "Email edu (.ac.id / .edu)",
      "submit": "Kirim OTP",
      "detected": "Terdeteksi: {institution}",
      "notRecognized": "Domain email tidak dikenali sebagai institusi pendidikan"
    },
    "step2": {
      "title": "Masukkan kode OTP",
      "description": "Kode 6 digit telah dikirim ke {email}",
      "expiry": "OTP berlaku {minutes}:{seconds} lagi",
      "resend": "Kirim ulang OTP",
      "resendCooldown": "Kirim ulang dalam {seconds}s",
      "wrongOtp": "OTP salah. Sisa percobaan: {remaining}",
      "expired": "OTP kedaluwarsa. Silakan kirim ulang.",
      "tooManyAttempts": "Terlalu banyak percobaan. Kirim ulang OTP."
    },
    "step3": {
      "title": "Verifikasi berhasil!",
      "description": "Kamu sekarang mendapat akses fitur pelajar gratis selama 1 tahun.",
      "close": "Tutup"
    }
  },
  "errors": {
    "VALIDATION_ERROR": "Data yang dimasukkan tidak valid",
    "USERNAME_TAKEN": "Username sudah dipakai",
    "USERNAME_COOLDOWN": "Username hanya bisa diubah setiap 30 hari",
    "EDU_DOMAIN_NOT_RECOGNIZED": "Domain email tidak dikenali",
    "OTP_INVALID": "Kode OTP tidak valid",
    "OTP_EXPIRED": "Kode OTP sudah kedaluwarsa",
    "OTP_TOO_MANY_ATTEMPTS": "Terlalu banyak percobaan",
    "FILE_TOO_LARGE": "Ukuran file terlalu besar. Maksimal {max}MB",
    "FILE_INVALID_TYPE": "Format file tidak didukung. Gunakan JPG, PNG, atau WebP",
    "RATE_LIMIT_EXCEEDED": "Terlalu banyak permintaan. Coba lagi dalam {minutes} menit"
  }
}
```

### RTL implementation rules

```typescript
// apps/web/app/[locale]/layout.tsx

import { getLocale } from 'next-intl/server';

const RTL_LOCALES = ['ar', 'he', 'ur', 'fa', 'ku', 'ug'];

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}

// In Tailwind classes — ALWAYS use logical properties:
// WRONG:  ml-4, pl-4, text-left, border-l
// RIGHT:  ms-4, ps-4, text-start, border-s
// The rtl: modifier handles the flip automatically
// ms = margin-inline-start, ps = padding-inline-start
```

### Font loading strategy

```typescript
// apps/web/app/layout.tsx

import { Noto_Sans } from 'next/font/google';

// Load only the subsets needed for Tier 1 languages
// Add more subsets as Tier 2/3 languages are added
const notoSans = Noto_Sans({
  subsets: [
    'latin',          // English, Indonesian, Malay, Javanese (romanized)
    'arabic',         // Arabic
    'latin-ext',      // Extended Latin for European languages (Tier 2+)
  ],
  weight: ['400', '500'],
  variable: '--font-noto',
  display: 'swap',   // prevent invisible text during font load
});

// Add these subsets when Tier 2 languages are activated:
// 'cyrillic'        → Russian, Ukrainian, Bulgarian, Serbian
// 'cyrillic-ext'    → Extended Cyrillic
// 'devanagari'      → Hindi, Sanskrit
// 'thai'            → Thai
// 'vietnamese'      → Vietnamese
// For CJK: use next/font/google with Noto Sans SC/TC/JP/KR (separate fonts)
```

### Whisper language codes reference (for transcription_language setting)

```
Show this list in the AI Settings language selector:

auto  Deteksi otomatis (recommended)
──────────────────────────────────────
id    Indonesian · Bahasa Indonesia
en    English
ar    Arabic · العربية
ms    Malay · Bahasa Melayu
jv    Javanese · Basa Jawa
zh    Chinese · 中文
ja    Japanese · 日本語
ko    Korean · 한국어
hi    Hindi · हिंदी
fr    French · Français
de    German · Deutsch
es    Spanish · Español
pt    Portuguese · Português
ru    Russian · Русский
tr    Turkish · Türkçe
vi    Vietnamese · Tiếng Việt
th    Thai · ภาษาไทย
nl    Dutch · Nederlands
pl    Polish · Polski
it    Italian · Italiano
sv    Swedish · Svenska
da    Danish · Dansk
fi    Finnish · Suomi
no    Norwegian · Norsk
uk    Ukrainian · Українська
cs    Czech · Čeština
ro    Romanian · Română
hu    Hungarian · Magyar
el    Greek · Ελληνικά
he    Hebrew · עברית
fa    Persian · فارسی
ur    Urdu · اردو
bn    Bengali · বাংলা
pa    Punjabi · ਪੰਜਾਬੀ
ta    Tamil · தமிழ்
te    Telugu · తెలుగు
ml    Malayalam · മലയാളം
si    Sinhala · සිංහල
my    Burmese · မြန်မာ
km    Khmer · ខ្មែរ
lo    Lao · ລາວ
mn    Mongolian · Монгол
sw    Swahili · Kiswahili
am    Amharic · አማርኛ
yo    Yoruba
ha    Hausa
af    Afrikaans
tl    Filipino/Tagalog
+ others (full list: https://github.com/openai/whisper#available-models-and-languages)
```

### i18n development rules (MANDATORY)

```
1. WRITE ENGLISH FIRST, INDONESIAN SECOND
   All new UI strings: add to en.json first, then id.json
   This is the Crowdin source language

2. NO HARDCODED STRINGS IN COMPONENTS
   Every user-visible string MUST use the translation function
   WRONG: <p>Simpan perubahan</p>
   RIGHT: <p>{t('common.save')}</p>

3. NO BACKEND HUMAN-READABLE ERRORS
   Backend returns error CODES only
   Frontend handles all human-readable translation
   WRONG: { "message": "Username already taken" }
   RIGHT: { "code": "USERNAME_TAKEN" }

4. USE ICU MESSAGE FORMAT FOR DYNAMIC STRINGS
   WRONG: t('counter') + count + t('characters')
   RIGHT: t('bio.counter', { count: 160 - bio.length })
          with message: "bio.counter": "{count}/160 karakter"

5. ALWAYS TEST RTL LAYOUT FOR ARABIC
   Before any PR: switch interface_language to 'ar' and visually verify
   Sidebar, forms, buttons, icons must all mirror correctly

6. DATES AND NUMBERS VIA Intl API ONLY
   WRONG: "Bergabung sejak " + date.toLocaleDateString()
   RIGHT: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)

7. FALLBACK CHAIN FOR MISSING TRANSLATIONS
   User locale → "en" → key name (never show raw key to user)
   next-intl handles this automatically with fallbackLocale: 'en'
```

---

*CLAUDE-MVP-SETTINGS.md — Fren-Edu · Phase 1 MVP · Version 1.1*
*Read alongside CLAUDE.md for full project context.*
*This document is authoritative for all settings, profile, and i18n features.*
