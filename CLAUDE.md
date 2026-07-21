# MK Portfolio — Project Memory

Personal portfolio for Muhammad Muqeet Khan (Frontend Engineer). Next.js App Router,
TypeScript, Tailwind. Statically exported and deployed to **GitHub Pages** under the
`/portfolio` base path.

## Golden rules

1. **All content lives in `lib/data.ts`** — never hardcode personal info, project
   copy, or skills inside components. Components render data; `data.ts` owns it.
2. **Two layouts, one data source.** `components/root/PortfolioRouter.tsx` picks
   Desktop (≥1280px, horizontal panel scroll) or Mobile (vertical scroll) via
   `matchMedia`. Any new section must work in both.
3. **Static export must keep working.** `npm run build:static` sets
   `output: 'export'` + `basePath: '/portfolio'`. That means:
   - No server actions, no API routes, no dynamic SSR.
   - Asset URLs in JSX must be relative (`./m_muqeet_khan_CV.pdf`) or use the
     `asset()` helper if one exists — never absolute `/foo.png` (breaks under basePath).
   - `next/image` runs unoptimized in export mode; plain `<img>` is fine.
4. **Respect `prefers-reduced-motion`.** Every GSAP/Lenis/R3F effect needs a
   reduced-motion early-out. See `.claude/docs/LIBRARIES.md`.
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
- `components/root/PortfolioRouter.tsx` — desktop/mobile switch
- `components/desktop/DesktopPortfolio.tsx` — horizontal-scroll desktop experience
- `components/portfolio/PortfolioPage.tsx` — vertical mobile experience
- `public/projects/<slug>/` — per-project media (cover + gallery + video)
- `scripts/generate-placeholders.mjs` — placeholder covers; keep its slug list in
  sync with `lib/data.ts`
- `.github/workflows/deploy-pages.yml` — CI deploy to GitHub Pages on push to `main`

## Deeper docs (read when relevant)

- `.claude/docs/ARCHITECTURE.md` — how scrolling, routing, and export fit together
- `.claude/docs/DESIGN-SYSTEM.md` — fonts, colors, spacing, component conventions
- `.claude/docs/LIBRARIES.md` — GSAP / Lenis / Motion / R3F usage rules + gotchas
- `.claude/docs/REDESIGN-PLAN.md` — the approved redesign direction & section map
- `docs/CONTENT.md` — human-facing guide for updating content/media

## Skills

- `/add-project` — add or update a project (data + media folder + placeholder)

## Conventions

- TypeScript strict; no `any` unless unavoidable.
- Tailwind utility-first; shared visual primitives live in `app/globals.css`
  (`.panel`, `.section-shell`, `.section-title`, masked-text classes).
- Fonts via `next/font/google` with CSS variables (`--font-syne` headings,
  `--font-space-grotesk` body).
- No semicolons, single quotes (match existing code style).
- Keep components small; shared pieces go in `components/shared/`.
