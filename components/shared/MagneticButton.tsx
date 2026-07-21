'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'

/**
 * Wraps a CTA so it eases toward the cursor while hovered (GSAP quickTo —
 * intentionally not Motion, which stays out of the main bundle).
 * Wrap ONE interactive child: <MagneticButton><a …>Label</a></MagneticButton>
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const setters = useRef<{ x?: (v: number) => void; y?: (v: number) => void }>({})

  const handleMove = (event: React.MouseEvent) => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    if (!setters.current.x) {
      setters.current.x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
      setters.current.y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
    }
    const rect = el.getBoundingClientRect()
    setters.current.x?.((event.clientX - rect.left - rect.width / 2) * strength)
    setters.current.y?.((event.clientY - rect.top - rect.height / 2) * strength)
  }

  const handleLeave = () => {
    setters.current.x?.(0)
    setters.current.y?.(0)
  }

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={cn('inline-block will-change-transform', className)}>
      {children}
    </div>
  )
}
