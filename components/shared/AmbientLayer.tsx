'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Full-bleed backdrop slot for the OriginKit WebGL backgrounds.
 *
 * Every panel of the desktop track is mounted at once, so without gating we'd
 * hold five live WebGL contexts (plus the hero's R3F canvas) for the whole
 * session. This mounts its child only while the panel is on or next to the
 * screen, and tears the context down again once it isn't:
 *
 * - `active` — drive it from the layout's panel index on desktop (where the
 *   track is translated and IntersectionObserver reports everything visible).
 * - omit `active` — falls back to an IntersectionObserver, which is what the
 *   mobile layout's ordinary vertical flow wants.
 *
 * Returns null under prefers-reduced-motion (design rule 4); the static
 * gradient washes in globals.css stay as the fallback visual.
 */
export function AmbientLayer({
  children,
  active,
  className,
  opacity = 0.32,
  fade = true,
  blend = 'normal',
}: {
  children: ReactNode
  /** Desktop: mount while this panel is current/adjacent. Omit to use an observer. */
  active?: boolean
  className?: string
  /** Backdrop strength — keep low so section copy stays readable. */
  opacity?: number
  /** Mask the bottom edge so the layer dissolves instead of cutting off. */
  fade?: boolean
  /**
   * How the backdrop composites against its panel. 'screen' makes a dark-field
   * background additive — black contributes nothing and only the lit geometry
   * shows, so the layer glows instead of dimming the panel beneath it. That is
   * what the dark panels want, and it is what makes an opaque-output component
   * (dot-lens writes alpha 1.0) usable as an overlay at all. Leave it 'normal'
   * on the white Experience panel, where screen would blow the lattice out.
   */
  blend?: 'normal' | 'screen'
}) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (reduced || active !== undefined) return
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(entries => setVisible(entries.some(e => e.isIntersecting)), {
      rootMargin: '25%',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, active])

  if (reduced) return null

  const mounted = active !== undefined ? active : visible

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)}
      style={{
        // Height cap, not a style choice. These backdrops size their drawing
        // buffer to the element at up to 2× DPR, and a mobile section is as
        // tall as its content — the Projects list is ~7500px, which asks for a
        // 750×14922 canvas. That is ~11M pixels redrawn every frame, and it is
        // over the max texture/canvas dimension on plenty of phone GPUs (4096
        // or 8192), where it fails outright rather than merely running slow.
        // Capping keeps the buffer sane; the bottom mask already dissolves the
        // edge, so a backdrop that stops short of a very long section reads as
        // intentional. Desktop panels are exactly one viewport, so this is a
        // no-op there.
        maxHeight: '160vh',
        opacity: mounted ? opacity : 0,
        mixBlendMode: blend,
        transition: 'opacity 700ms ease',
        ...(fade
          ? {
              maskImage: 'linear-gradient(180deg,#000 0%,#000 62%,transparent 100%)',
              WebkitMaskImage: 'linear-gradient(180deg,#000 0%,#000 62%,transparent 100%)',
            }
          : null),
      }}
    >
      {mounted ? children : null}
    </div>
  )
}
