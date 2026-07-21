'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

/**
 * Fade-and-rise reveal when the element scrolls into view (mobile layout).
 * GSAP ScrollTrigger (not Motion) so it rides the existing main-bundle deps
 * and stays in sync with Lenis. No-op under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  y?: number
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 0.7,
        delay,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
