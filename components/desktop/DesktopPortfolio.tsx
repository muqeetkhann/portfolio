'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { EXPERIENCE, PERSONAL, SKILLS, projectGroups } from '@/lib/data'
import { ProjectCard } from '@/components/shared/ProjectCard'
import { SectionHeader } from '@/components/shared/SectionHeader'
import DeveloperSnapshot from '@/components/portfolio/DeveloperSnapshot'

const TOTAL_SECTIONS = 6

function DesktopNav({ activeIndex, onNavigate }: { activeIndex: number; onNavigate: (index: number) => void }) {
  const links = [
    { label: 'Intro', index: 0 },
    { label: 'Experience', index: 1 },
    { label: 'Projects', index: 2 },
    { label: 'Stack', index: 4 },
    { label: 'Contact', index: 5 },
  ]

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
            {links.map(link => (
              <button
                key={link.label}
                type="button"
                onClick={() => onNavigate(link.index)}
                className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition ${activeIndex === link.index || (link.label === 'Projects' && (activeIndex === 2 || activeIndex === 3)) ? 'bg-white text-black' : 'text-white/65 hover:text-white'}`}
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

function ProjectCardAnimated({
  project,
  index,
  isActive,
}: {
  project: { id: number; title: string; type: string; desc: string; tags: string[]; url?: string }
  index: number
  isActive: boolean
}) {
  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: isActive ? `${index * 80}ms` : '0ms',
      }}
    >
      <ProjectCard
        title={project.title}
        type={project.type}
        desc={project.desc}
        tags={project.tags}
        url={project.url}
        variant="desktop"
      />
    </div>
  )
}

export default function DesktopPortfolio() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isScrolling = useRef(false)
  const lastWheelTime = useRef(0)
  const nameParts = useMemo(() => PERSONAL.name.split(' '), [])
  const lastName = nameParts[nameParts.length - 1] ?? ''
  const firstNames = nameParts.slice(0, -1).join(' ')
  const desktopShell = 'mx-auto w-full max-w-[92rem] px-8 2xl:max-w-[100rem] 2xl:px-10'

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    track.scrollTo({
      left: activeIndex * window.innerWidth,
      behavior: 'smooth',
    })
  }, [activeIndex])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const unlock = () => {
      window.setTimeout(() => {
        isScrolling.current = false
      }, 700)
    }

    const moveTo = (index: number, now: number) => {
      isScrolling.current = true
      lastWheelTime.current = now
      setActiveIndex(index)
      unlock()
    }

    const handleWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('a, button')) return

      event.preventDefault()
      const now = Date.now()
      if (now - lastWheelTime.current < 700 || isScrolling.current) return

      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX
      if (Math.abs(delta) < 20) return

      if (delta > 0 && activeIndex < TOTAL_SECTIONS - 1) moveTo(activeIndex + 1, now)
      if (delta < 0 && activeIndex > 0) moveTo(activeIndex - 1, now)
    }

    let touchStartY = 0
    let touchStartX = 0

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0].clientY
      touchStartX = event.touches[0].clientX
    }

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault()
      const now = Date.now()
      if (now - lastWheelTime.current < 700 || isScrolling.current) return

      const deltaY = touchStartY - event.touches[0].clientY
      const deltaX = touchStartX - event.touches[0].clientX
      const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY
      if (Math.abs(delta) < 40) return

      if (delta > 0 && activeIndex < TOTAL_SECTIONS - 1) moveTo(activeIndex + 1, now)
      if (delta < 0 && activeIndex > 0) moveTo(activeIndex - 1, now)
    }

    const handleResize = () => {
      track.scrollTo({ left: activeIndex * window.innerWidth, behavior: 'auto' })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [activeIndex])

  return (
    <main className="fixed inset-0 overflow-hidden bg-black text-white">
      <DesktopNav activeIndex={activeIndex} onNavigate={setActiveIndex} />
      <WhatsAppButton />

      <div className="fixed bottom-0 left-0 z-40 h-[2px] w-full bg-white/8">
        <div
          className="h-full bg-neon-cyan transition-[width] duration-500"
          style={{ width: `${(activeIndex / (TOTAL_SECTIONS - 1)) * 100}%` }}
        />
      </div>

      <div className="fixed bottom-5 right-[clamp(20px,4%,60px)] z-40 text-[10px] font-bold tracking-[0.3em] text-white/35">
        {String(activeIndex + 1).padStart(2, '0')} / {String(TOTAL_SECTIONS).padStart(2, '0')}
      </div>

      <div ref={trackRef} className="absolute inset-0 flex overflow-hidden">
        {/* ── 0 · INTRO ── */}
        <section className="section-inner w-[100dvw] flex-shrink-0 pt-28 xl:pt-32">
          <div className={`${desktopShell} grid w-full grid-cols-[minmax(0,1fr)_minmax(300px,440px)] items-center gap-14`}>
            <div className="relative min-w-0 max-w-4xl">
              <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-neon-cyan/10 blur-3xl" />
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-neon-cyan">Available for new projects</p>
              <h1 className="font-heading text-[clamp(3.4rem,7vw,6.2rem)] uppercase leading-[0.88] tracking-[-0.05em]">
                {firstNames} <span className="masked-text-dark">{lastName}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[17px] font-semibold uppercase tracking-[0.08em] text-neon-cyan/85">{PERSONAL.role}</p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">{PERSONAL.bio}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-neon-cyan">
                  GitHub
                </a>
                <a href={`mailto:${PERSONAL.email}`} className="rounded-full border border-white/15 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:border-neon-cyan hover:text-neon-cyan">
                  Let&apos;s talk
                </a>
                <a href="./m_muqeet_khan_CV.pdf" target="_blank" rel="noreferrer" className="rounded-full border border-neon-purple/40 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neon-purple transition hover:bg-neon-purple/10">
                  Resume PDF
                </a>
              </div>
            </div>

            <DeveloperSnapshot />
          </div>
        </section>

        {/* ── 1 · EXPERIENCE ── */}
        <section className="section-inner w-[100dvw] flex-shrink-0 bg-white pt-28 text-black xl:pt-32">
          <div className={`${desktopShell} w-full`}>
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

        {/* ── 2 · PROJECTS PAGE 1 ── */}
        <section className="section-inner w-[100dvw] flex-shrink-0 pt-28 xl:pt-32">
          <div className={`${desktopShell} flex w-full flex-col`}>
            <SectionHeader kicker="Selected Work" title="Projects" variant="desktop" />

            <div className="mb-5 flex items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Page 1 / 2</p>
              <div className="flex gap-1.5">
                <span className="h-1 w-6 rounded-full bg-neon-cyan" />
                <span className="h-1 w-6 rounded-full bg-white/15" />
              </div>
            </div>

            {/* flat 3-col grid: category headers row + 2 card rows */}
            <div className="grid grid-cols-3 gap-x-5 gap-y-4">
              <p className="font-heading text-[1.2rem] uppercase tracking-[0.08em] text-neon-purple">Web3 & DeFi</p>
              <p className="font-heading text-[1.2rem] uppercase tracking-[0.08em] text-neon-cyan">SaaS & Platforms</p>
              <p className="font-heading text-[1.2rem] uppercase tracking-[0.08em] text-white/75">Digital Experiences</p>
              {[0, 1].map(row => [
                projectGroups.web3[row],
                projectGroups.saas[row],
                projectGroups.sites[row],
              ].map((project, col) =>
                project ? (
                  <ProjectCardAnimated key={project.id} project={project} index={row * 3 + col} isActive={activeIndex === 2} />
                ) : <div key={`empty-p1-${row}-${col}`} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 3 · PROJECTS PAGE 2 ── */}
        <section className="section-inner w-[100dvw] flex-shrink-0 pt-28 xl:pt-32">
          <div className={`${desktopShell} flex w-full flex-col`}>
            <SectionHeader kicker="Selected Work" title="Projects" variant="desktop" />

            <div className="mb-5 flex items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Page 2 / 2</p>
              <div className="flex gap-1.5">
                <span className="h-1 w-6 rounded-full bg-white/15" />
                <span className="h-1 w-6 rounded-full bg-neon-cyan" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-5 gap-y-4">
              <p className="font-heading text-[1.2rem] uppercase tracking-[0.08em] text-neon-purple">Web3 & DeFi</p>
              <p className="font-heading text-[1.2rem] uppercase tracking-[0.08em] text-neon-cyan">SaaS & Platforms</p>
              <p className="font-heading text-[1.2rem] uppercase tracking-[0.08em] text-white/75">Digital Experiences</p>
              {[0, 1].map(row => [
                projectGroups.web3[row + 2],
                projectGroups.saas[row + 2],
                projectGroups.sites[row + 2],
              ].map((project, col) =>
                project ? (
                  <ProjectCardAnimated key={project.id} project={project} index={row * 3 + col} isActive={activeIndex === 3} />
                ) : <div key={`empty-p2-${row}-${col}`} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 4 · SKILLS (2-row, 4-col grid) ── */}
        <section className="section-inner w-[100dvw] flex-shrink-0 bg-[#080808] pt-28 xl:pt-32">
          <div className={`${desktopShell} w-full`}>
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

        {/* ── 5 · CONTACT ── */}
        <section className="section-inner w-[100dvw] flex-shrink-0 pt-28 xl:pt-32">
          <div className={`${desktopShell} w-full`}>
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
                  <h3 className="break-words font-heading text-[2rem] uppercase leading-[0.95] text-white">Frontend systems that feel sharp and ship fast</h3>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Copyright {new Date().getFullYear()} {PERSONAL.name}
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
