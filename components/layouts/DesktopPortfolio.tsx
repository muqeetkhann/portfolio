'use client'

import { useRef, useState } from 'react'
import { DESKTOP_NAV, DesktopNav } from '@/components/layouts/DesktopNav'
import SmoothScroll, { getLenis, scrollToTarget, scrollToY } from '@/components/providers/SmoothScroll'
import { ContactCard } from '@/components/sections/ContactCard'
import { ExperienceList } from '@/components/sections/ExperienceList'
import { HeroIntro } from '@/components/sections/HeroIntro'
import { SkillsGrid } from '@/components/sections/SkillsGrid'
import { ProjectCard } from '@/components/shared/ProjectCard'
import { ProjectModal } from '@/components/shared/ProjectModal'
import ProjectSpotlight from '@/components/shared/ProjectSpotlight'
import { SectionHeader } from '@/components/shared/SectionHeader'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import HeroCanvas from '@/components/three/HeroCanvas'
import { PERSONAL, PROJECTS, type Project } from '@/lib/data'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import { useReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'

// Timeline time (out of TL_DURATION) at which each panel is settled in view.
// Segments (duration 1 each): 0 intro→exp, 1 exp→proj, 2 proj-vertical, 3 proj→stack, 4 stack→contact.
const NAV_TIME = [0, 1, 2, 4, 5]
const TL_DURATION = 5
/** Timeline window (in NAV_TIME units) where projects sub-scroll vertically. */
const PROJECTS_FREE = [2 / TL_DURATION, 3 / TL_DURATION]

const SHELL = 'mx-auto w-full max-w-[92rem] px-8 2xl:max-w-[100rem] 2xl:px-10'

function activeFromTime(t: number) {
  if (t < 0.5) return 0
  if (t < 1.5) return 1
  if (t < 3.5) return 2
  if (t < 4.5) return 3
  return 4
}

export default function DesktopPortfolio() {
  const reduced = useReducedMotion()
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const projectsInnerRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [selected, setSelected] = useState<Project | null>(null)

  useGSAP(
    () => {
      if (reduced) return
      const track = trackRef.current
      const pin = pinRef.current
      const inner = projectsInnerRef.current
      if (!track || !pin || !inner) return

      const panelX = (i: number) => -(i * window.innerWidth)
      const innerDist = () => {
        const viewport = inner.parentElement?.clientHeight ?? window.innerHeight
        return Math.max(0, inner.scrollHeight - viewport)
      }

      const tl = gsap.timeline({ defaults: { ease: 'none', duration: 1 } })
      tl.to(track, { x: () => panelX(1) }) //         seg0: intro → experience
        .to(track, { x: () => panelX(2) }) //         seg1: experience → projects
        .to(inner, { y: () => -innerDist() }) //      seg2: vertical sub-scroll inside projects
        .to(track, { x: () => panelX(3) }) //         seg3: projects → stack
        .to(track, { x: () => panelX(4) }) //         seg4: stack → contact

      stRef.current = ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: () => '+=' + window.innerWidth * TL_DURATION,
        pin: true,
        // Lenis already smooths the input; keep scrub tight so the track tracks
        // the wheel closely instead of lagging ~1s behind (felt sluggish).
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: self => {
          setProgress(self.progress)
          setActiveIndex(activeFromTime(self.progress * TL_DURATION))
        },
      })

      // ── Section snapping ──────────────────────────────────────────────
      // ScrollTrigger's built-in `snap` never fires here because Lenis owns
      // the scroll position (its scroll-end detection never triggers). So we
      // snap through Lenis ourselves: when the wheel/momentum settles, glide
      // to the nearest section rest point. The projects panel is a vertical
      // sub-scroll and stays free so cards can be browsed.
      const snapPoints = NAV_TIME.map(t => t / TL_DURATION) // [0, .2, .4, .8, 1]
      let snapTimer: ReturnType<typeof setTimeout> | undefined

      const scheduleSnap = () => {
        clearTimeout(snapTimer)
        snapTimer = setTimeout(() => {
          const st = stRef.current
          if (!st || !st.isActive) return
          const p = st.progress
          if (p <= 0.001 || p >= 0.999) return //                       already parked at an edge
          if (p > PROJECTS_FREE[0] && p < PROJECTS_FREE[1]) return //   browsing projects
          const targetP = snapPoints.reduce((a, b) => (Math.abs(b - p) < Math.abs(a - p) ? b : a))
          const targetScroll = st.start + targetP * (st.end - st.start)
          if (Math.abs(window.scrollY - targetScroll) < 4) return //    close enough
          scrollToY(targetScroll, 0.7)
        }, 140)
      }
      window.addEventListener('scroll', scheduleSnap, { passive: true })

      // Recompute once fonts/images settle.
      const refresh = () => ScrollTrigger.refresh()
      if (document.fonts?.ready) document.fonts.ready.then(refresh)

      return () => {
        clearTimeout(snapTimer)
        window.removeEventListener('scroll', scheduleSnap)
        stRef.current?.kill()
        stRef.current = null
      }
    },
    { dependencies: [reduced], scope: pinRef },
  )

  // Hero entrance: masked line reveal on the headline + staggered fade-ups.
  // Waits for fonts so SplitText measures correct line breaks.
  useGSAP(
    () => {
      if (reduced) return
      const h1 = heroTitleRef.current
      if (!h1) return
      let split: SplitText | undefined
      // fonts.ready is async, so this can outlive the effect (StrictMode runs
      // it twice) — the cancelled flag ensures only the live effect animates,
      // and fromTo keeps targets explicit so a re-run can't capture opacity 0.
      let cancelled = false
      const run = () => {
        if (cancelled) return
        split = new SplitText(h1, { type: 'lines', mask: 'lines' })
        gsap.from(split.lines, { yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.12 })
        gsap.fromTo(
          '[data-hero-fade]',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.09, delay: 0.35 },
        )
      }
      if (document.fonts) document.fonts.ready.then(run)
      else run()
      return () => {
        cancelled = true
        split?.revert()
      }
    },
    { dependencies: [reduced], scope: pinRef },
  )

  const navigate = (index: number) => {
    if (reduced) {
      scrollToTarget(`#panel-${index}`)
      return
    }
    const st = stRef.current
    if (!st) return
    scrollToY(st.start + (NAV_TIME[index] / TL_DURATION) * (st.end - st.start))
  }

  const panelBase = cn(
    'section-inner relative overflow-hidden',
    reduced ? 'w-full min-h-screen' : 'h-screen w-screen flex-shrink-0',
  )

  return (
    <SmoothScroll>
      <DesktopNav activeIndex={activeIndex} onNavigate={navigate} />
      <WhatsAppButton />
      <ProjectModal project={selected} projects={PROJECTS} onChange={setSelected} onClose={() => setSelected(null)} />

      {/* progress rail + counter */}
      <div className="fixed bottom-0 left-0 z-40 h-[2px] w-full bg-white/8">
        <div className="h-full bg-neon-cyan transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="fixed bottom-5 right-[clamp(20px,4%,60px)] z-40 text-[10px] font-bold tracking-[0.3em] text-white/35">
        {String(activeIndex + 1).padStart(2, '0')} / {String(DESKTOP_NAV.length).padStart(2, '0')}
      </div>

      <main className="bg-black text-white">
        <div ref={pinRef} className={cn(reduced ? 'w-full' : 'h-screen w-screen overflow-hidden')}>
          <div ref={trackRef} className={cn('flex', reduced ? 'flex-col' : 'h-screen flex-nowrap')}>
            {/* ── 0 · INTRO ── */}
            <section id="panel-0" className={cn(panelBase, 'pt-28 xl:pt-32')}>
              <HeroCanvas className="absolute inset-y-0 right-[-8%] z-0 w-[62%] opacity-80" />
              <div className={cn(SHELL, 'relative z-10 grid w-full grid-cols-[minmax(0,1fr)_minmax(340px,460px)] items-center gap-14')}>
                <HeroIntro variant="desktop" titleRef={heroTitleRef} />
                <ProjectSpotlight onOpen={setSelected} />
              </div>
            </section>

            {/* ── 1 · EXPERIENCE ── */}
            <section id="panel-1" className={cn(panelBase, 'bg-white pt-28 text-black xl:pt-32')}>
              <div className={cn(SHELL, 'w-full')}>
                <SectionHeader kicker="Journey" title="Professional" accent="Milestones" tone="light" className="mb-8" />
                <ExperienceList variant="desktop" />
              </div>
            </section>

            {/* ── 2 · PROJECTS (vertical sub-scroll) ── */}
            <section id="panel-2" className={cn(panelBase, 'flex-col !items-stretch pt-28 xl:pt-32')}>
              <div className={cn(SHELL, 'flex w-full items-end justify-between pb-6')}>
                <SectionHeader kicker="Selected Work" title="Projects" className="mb-8" />
                <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 xl:block">
                  {PROJECTS.length} builds · scroll to explore
                </p>
              </div>
              {/* viewport window that the inner list scrolls within */}
              <div className={cn('relative w-full flex-1', reduced ? '' : 'overflow-hidden')}>
                <div ref={projectsInnerRef} className={cn(SHELL, reduced && 'pb-24')}>
                  <div className="grid grid-cols-2 gap-5 2xl:grid-cols-3">
                    {PROJECTS.map(project => (
                      <ProjectCard key={project.id} project={project} onOpen={setSelected} variant="desktop" />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3 · STACK ── */}
            <section id="panel-3" className={cn(panelBase, 'bg-[#080808] pt-28 xl:pt-32')}>
              <div className={cn(SHELL, 'w-full')}>
                <SectionHeader kicker="Technology" title="Technical" accent="Arsenal" className="mb-8" />
                <SkillsGrid variant="desktop" />
              </div>
            </section>

            {/* ── 4 · CONTACT ── */}
            <section id="panel-4" className={cn(panelBase, 'pt-28 xl:pt-32')}>
              <div className={cn(SHELL, 'w-full')}>
                <SectionHeader kicker="Connect" title="Start a" accent="Conversation" className="mb-8" />
                <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] gap-6">
                  <ContactCard variant="desktop" />
                  <div className="relative flex h-fit min-w-0 flex-col justify-between gap-10 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(188,19,254,0.14),transparent_45%),rgba(255,255,255,0.03)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <div>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">Open to work</p>
                      <h3 className="break-words font-heading text-[2rem] uppercase leading-[0.95] text-white">
                        Full-stack products that feel sharp and ship fast
                      </h3>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                      Copyright {new Date().getFullYear()} {PERSONAL.name}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </SmoothScroll>
  )
}
