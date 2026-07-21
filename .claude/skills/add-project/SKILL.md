---
name: add-project
description: Add a new project (or update an existing one) in the portfolio — updates lib/data.ts, creates the media folder, generates a placeholder cover, and keeps the placeholder script in sync. Use when the user says "add a project", "add my new project X", or wants to edit/remove a project entry.
---

# Add / update a portfolio project

All portfolio content lives in `lib/data.ts`. Project media lives in
`public/projects/<slug>/`. This skill keeps both in sync.

## Gather (ask only for what's missing)

Required: **title**, **type** (e.g. "SaaS Platform"), **desc** (1–2 sentences),
**tags** (3–7 tech names), **cat** — one of `saas` | `web3` | `ecom` | `site`
(space-separate combos like `'site web3'`).
Optional: **url** (live link), **highlights** (2–3 achievement bullets, start with
a strong verb: Architected / Built / Engineered / Implemented), media files.

## Steps

1. **Derive a slug**: kebab-case of the title (`ASAP Pay` → `asap-pay`).
2. **Edit `lib/data.ts`** — append to `PROJECTS` (or edit in place if the title
   already exists), matching the existing object shape exactly:
   - `id`: max existing id + 1; `num`: zero-padded id as string (`'14'`).
   - `accent`: rotate through the pastel set `#6EE7B7 #93C5FD #FDE68A #C4B5FD #FCA5A5`
     — pick one not used by adjacent entries.
   - `urlLabel`: the url minus protocol, or `''`.
   - `media`: `{ cover: 'projects/<slug>/cover.svg' }` — switch the extension if
     the user provides a real file; add `gallery`/`video` keys only when files exist.
3. **Sync the placeholder script** — add `{ slug, label, accent }` to the
   `projects` array in `scripts/generate-placeholders.mjs`.
4. **Media folder** — run `npm run placeholders` (creates the folder + cover.svg,
   never overwrites real files). If the user supplied real media, place it as
   `public/projects/<slug>/cover.webp` (or `.jpg`) / `gallery-1.webp…` /
   `loop.mp4`, and point `media.*` at those instead.
5. **Verify** — `npm run build` must pass. If the project should appear in a
   specific desktop group, check how the rendering component groups projects
   (`projectGroups` in data.ts buckets by `cat` and slices to 4 — a new project
   may not surface on desktop unless its bucket has room; tell the user if so).

## Removal / edits

- Remove: delete the object from `PROJECTS`, the entry in
  `generate-placeholders.mjs`, and the `public/projects/<slug>/` folder.
- Don't renumber existing ids; gaps are fine.

## Media specs (tell the user if their files miss these)

- Cover: 1600×900 (16:9), WebP preferred, ≤ 300 KB.
- Gallery stills: same specs, `gallery-1.webp`, `gallery-2.webp`, …
- Video loop: MP4 (H.264) or WebM, ≤ 8s, muted-friendly, ≤ 3 MB, 1280×720 is enough.
