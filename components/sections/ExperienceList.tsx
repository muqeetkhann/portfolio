'use client'

import { useId, useRef, useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'
import { EXPERIENCE, JOURNEY_COPY } from '@/lib/data'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion, useReducedMotion } from '@/lib/reduced-motion'
import { timelineProgress } from '@/lib/scroll-effects'

export function ExperienceList({ variant, active, animateTimeline = true, overview = false }: { variant?: 'desktop' | 'mobile'; active?: boolean; animateTimeline?: boolean; overview?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    const element = root.current
    if (!element || !animateTimeline || active === false || reduced || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    const scroller = variant === 'desktop' ? element.closest<HTMLElement>('.panel-scroll') : null
    const target = scroller ?? window
    let inView = active ?? false
    let frame = 0
    let disposed = false
    const cards = Array.from(element.querySelectorAll<HTMLElement>('.experience-card'))
    const setters = cards.map(card => {
      const line = card.querySelector('.experience-line')
      const point = card.querySelector('.experience-point')
      gsap.set(line, { scaleY: 0 })
      gsap.set(point, { opacity: 0.2 })
      return {
        line: gsap.quickTo(line, 'scaleY', { duration: 0.45, ease: 'power2.out' }),
        point: gsap.quickTo(point, 'opacity', { duration: 0.25, ease: 'power2.out' }),
      }
    })
    const update = () => {
      frame = 0
      if (disposed || !inView || document.hidden) return
      const area = scroller?.getBoundingClientRect()
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect()
        const progress = timelineProgress(rect.top, rect.height, area?.top ?? 0, scroller?.clientHeight ?? window.innerHeight)
        setters[index].line(progress)
        setters[index].point(0.2 + progress * 0.8)
      })
    }
    const schedule = () => { if (!disposed && inView && !frame) frame = requestAnimationFrame(update) }
    const visibility = new IntersectionObserver(entries => {
      if (disposed) return
      inView = entries.some(entry => entry.isIntersecting)
      schedule()
    }, { root: scroller, rootMargin: '20% 0px' })
    visibility.observe(element)
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
    resize?.observe(element)
    if (scroller) resize?.observe(scroller)
    target.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('visibilitychange', schedule)
    schedule()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      visibility.disconnect()
      resize?.disconnect()
      target.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, { scope: root, dependencies: [active, reduced, variant, animateTimeline], revertOnUpdate: true })

  return (
    <div ref={root} className="experience-grid" data-variant={variant} data-overview={overview || undefined}>
      {EXPERIENCE.map(item => <ExperienceCard key={item.company} item={item} overview={overview} />)}
    </div>
  )
}

function ExperienceCard({ item, overview }: { item: typeof EXPERIENCE[number]; overview: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const id = useId()

  return (
    <article className="experience-card">
      <span className="experience-line" aria-hidden="true" />
      <span className="experience-point" aria-hidden="true" />
      {!overview && item.period ? <p className="experience-date">{item.period}</p> : null}
      <h4>{item.company}</h4>
      <p className="experience-role">{item.role}</p>
      {overview ? <p className="experience-summary">{item.summary}</p> : <ul id={id}>
        {item.bullets.map((bullet, index) => <li key={bullet} hidden={!expanded && index >= 2}>{bullet}</li>)}
      </ul>}
      {!overview && item.bullets.length > 2 ? (
        <button type="button" className="experience-toggle" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}>
          {expanded ? JOURNEY_COPY.showLess : JOURNEY_COPY.showMore}
          {expanded ? <ArrowUpIcon size={15} aria-hidden /> : <ArrowDownIcon size={15} aria-hidden />}
        </button>
      ) : null}
    </article>
  )
}
