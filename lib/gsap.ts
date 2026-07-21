'use client'

/**
 * Central GSAP setup. Import `gsap` and `ScrollTrigger` from here so plugins are
 * registered exactly once. See .claude/docs/LIBRARIES.md for usage rules.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)
  // Dev-only debug handles (used for automated visual verification).
  if (process.env.NODE_ENV !== 'production') {
    ;(window as unknown as Record<string, unknown>).gsap = gsap
    ;(window as unknown as Record<string, unknown>).ScrollTrigger = ScrollTrigger
  }
}

/** True when the user asked the OS to minimise motion. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Breakpoint used to split desktop (horizontal) from mobile (vertical). */
export const DESKTOP_MQ = '(min-width: 1280px)'

export { gsap, ScrollTrigger, SplitText, useGSAP }
