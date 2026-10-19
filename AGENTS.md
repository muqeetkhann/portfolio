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
4. **Respect `prefers-reduced-motion`.** Every GSAP/Lenis/R3F effect needs a
   reduced-motion early-out. See `.Codex/docs/LIBRARIES.md`.
5. **3D is lazy.** Anything importing `three` / `@react-three/*` must be loaded via
   `next/dynamic` with `ssr: false` and a lightweight fallback, so the base site
   stays fast.

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
- `components/layouts/` — `PortfolioRouter` (desktop/mobile switch),
  `DesktopPortfolio` + `DesktopNav` (horizontal track), `MobilePortfolio` +
  `MobileNav` (vertical scroll)
- `components/sections/` — section bodies shared by both layouts (`HeroIntro`,
  `ExperienceList`, `SkillsGrid`, `ContactCard`)
- `components/shared/` — reusable UI (`ProjectCard`, `ProjectSpotlight`,
  `ProjectDetail` + its lazy `ProjectModal` wrapper, `SectionHeader`, `Reveal`,
  `MagneticButton`, `WhatsAppButton`)
- `lib/reduced-motion.ts` — `prefersReducedMotion()` + `useReducedMotion()`
- `public/projects/<slug>/` — per-project media (cover + gallery + video)
- `scripts/generate-placeholders.mjs` — placeholder covers; keep its slug list in
  sync with `lib/data.ts`
- `components/backgrounds/PanelAmbient.tsx` — per-panel ambient backdrop, shared
  by both layouts (the single place backgrounds are assigned/tuned)
- `components/originkit/ui/` — vendored OriginKit registry components (see below)
- `scripts/originkit-sync.sh` — pulls the OriginKit shortlist, quota-safe
- `.github/workflows/deploy-pages.yml` — CI deploy to GitHub Pages on push to `main`

## OriginKit backgrounds

