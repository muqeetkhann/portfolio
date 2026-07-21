'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

// Three.js arrives only in this lazy chunk, after first paint.
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => null,
})

/**
 * Lazy, guarded entry point for the 3D hero.
 * - prefers-reduced-motion → renders nothing (the page's static glow layers
 *   in globals.css act as the fallback visual).
 * - Only mounts the scene once the wrapper is on screen (IntersectionObserver),
 *   and unmounts rendering work when scrolled far away is unnecessary since
 *   the hero is the first panel — the observer mainly delays WebGL init until
 *   after first paint.
 */
export default function HeroCanvas({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) return
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setReady(true)
          io.disconnect()
        }
      },
      { rootMargin: '20%' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  if (reduced) return null

  return (
    <div ref={wrapRef} aria-hidden className={cn('pointer-events-none', className)}>
      {ready ? <HeroScene /> : null}
    </div>
  )
}
