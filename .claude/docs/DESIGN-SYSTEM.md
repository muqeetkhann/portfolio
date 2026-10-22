# Design System

## Identity

Near-black, cyan, editorial type and open service rows. One fixed, sparse starfield supports every section. White and pale cyan stars
twinkle independently, with occasional shooting stars at varied speeds. No white inverted panel,
glow blobs, background shaders, or hover-only primary actions.

## Type

Both variable fonts remain self-hosted through `next/font/local`. Satoshi
(`--font-satoshi`, weights 300–900) handles the current hero, section headings,
project titles, body and UI. Clash Display (`--font-clash`, weights 200–700) remains
available through `font-heading` and is used by the existing case-study modal.

- Hero: Satoshi 900, fluid 28–93px from its content container width, uppercase,
  0.98–1 line height, -0.055em tracking. The three-line heading reads “Your business.
  Your workflows. Better software.”, with “software.” in cyan.
- Section headings: Satoshi 600, fluid 32–72px, sentence case, -0.045em tracking.
- Body: 14–22px, 1.6–1.8 line height, restrained secondary ink.
- Metadata: 10–12px; monospace for indices and dates.
- Solid cyan emphasis; selection inherits text color with a neutral gray background.

## Tokens

Current CSS variables in `app/globals.css`:

| Token | Value | Purpose |
|---|---|---|
| `--page` | `#050708` | Base surface |
| `--surface` | `#0b1013` | Raised cards |
| `--ink` | `#f4f6f7` | Primary text |
| `--muted` | `#b1bbc1` | Supporting text |
| `--line` | pale ink at 14% | Dividers and borders |
| `--accent` | `#00f5ff` | Actions, active states, focus |

The broader Tailwind palette and per-project accent values remain intact.

## Layout and surfaces

- One `SiteShell` wraps all site content in the root layout. Its `.site-container`
  primitive aligns navigation and every section: 1680px maximum on desktop,
  `clamp(32px, 4vw, 80px)` side gutters; tablet maximum 1080px with 32px gutters;
  mobile 20px gutters. Widths are declared only in `SiteShell.module.css`.
  Viewport panels and the GSAP track stay full-width.
- Rounded navigation capsule: intrinsic width, centered within the shared site
  container, 60–64px high. The desktop active pill moves between labels with a
  restrained Motion spring as the current scroll panel changes. Reduced motion
  switches immediately. Mobile keeps a compact centered brand/menu capsule.
- Hero: balanced two columns on wide screens, stacked below 960px.
- Project grid: three columns at 1536px, two on laptop/tablet, one below 640px.
- Cards: 18px radius, subtle border, no heavy shadow; real images use `contain`.
- Missing product images: restrained textual previews, never fabricated screenshots.
- Background: two scroll stages in one shared viewport. The first pairs high-level
  experience and education timelines without dates; the second shows six curated
  stack groups in a full-width grid (three desktop columns, two tablet, one phone).
  No stage toolbar or Background edge shadows. Content is vertically balanced
  within each stage; taller content receives its full scroll travel. Desktop
  vertical movement starts only after the panel is horizontally centered.
- Scrollbars are hidden throughout the site; wheel, touch and keyboard scrolling
  remain available.
- Global backdrop: `StarfieldBackground`, fixed at `100dvw × 100dvh`, mounted once
  in the root layout. 60 stars on desktop / 30 on phones and one reusable meteor.
  Random timing, brightness, position, angle and speed; only opacity/transform
  animate. Hidden tabs stop motion; reduced motion keeps static stars.

## Interaction and motion

- Hero heading entrance: 600ms masked opacity/translate, 75ms stagger.
- Section headings: one-time 550ms masked reveal, triggered by the active desktop
  panel or mobile viewport entry. Headings preserve their original type dimensions.
- Project cards: one-time 500ms opacity/20px translate, up to 60ms between cards
  with total stagger capped at 180ms. Focus reveals a card immediately.
- Background sequence: page scroll controls a 40px slide/fade exit and entrance,
  with no overlapping text or wheel interception. Each scene's full height remains
  reachable before the next enters. Timeline accents stay static within scenes.
  Reduced motion uses normal vertical flow without hidden scenes.
- Native modal overflow uses restrained 22px edge shadows, fading over
  140ms. They disappear at each boundary and do not capture pointer input.
- Microinteractions: 180–240ms transform/color; subtle magnetic primary CTA.
- Expertise hover/focus selects a contextual preview; click opens the case study.
- Compact preview keeps previous/next and image crossfade, with a borderless 2px
  cyan timing bar flush below the image, spanning its full width. It has no autoplay button.
- Compact autoplay runs on a five-second cycle, pausing for hover, focus, open
  case studies, hidden tabs and inactive/offscreen panels. Manual navigation
  resets the countdown; it resumes when interaction ends. The default card
  variant retains its explicit Play/Pause control and holds manual selections.
- Desktop horizontal shell remains; scrolling has no snapping or second scrub delay.
- Reduced motion skips Lenis/pinning, reveals final content and disables autoplay.

## Accessibility

Semantic buttons/links, cyan focus outlines, skip link, native dialog mobile menu,
44px compact controls, offscreen desktop panels marked inert, meaningful media
alt text, and readable supporting ink. The timing bar is decorative and hidden
from assistive technology; focus pauses rotation. Long text wraps; modal content scrolls inside
a stable viewport frame.
