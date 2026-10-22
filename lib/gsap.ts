'use client'

/**
 * Central GSAP setup. Import `gsap` and `ScrollTrigger` from here so plugins are
 * registered exactly once. See .claude/docs/LIBRARIES.md for usage rules.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
  // Dev-only debug handles (used for automated visual verification).
  if (process.env.NODE_ENV !== 'production') {
    ;(window as unknown as Record<string, unknown>).gsap = gsap
    ;(window as unknown as Record<string, unknown>).ScrollTrigger = ScrollTrigger
  }
}

export { gsap, ScrollTrigger, useGSAP }
