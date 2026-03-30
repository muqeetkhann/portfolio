'use client'

import Navbar from '@/components/Navbar'
import { EXPERIENCE, PERSONAL, PROJECTS, SKILLS } from '@/lib/data'

const WEB3_PROJECTS = PROJECTS.filter(p => p.cat.includes('web3'))
const SAAS_PROJECTS = PROJECTS.filter(p => p.cat.includes('saas') || p.cat.includes('ecom'))
const SITE_PROJECTS = PROJECTS.filter(p => p.cat.includes('site') && !p.cat.includes('web3'))

const sectionMap: Record<number, string> = {
  0: 'intro',
  1: 'experience',
  2: 'projects',
  5: 'skills',
  6: 'contact',
}

function goToSection(index: number) {
  const id = sectionMap[index]
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return

  const navOffset = 96
  const top = el.getBoundingClientRect().top + window.scrollY - navOffset
  window.scrollTo({ top, behavior: 'smooth' })
}

function ProjectCard({
  title,
  type,
  desc,
  tags,
  url,
}: {
  title: string
  type: string
  desc: string
  tags: string[]
  url?: string
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">{type}</p>
      <h3 className="mb-3 break-words font-heading text-[clamp(1.05rem,5.8vw,1.625rem)] uppercase leading-[1.02] text-white">{title}</h3>
      <p className="mb-4 text-sm leading-6 text-white/65">{desc}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.slice(0, 4).map(tag => (
          <span
            key={`${title}-${tag}`}
            className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70"
          >
            {tag}
          </span>
        ))}
      </div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-neon-cyan"
        >
          Visit project -&gt;
        </a>
      ) : null}
    </article>
  )
}

