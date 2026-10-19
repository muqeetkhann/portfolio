# Architecture

How the pieces fit together. Read this before touching scrolling, routing, or the
build pipeline.

## Rendering & deployment model

```
app/layout.tsx        → fonts (Clash Display + Satoshi, next/font/local), metadata, <body>
app/page.tsx          → renders <PortfolioRouter/>
components/layouts/
  PortfolioRouter.tsx → 'use client'; matchMedia('(min-width: 1280px)')
                        ├── true  → DesktopPortfolio   (horizontal panels)
                        └── false → MobilePortfolio    (vertical scroll)
```

Both shells render the SAME section bodies from `components/sections/`
(`HeroIntro`, `ExperienceList`, `SkillsGrid`, `ContactCard`), each taking a
`variant` of `'desktop' | 'mobile'` that tunes only type scale and grid columns.
**A new section belongs there** — add it once, render it from both shells.

- Everything below the router is client-rendered. The router returns `null` until
  it knows the viewport (avoids hydration mismatch) — keep that behavior.
- **Static export**: `STATIC_EXPORT=true next build` → `output: 'export'`,
  `basePath: '/portfolio'`, `trailingSlash: true`, images unoptimized. CI
  (`.github/workflows/deploy-pages.yml`) builds on Node 22 and publishes `out/`
  to GitHub Pages on push to `main`.
- Consequence: **no server features**. No route handlers, no server actions, no
  `headers()`/`cookies()`, no ISR. Contact is `mailto:`/`tel:`/WhatsApp links only.

## The two scroll worlds

### Desktop (≥1280px) — horizontal
`DesktopPortfolio.tsx`: a **GSAP ScrollTrigger pin** over a tall vertical scroll
body, driving a 5-segment timeline (`TL_DURATION`) that translates a flex track
horizontally. Segment 2 is a *vertical* sub-scroll inside the projects panel, so
the track parks, scrolls the card list, then continues sideways. Progress rail +
`01/05` counter are fixed overlays driven by `activeIndex`/`progress`.

Wheel input follows Lenis without automatic snapping: snapping to the nearest
panel used to pull small gestures back to the same panel. Navigation still
lands at the exact `NAV_TIME` positions via `scrollToY()`.

Experience and Stack use native `PanelScrollArea` containers. Lenis enables
`allowNestedScroll`, so those containers consume input while content remains
in the requested direction and hand it back to the track at their boundaries.
Keep `data-lenis-prevent` and `overscroll-contain` off these panel containers;
together they trap scrolling even after the inner content reaches an edge.
The modal keeps its separate scroll containment and page lock.

Under `prefers-reduced-motion` the whole timeline is skipped and the panels
stack vertically (`panelBase` swaps to `w-full min-h-screen`), with nav falling
back to `scrollToTarget('#panel-N')`.

### Mobile (<1280px) — vertical
`MobilePortfolio.tsx`: conventional anchored sections (`#intro`, `#experience`,
`#projects`, `#stack`, `#contact`) with `MobileNav` (hide-on-scroll-down) and a
full-screen menu overlay. Lenis smooth scroll + `Reveal` (GSAP ScrollTrigger)
apply here; no pinning gymnastics on touch devices.

## Data flow

`lib/data.ts` exports `PERSONAL`, `EXPERIENCE`, `HERO_DOMAINS`, `SKILLS`, and
two derived lists: `PROJECTS` (`FEATURED_MERN` then `CLIENT_PROJECTS`, with `num`
badges recomputed from position) and `SPOTLIGHT` (the ≤5 projects shipping a real
`.webp` cover, for the rotating hero card). Components import what they render.
Projects carry a media contract:

```
media?: {
  cover: string        // 'projects/<slug>/cover.svg' (or .webp/.jpg when real)
  gallery?: string[]   // additional stills
  video?: string       // short mp4/webm loop, muted, no audio track needed
}
```

Paths are **relative to `public/`, without a leading slash** — prefix at render
time so basePath works in both dev (`/`) and Pages (`/portfolio/`).

## Media pipeline

- `public/projects/<slug>/` — one folder per project; slug list mirrors
  `lib/data.ts` and `scripts/generate-placeholders.mjs`.
- `npm run placeholders` writes branded `cover.svg` placeholders for any project
  missing one. It never overwrites existing files, so real screenshots are safe.
- Real media guidance lives in `docs/CONTENT.md` (sizes, formats, compression).

## Things that will bite you

1. **Leading-slash asset paths** break on GitHub Pages (`/og-image.png` → 404;
   needs `/portfolio/og-image.png`). Use relative `./` paths, or `asset()` from
   `lib/utils.ts` for anything under `public/`.
2. **Don't layer scroll hijacks.** Lenis owns the scroll position; anything that
   calls `preventDefault()` on wheel events, or scrolls the window directly,
   will fight it.
3. **R3F + static export**: Three.js must never render on the server. Always
   `next/dynamic(() => import(...), { ssr: false })`.
4. **The router's `null` first paint** means anything measuring the DOM on mount
   (GSAP pins, Lenis) must init inside the chosen layout, not in `layout.tsx`.
5. **Lenis is reached via `getLenis()`** (`components/providers/SmoothScroll.tsx`),
   never `window.__lenis` directly — it is `undefined` under reduced motion, so
   every caller needs the native-scroll fallback that `scrollToY`/`scrollToTarget`
   already provide.
6. **Node 18 locally vs 22 in CI** — if a dependency's engine field complains,
   trust CI's Node 22; `.nvmrc` pins 22.
