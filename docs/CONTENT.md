# Updating Your Portfolio Content

Everything the site displays comes from **one file: [`lib/data.ts`](../lib/data.ts)**.
You never need to touch components to change your info.

## Quick edits

| I want to change… | Edit this |
|---|---|
| Name, role, bio, email, phone, links | `PERSONAL` |
| Jobs / work history | `EXPERIENCE` |
| Projects | `PROJECTS` (or run the `/add-project` skill in Claude Code) |
| Skill categories | `SKILLS` |
| My CV | Replace `public/m_muqeet_khan_CV.pdf` (keep the filename, or update the links in both layout components) |

After editing, run `npm run dev` and check http://localhost:3000. Deploys happen
automatically when you push to `main` (GitHub Actions → GitHub Pages).

## Adding a project

Easiest way — in Claude Code, type:

```
/add-project
```

and answer the questions. It updates `lib/data.ts`, creates the media folder, and
generates a placeholder cover.

Manual way — copy an existing entry in `PROJECTS` and change the fields:

```ts
{
  id: 14,                      // max existing id + 1
  title: 'My Project',
  type: 'SaaS Platform',       // short label shown above the title
  url: 'https://myproject.com',
  urlLabel: 'myproject.com',
  cat: 'saas',                 // saas | web3 | ecom | site (combine: 'site web3')
  accent: '#6EE7B7',           // pastel accent — rotate: 6EE7B7 93C5FD FDE68A C4B5FD FCA5A5
  num: '14',
  slug: 'my-project',          // kebab-case, used for the media folder
  media: { cover: 'projects/my-project/cover.svg' },
  desc: '1–2 sentence description.',
  highlights: ['Achievement bullet 1.', 'Achievement bullet 2.'],
  tags: ['React', 'Next.js'],
}
```

Then add the same `{ slug, label, accent }` to `scripts/generate-placeholders.mjs`
and run `npm run placeholders` to create the folder + placeholder cover.

## Project images & video

Each project has a folder: `public/projects/<slug>/`

| File | Specs | Then set in data.ts |
|---|---|---|
| `cover.webp` (or `.jpg`) | 1600×900 (16:9), ≤ 300 KB | `media.cover: 'projects/<slug>/cover.webp'` |
| `gallery-1.webp`, `gallery-2.webp`… | 1600×900, ≤ 300 KB each | `media.gallery: [...]` |
| `loop.mp4` | ≤ 8 s, muted, 1280×720, ≤ 3 MB | `media.video: 'projects/<slug>/loop.mp4'` |

Tips:
- Screenshot your live sites at 1600×900 (or 2560×1440 and downscale).
- Convert/compress with [squoosh.app](https://squoosh.app) (WebP, quality ~80).
- For video loops, screen-record 5–8 s of the best interaction and compress with
  HandBrake (H.264, web-optimized) — no audio needed.
- The `cover.svg` placeholders are safe to leave in place; replace them whenever
  you're ready. `npm run placeholders` never overwrites your real files.

## Rules that keep the deploy working

1. **Media paths in `data.ts` have no leading slash** — `projects/foo/cover.webp`,
   not `/projects/foo/cover.webp`. The site lives under `/portfolio/` on GitHub
   Pages and leading slashes break there.
2. Keep filenames lowercase, kebab-case, no spaces.
3. Big files slow the site — stick to the size limits above.
