# Architecture

How the pieces fit together. Read this before touching scrolling, routing, or the
build pipeline.

## Rendering & deployment model

```
app/layout.tsx        → fonts (Syne + Space Grotesk via next/font), metadata, <body>
app/page.tsx          → renders <PortfolioRouter/>
PortfolioRouter.tsx   → 'use client'; matchMedia('(min-width: 1280px)')
                        ├── true  → DesktopPortfolio   (horizontal panels)
                        └── false → PortfolioPage      (vertical scroll)
```

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
`DesktopPortfolio.tsx` today: a `fixed inset-0` shell containing a flex track of
`w-[100dvw]` sections. Wheel/touch events are intercepted (`preventDefault`) and
translated into "go to panel N" with a 700ms lockout; the track scrolls via
`scrollTo({left: index * innerWidth})`. Progress bar + `01/06` counter are fixed
overlays driven by `activeIndex`.

**Redesign intent** (see REDESIGN-PLAN.md): replace the hand-rolled wheel hijack
with **GSAP ScrollTrigger pinning** — a tall vertical scroll body where a pinned
track translates horizontally (`xPercent`), so native scrollbars, keyboard, a11y
and momentum all keep working. Sections that need internal vertical scroll become
nested pinned segments of the same timeline (scroll "parks" horizontally, plays a
vertical sub-scroll, then continues horizontally).

### Mobile (<1280px) — vertical
`PortfolioPage.tsx`: conventional anchored sections (`#intro`, `#experience`,
`#projects`, `#stack`, `#contact`) with `SiteHeader` (hide-on-scroll-down) and a
full-screen menu overlay. Lenis smooth scroll + lighter reveal animations apply
here; no pinning gymnastics on touch devices.

## Data flow

`lib/data.ts` exports `PERSONAL`, `EXPERIENCE`, `PROJECTS`, `SKILLS`, `FILTERS`,
and derived `projectGroups` (web3 / saas / sites buckets, sliced to 4 each).
Components import what they render. Projects carry an optional media contract:

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

1. **Leading-slash asset paths** break on GitHub Pages (`/me.png` → 404; needs
   `/portfolio/me.png`). Use relative `./` paths or a small `asset()` helper.
2. **`Date.now()` wheel-lock logic** in the current desktop scroller fights any
   library-driven scroll. Remove it entirely when GSAP takes over — don't layer.
3. **R3F + static export**: Three.js must never render on the server. Always
   `next/dynamic(() => import(...), { ssr: false })`.
4. **The router's `null` first paint** means anything measuring the DOM on mount
   (GSAP pins, Lenis) must init inside the chosen layout, not in `layout.tsx`.
5. **Node 18 locally vs 22 in CI** — if a dependency's engine field complains,
   trust CI's Node 22; `.nvmrc` pins 22.
