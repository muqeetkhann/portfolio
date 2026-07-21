'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/gsap'

/**
 * Site-wide smooth momentum scroll (Lenis) wired into the GSAP ticker so
 * ScrollTrigger stays in sync. Mount inside a layout — NOT app/layout.tsx,
 * because PortfolioRouter renders null on first paint.
 *
 * Skipped entirely under prefers-reduced-motion (native scroll takes over).
 * Exposes the instance on window.__lenis so nav links can scrollTo().
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ autoRaf: false, duration: 1.1 })
    // @ts-expect-error — intentional escape hatch for anchor navigation
    window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      // @ts-expect-error — cleanup
      delete window.__lenis
    }
  }, [])

  return <>{children}</>
}

/** Smoothly scroll to a target (selector or element), Lenis-aware. */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  // @ts-expect-error — set by SmoothScroll
  const lenis = typeof window !== 'undefined' ? window.__lenis : undefined
  if (lenis) {
    lenis.scrollTo(target, { offset })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth' })
}
