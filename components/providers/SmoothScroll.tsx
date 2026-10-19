'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/reduced-motion'

declare global {
  // eslint-disable-next-line no-var
  var __lenis: Lenis | undefined
}

/** The live Lenis instance, or undefined (SSR, or reduced motion). */
export function getLenis() {
  return typeof window === 'undefined' ? undefined : globalThis.__lenis
}

/**
 * Site-wide smooth momentum scroll (Lenis) wired into the GSAP ticker so
 * ScrollTrigger stays in sync. Mount inside a layout — NOT app/layout.tsx,
 * because PortfolioRouter renders null on first paint.
 *
 * Skipped entirely under prefers-reduced-motion (native scroll takes over).
 * Exposes the instance via getLenis() so nav/snap logic can scroll it.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    // Let inner panels consume input only while they can scroll in that direction.
    // At either edge Lenis takes over again to move through the horizontal track.
    const lenis = new Lenis({ autoRaf: false, duration: 1.1, allowNestedScroll: true })
    globalThis.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      globalThis.__lenis = undefined
    }
  }, [])

  return <>{children}</>
}

/** Scroll to an absolute Y offset, Lenis-aware. */
export function scrollToY(y: number, duration?: number) {
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(y, duration === undefined ? undefined : { duration })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

/** Smoothly scroll to a target (selector or element), Lenis-aware. */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(target, { offset })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth' })
}
