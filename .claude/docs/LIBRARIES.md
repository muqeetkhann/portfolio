# Animation Libraries — Usage Rules

Installed stack, what each library is *for*, and the gotchas specific to this repo
(client-only rendering + static export to GitHub Pages).

## Stack at a glance

| Library | Role | Reach for it when |
|---|---|---|
| `gsap` + `@gsap/react` | Scroll choreography | Pinned horizontal track, scrubbed timelines, masked reveals |
| `lenis` | Smooth momentum scroll | Site-wide scroll feel; drives ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` |
| `motion` (`motion/react`) | UI micro-interactions | Hover/tap gestures, layout animations, presence (menus, modals, cards) |
| `clsx` + `tailwind-merge` | Class utils | Conditional Tailwind classes (`cn()` helper) |

Division of labor: **GSAP owns the scroll axis. Motion owns pointer-driven UI.
Native Web Animations own the fixed starfield.** Don't animate the same property from two systems.

## GSAP

- Import the shared GSAP setup and use its `useGSAP` hook (auto cleanup, StrictMode-safe):

```tsx
'use client'
import { gsap, useGSAP } from '@/lib/gsap'

useGSAP(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // timelines / ScrollTriggers here
}, { scope: containerRef })
```

- `lib/gsap.ts` registers `useGSAP` and `ScrollTrigger` once, guarded for the
  browser. Add another plugin there only when an active component needs it.
- Horizontal pinned track pattern: tall wrapper (`height: ${panels * 100}vh`),
  pinned viewport, `gsap.to(track, { xPercent, scrollTrigger: { scrub, pin, snap } })`.
- Use `gsap.matchMedia()` for the ≥1280px / mobile split *inside* animation code —
  it auto-reverts when the viewport crosses the breakpoint.
- After images/fonts load or layout shifts: `ScrollTrigger.refresh()`.
- Never mix the old hand-rolled wheel hijack (Date.now lockouts,
  `preventDefault` on wheel) with ScrollTrigger — delete it, don't bridge it.

## Lenis

- One instance, created in the active layout (not `app/layout.tsx` — the router
  renders `null` first). Recommended integration:

```tsx
const lenis = new Lenis({ autoRaf: false })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add(t => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```

- Destroy on unmount. Skip entirely under `prefers-reduced-motion`.
- Anchor links need `lenis.scrollTo(target)` instead of native jumps.

## Motion (formerly Framer Motion)

- Import from **`motion/react`** (2025+ name), not `framer-motion`.
- Use for: hover/tap springs, `layout` animations, `AnimatePresence` on the mobile
  menu, magnetic buttons, cursor followers.
- Keep bundle small with `LazyMotion` + `m.` components if usage grows.
- Do **not** use `useScroll`/`useTransform` for anything GSAP already scrubs.

## Fixed starfield

- `StarfieldBackground` is the only background component, mounted in the root
  layout outside all transformed/pinned containers.
- Use native Web Animations for star opacity and meteor opacity/transform.
  Randomize on animation completion; never add a JavaScript drawing loop.
- Reduced motion is static. Hidden tabs cancel animations and timers. Keep
  cleanup for listeners, animations and scheduling on unmount/preference changes.
- Keep counts capped (60 desktop / 30 phones) and reuse one meteor element.
- No Three.js, R3F or shader dependencies remain installed.

## Static-export landmines (GitHub Pages)

1. Nothing above imports server code — keep it all in `'use client'` land.
2. Asset URLs: relative (`./`, `projects/...`) — never `/absolute` (breaks under
   `/portfolio` basePath).
3. `next/image` is unoptimized in export mode — pre-compress media instead
   (see `docs/CONTENT.md`).
4. Test both `npm run build` and `npm run build:static` after animation work;
   pins/measurements can differ when `trailingSlash` rewrites URLs.

## Performance

The background adds no dependency, image request, canvas or WebGL context. Keep
its fixed surface viewport-sized even on the long mobile Projects section, and
avoid blur filters or pointer listeners. Check desktop and mobile navigation,
transparent panels, motion cleanup, and both build modes after animation work.


## Scroll effects

Keep one page scroll controller. `SectionHeader` and `ProjectGrid` use scoped
GSAP with `revertOnUpdate`, active-panel gating on desktop and one-shot observers.
`ExperienceList` renders static timeline accents. `ScrollEdges` schedules frames
only on scroll/resize/load; never add a perpetual measurement loop or per-frame React state. Disconnect
observers, cancel queued frames and guard delayed callbacks during cleanup.
Reduced motion must leave content visible without relying on animation completion.
