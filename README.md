# Muhammad Muqeet Khan — Portfolio

Futuristic dark-neon portfolio. **Next.js 15 · React 19 · TypeScript · Tailwind**,
with GSAP + Lenis scroll choreography and a React Three Fiber 3D layer.
Desktop scrolls horizontally; mobile scrolls vertically. Statically exported to
GitHub Pages.

## Quick start

```bash
nvm use          # Node 22 (see .nvmrc) — 18.18+ works but 20+ recommended
npm install
npm run dev      # → http://localhost:3000
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (sanity check) |
| `npm run build:static` | GitHub Pages build → `out/` (basePath `/portfolio`) |
| `npm run placeholders` | Generate missing placeholder project covers |

## ✏️ Updating your info

**Everything lives in [`lib/data.ts`](lib/data.ts)** — personal details, experience,
projects, skills. Full guide: **[docs/CONTENT.md](docs/CONTENT.md)**.

Working in Claude Code? Type `/add-project` to add a project interactively.

Project images/videos go in `public/projects/<slug>/` — specs and tips are in the
content guide. Branded SVG placeholders are already in place until you add real media.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, static export), React 19, TypeScript |
| Styling | Tailwind CSS, Syne + Space Grotesk (next/font) |
| Scroll & motion | GSAP 3 + ScrollTrigger (`@gsap/react`), Lenis, Motion (`motion/react`) |
| 3D | Three.js, React Three Fiber v9, drei, postprocessing |

## Structure

```
├── app/                     # layout (fonts/meta), page, globals.css
├── components/
│   ├── root/PortfolioRouter.tsx   # desktop/mobile switch (matchMedia ≥1280px)
│   ├── desktop/                   # horizontal-scroll desktop experience
│   ├── portfolio/                 # vertical mobile experience
│   ├── layout/                    # header/nav
│   └── shared/                    # ProjectCard, SectionHeader, …
├── lib/data.ts              # ⭐ ALL CONTENT
├── public/projects/<slug>/  # per-project media
├── scripts/                 # placeholder generator
├── docs/CONTENT.md          # how to update content & media
└── .claude/                 # AI-assistant docs & skills (architecture, design
                             # system, library rules, redesign plan, /add-project)
```

## Deploy

Push to `main` → GitHub Actions builds the static export and publishes to GitHub
Pages (`.github/workflows/deploy-pages.yml`). No manual steps.

> ⚠️ Static export means no server features (API routes, server actions). Asset
> paths must be relative — see `.claude/docs/ARCHITECTURE.md` for the details.

## Troubleshooting

- **Blank page on GitHub Pages, works locally** → an asset was referenced with a
  leading `/`. Use relative paths (`./file.pdf`, `projects/...`).
- **Fonts not loading on first run** → Google Fonts needs network access once.
- **Type errors after `npm install`** → ensure `@types/react` is v19
  (`npm ls @types/react`).
