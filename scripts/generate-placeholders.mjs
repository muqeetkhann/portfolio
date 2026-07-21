/**
 * Generates placeholder cover images for every project in lib/data.ts.
 *
 * Why: the redesign shows project media, but real screenshots/videos are added
 * later. This writes a lightweight branded SVG per project so layouts have
 * something to render in the meantime.
 *
 * Usage:  npm run placeholders
 * Safe to re-run — it only writes files that don't already exist, so it will
 * never overwrite a real screenshot you've dropped in.
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Keep this list in sync with lib/data.ts (slug + accent + label).
// The `add-project` skill updates both places together.
const projects = [
  { slug: 'jitsuites', label: 'JitSuites', accent: '#6EE7B7' },
  { slug: 'kompra', label: 'Kompra', accent: '#93C5FD' },
  { slug: 'kompra-seller', label: 'Kompra Seller', accent: '#FDE68A' },
  { slug: 'extsy', label: 'Extsy', accent: '#C4B5FD' },
  { slug: 'asap-pay', label: 'ASAP Pay', accent: '#FCA5A5' },
  { slug: 'ethoro', label: 'Ethoro', accent: '#6EE7B7' },
  { slug: 'katana-healthcare', label: 'Katana Healthcare', accent: '#93C5FD' },
  { slug: 'zawayadao', label: 'ZawayaDAO', accent: '#C4B5FD' },
  { slug: 'travaleo', label: 'Travaleo', accent: '#FDE68A' },
  { slug: 'singularity', label: 'Singularity', accent: '#6EE7B7' },
  { slug: 'blockyfy', label: 'Blockyfy', accent: '#6EE7B7' },
  { slug: 'nextsense', label: 'NextSense', accent: '#93C5FD' },
  { slug: 'regen-digital', label: 'Regen Digital', accent: '#C4B5FD' },
  { slug: 'ingles-academics', label: 'Inglés Academics', accent: '#6EE7B7' },
  { slug: 'ingles-crm', label: 'Inglés CRM', accent: '#93C5FD' },
]

const exists = async (p) => {
  try {
    await access(p, constants.F_OK)
    return true
  } catch {
    return false
  }
}

const cover = ({ label, accent }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-label="${label} placeholder cover">
  <defs>
    <radialGradient id="glow" cx="30%" cy="24%" r="90%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="${accent}" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1600" height="900" fill="#050505"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <rect width="1600" height="900" fill="url(#glow)"/>
  <text x="80" y="470" font-family="'Syne','Space Grotesk',sans-serif" font-size="120" font-weight="800" fill="#ffffff" letter-spacing="-4">${label}</text>
  <text x="84" y="540" font-family="'Space Grotesk',monospace" font-size="22" font-weight="600" letter-spacing="8" fill="${accent}">PLACEHOLDER · REPLACE WITH REAL MEDIA</text>
</svg>
`

let written = 0
let skipped = 0

for (const project of projects) {
  const dir = join(root, 'public', 'projects', project.slug)
  await mkdir(dir, { recursive: true })
  const file = join(dir, 'cover.svg')
  if (await exists(file)) {
    skipped += 1
    continue
  }
  await writeFile(file, cover(project), 'utf8')
  written += 1
}

console.log(`Placeholder covers → wrote ${written}, skipped ${skipped} (already existed).`)
console.log('Drop real files as public/projects/<slug>/cover.(webp|jpg|mp4) and re-run to keep the rest.')
