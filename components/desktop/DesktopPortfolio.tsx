'use client'

import { useMemo, useRef, useState } from 'react'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { EXPERIENCE, HERO_DOMAINS, PERSONAL, PROJECTS, SKILLS, type Project } from '@/lib/data'
import dynamic from 'next/dynamic'
import { ProjectCard } from '@/components/shared/ProjectCard'

// Motion (framer) lives only in this lazy chunk — keeps the main bundle lean.
const ProjectDetail = dynamic(
  () => import('@/components/shared/ProjectDetail').then(m => m.ProjectDetail),
  { ssr: false },
)
import { SectionHeader } from '@/components/shared/SectionHeader'
import ProjectSpotlight from '@/components/portfolio/ProjectSpotlight'
import SmoothScroll, { scrollToTarget } from '@/components/providers/SmoothScroll'
import HeroCanvas from '@/components/three/HeroCanvas'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Intro', index: 0 },
  { label: 'Experience', index: 1 },
  { label: 'Projects', index: 2 },
  { label: 'Stack', index: 3 },
  { label: 'Contact', index: 4 },
]
const TOTAL_SECTIONS = NAV.length

// Timeline time (out of tl.duration()) at which each panel is settled in view.
// Segments (duration 1 each): 0 intro→exp, 1 exp→proj, 2 proj-vertical, 3 proj→stack, 4 stack→contact.
const NAV_TIME = [0, 1, 2, 4, 5]
const TL_DURATION = 5

function activeFromTime(t: number) {
  if (t < 0.5) return 0
  if (t < 1.5) return 1
  if (t < 3.5) return 2
  if (t < 4.5) return 3
  return 4
}