Section backdrops come from the [OriginKit](https://www.originkit.dev) registry
(`npx originkit add <name>`), vendored into `components/originkit/ui/`.

The free tier has **two caps, and both are small**:

| Cap | Limit | Applies to |
|---|---|---|
| Weekly | **5 component fetches** | `kind: component` only — sections are exempt |
| Daily | **3 component fetches** | everything |

The daily cap is **3, not 10** — the CLI says so when it refuses
(`you've used all 3 Originkit component fetches for today`). So a full
five-component shortlist takes **two days minimum**, not one sitting: three land,
then the run stops until the daily window reopens. Plan the shortlist at five
(one backdrop per panel) and expect it to arrive over two runs. That budget also
shapes how this is wired:

1. **Never batch `add`.** The CLI fetches every argument before writing anything,
   so a batch that trips the cap on its last item discards every component that
   already fetched successfully. `scripts/originkit-sync.sh` adds one at a time.
   A `--dry-run` also consumes a fetch, so don't use it as a safety check.
1b. **Some components are paid, and you cannot tell which until you try.** `add`
   refuses them with *"is a paid component and your plan does not include it"* —
   no amount of waiting fixes that. `list --json` returns name, category, kind,
   description and tags and **nothing about entitlement**, so the only signal is
   the add itself. That rejection reads as an authorization failure rather than a
   metered one and appears not to burn a fetch, but don't lean on it. `sonar-bloom`
   was the original Contact pick and turned out to be paid; `smokey-shader` replaced it.
2. **Stubs keep a spent quota harmless.** Every component on the shortlist ships
   first as a no-op module marked `ORIGINKIT_STUB`, so imports resolve and the
   app builds and runs identically whether or not the real file has been pulled —
   it just draws nothing. The sync script overwrites *only* files still carrying
   that marker, so a real component is never clobbered. **Don't delete a stub
   because it looks dead; it's load-bearing.**

`AmbientLayer` gates WebGL context creation. On desktop all five panels are
mounted at once inside the translated track, so an IntersectionObserver would
report every one visible and hold five live contexts — pass `active` (the panel
index) there, and omit it on mobile to get the observer path. It returns `null`
under `prefers-reduced-motion`.

It also caps its own height at `160vh`, which is **not** a style choice. These
backdrops size their drawing buffer to the element at up to 2× DPR, and a mobile
section is as tall as its content — the Projects list is ~7500px, which asks for
a 750×14922 canvas. That is ~11M pixels redrawn every frame, and it is over the
max texture dimension on plenty of phone GPUs (4096/8192), where it fails
outright rather than merely running slow. Desktop panels are exactly one
viewport, so the cap is a no-op there.

**Every backdrop dial is a count, not a rate.** `density` means nodes in the
field, or dots across the frame *height* — never per-area — so a value tuned on
a 1440×900 desktop panel packs into a 375px-wide phone panel and turns a subtle
field into a thicket. `PanelAmbient` therefore takes the same `variant` prop the
section components use: the desktop shell passes `variant="desktop"`, the mobile
shell doesn't, and each panel carries a `mobile` override for density/opacity.
Re-tune both when adding a background; one set of numbers cannot serve both.

Two of the three fetched components composite over the panel (`background:
'transparent'`), but **dot-lens writes alpha 1.0** — it paints a solid rectangle.
It is usable as an overlay only via `blend="screen"` with a black background,
where the black drops out and the dots stay. Experience is the one white panel:
it keeps `blend="normal"` and darkened ink, since screen would wash it out.

**Coverage matters more than opacity.** Sparse backdrops (network-lines,
dot-lens, smokey-shader) leave most of the frame black, so 0.18-0.32 reads as
texture. `hex-comb` is a full tessellation at 100% coverage — the same 0.26 reads
as saturated honeycomb wallpaper. It runs at **0.08**, and that is not a typo.

**Check what a dial actually does before tuning it.** `hex-comb` clamps
`density` to `[3, 24]` internally, so 30 / 34 / 52 all silently collapse to 24 —
it is the one backdrop whose density is a clamped absolute scale rather than a
count, and it needs no mobile override. `smokey-shader` ramps its `colors` array
by noise density and then masks off everything but the dense end, so the **last**
entry is what actually reads on the page and the first is nearly invisible.

**`originkit add` installs `framer-motion`.** The project already ships `motion`
(v12) — the same library under its newer name — so accepting that leaves two
copies of the animation runtime in the bundle. Repoint the import to
`motion/react` (it exports `motion`, `useAnimate` and `stagger` identically) and
`npm uninstall framer-motion`. Re-apply after any re-fetch.

**Scroll-triggered components don't work inside the desktop track.** Anything
that decides visibility from `getBoundingClientRect()` against the viewport sees
all five panels at y=0 and fires them at once, which is the same failure
`AmbientLayer` exists to solve. Such a component needs the `active` index passed
down, exactly like `PanelAmbient`.

`SectionHeader` is the worked example. It runs `text-colour-sweep` on the base
title and takes `active` + `variant`: desktop passes both and the sweep is
replayed by flipping a React `key` when the panel becomes current
(`appearTrigger: "default"`); mobile omits them and uses the scroll trigger,
which is correct in ordinary vertical flow. Three details are load-bearing:

- **Only the base title is swept.** The accent keeps its gradient mask, which
  sets `-webkit-text-fill-color: transparent` and would swallow any per-letter
  colour the sweep applied anyway.
- **`font={{}}` is deliberate.** An empty object means no inline font styles, so
  the inline-block span inherits `.section-title` from globals.css instead of
  re-declaring the Clash type scale in JS where it would drift.
- **`inline` is a local addition to the vendored component.** Upstream wraps its
  output in a `width:100%` flex div, which is block-level and would push the
  accent word onto its own line. `inline` renders just the tag. Re-apply it (and
  the `motion/react` import) if the component is ever re-fetched.

`next/dynamic` options must be an **inline object literal**; a shared `opts`
const fails the build (the SWC plugin reads them statically).

## Deeper docs (read when relevant)

- `.Codex/docs/ARCHITECTURE.md` — how scrolling, routing, and export fit together
- `.Codex/docs/DESIGN-SYSTEM.md` — fonts, colors, spacing, component conventions
- `.Codex/docs/LIBRARIES.md` — GSAP / Lenis / Motion / R3F usage rules + gotchas
- `.Codex/docs/REDESIGN-PLAN.md` — the approved redesign direction & section map
- `docs/CONTENT.md` — human-facing guide for updating content/media

## Skills

- `/add-project` — add or update a project (data + media folder + placeholder)

## Conventions

- TypeScript strict; no `any` unless unavoidable.
- Tailwind utility-first; shared visual primitives live in `app/globals.css`
  (`.panel`, `.section-shell`, `.section-title`, masked-text classes).
- Fonts via `next/font/local` with CSS variables (`--font-clash` headings,
  `--font-satoshi` body); files in `app/fonts/`.
- No semicolons, single quotes (match existing code style).
- Keep components small. Section bodies → `components/sections/`; reusable UI →
  `components/shared/`; layout shells and nav → `components/layouts/`.
- Reach Lenis through `getLenis()` / `scrollToY()` / `scrollToTarget()` from
  `components/providers/SmoothScroll.tsx` — never `window.__lenis` directly.
