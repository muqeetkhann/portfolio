'use client'

import { useState } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import ProjectSpotlight from '@/components/portfolio/ProjectSpotlight'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import SmoothScroll from '@/components/providers/SmoothScroll'
import { EXPERIENCE, HERO_DOMAINS, PERSONAL, PROJECTS, SKILLS, type Project } from '@/lib/data'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Reveal } from '@/components/shared/Reveal'
import dynamic from 'next/dynamic'
import { ProjectCard } from '@/components/shared/ProjectCard'

// Motion (framer) lives only in this lazy chunk — keeps the main bundle lean.
const ProjectDetail = dynamic(
  () => import('@/components/shared/ProjectDetail').then(m => m.ProjectDetail),
  { ssr: false },
)

export default function PortfolioPage() {
  const nameParts = PERSONAL.name.split(' ')
  const lastName = nameParts.pop() ?? ''
  const firstNames = nameParts.join(' ')
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <SmoothScroll>
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <SiteHeader />
      <WhatsAppButton />
      <ProjectDetail project={selected} projects={PROJECTS} onChange={setSelected} onClose={() => setSelected(null)} />

      <section id="intro" className="section-shell grid min-h-screen items-start gap-10 pb-16 pt-[max(6rem,calc(4.5rem+env(safe-area-inset-top)))] sm:gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="relative max-w-3xl">
          <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-neon-cyan/10 blur-3xl sm:block" />

          {/* meta row: status + location */}
          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.24em]">
            <span className="inline-flex items-center gap-2 text-neon-cyan">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
              </span>
              Available for new projects
            </span>
            <span className="text-white/35">{PERSONAL.location}</span>
          </div>

          <h1 className="font-heading text-[clamp(2.2rem,9vw,6rem)] uppercase leading-[0.86] tracking-[-0.05em]">
            {firstNames} <span className="masked-text-dark">{lastName}</span>
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="text-[15px] font-semibold uppercase tracking-[0.1em] text-neon-cyan/90 sm:text-lg">{PERSONAL.role}</p>
            <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
            <ul className="flex flex-wrap gap-2">
              {HERO_DOMAINS.map(domain => (
                <li key={domain} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
                  {domain}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">{PERSONAL.bio}</p>

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

        <ProjectSpotlight onOpen={setSelected} className="mx-auto w-full max-w-[30rem] lg:mx-0" />
      </section>

      <section id="experience" className="bg-white py-16 text-black sm:py-20">
        <div className="section-shell">
          <Reveal>
            <SectionHeader kicker="Journey" title={<>Professional</>} accent={<span className="masked-text-light">Milestones</span>} />
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-2">
            {EXPERIENCE.map((item, index) => (
              <article key={`${item.company}-${index}`} className="rounded-[28px] border border-black/10 bg-black/[0.03] p-6 sm:p-7">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-heading text-[1.55rem] uppercase leading-none sm:text-[1.8rem]">{item.company}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">{item.period}</p>
                </div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-neon-purple">{item.role}</p>
                <ul className="space-y-2.5">
                  {item.bullets.slice(0, 4).map(bullet => (
                    <li key={bullet} className="text-sm leading-6 text-black/70">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 sm:py-20">
        <div className="section-shell">
          <Reveal>
            <SectionHeader kicker="Selected Work" title={<>Projects</>} />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {PROJECTS.map((project, index) => (
              <Reveal key={project.id} delay={(index % 2) * 0.08}>
                <ProjectCard project={project} onOpen={setSelected} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="stack" className="bg-[#080808] py-16 sm:py-20">
        <div className="section-shell">
          <Reveal>
            <SectionHeader kicker="Technology" title={<>Technical</>} accent={<span className="masked-text-dark">Arsenal</span>} />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SKILLS.map(skill => (
              <article key={skill.cat} className="panel p-5 sm:p-6">
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

      <section id="contact" className="py-16 sm:py-20">
        <div className="section-shell">
          <Reveal>
            <SectionHeader kicker="Connect" title={<>Start a</>} accent={<span className="masked-text-dark">Conversation</span>} />
          </Reveal>

          <div className="panel grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Email</p>
              <a href={`mailto:${PERSONAL.email}`} className="break-all font-heading text-[clamp(1rem,4vw,1.55rem)] uppercase leading-tight transition hover:text-neon-cyan">
                {PERSONAL.email}
              </a>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Phone</p>
              <a href={`tel:${PERSONAL.phone}`} className="font-heading text-[clamp(1rem,4vw,1.55rem)] uppercase leading-tight transition hover:text-neon-cyan">
                {PERSONAL.phone}
              </a>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">LinkedIn</p>
              <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer" className="break-all text-sm text-neon-cyan transition hover:text-white">
                {PERSONAL.linkedin.replace('https://', '')}
              </a>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">GitHub</p>
              <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="break-all text-sm text-neon-cyan transition hover:text-white">
                {PERSONAL.github.replace('https://', '')}
              </a>
            </div>
          </div>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
            Copyright {new Date().getFullYear()} {PERSONAL.name}
          </p>
        </div>
      </section>
    </main>
    </SmoothScroll>
  )
}
