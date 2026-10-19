/** Rebuild the 1200×630 share image from the portfolio's content source (Node 22+). */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { PERSONAL, SITE_METADATA } from '../lib/data.ts'

const escapeXml = value => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[char])

const [firstName, ...remainingNames] = PERSONAL.name.toUpperCase().split(' ')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="cyan" cx="10%" cy="10%" r="65%">
      <stop stop-color="#00f5ff" stop-opacity=".15"/>
      <stop offset="1" stop-color="#00f5ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="purple" cx="95%" cy="90%" r="55%">
      <stop stop-color="#bc13fe" stop-opacity=".13"/>
      <stop offset="1" stop-color="#bc13fe" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="name"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#00f5ff"/></linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#fff" stroke-opacity=".045"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#050505"/>
  <rect width="1200" height="630" fill="url(#cyan)"/>
  <rect width="1200" height="630" fill="url(#purple)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <g font-family="Arial, sans-serif" font-weight="700">
    <text x="80" y="140" font-size="23" letter-spacing="7" fill="#00f5ff">${escapeXml(PERSONAL.availability.toUpperCase())}</text>
    <text x="80" y="280" font-size="106" letter-spacing="-3" fill="#f8fafc">${escapeXml(firstName)}</text>
    <text x="80" y="390" font-size="106" letter-spacing="-3" fill="url(#name)">${escapeXml(remainingNames.join(' '))}</text>
    <text x="80" y="465" font-size="35" letter-spacing="4" fill="#a1a1aa">${escapeXml(PERSONAL.role.toUpperCase())}</text>
    <text x="80" y="545" font-size="24" fill="#71717a">${escapeXml(SITE_METADATA.imageTechnologies.join(' · '))}</text>
  </g>
  <rect x="80" y="575" width="120" height="4" rx="2" fill="#00f5ff"/>
</svg>`

await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL(`../public/${SITE_METADATA.image}`, import.meta.url)))
console.log(`Updated ${SITE_METADATA.image} from lib/data.ts`)
