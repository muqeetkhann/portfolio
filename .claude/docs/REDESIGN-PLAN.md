# Redesign Plan

Direction agreed July 2026. This is the blueprint development starts from —
update it as decisions evolve rather than letting it go stale.

## Status (updated 2026-07-19 — all phases complete)

Phases 0–5 are DONE and browser-verified (hero entrance, 3D scene, reorder,
mobile reveals, overlay). Highlights of the final session:
- Phase 3 verified + scroll-linked drift added to HeroScene.
- Phase 4: SplitText masked-line hero reveal (StrictMode-safe — see the
  cancelled-flag pattern in DesktopPortfolio; gsap.from + async fonts.ready
  double-fire was a real bug), GSAP MagneticButton, mobile Reveal component.
  Motion intentionally lives ONLY in the lazy ProjectDetail chunk; main-bundle
  animation is GSAP-only.
- Phase 5: user confirmed Fexen backend bullet + PostgreSQL/Cloudinary skills;
  Inglés projects featured first (PROJECTS = [...FEATURED_MERN,
  ...CLIENT_PROJECTS] with auto-derived num badges — never hand-edit num);
  OG image (public/og-image.png, rendered via headless Chrome from SVG) +
  metadataBase https://muqeetkhann.github.io/portfolio; projectGroups removed.

Still open (nice-to-haves, not blockers):
- Swap remaining 9 placeholder covers as user adds shots to PF-media/.
- Mobile 3D hero variant (currently desktop-only by design).
- Optional: bundle trim below final figure (see build output), Lighthouse pass.

## Historical status (2026-07-17)

DONE:
- Phase 0 — Clash Display + Satoshi self-hosted (`app/fonts/`), Lenis provider
  (`components/providers/SmoothScroll.tsx`), `lib/gsap.ts`, `useReducedMotion`.
- Phase 1 — Desktop rebuilt on pinned ScrollTrigger timeline with vertical
  sub-scroll inside Projects (`DesktopPortfolio.tsx`); wheel-hijack deleted.
- Phase 2 — Media-aware ProjectCard + ProjectDetail overlay (Motion), both
  layouts data-driven over PROJECTS (15 entries).
- Content: repositioned as MERN Stack Developer (data.ts, snapshot, metadata,
  contact tagline). Real media wired for singularity/blockyfy/nextsense/
  zawayadao/ingles-academics/ingles-crm (WebP, from PF-media/, gitignored).
  Added Inglés Academics (#14) + Inglés CRM (#15) as full-stack MERN projects.
- Phase 3 (code checkpoint) — HeroScene (glass torus knot + bloom + chromatic
  aberration, pointer parallax) behind desktop intro via lazy HeroCanvas
  (IntersectionObserver-gated, reduced-motion → null). NOT visually verified
  yet; no mobile hero yet.

REMAINING (tomorrow):
1. Visually verify 3D hero in browser; tune material/lighting/placement; add
   scroll-linked camera drift; consider static fallback image + mobile version.
2. Phase 4 — SplitText reveals, MagneticButton, micro-interactions, section
   enter animations.
3. Phase 5 — content pass (verify Inglés experience bullet + PostgreSQL/
   Cloudinary skill claims with user; alt text; OG image), swap remaining 9
   placeholder covers as media arrives.
4. Perf — First Load JS 215 kB (target ≤180): lazy-load ProjectDetail/Motion,
   check what pulled Motion+GSAP into the shared bundle.
5. Decide: Inglés projects stay at end of PROJECTS or get featured first.
6. Old cleanups: `projectGroups` export in data.ts is now unused — remove with
   care; README stack table mentions R3F hero (fine).

## Goals

1. Keep the signature **horizontal page scroll** on desktop, but rebuild it on
   GSAP ScrollTrigger (native scroll → pinned track) instead of wheel hijacking.
2. Add **vertical scroll inside chosen sections** — the scroll "parks" on a panel,
   plays a vertical sub-sequence, then continues horizontally. Candidates:
   Projects (deep-dive per project) and Experience (timeline).
3. **Full 3D hero + scene accents** via React Three Fiber (lazy-loaded).
4. Project cards get real **media (cover images / video loops)** — placeholders
   exist now in `public/projects/<slug>/cover.svg`.
5. Refresh **fonts, color usage, and content** while keeping the dark neon
   editorial identity (see DESIGN-SYSTEM.md).

## Section map (desktop)

```
[0 INTRO]──[1 EXPERIENCE]──[2 PROJECTS]──[3 STACK]──[4 CONTACT]
   │             │              │
   3D hero    vertical      vertical deep-dive:
   R3F scene  timeline      each project = one
              sub-scroll    vertical step w/ media
```

- The two hardcoded "Projects page 1/2" panels are replaced by one Projects panel
  with an internal vertical sequence (data-driven from `PROJECTS`, no slicing
  into fixed `projectGroups` buckets).
- Progress UI: keep the bottom progress bar + `01/05` counter, driven by
  ScrollTrigger progress instead of `activeIndex`.

## Mobile

Stays vertical. Gets: Lenis smooth scroll, Motion-powered reveals, media on
project cards, and a lightweight (or static-image) version of the hero scene.
No pinning gymnastics on touch.

## 3D direction (hero showpiece)

- One R3F scene, lazy-loaded, `ssr: false`, static fallback image.
- Vibe: abstract futuristic — floating geometry / glass (drei
  `MeshTransmissionMaterial`, `Float`), subtle Bloom + chromatic aberration,
  pointer parallax, scroll-linked camera drift as you leave the intro panel.
- No heavy downloaded GLTF models to start; procedural geometry keeps the
  bundle and load small. Revisit if a hero model is provided.

## Implementation phases

1. **Foundation** — `cn()` + `asset()` helpers, Lenis provider, GSAP setup,
   reduced-motion utility. Replace desktop wheel hijack with pinned track.
2. **Sections** — rebuild Intro/Experience/Projects/Stack/Contact on the new
   scroll system; nested vertical sub-scrolls; media-aware ProjectCard.
3. **3D** — hero scene + post FX; scroll-linked camera; fallbacks.
4. **Polish** — SplitText headline reveals, Motion micro-interactions, magnetic
   buttons, page transitions, perf pass (budgets in LIBRARIES.md).
5. **Content** — refreshed copy in `lib/data.ts`, real media replacing
   placeholders, alt text, OG image.

## Non-negotiables

- `npm run build:static` keeps producing a working GitHub Pages site.
- `prefers-reduced-motion` users get a complete, readable, non-animated site.
- Content stays 100% in `lib/data.ts`.
- First Load JS (non-3D) ≤ ~180 kB; 3D arrives lazily after first paint.

## Open questions (ask before building)

- Which font(s) replace/join Syne + Space Grotesk? (User said "update fonts" —
  propose 2–3 pairings with previews before committing.)
- Should Contact gain a form (needs external service — Formspree etc. — since
  the site is static), or stay mailto/WhatsApp?
- Case-study pages per project (new routes) or keep single-page?
