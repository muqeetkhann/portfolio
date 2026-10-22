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
(`HeroSection`, `ExperienceList`, `SkillsGrid`, `ContactCard`). Layout-sensitive bodies take a
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

## Shared layout width

`SiteShell` mounts once in the root layout around all site content. Its CSS module
sets the responsive width tokens and the shared `.site-container` primitive used
by the fixed header, hero, section bodies, Projects heading/list and footer's
parent. Desktop content expands to 1680px maximum with fluid 4vw gutters; tablet
and mobile keep comfortable 32px / 20px gutters. Section-specific styles own only
internal layout and vertical spacing. Do not constrain the root shell, pin or
track to the content maximum: horizontal transitions still measure a full
viewport width. The fixed starfield remains outside the content shell.

## The two scroll worlds

The four-page order is **Intro → Projects → Background → Contact**. Background
merges experience, education and skills and stays second-last in both layouts.
`BackgroundSection` owns that shared body. The first scroll scene uses high-level
experience summaries and education without dates; the second renders six curated
`FEATURED_SKILLS` groups. Complete dates, responsibilities and all 14 detailed
skill groups remain in `lib/data.ts` for content reuse.
Scrollbars are visually hidden globally; scrolling and focus remain enabled.
Desktop timeline distances/nav offsets are derived from `NAVIGATION`, including
the Projects vertical segment, rather than five hard-coded panel positions.

### Desktop (≥1280px) — horizontal
`DesktopPortfolio.tsx`: a **GSAP ScrollTrigger pin** over a tall vertical scroll
body, driving a measured timeline that translates a flex track horizontally.
Each horizontal transition consumes one viewport width of scroll. The projects
segment consumes its actual overflowing content height, so a scroll pixel moves
a list pixel rather than compressing seventeen projects into one short gesture.
The track parks for that segment, then continues sideways. The progress rail is
updated through a DOM ref; the counter uses `activeIndex`. Offscreen panels are
`inert`, keeping keyboard focus inside the visible panel. Keyboard focus on an
offscreen project advances the same measured timeline. Clipping wrappers use
`overflow: clip` so browser focus cannot create a second hidden scroll offset.

Wheel input follows Lenis without automatic snapping: snapping to the nearest
panel used to pull small gestures back to the same panel. Navigation still
lands at measured panel offsets via `scrollToY()`. The timeline uses `scrub: true`; Lenis already supplies easing, so a second scrub delay is unnecessary.

Background uses a measured vertical segment in the same parent timeline as
Projects. `BackgroundSequenceController.measure()` supplies its distance and
`render()` seeks a paused child animation. The parent clamps progress against
Background's measured start/end: nothing advances during horizontal entry or
exit, in either direction. There is no separate desktop ScrollTrigger, native
inner scroller, toolbar, or edge-shadow overlay. Clipping wrappers keep native
scroll offsets at zero. The focusable Background region supports normal window
keyboard scrolling. The modal retains its independent containment and page lock.

Under `prefers-reduced-motion` the whole timeline is skipped and the panels
stack vertically (`desktop-panel-static`), with nav falling
back to `scrollToTarget('#panel-N')`.

### Mobile (<1280px) — vertical
`MobilePortfolio.tsx`: conventional anchored sections (`#intro`, `#projects`,
`#background`, `#contact`) with a persistent `MobileNav` and a
native full-screen `<dialog>` menu. The dialog supplies focus containment and
Escape handling; cleanup restores page scrolling and the menu button focus. Lenis smooth scroll and observer-triggered reveals
apply here; no pinning gymnastics on touch devices.

## Data flow

`lib/data.ts` exports `PERSONAL`, `EXPERIENCE`, `HERO_DOMAINS`, `SKILLS`, and
two derived lists: `PROJECTS` (`FEATURED_MERN` then `CLIENT_PROJECTS`, with `num`
badges recomputed from position) and `SPOTLIGHT` (the ≤5 projects shipping a real
`.webp` cover, for the compact hero preview). Components import what they render.
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

## Current hero and backgrounds

`HeroSection` is shared by both shells and composes `HeroIntro`, the compact
`ProjectSpotlight`, and three expertise buttons. Hover/focus previews an actual
related project; activating the row opens its case study. Hero and navigation
copy live in `lib/data.ts` alongside the original portfolio content.

The compact spotlight rotates every five seconds and displays its countdown
flush below the image. CSS animates only the fill transform; the timeout preserves
remaining time through hover/focus, visibility and modal pauses. Manual project
navigation resets the cycle. Both shells pass modal state through
`HeroSection.previewPaused` to `ProjectSpotlight.suspended`. Reduced motion
disables rotation and hides the timing bar.

`StarfieldBackground` mounts once in `app/layout.tsx`, outside both responsive
shells and the transformed desktop track. It stays fixed at `100dvw × 100dvh` as
sections move over it; desktop panel surfaces are transparent. The component's
CSS module owns its appearance. Body isolation keeps its negative z-index above
the page base and below content without affecting focus or pointer events.

60 stars (30 on phones) twinkle through independent native Web Animations. Each
cycle gets new timing/brightness; a single reusable meteor gets a random origin,
angle, distance and speed. No frame loop or canvas is used. Hidden tabs cancel
animations and the pending meteor timer; visibility resumes the scheduler.
Reduced motion keeps static stars. All listeners, animations and timers clean up
on unmount, breakpoint changes and motion preference changes. The old per-panel
backdrops, R3F scenes and related dependencies have been removed.

## Scroll effects

`SectionHeader` masks a single semantic heading and reveals it once. Desktop
passes the current panel's `active` state; mobile observes normal vertical flow.
`ProjectGrid` uses one observer rooted in `.projects-window` on desktop and the
viewport on mobile. Only newly visible cards stagger; a focused card is revealed
immediately. Reveal wrappers own entrance transforms and cards retain their own
hover transforms. Desktop focus navigation measures the wrapper's offset, since
transformed parents affect a card's offset parent.

`BackgroundSequence` measures natural scene heights with `backgroundSequenceLayout`
and gives each a reading interval, overflow travel and a transition interval.
Desktop receives progress exclusively from the horizontal page timeline; mobile
uses document scroll with a CSS-sticky viewport below the header. The mobile Background ancestor uses
`overflow: clip` so it does not create a second scrolling root. Resize observers
refresh scene dimensions after responsive or content changes.
Inactive scenes are inert and aria-hidden; focus moves to the sequence wrapper
if a scroll gesture hides the currently focused scene. Reduced motion removes the
sticky scene treatment and renders both stages in ordinary flow.
`ExperienceList` keeps static decorative timeline accents within the sequence.
`ScrollEdges` measures overflow at native modal boundaries, updating two
noninteractive gradients through CSS variables. It does not change scroll input.

Effects clean up on unmount, responsive layout swaps and motion preference
changes. Reduced motion leaves headings/cards visible and timeline accents
static. The existing Lenis/GSAP track remains the only page scroll controller.
