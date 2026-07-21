# Design System

Current visual language + where the redesign is allowed to push it. Keep this file
updated whenever tokens change — it is the single source of truth for "what does
this site look like".

## Identity

Dark, high-contrast, neon-accented, editorial-brutalist. Big uppercase display
type, tight tracking, tiny bold kickers with wide letterspacing, rounded-pill
buttons, soft glass panels on pure black. One section (Experience) deliberately
inverts to white for rhythm.

## Type

| Role | Font | Source | CSS var |
|---|---|---|---|
| Display / headings | **Clash Display** (variable 200–700) | self-hosted, next/font/local (`app/fonts/`) | `--font-clash` |
| Body / UI | **Satoshi** (variable 300–900) | self-hosted, next/font/local (`app/fonts/`) | `--font-satoshi` |
| Code accents | monospace stack | — | — |

Fonts are from Fontshare (free). WOFF2 files live in `app/fonts/`; re-fetch via the
Fontshare CSS API (`https://api.fontshare.com/v2/css?f[]=clash-display@1`) if lost.
Tailwind maps `font-heading` → Clash, `font-sans` → Satoshi. Old Syne/Space Grotesk
remain only as named fallbacks.

Patterns in use:
- Hero: `clamp(3.4rem, 7vw, 6.2rem)`, `leading-[0.88]`, `tracking-[-0.05em]`, uppercase.
- Section titles: `.section-title` → `clamp(1.7rem, 6vw, 4.5rem)`, uppercase.
- Kickers: 10px, `font-bold`, `tracking-[0.24em]`, uppercase, 45% opacity.
- Gradient text via `.masked-text-dark` (white→cyan) and `.masked-text-light`.

Redesign may add a third variable-font display face if it earns its bytes —
document it here if so.

## Color tokens (tailwind.config.ts)

```
bg        #000000        base
card      #0D0D0D        raised surfaces
border    rgba(255,255,255,0.1)
neon.cyan     #00F5FF    primary accent (links, active, progress)
neon.purple   #BC13FE    secondary accent (roles, alt CTA)
neon.magenta  #FF00CC    unused — candidate for redesign
neon.green    #39FF14    unused
neon.yellow   #FFCC00    unused
muted     #A1A1AA
dim       #3F3F46
```

Per-project accent hexes also live on each project in `lib/data.ts`
(`#6EE7B7` mint, `#93C5FD` sky, `#FDE68A` sand, `#C4B5FD` lavender, `#FCA5A5` rose)
— softer pastels used for cards/covers, intentionally distinct from the neon set.

## Surfaces & effects

- `.panel` — 1px white/10 border, 28px radius, white/3 fill, deep shadow.
- Body has two fixed pseudo-layers: radial neon glows + SVG fractal noise at 3%.
- Glass: `backdrop-blur-xl` + `rgba(0,0,0,0.88)` (header pills).
- Glow blobs: large `rounded-full` divs with `blur-3xl` at 10–16% accent alpha.
- Selection: cyan at 20%.

## Spacing & layout

- `.section-shell` — max-w 72rem, responsive inline padding (1.25 → 3rem).
- Desktop shell — `max-w-[92rem] px-8`, `2xl:max-w-[100rem]`.
- Radii: pills `rounded-full`; cards 28px; large surfaces 32–36px.
- Buttons: pill, 10–11px bold uppercase label, `tracking-[0.18em]`.

## Motion rules (redesign)

1. Durations: micro 150–250ms; reveals 500–800ms; scroll-scrubbed = no duration.
2. Easing: GSAP `power2/power3.out` for reveals; springs (Motion) for gestures.
3. Stagger children 60–90ms.
4. Nothing auto-plays longer than ~5s; loops must be subtle (glow pulse ≈ 5s).
5. `prefers-reduced-motion` → kill Lenis, skip pins, render final states, pause R3F.
6. 3D scenes cap DPR at 2, pause when tab hidden / off-screen.

## Accessibility floor

- Text on black: minimum white/65 for body copy.
- Neon cyan on black passes AA for large text only — don't use it for small body text.
- Focus states must survive the redesign (visible outline or equivalent).
- All media in `public/projects/` needs meaningful `alt` text from `lib/data.ts`.
