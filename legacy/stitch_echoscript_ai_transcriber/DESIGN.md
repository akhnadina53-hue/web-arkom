---
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3b4a45'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6b7a75'
  outline-variant: '#bacac4'
  surface-tint: '#006b5a'
  primary: '#006b5a'
  on-primary: '#ffffff'
  primary-container: '#00d1b2'
  on-primary-container: '#005446'
  inverse-primary: '#2cdebf'
  secondary: '#446900'
  on-secondary: '#ffffff'
  secondary-container: '#b2f746'
  on-secondary-container: '#496f00'
  tertiary: '#006b5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#25d0bb'
  on-tertiary-container: '#00544b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#58fbda'
  primary-fixed-dim: '#2cdebf'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#005143'
  secondary-fixed: '#b2f746'
  secondary-fixed-dim: '#98da27'
  on-secondary-fixed: '#121f00'
  on-secondary-fixed-variant: '#334f00'
  tertiary-fixed: '#62fae3'
  tertiary-fixed-dim: '#3cddc7'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  body-main:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  ai-monospaced:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0.05em
  human-touch:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is built on the intersection of academic rigor and creative energy. It aims to evoke a sense of effortless productivity, transforming the "chore" of transcription into a visually stimulating experience. The brand personality is "The Intelligent Companion"—sophisticated enough for professional use but approachable enough for a late-night study session.

The visual style utilizes **Glassmorphism** to create a sense of depth and hierarchy without heavy cognitive load. By using semi-transparent surfaces and background blurs, the UI remains "airy" and "clean," preventing the interface from feeling cluttered even during complex editing tasks. The aesthetic is "kekinian" (trendy), leveraging vibrant gradients and soft, organic shadows to feel cutting-edge and student-friendly.

## Colors

The palette revolves around a "Digital Vitality" theme. The **Bright Tosca Green** acts as the primary anchor, providing a professional and stable base, while the **Lime Green** provides a high-energy accent that draws the eye to primary actions.

- **Primary (Tosca):** Used for main branding elements and active states.
- **Secondary (Lime):** Reserved for "Success" states and high-priority Call-to-Actions (CTAs) to maintain a youthful energy.
- **Gradients:** Use the Tosca-to-Lime gradient for data visualizations, such as voice wave patterns and equalizer bars.
- **Neutrals:** A heavy reliance on clean whites (#FFFFFF) and very light slate grays (#F8FAFC) ensures the "airy" feel of the interface.

## Typography

This system employs a three-tier typographic strategy to distinguish between different types of content:

1.  **Primary UI (Plus Jakarta Sans):** Selected for its "Poppins-like" geometric friendliness but with better screen legibility. It handles all functional text, headings, and navigation.
2.  **The Human Element (Be Vietnam Pro):** Used sparingly for tooltips, user-generated notes, or "personal tips" from the AI. This font should feel like a soft, handwritten annotation in the margin of a notebook.
3.  **The Technical Core (Space Grotesk):** A modern, geometric mono-type used for timestamps, confidence scores, and raw metadata. It represents the "AI engine" at work.

*Note: Bold weights should be used for headlines to contrast against the airy backgrounds.*

## Layout & Spacing

The layout follows a **Fixed Grid** model for the central workspace to ensure focus, while using **Fluid Sidebars** for utility tools. 

- **Grid:** Use a 12-column grid system for the main dashboard. 
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Whitespace:** Emphasize "Large" (lg) and "Extra Large" (xl) spacing between major sections to maintain the airy, tech-focused aesthetic. Avoid tight clusters of information; instead, use generous padding within cards to allow the background gradients to breathe through the glass layers.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and **Ambient Shadows** rather than solid color fills.

1.  **Level 0 (Background):** A soft gradient mesh or clean white surface.
2.  **Level 1 (Cards/Containers):** White background with 70% opacity, a 16px backdrop blur, and a thin 1px border in a semi-transparent white or very light Tosca.
3.  **Level 2 (Floating Elements/Modals):** High-diffusion shadows (#00D1B2 at 10% opacity) with a larger blur radius (20px+) to create a "lifting" effect.
4.  **Interactive States:** On hover, glass elements should increase in opacity and shadow depth to signify tangibility.

## Shapes

The shape language is "Soft-Modern." Sharp corners are avoided to keep the student-friendly vibe. 

- **Standard Elements:** 0.5rem (8px) for buttons and input fields.
- **Large Containers:** 1rem (16px) for cards and transcription blocks.
- **Feature Highlights:** 1.5rem (24px) for prominent "Start Recording" or "Upload" sections.
- **Visual Accents:** Icons like microphones and equalizers should feature rounded terminals and fluid, wave-like curves rather than rigid geometric lines.

## Components

- **The Recording Button:** A large, pill-shaped button using the primary gradient. When active, it pulses with a Lime Green glow, accompanied by a dynamic equalizer wave pattern.
- **Glass Cards:** Used for individual transcription segments. These should feature a subtle "Handwriter" style note icon in the top right corner for personal annotations.
- **Transcription Text:** The main text uses the primary UI font, but technical metadata (confidence scores) appears in the "Typewriter" style monospaced font in a light gray.
- **Progress Equalizers:** Instead of standard loading bars, use animated vertical bars (equalizers) that oscillate in Tosca and Lime colors to represent AI processing.
- **Chips/Tags:** Small, pill-shaped labels with high-contrast Tosca text on a low-opacity Lime background.
- **Input Fields:** Minimalist design with only a bottom border that transforms into a Tosca-to-Lime gradient line when focused.