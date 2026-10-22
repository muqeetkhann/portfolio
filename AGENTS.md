# MK Portfolio — Project Memory

Personal portfolio for Muhammad Muqeet Khan (Frontend Engineer). Next.js App Router,
TypeScript, Tailwind. Statically exported and deployed to **GitHub Pages** under the
`/portfolio` base path.

## Golden rules

1. **All content lives in `lib/data.ts`** — never hardcode personal info, project
   copy, or skills inside components. Components render data; `data.ts` owns it.
2. **Two layouts, one data source.** `components/layouts/PortfolioRouter.tsx`
   picks Desktop (≥1280px, horizontal panel scroll) or Mobile (vertical scroll)
   via `matchMedia`. Any new section must work in both — write its body once in
   `components/sections/` with a `variant` prop and render it from both shells.
3. **Static export must keep working.** `npm run build:static` sets
   `output: 'export'` + `basePath: '/portfolio'`. That means:
   - No server actions, no API routes, no dynamic SSR.
   - Asset URLs in JSX must be relative (`./m_muqeet_khan_CV.pdf`) or use the
     `asset()` helper if one exists — never absolute `/foo.png` (breaks under basePath).
   - `next/image` runs unoptimized in export mode; plain `<img>` is fine.
4. **Respect `prefers-reduced-motion`.** Every animated effect needs a
   reduced-motion early-out. See `.claude/docs/LIBRARIES.md`.
5. **One global background.** Mount `StarfieldBackground` once in `app/layout.tsx`,
   outside the translated desktop track. Keep section shells transparent. Do not
   reintroduce per-panel canvases, background images, or shader dependencies.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:3000 |
| `npm run build` | Standard Next build |
| `npm run build:static` | GitHub Pages build → `out/` (basePath `/portfolio`) |
| `npm run placeholders` | Generate missing placeholder covers in `public/projects/` |

Node: use v20+ locally (`.nvmrc` says 22, matching CI). v18.18+ works but is EOL.

## Key paths

- `lib/data.ts` — ⭐ all content (personal, experience, projects, skills)
- `components/layouts/SiteShell.tsx` + its CSS module — one root shell;
  `.site-container` owns content width and gutters for header and every section.
  Keep the horizontal track full viewport width; never constrain the pin itself.
- `components/layouts/` — `PortfolioRouter` (desktop/mobile switch),
  `DesktopPortfolio` + `DesktopNav` (horizontal track), `MobilePortfolio` +
  `MobileNav` (vertical scroll)
- `components/sections/` — section bodies shared by both layouts (`HeroSection`,
  `BackgroundSection`, `ExperienceList`, `SkillsGrid`, `ContactCard`). Page order:
  Intro → Projects → Background (experience + education + skills) → Contact.
  Scrollbars are hidden globally; keep scrolling and keyboard access enabled.
- `components/shared/` — reusable UI (`ProjectCard`, `ProjectSpotlight`,
  `ProjectDetail` + its lazy `ProjectModal` wrapper, `SectionHeader`, `Reveal`,
  `MagneticButton`, `WhatsAppButton`)
- `lib/reduced-motion.ts` — `prefersReducedMotion()` + `useReducedMotion()`
- `public/projects/<slug>/` — per-project media (cover + gallery + video)
- `scripts/generate-placeholders.mjs` — placeholder covers; keep its slug list in
  sync with `lib/data.ts`
- `components/backgrounds/StarfieldBackground.tsx` + its CSS module — the single
  fixed site-wide starfield, mounted by the root layout
- `.github/workflows/deploy-pages.yml` — CI deploy to GitHub Pages on push to `main`

## Background

`StarfieldBackground` is fixed at `100dvw × 100dvh`, behind all content and outside
GSAP's pinned/translated track. Both layout shells render transparent sections.
It uses 60 small stars on desktop, 30 on phones, and one reusable meteor element.
Native Web Animations change only opacity and transform; durations, brightness
peaks, meteor origin, angle and speed are randomized for each pass. There is no
canvas, WebGL context, drawing loop or background image. Hidden tabs cancel all
animations/timers; reduced motion leaves a static starfield. Cleanup runs on
unmount and preference changes. Background styling belongs in the component's
CSS module. Keep foreground card surfaces so text remains readable.

The old OriginKit backdrops, sync script, ambient wrapper, hero dot image and
unused R3F scenes/dependencies were removed at the user's request. Do not restore
the old stub infrastructure.

## Scroll effects

`SectionHeader` keeps semantic headings and uses a one-time masked reveal.
Desktop callers pass `active` from the current panel; mobile uses an observer.
`ProjectGrid` shares staggered entrances between both layouts, with desktop
visibility rooted in `.projects-window`. Its wrapper owns the reveal transform;
`ProjectCard` owns hover transforms. Keyboard focus reveals the wrapper immediately.
Use the wrapper's offset for desktop project focus navigation.

`BackgroundSequence` shows Experience & Education → Selected Stack. On desktop,
`DesktopPortfolio` parks the horizontal track at Background, then drives the
sequence through `BackgroundSequenceController`. Progress clamps to 0 before the
panel is centered and 1 after the sequence finishes, including reverse scrolling.
There is no nested desktop scroller, slide toolbar, or Background edge shadow.
Mobile uses document scrolling with a sticky viewport. Each stage receives its
full overflow travel before the next enters. Inactive stages are inert and
aria-hidden; reduced motion renders all content in normal vertical flow.
Resize observers remeasure content and viewport changes. `ExperienceList` uses
high-level summaries and static timeline accents inside this sequence. The paired
education view omits dates/location/level metadata. `FEATURED_SKILLS` supplies six
curated stack groups; complete resume dates, bullets and skills stay in data.

`ScrollEdges` adds visual overflow cues only to modal regions without changing
input. Keep the modal's independent containment and page lock.

## Deeper docs (read when relevant)

- `.claude/docs/ARCHITECTURE.md` — how scrolling, routing, and export fit together
- `.claude/docs/DESIGN-SYSTEM.md` — fonts, colors, spacing, component conventions
- `.claude/docs/LIBRARIES.md` — GSAP / Lenis / Motion / starfield usage rules + gotchas
- `.claude/docs/REDESIGN-PLAN.md` — the approved redesign direction & section map
- `docs/CONTENT.md` — human-facing guide for updating content/media

## Skills

- `/add-project` — add or update a project (data + media folder + placeholder)

## Conventions

- TypeScript strict; no `any` unless unavoidable.
- Tailwind utility-first; shared visual primitives live in `app/globals.css`
  (`.section-title`, heading masks, card surfaces). Content widths belong in
  `SiteShell.module.css`; do not duplicate them in section or navigation styles.
- Fonts via `next/font/local` with CSS variables (`--font-clash` headings,
  `--font-satoshi` body); files in `app/fonts/`.
- No semicolons, single quotes (match existing code style).
- Keep components small. Section bodies → `components/sections/`; reusable UI →
  `components/shared/`; layout shells and nav → `components/layouts/`.
- Reach Lenis through `getLenis()` / `scrollToY()` / `scrollToTarget()` from
  `components/providers/SmoothScroll.tsx` — never `window.__lenis` directly.
