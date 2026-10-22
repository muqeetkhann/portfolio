'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion, useReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'

/** Native mobile visibility; explicit active-panel gating inside the track. */
export function SectionHeader({ title, accent, className, active }: {
  title: string
  accent?: string
  className?: string
  active?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const seen = useRef(false)
  const reduced = useReducedMotion()

  useGSAP((_, contextSafe) => {
    const element = root.current
    const content = element?.querySelector('.heading-reveal')
    if (!element || !content || !contextSafe || reduced || prefersReducedMotion() || seen.current) return
    if (typeof IntersectionObserver === 'undefined') return
    gsap.set(content, { y: 24, opacity: 0 })
    const reveal = contextSafe(() => {
      seen.current = true
      gsap.to(content, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' })
    })
    if (active !== undefined) {
      if (active) reveal()
      return
    }
    let disposed = false
    const observer = new IntersectionObserver(entries => {
      if (!disposed && entries.some(entry => entry.isIntersecting)) { reveal(); observer.disconnect() }
    }, { rootMargin: '0px 0px -12% 0px' })
    observer.observe(element)
    return () => { disposed = true; observer.disconnect() }
  }, { scope: root, dependencies: [active, reduced], revertOnUpdate: true })

  return (
    <div ref={root} className={cn('section-heading', className)}>
      <h2 className="section-title heading-mask"><span className="heading-reveal">{title}{accent ? <> <span className="text-neon-cyan">{accent}</span></> : null}</span></h2>
    </div>
  )
}