export default function ResponsivePortfolio() {
  const nameParts = PERSONAL.name.split(' ')
  const maskedName = nameParts.pop() ?? ''
  const leadingName = nameParts.join(' ')

  return (
    <main className="relative min-h-screen max-w-full overflow-x-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_10%,rgba(0,245,255,0.09),transparent_36%),radial-gradient(circle_at_82%_38%,rgba(188,19,254,0.1),transparent_38%)]" />
      <Navbar onNavigate={goToSection} />

      <section id="intro" className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-14 pt-[max(7.4rem,calc(5.5rem+env(safe-area-inset-top)))] sm:px-8 sm:pt-32 lg:px-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neon-cyan sm:tracking-[0.32em]">Available for new projects</p>
        <h1 className="break-words font-heading text-[clamp(1.55rem,7.4vw,5.25rem)] uppercase leading-[0.9] sm:text-[clamp(2.8rem,9.2vw,5.25rem)]">
          {leadingName}{' '}
          <span className="masked-text-dark">{maskedName}</span>
        </h1>
        <p className="max-w-3xl text-[15px] font-semibold uppercase tracking-[0.04em] text-neon-cyan/90 sm:text-lg sm:tracking-[0.08em]">{PERSONAL.role}</p>
        <p className="max-w-3xl text-sm leading-7 text-white/70 sm:text-base">{PERSONAL.bio}</p>
        <div className="flex max-w-full flex-wrap gap-3">
          <a
            href={PERSONAL.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-black sm:px-6 sm:text-[11px] sm:tracking-[0.2em]"
          >
            GitHub
          </a>
          <a
            href={`mailto:${PERSONAL.email}`}
            className="rounded-full border border-white/20 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white sm:px-6 sm:text-[11px] sm:tracking-[0.2em]"
          >
            Let&apos;s talk
          </a>
          <a
            href="./m_muqeet_khan_CV.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-neon-purple/50 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-neon-purple sm:px-6 sm:text-[11px] sm:tracking-[0.2em]"
          >
            Resume PDF
          </a>
        </div>
      </section>

      <section id="experience" className="bg-white py-14 text-black sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 sm:tracking-[0.32em]">Journey</p>
          <h2 className="mb-10 font-heading text-[clamp(1.35rem,6.5vw,3rem)] uppercase leading-[0.95] sm:text-[clamp(2rem,6.8vw,3rem)]">Professional <span className="masked-text-light">Milestones</span></h2>
          <div className="space-y-6">
            {EXPERIENCE.map((exp, i) => (
              <article key={`${exp.company}-${i}`} className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-heading text-[22px] uppercase leading-none sm:text-[26px]">{exp.company}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/50 sm:tracking-[0.2em]">{exp.period}</p>
                </div>
                <p className="mb-3 break-words text-[11px] font-bold uppercase tracking-[0.1em] text-neon-purple sm:tracking-[0.18em]">{exp.role}</p>
                <ul className="space-y-2">
                  {exp.bullets.slice(0, 3).map((item, bulletIndex) => (
                    <li key={`${exp.company}-${bulletIndex}`} className="text-sm leading-6 text-black/70">
                      - {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 sm:tracking-[0.32em]">Selected Work</p>
          <h2 className="font-heading text-[clamp(1.35rem,6.5vw,3rem)] uppercase leading-[0.95] sm:text-[clamp(2rem,6.8vw,3rem)]">Projects</h2>
        </div>

        <div className="space-y-5">
          <p className="font-heading text-[clamp(1.15rem,5.2vw,1.9rem)] uppercase tracking-[0.04em] text-neon-purple sm:tracking-[0.08em]">Web3 and DeFi</p>
          <div className="grid gap-4 md:grid-cols-2">
            {WEB3_PROJECTS.slice(0, 4).map(project => (
              <ProjectCard key={project.id} title={project.title} type={project.type} desc={project.desc} tags={project.tags} url={project.url} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <p className="font-heading text-[clamp(1.15rem,5.2vw,1.9rem)] uppercase tracking-[0.04em] text-neon-cyan sm:tracking-[0.08em]">SaaS and Platforms</p>
          <div className="grid gap-4 md:grid-cols-2">
            {SAAS_PROJECTS.slice(0, 4).map(project => (
              <ProjectCard key={project.id} title={project.title} type={project.type} desc={project.desc} tags={project.tags} url={project.url} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <p className="font-heading text-[clamp(1.15rem,5.2vw,1.9rem)] uppercase tracking-[0.04em] text-white/75 sm:tracking-[0.08em]">Digital Experiences</p>
          <div className="grid gap-4 md:grid-cols-2">
            {SITE_PROJECTS.slice(0, 4).map(project => (
              <ProjectCard key={project.id} title={project.title} type={project.type} desc={project.desc} tags={project.tags} url={project.url} />
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="bg-[#080808] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neon-cyan/80 sm:tracking-[0.32em]">Technology</p>
          <h2 className="mb-8 font-heading text-[clamp(1.35rem,6.5vw,3rem)] uppercase leading-[0.95] sm:text-[clamp(2rem,6.8vw,3rem)]">Technical <span className="masked-text-dark">Arsenal</span></h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SKILLS.map(set => (
              <article key={set.cat} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white">{set.cat}</h3>
                <ul className="space-y-1.5">
                  {set.items.map(item => (
                    <li key={`${set.cat}-${item}`} className="text-sm text-white/65">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 sm:tracking-[0.32em]">Connect</p>
        <h2 className="mb-8 font-heading text-[clamp(1.35rem,6.5vw,3rem)] uppercase leading-[0.95] sm:text-[clamp(2rem,6.8vw,3rem)]">
          Start a <span className="masked-text-dark">Conversation</span>
        </h2>

        <div className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-2 sm:p-7">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:tracking-[0.3em]">Email</p>
            <a href={`mailto:${PERSONAL.email}`} className="break-all font-heading text-[clamp(1rem,4.8vw,1.5rem)] uppercase leading-tight">
              {PERSONAL.email}
            </a>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:tracking-[0.3em]">Phone</p>
            <a href={`tel:${PERSONAL.phone}`} className="font-heading text-[clamp(1rem,4.8vw,1.5rem)] uppercase leading-tight">
              {PERSONAL.phone}
            </a>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:tracking-[0.3em]">LinkedIn</p>
            <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer" className="break-all text-xs text-neon-cyan sm:text-sm sm:tracking-[0.14em]">
              {PERSONAL.linkedin.replace('https://', '')}
            </a>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:tracking-[0.3em]">GitHub</p>
            <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="break-all text-xs text-neon-cyan sm:text-sm sm:tracking-[0.14em]">
              {PERSONAL.github.replace('https://', '')}
            </a>
          </div>
        </div>

        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Copyright {new Date().getFullYear()} {PERSONAL.name}</p>
      </section>
    </main>
  )
}
