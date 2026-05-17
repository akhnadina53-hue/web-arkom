# CLAUDE-DESIGN.md — Fren-Edu
> Design System & Interaction Language — Phase 1 MVP
> Read alongside CLAUDE.md + CLAUDE-MVP-SETTINGS.md before touching any UI code.
> This file is the single source of truth for all visual and motion decisions.

---

## TABLE OF CONTENTS

1. [Design Philosophy](#1-design-philosophy)
2. [Color System — "Smurf Forest"](#2-color-system--smurf-forest)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Design Tokens](#5-component-design-tokens)
6. [Motion & Animation System](#6-motion--animation-system)
7. [Logo — Dynamic Identity](#7-logo--dynamic-identity)
8. [Component Interaction Patterns](#8-component-interaction-patterns)
9. [Glassmorphism Rules](#9-glassmorphism-rules)
10. [Accessibility & Reduced Motion](#10-accessibility--reduced-motion)
11. [Tailwind Config](#11-tailwind-config)
12. [File Structure](#12-file-structure)
13. [Agent Implementation Instructions](#13-agent-implementation-instructions)

---

## 1. DESIGN PHILOSOPHY

### Three core words
```
INTERAKTIF · SOLID · ELEGAN
```

Every design decision must pass this filter:
- **Interaktif** — the UI responds, breathes, and gives feedback. Nothing feels static or dead.
- **Solid** — animations never compromise usability. Structure is always clear.
- **Elegan** — restraint over excess. One perfect animation beats five competing ones.

### What this means in practice

```
✅ DO
  - Animate to give feedback (confirm user action succeeded)
  - Animate to guide attention (lead eye to important state change)
  - Animate to convey hierarchy (staggered reveals show structure)
  - Use motion as a reward (satisfying micro-interactions)

❌ DON'T
  - Animate just because we can
  - Use more than 2 animated elements simultaneously on the same card
  - Play animations longer than 400ms (feels sluggish)
  - Add particle effects on every click — reserve for high-value moments only
  - Use glassmorphism on every single element (it stops reading as "glass")
```

### On the Gemini prompt — what we keep and what we improve

```
KEEP from Gemini's suggestion:
  ✅ Smurf Forest color palette concept (we refine the exact values)
  ✅ Glassmorphism on settings cards (with strict rules to avoid overdoing it)
  ✅ Hover scale + y-lift on cards (we dial down from 1.02 to 1.015)
  ✅ Staggered fade-in on page entry
  ✅ Spring physics on OTP input boxes
  ✅ Moving gradient on Save button

IMPROVE from Gemini's suggestion:
  ⚠️ "Particle burst on toggle" → only trigger on first activation, not every toggle
     Rationale: deaf users rely heavily on visual feedback — particle burst on every
     toggle is distracting and desensitizes the meaningful signal
  ⚠️ "Logo rotation on cursor approach" → replace with scale + glow only
     Rationale: rotation on hover can cause motion sickness (vestibular disorder)
     and conflicts with reduced_motion accessibility requirement
  ⚠️ "backdrop-blur-md on all cards" → only on modal overlays and hero sections
     Rationale: blur on many elements simultaneously causes GPU strain on low-end devices
     (many students use budget Android phones or low-spec laptops)
  ⚠️ Golden Snitch #F4A261 accent → keep as secondary accent only, not primary CTA
     Rationale: clashes with green palette on contrast-sensitive elements

ADD that Gemini missed:
  ➕ Dark mode variant for all tokens (users set dark mode in Appearance settings)
  ➕ RTL-safe motion (no left/right directional animations — use scale and y-axis only)
  ➕ Performance budget: 60fps on Intel UHD 620 (common budget laptop GPU)
  ➕ Skeleton loaders with shimmer in brand colors
  ➕ Focus ring design (critical for keyboard users / tunarungu)
```

---

## 2. COLOR SYSTEM — "Smurf Forest"

### Palette definition

```
INSPIRATION
  Smurf village: soft teal-greens, misty whites, natural forest warmth
  Snitch (Harry Potter): warm golden accent for action moments
  NOT: neon, saturated, or dark — this is a pastel-first palette
```

```css
/* apps/web/app/globals.css — CSS custom properties */

:root {
  /* ── PRIMARY GREENS ─────────────────────────────────────── */
  --color-smurf-100: #E8F5F0;   /* Mist — lightest tint, backgrounds */
  --color-smurf-200: #C8E8DC;   /* Soft Moss — hover states, subtle fills */
  --color-smurf-300: #A7D7C5;   /* Smurf Green — PRIMARY brand color */
  --color-smurf-400: #74B49B;   /* Deep Moss — secondary actions, icons */
  --color-smurf-500: #52967E;   /* Forest — pressed states, dark accents */
  --color-smurf-600: #3A6E5C;   /* Deep Forest — text on light backgrounds */
  --color-smurf-700: #264D40;   /* Dark Canopy — headings, high contrast */

  /* ── ACCENT — "The Snitch" ──────────────────────────────── */
  --color-snitch-300: #FBD5A8;  /* Light golden — hover tint */
  --color-snitch-400: #F4A261;  /* Golden Snitch — CTA highlights, badges */
  --color-snitch-500: #E07B3A;  /* Deep gold — pressed state */

  /* ── NEUTRALS ───────────────────────────────────────────── */
  --color-white:      #FFFFFF;
  --color-mist:       #F6FBF9;  /* Page background (light mode) */
  --color-fog:        #EDF5F1;  /* Card background (light mode) */
  --color-stone-100:  #D4E5DF;  /* Borders, dividers */
  --color-stone-200:  #B0CEC5;  /* Disabled states */
  --color-stone-500:  #607C75;  /* Body text (light mode) */
  --color-stone-700:  #2E4A43;  /* Headings (light mode) */

  /* ── SEMANTIC ALIASES (use these in components, not raw values) ── */
  --bg-page:          var(--color-mist);
  --bg-card:          var(--color-fog);
  --bg-card-glass:    rgba(246, 251, 249, 0.72);  /* glassmorphism */
  --bg-elevated:      #FFFFFF;
  --bg-overlay:       rgba(38, 77, 64, 0.45);     /* modal backdrop */

  --text-primary:     var(--color-stone-700);
  --text-secondary:   var(--color-stone-500);
  --text-tertiary:    var(--color-stone-200);
  --text-on-brand:    #FFFFFF;
  --text-brand:       var(--color-smurf-600);
  --text-accent:      var(--color-snitch-500);

  --border-default:   var(--color-stone-100);
  --border-brand:     var(--color-smurf-300);
  --border-focus:     var(--color-smurf-400);

  --brand-primary:    var(--color-smurf-300);
  --brand-secondary:  var(--color-smurf-400);
  --brand-dark:       var(--color-smurf-700);

  --success:          #52B788;
  --warning:          #F4A261;
  --error:            #E05C5C;
  --info:             #5B9BD5;

  /* ── SHADOWS ────────────────────────────────────────────── */
  --shadow-sm:        0 1px 3px rgba(38, 77, 64, 0.08);
  --shadow-md:        0 4px 12px rgba(38, 77, 64, 0.10);
  --shadow-lg:        0 8px 24px rgba(38, 77, 64, 0.12);
  --shadow-glow-sm:   0 0 12px rgba(167, 215, 197, 0.35);
  --shadow-glow-md:   0 0 24px rgba(167, 215, 197, 0.45);
  --shadow-glow-lg:   0 8px 32px rgba(167, 215, 197, 0.40);
  --shadow-snitch:    0 0 16px rgba(244, 162, 97, 0.40);
}

/* ── DARK MODE ──────────────────────────────────────────────────── */
.dark {
  --bg-page:          #0D1F1A;   /* Deep forest night */
  --bg-card:          #132920;   /* Slightly lighter */
  --bg-card-glass:    rgba(19, 41, 32, 0.75);
  --bg-elevated:      #1A3529;
  --bg-overlay:       rgba(0, 0, 0, 0.60);

  --text-primary:     #E8F5F0;
  --text-secondary:   #A7C4BB;
  --text-tertiary:    #5A7A70;
  --text-brand:       var(--color-smurf-300);

  --border-default:   rgba(167, 215, 197, 0.12);
  --border-brand:     rgba(167, 215, 197, 0.30);
  --border-focus:     var(--color-smurf-300);

  --shadow-sm:        0 1px 3px rgba(0, 0, 0, 0.30);
  --shadow-md:        0 4px 12px rgba(0, 0, 0, 0.40);
  --shadow-glow-sm:   0 0 12px rgba(167, 215, 197, 0.20);
  --shadow-glow-md:   0 0 24px rgba(167, 215, 197, 0.25);
}
```

### Accent color presets (for UserSettings.accent_color)

```typescript
// 6 preset options only — no free color picker in MVP
// stored as hex in UserSettings.accent_color

export const ACCENT_PRESETS = [
  { id: 'smurf',    hex: '#A7D7C5', label: 'Smurf Green',    default: true },
  { id: 'moss',     hex: '#74B49B', label: 'Deep Moss'  },
  { id: 'snitch',   hex: '#F4A261', label: 'Golden Snitch'   },
  { id: 'sky',      hex: '#5B9BD5', label: 'Sky Blue'        },
  { id: 'lavender', hex: '#A89BD9', label: 'Lavender'        },
  { id: 'coral',    hex: '#E07B7B', label: 'Coral Rose'      },
] as const;

// Apply selected accent as CSS variable override on <html>
// html style="--brand-primary: #F4A261; --border-brand: #F4A261; ..."
```

---

## 3. TYPOGRAPHY

```css
/* Font stack */
--font-display:  'Sora', var(--font-noto), sans-serif;     /* headings, logo, badges */
--font-body:     'Plus Jakarta Sans', var(--font-noto), sans-serif; /* body, settings copy */
--font-mono:     'JetBrains Mono', 'Fira Code', monospace; /* transcript, OTP, code */

/* Why these fonts:
   Sora          → rounded, modern, energetic — matches "interaktif" personality
   Plus Jakarta  → clean, readable at small sizes — better than Poppins at 13px
   JetBrains Mono→ already in CLAUDE.md for transcript, familiar for devs
   Noto (fallback)→ i18n coverage (Section 10 of CLAUDE-MVP-SETTINGS.md) */
```

```typescript
// next.config.ts — Google Fonts import
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono, Noto_Sans } from 'next/font/google';

export const fontSora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

export const fontJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
```

### Type scale

```
Display    : Sora 800  32px / 1.15  → page titles, hero name
Heading 1  : Sora 700  24px / 1.25  → section titles
Heading 2  : Sora 600  18px / 1.3   → card titles, modal titles
Body L     : Jakarta 500 16px / 1.6  → primary body copy
Body M     : Jakarta 400 14px / 1.6  → secondary copy, descriptions
Body S     : Jakarta 400 13px / 1.5  → settings labels, meta info
Caption    : Jakarta 500 11px / 1.4  → badges, uppercase labels (tracking: 1.5px)
Mono       : JetBrains 400 14px / 1.7 → transcript text, OTP boxes
```

---

## 4. SPACING & LAYOUT

```
Base unit: 4px

Scale:
  space-1  :  4px   → icon gap, inline elements
  space-2  :  8px   → tight component padding
  space-3  :  12px  → compact row padding
  space-4  :  16px  → default padding
  space-5  :  20px  → section gap (small)
  space-6  :  24px  → card padding
  space-8  :  32px  → section gap (large)
  space-10 :  40px  → between settings groups
  space-16 :  64px  → page vertical padding
  space-20 :  80px  → hero section padding

Border radius:
  radius-sm  :  6px   → badges, small inputs, tags
  radius-md  :  10px  → buttons, row items
  radius-lg  :  16px  → cards, settings groups
  radius-xl  :  24px  → modals, panels
  radius-full: 9999px → avatars, pills, toggles
```

---

## 5. COMPONENT DESIGN TOKENS

### Buttons

```css
/* PRIMARY BUTTON — main actions (Save, Verify, etc.) */
.btn-primary {
  background: linear-gradient(135deg, var(--color-smurf-300) 0%, var(--color-smurf-400) 100%);
  color: var(--color-smurf-700);
  font-weight: 600;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  box-shadow: var(--shadow-md), var(--shadow-glow-sm);
  transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-smurf-200) 0%, var(--color-smurf-300) 100%);
  box-shadow: var(--shadow-lg), var(--shadow-glow-md);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0px) scale(0.98);
  box-shadow: var(--shadow-sm);
}

/* SAVE BUTTON — special moving gradient (from Gemini, refined) */
.btn-save {
  background-size: 200% 100%;
  background-image: linear-gradient(
    110deg,
    var(--color-smurf-300) 0%,
    var(--color-smurf-200) 35%,
    var(--color-smurf-400) 70%,
    var(--color-smurf-300) 100%
  );
  animation: none;
  transition: background-position 400ms ease, box-shadow 200ms ease, transform 150ms ease;
}

.btn-save:hover {
  background-position: 100% 0;
  animation: gradient-shift 2s linear infinite;
}

@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* SECONDARY BUTTON */
.btn-secondary {
  background: transparent;
  color: var(--text-brand);
  border: 1.5px solid var(--border-brand);
  padding: 9px 20px;
  border-radius: 10px;
  transition: all 150ms ease;
}

.btn-secondary:hover {
  background: var(--color-smurf-100);
  border-color: var(--color-smurf-400);
}

/* DANGER BUTTON */
.btn-danger {
  background: transparent;
  color: var(--error);
  border: 1.5px solid rgba(224, 92, 92, 0.30);
  padding: 9px 20px;
  border-radius: 10px;
  transition: all 150ms ease;
}

.btn-danger:hover {
  background: rgba(224, 92, 92, 0.08);
  border-color: var(--error);
}
```

### Toggle Switch

```css
/* Custom toggle — replaces shadcn/ui default for brand consistency */
.toggle-track {
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background: var(--border-default);
  transition: background 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  position: relative;
}

.toggle-track[data-checked="true"] {
  background: linear-gradient(90deg, var(--color-smurf-300), var(--color-smurf-400));
  box-shadow: var(--shadow-glow-sm);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toggle-track[data-checked="true"] .toggle-thumb {
  transform: translateX(20px);
}
```

### Input fields

```css
.input-field {
  background: var(--bg-elevated);
  border: 1.5px solid var(--border-default);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--text-primary);
  transition: border-color 150ms ease, box-shadow 150ms ease;
  outline: none;
  width: 100%;
}

.input-field:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(167, 215, 197, 0.20);
}

.input-field::placeholder {
  color: var(--text-tertiary);
}

.input-field[aria-invalid="true"] {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(224, 92, 92, 0.12);
}

/* Focus ring for keyboard users — NEVER remove this */
.input-field:focus-visible {
  outline: 2.5px solid var(--border-focus);
  outline-offset: 2px;
}
```

---

## 6. MOTION & ANIMATION SYSTEM

### Animation constants (use ONLY these values — never ad-hoc durations)

```typescript
// lib/motion/constants.ts

export const DURATION = {
  instant:  100,   // state changes that should feel immediate
  fast:     150,   // micro-interactions (button press, toggle)
  default:  250,   // most transitions
  medium:   350,   // card hover, page section reveal
  slow:     500,   // page enter, modal open
  crawl:    800,   // logo pulse, skeleton shimmer (looping)
} as const;

export const EASING = {
  // Standard transitions
  ease:       [0.4, 0, 0.2, 1],       // Material Design standard
  easeIn:     [0.4, 0, 1, 1],
  easeOut:    [0, 0, 0.2, 1],

  // Spring-based (for interactions with physical feel)
  spring:     { type: 'spring', stiffness: 320, damping: 28 },
  springBounce: { type: 'spring', stiffness: 400, damping: 20 },
  springSnap:   { type: 'spring', stiffness: 500, damping: 35 },
} as const;

export const STAGGER = {
  children: 0.06,   // delay between each child in a staggered list
  fast:     0.04,   // for longer lists (5+ items)
} as const;
```

### Framer Motion variants library

```typescript
// lib/motion/variants.ts
import { Variants } from 'framer-motion';
import { DURATION, EASING, STAGGER } from './constants';

// ── PAGE / SECTION ENTRY ─────────────────────────────────────────
export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.medium / 1000, ease: EASING.easeOut }
  },
};

export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: STAGGER.children, delayChildren: 0.05 } },
};

// ── CARD INTERACTIONS ────────────────────────────────────────────
export const cardHover: Variants = {
  rest:  { scale: 1,     y: 0,  boxShadow: 'var(--shadow-sm)' },
  hover: {
    scale: 1.015,          // NOT 1.02 — subtler, more elegant
    y: -3,                 // NOT -5 — keeps element grounded
    boxShadow: 'var(--shadow-lg), var(--shadow-glow-sm)',
    transition: EASING.spring,
  },
};

// ── MODAL ────────────────────────────────────────────────────────
export const modalBackdrop: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.default / 1000 } },
  exit:    { opacity: 0, transition: { duration: DURATION.fast / 1000 } },
};

export const modalPanel: Variants = {
  hidden:  { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { ...EASING.spring, delay: 0.03 }
  },
  exit:    {
    opacity: 0, scale: 0.97, y: 8,
    transition: { duration: DURATION.fast / 1000, ease: EASING.easeIn }
  },
};

// ── OTP INPUT ────────────────────────────────────────────────────
export const otpBoxEntry: Variants = {
  idle:    { scale: 1,    borderColor: 'var(--border-default)' },
  filled:  {
    scale: [1, 1.08, 1],   // spring bounce on input
    borderColor: 'var(--border-focus)',
    transition: EASING.springBounce,
  },
  error:   {
    x: [0, -4, 4, -4, 4, 0],   // shake on wrong OTP
    borderColor: 'var(--error)',
    transition: { duration: DURATION.medium / 1000, ease: EASING.ease },
  },
  success: {
    scale: 1,
    borderColor: 'var(--success)',
    backgroundColor: 'rgba(82, 183, 136, 0.08)',
    transition: EASING.spring,
  },
};

// ── BADGE AWARD ──────────────────────────────────────────────────
export const badgeReveal: Variants = {
  hidden:  { scale: 0, opacity: 0, rotate: -12 },
  visible: {
    scale: 1, opacity: 1, rotate: 0,
    transition: { ...EASING.springBounce, delay: 0.2 }
  },
};

// ── SKELETON SHIMMER ─────────────────────────────────────────────
// Applied via CSS animation, not Framer Motion (better perf)
// See: .skeleton class in globals.css
```

### Skeleton shimmer (CSS, not JS)

```css
/* globals.css */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-smurf-100) 0%,
    var(--color-smurf-200) 50%,
    var(--color-smurf-100) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease infinite;
  border-radius: var(--radius-md, 10px);
}

/* Dark mode shimmer */
.dark .skeleton {
  background: linear-gradient(
    90deg,
    rgba(167, 215, 197, 0.05) 0%,
    rgba(167, 215, 197, 0.12) 50%,
    rgba(167, 215, 197, 0.05) 100%
  );
}
```

---

## 7. LOGO — DYNAMIC IDENTITY

### Logo behavior states

```
STATE 1: IDLE (default)
  → Gentle float: translateY -4px to 0px, loop 3s ease-in-out infinite
  → Very subtle glow pulse around icon perimeter
  → NO rotation — avoid vestibular/motion sickness issues

STATE 2: HOVER
  → Scale up to 1.08 (spring physics)
  → Glow intensifies from shadow-glow-sm → shadow-glow-md
  → Icon color shifts from smurf-300 → smurf-200 (brightens)
  → NO rotation (consistent with idle rule)

STATE 3: LOADING / PROCESSING
  → Float animation pauses
  → Icon morphs to pulsing circle (CSS clip-path or SVG transition)
  → Pulse: scale 1.0 → 1.08 → 1.0, breathing rhythm (1.2s ease-in-out)
  → Ring spinner in smurf-300 orbits the icon
  → Used during: pipeline processing, page loading

STATE 4: SUCCESS
  → Brief scale pop: 1 → 1.15 → 1 (spring, 400ms)
  → Color flash: smurf-300 → success (#52B788) → smurf-300
  → Single pulse of shadow-glow-lg
  → Triggered by: save success, verification complete
```

### Logo component implementation

```typescript
// components/ui/FrenEduLogo.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

type LogoState = 'idle' | 'hover' | 'loading' | 'success';

interface FrenEduLogoProps {
  size?: number;       // default 40
  state?: LogoState;   // external control for loading/success
  showText?: boolean;  // show "Fren-Edu" wordmark beside icon
}

export function FrenEduLogo({ size = 40, state = 'idle', showText = true }: FrenEduLogoProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Respect reduced motion — all animations disabled
  if (shouldReduceMotion) {
    return <StaticLogo size={size} showText={showText} />;
  }

  return (
    <motion.div
      className="flex items-center gap-2 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Icon container — float animation */}
      <motion.div
        animate={state === 'loading' ? {
          scale: [1, 1.08, 1],
          transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
        } : state === 'success' ? {
          scale: [1, 1.15, 1],
          transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
        } : isHovered ? {
          scale: 1.08,
          y: 0,
          filter: 'drop-shadow(0 0 12px rgba(167, 215, 197, 0.6))',
          transition: { type: 'spring', stiffness: 400, damping: 20 }
        } : {
          // IDLE: gentle float — y-axis only
          y: [0, -4, 0],
          filter: 'drop-shadow(0 0 6px rgba(167, 215, 197, 0.3))',
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }}
        style={{ width: size, height: size }}
      >
        {/* SVG icon — graduation cap */}
        <LogoIcon
          size={size}
          isLoading={state === 'loading'}
          isSuccess={state === 'success'}
        />
      </motion.div>

      {/* Wordmark */}
      {showText && (
        <motion.span
          className="font-display font-700 text-brand select-none"
          style={{ fontSize: size * 0.425 }}
          animate={{ opacity: 1 }}
        >
          Fren-Edu
        </motion.span>
      )}
    </motion.div>
  );
}
```

---

## 8. COMPONENT INTERACTION PATTERNS

### SettingsGroup — Glassmorphism card

```typescript
// components/settings/SettingsGroup.tsx
'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion/variants';

interface SettingsGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  glass?: boolean;        // enable glassmorphism — use sparingly
  index?: number;         // for staggered entry delay
}

export function SettingsGroup({
  title, description, children, glass = false, index = 0
}: SettingsGroupProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover="hover"
      // Glassmorphism ONLY when glass=true — not on every card
      className={[
        'rounded-2xl border p-6 mb-4',
        glass
          ? 'bg-[var(--bg-card-glass)] backdrop-blur-sm border-[var(--border-brand)]/20'
          : 'bg-[var(--bg-card)] border-[var(--border-default)]',
      ].join(' ')}
      // Hover: subtle lift — NOT scale (settings cards shouldn't "float away")
      whileHover={{
        y: -2,
        boxShadow: 'var(--shadow-lg), var(--shadow-glow-sm)',
        borderColor: 'var(--color-smurf-300)',
        transition: { type: 'spring', stiffness: 300, damping: 28 },
      }}
    >
      <h3 className="font-display font-600 text-[var(--text-primary)] text-[16px] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-[var(--text-secondary)] text-[13px] mb-4">{description}</p>
      )}
      <div className="space-y-1">{children}</div>
    </motion.div>
  );
}
```

### SettingsRow — Single setting item

```typescript
// components/settings/SettingsRow.tsx
'use client';

import { motion } from 'framer-motion';

export function ToggleRow({
  label, description, checked, onChange, isFirstActivation = false
}: ToggleRowProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleChange = (newValue: boolean) => {
    // Particle burst ONLY on first activation (not every toggle)
    // Controlled by parent tracking whether this setting was ever enabled
    if (newValue && isFirstActivation && !shouldReduceMotion) {
      triggerParticleBurst();
    }
    onChange(newValue);
  };

  return (
    <motion.div
      className="flex items-center justify-between py-3 px-2 rounded-xl"
      whileHover={{
        backgroundColor: 'var(--color-smurf-100)',
        transition: { duration: 0.15 }
      }}
    >
      <div>
        <p className="text-[14px] font-500 text-[var(--text-primary)]">{label}</p>
        {description && (
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{description}</p>
        )}
      </div>
      <Toggle checked={checked} onChange={handleChange} />
    </motion.div>
  );
}
```

### Particle burst (first-activation only)

```typescript
// lib/motion/particles.ts
// Triggered ONCE per toggle lifetime — not on every click

export function triggerParticleBurst(originElement?: HTMLElement) {
  const origin = originElement?.getBoundingClientRect();
  const x = origin ? origin.left + origin.width / 2 : window.innerWidth / 2;
  const y = origin ? origin.top + origin.height / 2 : window.innerHeight / 2;

  // Create 8 particles
  Array.from({ length: 8 }).forEach((_, i) => {
    const particle = document.createElement('div');
    const angle = (i / 8) * Math.PI * 2;
    const distance = 24 + Math.random() * 16;

    particle.style.cssText = `
      position: fixed;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--color-smurf-300);
      left: ${x}px; top: ${y}px;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
    `;

    document.body.appendChild(particle);

    // Animate outward then fade
    particle.animate([
      { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
      {
        transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,
        opacity: 0
      }
    ], {
      duration: 400,
      easing: 'cubic-bezier(0, 0.9, 0.57, 1)',
      fill: 'forwards',
    }).onfinish = () => particle.remove();
  });
}
```

### OTP Input (Spring physics)

```typescript
// components/profile/OTPInput.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { otpBoxEntry } from '@/lib/motion/variants';

export function OTPInputGroup({ length = 6, value, onChange, status }: OTPInputProps) {
  return (
    <div
      className="flex gap-3 justify-center"
      role="group"
      aria-label={t('verification.step2.otpGroup')}
    >
      {Array.from({ length }).map((_, i) => (
        <motion.input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          variants={otpBoxEntry}
          initial="idle"
          animate={
            status === 'error'   ? 'error'   :
            status === 'success' ? 'success' :
            value[i]             ? 'filled'  : 'idle'
          }
          className={[
            'w-12 h-14 text-center font-mono font-500 text-[20px]',
            'rounded-xl border-2 outline-none',
            'bg-[var(--bg-elevated)] text-[var(--text-primary)]',
            'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
            'transition-colors',
          ].join(' ')}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => { refs.current[i] = el; }}
          aria-label={`Digit ${i + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
```

### Profile page — Staggered entry

```typescript
// app/profile/[username]/page.tsx
// All sections enter with staggered fade-in

<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
  className="max-w-2xl mx-auto"
>
  {/* Banner */}
  <motion.div variants={fadeInUp} className="...">
    <ProfileBanner url={profile.banner_url} />
  </motion.div>

  {/* Avatar + name row */}
  <motion.div variants={fadeInUp} className="...">
    <ProfileHeader profile={profile} />
  </motion.div>

  {/* Badges */}
  <motion.div variants={fadeInUp}>
    <ProfileBadges badges={profile.badges} />
  </motion.div>

  {/* Bio */}
  <motion.div variants={fadeInUp}>
    <p>{profile.bio}</p>
  </motion.div>

  {/* Stats */}
  <motion.div variants={fadeInUp}>
    <ProfileStats sessionCount={stats.total} studyHours={stats.hours} />
  </motion.div>
</motion.div>
```

---

## 9. GLASSMORPHISM RULES

> Glassmorphism is a premium touch — overuse destroys the effect.

```
USE glassmorphism ONLY on:
  ✅ Modal overlay panels (VerifyStudentModal, confirmation dialogs)
  ✅ Profile hero section card (avatar + name overlay on banner)
  ✅ UnsavedChangesBar (sticky bottom bar)
  ✅ Tooltip bubbles
  ✅ Floating logo background (sidebar top)

DO NOT use glassmorphism on:
  ❌ Regular SettingsGroup cards (use solid bg-card instead)
  ❌ Input fields
  ❌ Navigation sidebar (solid background for readability)
  ❌ Any element that contains long text blocks (blur degrades readability)
  ❌ Mobile: avoid backdrop-blur on elements that scroll — causes jank

Glass recipe (when allowed):
  background: var(--bg-card-glass)        → rgba(246, 251, 249, 0.72) light
  backdrop-filter: blur(12px)             → NOT more than 16px
  -webkit-backdrop-filter: blur(12px)     → Safari support
  border: 1px solid rgba(167,215,197,0.25)
  box-shadow: var(--shadow-md)

Performance note:
  backdrop-filter is GPU-intensive.
  Test on Intel UHD 620 before committing.
  If fps < 55 → remove backdrop-filter, use solid color fallback.
```

---

## 10. ACCESSIBILITY & REDUCED MOTION

```typescript
// RULE: Every animated component MUST check useReducedMotion()
// This respects BOTH:
//   (a) OS-level prefers-reduced-motion media query
//   (b) settings.reduced_motion = true (user preference in app)

// lib/hooks/useAppReducedMotion.ts
import { useReducedMotion } from 'framer-motion';
import { useSettingsStore } from '@/lib/store/settingsStore';

export function useAppReducedMotion(): boolean {
  const systemReducedMotion = useReducedMotion();          // OS preference
  const appReducedMotion = useSettingsStore(s => s.settings?.reduced_motion ?? false);
  return systemReducedMotion || appReducedMotion;
}

// Usage in any animated component:
const shouldReduce = useAppReducedMotion();

<motion.div
  animate={shouldReduce ? {} : { y: [0, -4, 0] }}
  // When reduced: no animation, instant state change only
/>
```

### Focus ring — non-negotiable

```css
/* globals.css — applied to ALL interactive elements */
/* NEVER use outline: none without a replacement */

*:focus-visible {
  outline: 2.5px solid var(--border-focus);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Branded focus ring on brand elements */
.btn-primary:focus-visible,
.toggle-track:focus-visible {
  outline-color: var(--color-smurf-500);
  box-shadow: 0 0 0 4px rgba(167, 215, 197, 0.25);
}
```

---

## 11. TAILWIND CONFIG

```typescript
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',            // toggled by adding .dark to <html>
  theme: {
    extend: {
      colors: {
        smurf: {
          100: '#E8F5F0',
          200: '#C8E8DC',
          300: '#A7D7C5',       // primary brand
          400: '#74B49B',
          500: '#52967E',
          600: '#3A6E5C',
          700: '#264D40',
        },
        snitch: {
          300: '#FBD5A8',
          400: '#F4A261',       // accent
          500: '#E07B3A',
        },
        mist: '#F6FBF9',
        fog:  '#EDF5F1',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'var(--font-noto)', 'sans-serif'],
        body:    ['var(--font-jakarta)', 'var(--font-noto)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        'sm':   '6px',
        'md':   '10px',
        'lg':   '16px',
        'xl':   '24px',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(167, 215, 197, 0.35)',
        'glow-md': '0 0 24px rgba(167, 215, 197, 0.45)',
        'glow-lg': '0 8px 32px rgba(167, 215, 197, 0.40)',
        'snitch':  '0 0 16px rgba(244, 162, 97, 0.40)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 2s linear infinite',
        'shimmer':        'shimmer 1.6s ease infinite',
        'float':          'float 3s ease-in-out infinite',
        'pulse-glow':     'pulse-glow 1.2s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: 'var(--shadow-glow-sm)' },
          '50%':      { boxShadow: 'var(--shadow-glow-md)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 12. FILE STRUCTURE

```
apps/web/
  app/
    globals.css                     ← CSS variables (all tokens defined here)
  lib/
    motion/
      constants.ts                  ← DURATION, EASING, STAGGER
      variants.ts                   ← All Framer Motion variants
      particles.ts                  ← Particle burst utility
    hooks/
      useAppReducedMotion.ts        ← Combined OS + app reduced motion check
  components/
    ui/
      FrenEduLogo.tsx               ← Dynamic logo (all 4 states)
      Toggle.tsx                    ← Custom branded toggle
      Button.tsx                    ← btn-primary, btn-secondary, btn-save, btn-danger
      Input.tsx                     ← input-field with focus ring
      Badge.tsx                     ← Profile badges
      Skeleton.tsx                  ← Shimmer skeleton variants
    settings/
      SettingsGroup.tsx             ← Animated settings card
      SettingsRow.tsx               ← Row with hover bg
      ToggleRow.tsx                 ← Row + custom toggle
      SelectRow.tsx                 ← Row + select
      DangerZone.tsx
      UnsavedChangesBar.tsx         ← Glassmorphism sticky bar
      ThemePicker.tsx
      AccentColorPicker.tsx
      FontSizePreview.tsx
    profile/
      ProfileHeader.tsx             ← Banner + avatar overlap
      ProfileBadges.tsx             ← Staggered badge reveal
      AvatarUploader.tsx
      BannerUploader.tsx
      OTPInput.tsx                  ← Spring physics input
      VerifyStudentModal.tsx        ← Glassmorphism modal
```

---

## 13. AGENT IMPLEMENTATION INSTRUCTIONS

### Task: Setup design system foundation

```
1. Install dependencies:
   npm install framer-motion@11

2. Add CSS variables to apps/web/app/globals.css
   Use the full :root and .dark blocks from Section 2 above.
   Do NOT use hardcoded hex values anywhere in components.

3. Update apps/web/tailwind.config.ts
   Use the full config from Section 11 above.

4. Add font imports to apps/web/app/layout.tsx
   Use Sora, Plus Jakarta Sans, JetBrains Mono from next/font/google.
   Apply all three as CSS variables on <html>.

5. Create lib/motion/constants.ts and lib/motion/variants.ts
   Copy exact values from Section 6 above.
   Do NOT invent new duration or easing values outside these constants.

6. Create lib/hooks/useAppReducedMotion.ts
   Must combine OS preference AND app setting.
   Every animated component must call this hook.
```

### Task: Apply theme from UserSettings

```
Read settings.theme and settings.accent_color from settingsStore.
On mount and on change:
  - theme DARK  → add class "dark" to document.documentElement
  - theme LIGHT → remove class "dark"
  - theme SYSTEM → match prefers-color-scheme media query
  - accent_color → set CSS variable on document.documentElement:
    document.documentElement.style.setProperty('--brand-primary', accentColor);
    document.documentElement.style.setProperty('--border-brand', accentColor);
    document.documentElement.style.setProperty('--border-focus', accentColor);
    // compute 20% opacity variant for glow:
    document.documentElement.style.setProperty('--shadow-glow-sm',
      `0 0 12px ${accentColor}59`);  // 59 = 35% opacity in hex

Apply theme change INSTANTLY (no transition delay) — theme flash is worse than no animation.
```

### Task: Build animated SettingsGroup

```
Use the SettingsGroup component from Section 8.
Rules:
  - glass=false by default — do NOT enable glass on regular settings cards
  - glass=true ONLY for: UnsavedChangesBar, VerifyStudentModal
  - Hover: y: -2, NOT scale (settings cards should not resize)
  - Entry: use fadeInUp variant with staggerContainer on parent
  - Each SettingsGroup gets index prop for stagger delay: index={0}, index={1}, etc.
```

### Task: Build VerifyStudentModal

```
Use glassmorphism panel (glass=true SettingsGroup or manual glass styles).
Wrap in AnimatePresence for exit animation.
Use modalBackdrop + modalPanel variants from Section 6.
OTP input: use OTPInput component with otpBoxEntry variants.
  - 'filled' state: triggered immediately on each digit input
  - 'error' state: triggered on wrong OTP (shake all 6 boxes simultaneously)
  - 'success' state: triggered on correct OTP before advancing to Step 3
Step 3 badge reveal: use badgeReveal variant on the badge icon.
Particle burst: triggerParticleBurst() once on verification success.
```

### Non-negotiable checks before any PR

```
□ useAppReducedMotion() called in every animated component
□ No hardcoded hex values — all colors via CSS variables
□ No animation > 400ms duration (except logo idle float and skeleton shimmer)
□ No backdrop-filter on more than 2 visible elements at once
□ Particle burst: maximum once per user session per toggle (not on every click)
□ Focus ring visible on all interactive elements (test with Tab key)
□ Dark mode tested — switch to .dark class and verify all tokens resolve correctly
□ RTL tested — switch html dir="rtl" and verify no left/right directional animations break
□ Ran on low-spec simulation (Chrome DevTools → CPU throttle 4x) — 55fps minimum
```

---

*CLAUDE-DESIGN.md — Fren-Edu · Design System v1.0*
*Read alongside CLAUDE.md + CLAUDE-MVP-SETTINGS.md*
*This file governs ALL visual and motion decisions. No exceptions.*
