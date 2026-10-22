'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion, useReducedMotion } from '@/lib/reduced-motion'

/**
 * One-shot reveal in ordinary vertical flow, including after content resizes.
 */
export function Reveal({
  children,
  className,
  y = 20,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  y?: number
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useRef(false)
  const reduced = useReducedMotion()

  useGSAP(
    (_, contextSafe) => {
      const element = ref.current
      if (!element || !contextSafe || reduced || prefersReducedMotion() || seen.current || typeof IntersectionObserver === 'undefined') return
      gsap.set(element, { opacity: 0, y })
      const reveal = contextSafe(() => {
        seen.current = true
        gsap.to(element, { opacity: 1, y: 0, duration: 0.55, delay, ease: 'power2.out', clearProps: 'transform,opacity' })
      })
      let disposed = false
      const observer = new IntersectionObserver(entries => {
        if (!disposed && entries.some(entry => entry.isIntersecting)) { reveal(); observer.disconnect() }
      }, { rootMargin: '0px 0px -12% 0px' })
      observer.observe(element)
      return () => { disposed = true; observer.disconnect() }
    },
    { scope: ref, dependencies: [reduced, y, delay], revertOnUpdate: true },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
