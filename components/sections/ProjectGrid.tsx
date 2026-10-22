'use client'

import { useEffect, useId, useRef, useState, type FocusEvent } from 'react'
import { scrollToTarget } from '@/components/providers/SmoothScroll'
import { ProjectCard } from '@/components/shared/ProjectCard'
import { PROJECTS, UI_COPY, type Project } from '@/lib/data'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion, useReducedMotion } from '@/lib/reduced-motion'

const MOBILE_BATCH_SIZE = 3

/** Mobile reveals three projects at a time; desktop retains the full grid. */
export function ProjectGrid({ onOpen, variant = 'mobile', active }: {
  onOpen: (project: Project) => void
  variant?: 'desktop' | 'mobile'
  active?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const loadMoreButton = useRef<HTMLButtonElement>(null)
  const pendingAction = useRef<number | 'collapse' | null>(null)
  const gridId = useId()
  const [visibleCount, setVisibleCount] = useState(MOBILE_BATCH_SIZE)
  const seen = useRef(new Set<HTMLElement>())
  const reduced = useReducedMotion()
  const mobile = variant === 'mobile'
  const projects = mobile ? PROJECTS.slice(0, visibleCount) : PROJECTS

  useEffect(() => {
    if (!mobile) return
    const frame = requestAnimationFrame(() => {
      // Adding/removing cards changes the document offsets of later sections.
      ScrollTrigger.refresh()
      const action = pendingAction.current
      pendingAction.current = null
      if (action === 'collapse') {
        loadMoreButton.current?.focus({ preventScroll: true })
        scrollToTarget('#projects', -96)
      } else if (typeof action === 'number') {
        const card = root.current?.querySelectorAll<HTMLElement>('[data-project-reveal]')[action]
        card?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })
        if (card) scrollToTarget(card, -112)
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [mobile, visibleCount])

  useGSAP((_, contextSafe) => {
    const grid = root.current
    if (!grid || !contextSafe || reduced || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    seen.current.forEach(card => { if (!grid.contains(card)) seen.current.delete(card) })
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-project-reveal]')).filter(card => !seen.current.has(card))
    if (!cards.length) return
    gsap.set(cards, { opacity: 0, y: 20 })
    if (active === false) return
    let disposed = false

    const animate = contextSafe((cards: HTMLElement[]) => {
      gsap.to(cards, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
        stagger: Math.min(0.06, 0.18 / Math.max(1, cards.length - 1)),
        clearProps: 'transform,opacity',
      })
    })
    const observer = new IntersectionObserver(entries => {
      if (disposed) return
      const entering = entries.filter(entry => entry.isIntersecting && !seen.current.has(entry.target as HTMLElement))
        .map(entry => entry.target as HTMLElement)
        .sort((a, b) => a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft)
      if (!entering.length) return
      entering.forEach(card => { seen.current.add(card); observer.unobserve(card) })
      animate(entering)
    }, {
      root: variant === 'desktop' ? grid.closest('.projects-window') : null,
      rootMargin: '0px 0px -24px 0px', threshold: 0.05,
    })
    cards.forEach(card => observer.observe(card))
    return () => { disposed = true; observer.disconnect() }
  }, { scope: root, dependencies: [active, reduced, variant, visibleCount], revertOnUpdate: true })

  const revealFocused = (event: FocusEvent<HTMLDivElement>) => {
    const wrapper = event.target.closest<HTMLElement>('[data-project-reveal]')
    if (!wrapper) return
    seen.current.add(wrapper)
    // Keyboard focus is immediate, including cards skipped by a fast scroll.
    gsap.killTweensOf(wrapper)
    wrapper.style.removeProperty('opacity')
    wrapper.style.removeProperty('transform')
  }

  return (
    <>
      <div ref={root} id={gridId} className="projects-grid" onFocusCapture={revealFocused}>
        {projects.map(project => (
          <div key={project.id} className="project-reveal" data-project-reveal>
            <ProjectCard project={project} onOpen={onOpen} />
          </div>
        ))}
      </div>
      {mobile && PROJECTS.length > MOBILE_BATCH_SIZE ? (
        <div className="projects-pagination">
          {visibleCount < PROJECTS.length ? (
            <button ref={loadMoreButton} type="button" aria-controls={gridId} onClick={() => {
              pendingAction.current = visibleCount
              setVisibleCount(count => Math.min(count + MOBILE_BATCH_SIZE, PROJECTS.length))
            }}>{UI_COPY.loadMoreProjects}</button>
          ) : null}
          {visibleCount > MOBILE_BATCH_SIZE ? (
            <button type="button" aria-controls={gridId} onClick={() => {
              pendingAction.current = 'collapse'
              setVisibleCount(MOBILE_BATCH_SIZE)
            }}>{UI_COPY.showLessProjects}</button>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