function DesktopNav({ activeIndex, onNavigate }: { activeIndex: number; onNavigate: (index: number) => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="section-shell pb-5 pt-[max(1rem,env(safe-area-inset-top))] xl:pt-6">
        <div
          className="flex items-center justify-between rounded-full border border-white/14 px-5 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)' }}
        >
          <span className="text-[12px] font-bold uppercase tracking-[0.24em] text-white">
            {PERSONAL.initials} // Portfolio
          </span>
          <nav className="flex items-center gap-2">
            {NAV.map(link => (
              <button
                key={link.label}
                type="button"
                onClick={() => onNavigate(link.index)}
                className={cn(
                  'rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition',
                  activeIndex === link.index ? 'bg-white text-black' : 'text-white/65 hover:text-white',
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
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

  const nameParts = useMemo(() => PERSONAL.name.split(' '), [])
  const lastName = nameParts[nameParts.length - 1] ?? ''
  const firstNames = nameParts.slice(0, -1).join(' ')
  const desktopShell = 'mx-auto w-full max-w-[92rem] px-8 2xl:max-w-[100rem] 2xl:px-10'

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
        .to(inner, { y: () => -innerDist() }) //       seg2: vertical sub-scroll inside projects
        .to(track, { x: () => panelX(3) }) //          seg3: projects → stack
        .to(track, { x: () => panelX(4) }) //          seg4: stack → contact

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
      // to the nearest section rest point. The projects panel (progress
      // 0.4–0.6) is a vertical sub-scroll and stays free so cards can browse.
      const snapPoints = NAV_TIME.map(t => t / TL_DURATION) // [0, .2, .4, .8, 1]
      const projectsFreeStart = 2 / TL_DURATION // 0.4
      const projectsFreeEnd = 3 / TL_DURATION //   0.6
      let snapTimer: ReturnType<typeof setTimeout> | undefined

      const scheduleSnap = () => {
        clearTimeout(snapTimer)
        snapTimer = setTimeout(() => {
          const st = stRef.current
          if (!st || !st.isActive) return
          const p = st.progress
          if (p <= 0.001 || p >= 0.999) return //           already parked at an edge
          if (p > projectsFreeStart && p < projectsFreeEnd) return // browsing projects
          const targetP = snapPoints.reduce((a, b) => (Math.abs(b - p) < Math.abs(a - p) ? b : a))
          const targetScroll = st.start + targetP * (st.end - st.start)
          if (Math.abs(window.scrollY - targetScroll) < 4) return // close enough
          // @ts-expect-error — Lenis set by SmoothScroll
          const lenis = window.__lenis
          if (lenis) lenis.scrollTo(targetScroll, { duration: 0.7 })
          else window.scrollTo({ top: targetScroll, behavior: 'smooth' })
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

  const navigate = (i: number) => {
    if (reduced) {
      scrollToTarget(`#panel-${i}`)
      return
    }
    const st = stRef.current
    if (!st) return
    const target = st.start + (NAV_TIME[i] / TL_DURATION) * (st.end - st.start)
    // @ts-expect-error — Lenis set by SmoothScroll
    const lenis = window.__lenis
    if (lenis) lenis.scrollTo(target)
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const panelBase = cn('section-inner relative overflow-hidden', reduced ? 'w-full min-h-screen' : 'h-screen w-screen flex-shrink-0')

  return (
    <SmoothScroll>
      <DesktopNav activeIndex={activeIndex} onNavigate={navigate} />
      <WhatsAppButton />
      <ProjectDetail project={selected} projects={PROJECTS} onChange={setSelected} onClose={() => setSelected(null)} />

      {/* progress rail + counter */}
      <div className="fixed bottom-0 left-0 z-40 h-[2px] w-full bg-white/8">
        <div className="h-full bg-neon-cyan transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="fixed bottom-5 right-[clamp(20px,4%,60px)] z-40 text-[10px] font-bold tracking-[0.3em] text-white/35">
        {String(activeIndex + 1).padStart(2, '0')} / {String(TOTAL_SECTIONS).padStart(2, '0')}
      </div>

      <main className="bg-black text-white">
        <div ref={pinRef} className={cn(reduced ? 'w-full' : 'h-screen w-screen overflow-hidden')}>
          <div ref={trackRef} className={cn('flex', reduced ? 'flex-col' : 'h-screen flex-nowrap')}>
            {/* ── 0 · INTRO ── */}
            <section id="panel-0" className={cn(panelBase, 'pt-28 xl:pt-32')}>
              <HeroCanvas className="absolute inset-y-0 right-[-8%] z-0 w-[62%] opacity-80" />
              <div className={cn(desktopShell, 'relative z-10 grid w-full grid-cols-[minmax(0,1fr)_minmax(340px,460px)] items-center gap-14')}>
                <div className="relative min-w-0 max-w-4xl">
                  <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-neon-cyan/10 blur-3xl" />

                  {/* meta row: status + location */}
                  <div data-hero-fade className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.24em]">
                    <span className="inline-flex items-center gap-2 text-neon-cyan">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan/70" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
                      </span>
                      Available for new projects
                    </span>
                    <span className="text-white/35">{PERSONAL.location}</span>
                  </div>

                  <h1 ref={heroTitleRef} className="font-heading text-[clamp(3.4rem,7vw,6.4rem)] uppercase leading-[0.86] tracking-[-0.05em]">
                    {firstNames} <span className="masked-text-dark">{lastName}</span>
                  </h1>
                  <div data-hero-fade className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                    <p className="text-[17px] font-semibold uppercase tracking-[0.1em] text-neon-cyan/90">{PERSONAL.role}</p>
                    <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
                    <ul className="flex flex-wrap gap-2">
                      {HERO_DOMAINS.map(domain => (
                        <li key={domain} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
                          {domain}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p data-hero-fade className="mt-6 max-w-2xl text-base leading-8 text-white/70">{PERSONAL.bio}</p>
                  <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
                    <MagneticButton>
                      <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-neon-cyan">
                        GitHub
                      </a>
                    </MagneticButton>
                    <MagneticButton>
                      <a href={`mailto:${PERSONAL.email}`} className="inline-block rounded-full border border-white/15 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:border-neon-cyan hover:text-neon-cyan">
                        Let&apos;s talk
                      </a>
                    </MagneticButton>
                    <MagneticButton>
                      <a href="./m_muqeet_khan_CV.pdf" target="_blank" rel="noreferrer" className="inline-block rounded-full border border-neon-purple/40 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neon-purple transition hover:bg-neon-purple/10">
                        Resume PDF
                      </a>
                    </MagneticButton>
                  </div>
                </div>
                <ProjectSpotlight onOpen={setSelected} />
              </div>
            </section>

            {/* ── 1 · EXPERIENCE ── */}
            <section id="panel-1" className={cn(panelBase, 'bg-white pt-28 text-black xl:pt-32')}>
              <div className={cn(desktopShell, 'w-full')}>
                <div className="mb-8">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">Journey</p>
                  <h2 className="section-title text-black">Professional <span className="masked-text-light">Milestones</span></h2>
                </div>
                <div className="grid gap-5 xl:grid-cols-2">
                  {EXPERIENCE.map((item, index) => (
                    <article key={`${item.company}-${index}`} className="h-full rounded-[28px] border border-black/10 bg-black/[0.03] p-6">
                      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                        <h3 className="font-heading text-[1.8rem] uppercase leading-none">{item.company}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">{item.period}</p>
                      </div>
                      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-neon-purple">{item.role}</p>
                      <ul className="space-y-2.5">
                        {item.bullets.slice(0, 4).map(bullet => (
                          <li key={bullet} className="text-sm leading-6 text-black/70">{bullet}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 2 · PROJECTS (vertical sub-scroll) ── */}
            <section id="panel-2" className={cn(panelBase, 'flex-col !items-stretch pt-28 xl:pt-32')}>
              <div className={cn(desktopShell, 'flex w-full items-end justify-between pb-6')}>
                <SectionHeader kicker="Selected Work" title="Projects" variant="desktop" />
                <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 xl:block">
                  {PROJECTS.length} builds · scroll to explore
                </p>
              </div>
              {/* viewport window that the inner list scrolls within */}
              <div className={cn('relative w-full flex-1', reduced ? '' : 'overflow-hidden')}>
                <div ref={projectsInnerRef} className={cn(desktopShell, reduced ? 'pb-24' : '')}>
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
              <div className={cn(desktopShell, 'w-full')}>
                <SectionHeader kicker="Technology" title="Technical" accent="Arsenal" variant="desktop" />
                <div className="grid grid-cols-4 gap-4">
                  {SKILLS.map(skill => (
                    <article key={skill.cat} className="panel h-full p-5">
                      <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white">{skill.cat}</h3>
                      <ul className="space-y-2 text-sm text-white/65">
                        {skill.items.map(item => (
                          <li key={`${skill.cat}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 4 · CONTACT ── */}
            <section id="panel-4" className={cn(panelBase, 'pt-28 xl:pt-32')}>
              <div className={cn(desktopShell, 'w-full')}>
                <SectionHeader kicker="Connect" title="Start a" accent="Conversation" variant="desktop" />
                <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] gap-6">
                  <div className="panel grid h-fit min-w-0 gap-6 p-8">
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Email</p>
                      <a href={`mailto:${PERSONAL.email}`} className="break-all font-heading text-[1.9rem] uppercase leading-tight transition hover:text-neon-cyan">
                        {PERSONAL.email}
                      </a>
                    </div>
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Phone</p>
                      <a href={`tel:${PERSONAL.phone}`} className="font-heading text-[1.9rem] uppercase leading-tight transition hover:text-neon-cyan">
                        {PERSONAL.phone}
                      </a>
                    </div>
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">LinkedIn</p>
                      <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer" className="text-base text-neon-cyan transition hover:text-white">
                        {PERSONAL.linkedin.replace('https://', '')}
                      </a>
                    </div>
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">GitHub</p>
                      <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="text-base text-neon-cyan transition hover:text-white">
                        {PERSONAL.github.replace('https://', '')}
                      </a>
                    </div>
                  </div>
                  <div className="relative flex h-fit min-w-0 flex-col justify-between gap-10 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(188,19,254,0.14),transparent_45%),rgba(255,255,255,0.03)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <div>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">Open to work</p>
                      <h3 className="break-words font-heading text-[2rem] uppercase leading-[0.95] text-white">Full-stack products that feel sharp and ship fast</h3>
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
