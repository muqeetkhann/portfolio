'use client'

import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { DesktopNav } from '@/components/layouts/DesktopNav'
import SmoothScroll, { scrollToTarget, scrollToY } from '@/components/providers/SmoothScroll'
import { BackgroundSection } from '@/components/sections/BackgroundSection'
import type { BackgroundSequenceController } from '@/components/sections/BackgroundSequence'
import { ContactCard } from '@/components/sections/ContactCard'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { ProjectModal } from '@/components/shared/ProjectModal'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { NAVIGATION, PROJECTS, UI_COPY, type Project } from '@/lib/data'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion, useReducedMotion } from '@/lib/reduced-motion'
import { backgroundSequenceProgress } from '@/lib/scroll-effects'
import { cn } from '@/lib/utils'

const PROJECT_PANEL = NAVIGATION.findIndex(item => item.id === 'projects')
const BACKGROUND_PANEL = NAVIGATION.findIndex(item => item.id === 'background')
const LAST_PANEL = NAVIGATION.length - 1

/** Horizontal transitions and centered vertical segments share one timeline. */
export default function DesktopPortfolio() {
  const reduced = useReducedMotion()
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const projectsInnerRef = useRef<HTMLDivElement>(null)
  const backgroundController = useRef<BackgroundSequenceController | null>(null)
  const backgroundDistance = useRef(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const offsets = useRef(NAVIGATION.map((_, index) => index))
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState<Project | null>(null)

  useGSAP(() => {
    if (reduced || prefersReducedMotion()) return
    const track = trackRef.current
    const pin = pinRef.current
    const inner = projectsInnerRef.current
    if (!track || !pin || !inner) return
    const timeline = gsap.timeline({ defaults: { ease: 'none', immediateRender: false } })
    const backgroundPhase = { progress: 0 }
    const measure = () => {
      const width = window.innerWidth
      const distance = Math.max(1, inner.scrollHeight - (inner.parentElement?.clientHeight ?? window.innerHeight))
      backgroundDistance.current = backgroundController.current?.measure() ?? 0
      // A wheel pixel moves a project-list pixel instead of compressing all
      // seventeen projects into a single viewport's worth of scrolling.
      timeline.clear()
      offsets.current = [0]
      let cursor = 0
      NAVIGATION.forEach((_, index) => {
        if (index === PROJECT_PANEL) {
          timeline.fromTo(inner, { y: 0 }, { y: -distance, duration: distance }, cursor)
          cursor += distance
        }
        if (index === BACKGROUND_PANEL && backgroundDistance.current > 0) {
          // Park the horizontal track, exactly as the Projects segment does.
          timeline.fromTo(backgroundPhase, { progress: 0 }, { progress: 1, duration: backgroundDistance.current }, cursor)
          cursor += backgroundDistance.current
        }
        if (index < LAST_PANEL) {
          timeline.fromTo(track, { x: -width * index }, { x: -width * (index + 1), duration: width }, cursor)
          cursor += width
          offsets.current.push(cursor)
        }
      })
    }
    measure()
    const update = (self: ScrollTrigger) => {
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
      const position = self.progress * offsets.current[LAST_PANEL]
      backgroundController.current?.render(backgroundSequenceProgress(position, offsets.current[BACKGROUND_PANEL], backgroundDistance.current))
      const width = window.innerWidth
      const index = offsets.current.reduce((current, offset, panelIndex) => position >= offset - width * 0.5 ? panelIndex : current, 0)
      setActiveIndex(previous => previous === index ? previous : index)
    }
    stRef.current = ScrollTrigger.create({
      trigger: pin, start: 'top top', end: () => `+=${offsets.current[LAST_PANEL]}`,
      pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true, animation: timeline,
      onRefreshInit: measure,
      onUpdate: update,
      onRefresh: update,
    })
    let cancelled = false
    document.fonts?.ready.then(() => { if (!cancelled) ScrollTrigger.refresh() })
    return () => { cancelled = true; stRef.current?.kill(); stRef.current = null }
  }, { dependencies: [reduced], scope: pinRef, revertOnUpdate: true })

  useEffect(() => {
    if (!reduced) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveIndex(Number(entry.target.id.replace('panel-', ''))) })
    }, { rootMargin: '-20% 0px -60% 0px' })
    pinRef.current?.querySelectorAll('section[id^="panel-"]').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [reduced])

  const navigate = (index: number) => {
    if (reduced) { scrollToTarget(`#panel-${index}`); return }
    const trigger = stRef.current
    if (trigger) scrollToY(trigger.start + offsets.current[index], 0.85)
  }
  const focusProject = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.target
    const inner = projectsInnerRef.current
    const trigger = stRef.current
    if (reduced || !inner || !trigger) return
    const card = target.closest<HTMLElement>('.project-card')
    const viewport = inner.parentElement
    if (!card || !viewport) return
    const bounds = target.getBoundingClientRect()
    const frame = viewport.getBoundingClientRect()
    if (bounds.top >= frame.top && bounds.bottom <= frame.bottom) return
    // Keep keyboard navigation on the same timeline as wheel navigation.
    // overflow:clip prevents native focus from creating a second inner scroll.
    const distance = Math.max(0, inner.scrollHeight - viewport.clientHeight)
    const wrapper = card.closest<HTMLElement>('[data-project-reveal]') ?? card
    requestAnimationFrame(() => scrollToY(trigger.start + offsets.current[PROJECT_PANEL] + Math.min(distance, wrapper.offsetTop), 0))
  }
  const panel = (index: number) => ({
    id: `panel-${index}`,
    inert: !reduced && activeIndex !== index,
    className: cn('desktop-panel', reduced && 'desktop-panel-static'),
  })

  return (
    <SmoothScroll>
      <DesktopNav activeIndex={activeIndex} onNavigate={navigate} />
      <WhatsAppButton />
      <ProjectModal project={selected} projects={PROJECTS} onChange={setSelected} onClose={() => setSelected(null)} />
      {!reduced ? <div className="scroll-progress" aria-hidden><div ref={progressRef} /></div> : null}
      <main id="main-content" tabIndex={-1}>
        <div ref={pinRef} className={cn(!reduced && 'desktop-pin')}>
          <div ref={trackRef} className={cn('desktop-track', reduced && 'desktop-track-static')}>
            <section {...panel(0)} className={cn(panel(0).className, 'hero-panel')}>
              <HeroSection variant="desktop" active={activeIndex === 0} previewPaused={!!selected} onExplore={() => navigate(PROJECT_PANEL)} onOpen={setSelected} />
            </section>
            <section {...panel(1)} className={cn(panel(1).className, 'projects-panel')}>
              <div className="site-container projects-heading"><SectionHeader {...UI_COPY.sections.projects} active={activeIndex === 1} /><p>{PROJECTS.length} {UI_COPY.projectCount}</p></div>
              <div className={cn('projects-window', reduced && 'projects-window-static')} onFocusCapture={focusProject}>
                <div ref={projectsInnerRef} className="site-container projects-inner"><ProjectGrid onOpen={setSelected} variant="desktop" active={activeIndex === PROJECT_PANEL} /></div>
              </div>
            </section>
            <section {...panel(2)}><BackgroundSection variant="desktop" scrollable={!reduced} active={activeIndex === 2} sequenceController={backgroundController} /></section>
            <section {...panel(3)}>
              <div className="site-container desktop-section-shell contact-shell"><SectionHeader {...UI_COPY.sections.contact} active={activeIndex === 3} /><ContactCard /><SiteFooter onIntro={() => navigate(0)} /></div>
            </section>
          </div>
        </div>
      </main>
    </SmoothScroll>
  )
}
