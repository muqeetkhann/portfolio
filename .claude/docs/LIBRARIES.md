# Animation & 3D Libraries — Usage Rules

Installed stack, what each library is *for*, and the gotchas specific to this repo
(client-only rendering + static export to GitHub Pages).

## Stack at a glance

| Library | Role | Reach for it when |
|---|---|---|
| `gsap` + `@gsap/react` | Scroll choreography | Pinned horizontal track, scrubbed timelines, section snapping, SplitText headlines |
| `lenis` | Smooth momentum scroll | Site-wide scroll feel; drives ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` |
| `motion` (`motion/react`) | UI micro-interactions | Hover/tap gestures, layout animations, presence (menus, modals, cards) |
| `three` + `@react-three/fiber` | 3D scenes | The hero showpiece and any WebGL section |
| `@react-three/drei` | R3F helpers | Cameras, `Environment`, `Text3D`, `Float`, `MeshTransmissionMaterial`, loaders |
| `@react-three/postprocessing` | Post FX | Bloom, chromatic aberration, noise — the "futuristic" grade |
| `clsx` + `tailwind-merge` | Class utils | Conditional Tailwind classes (`cn()` helper) |

Division of labor: **GSAP owns the scroll axis. Motion owns pointer-driven UI.
R3F owns the canvas.** Don't animate the same property from two systems.

## GSAP

- Always use the `useGSAP` hook from `@gsap/react` (auto cleanup, StrictMode-safe):

```tsx
'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

useGSAP(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // timelines / ScrollTriggers here
}, { scope: containerRef })
```

- **All plugins are free** since 2025 (ScrollTrigger, ScrollSmoother, SplitText,
  MorphSVG…). Import from `gsap/<Plugin>` and register once per module.
- Register plugins at module top level, inside `'use client'` files only.
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

## React Three Fiber (v9 — React 19 pairing)

- R3F v9 requires React 19 — we're on it. drei v10 / postprocessing v3 match.
- **Every** canvas entry point must be client-only and lazy:

```tsx
const Scene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="static-fallback" />,
})
```

- Canvas defaults for this site: `dpr={[1, 2]}`, `gl={{ antialias: true, alpha: true }}`,
  `frameloop="demand"` where the scene is idle-capable.
- Pause rendering when off-screen (`useInView`) and when tab hidden.
- Post FX budget: Bloom + one more effect max; each pass costs a full-screen render.
- Assets (GLTF/HDR) go in `public/` and load via **relative** paths (basePath!).
- Provide a static-image fallback for reduced-motion and WebGL-less browsers.

## Static-export landmines (GitHub Pages)

1. Nothing above imports server code — keep it all in `'use client'` land.
2. Asset URLs: relative (`./`, `projects/...`) — never `/absolute` (breaks under
   `/portfolio` basePath).
3. `next/image` is unoptimized in export mode — pre-compress media instead
   (see `docs/CONTENT.md`).
4. Test both `npm run build` and `npm run build:static` after animation work;
   pins/measurements can differ when `trailingSlash` rewrites URLs.

## Performance budget

- First Load JS for `/` was **113 kB** right after the upgrade (before any 3D).
  Keep the non-3D route under ~180 kB; everything Three-related must arrive in
  lazy chunks only after first paint.
- Lighthouse targets: Performance ≥ 90 desktop / ≥ 80 mobile with 3D enabled.
