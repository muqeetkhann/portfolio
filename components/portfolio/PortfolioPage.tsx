import type { ReactNode } from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import DeveloperSnapshot from '@/components/portfolio/DeveloperSnapshot'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { EXPERIENCE, PERSONAL, PROJECTS, SKILLS, projectGroups } from '@/lib/data'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { ProjectCard } from '@/components/shared/ProjectCard'



export default function PortfolioPage() {
  const nameParts = PERSONAL.name.split(' ')
  const lastName = nameParts.pop() ?? ''
  const firstNames = nameParts.join(' ')

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <SiteHeader />
      <WhatsAppButton />

      <section id="intro" className="section-shell grid min-h-screen items-center gap-14 pb-16 pt-[max(7rem,calc(5rem+env(safe-area-inset-top)))] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        <div className="relative max-w-3xl">
          <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-neon-cyan/10 blur-3xl sm:block" />
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-neon-cyan">Available for new projects</p>
          <h1 className="font-heading text-[clamp(2.2rem,9vw,6rem)] uppercase leading-[0.88] tracking-[-0.05em]">
            {firstNames} <span className="masked-text-dark">{lastName}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] font-semibold uppercase tracking-[0.08em] text-neon-cyan/85 sm:text-lg">{PERSONAL.role}</p>
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

        <DeveloperSnapshot />
      </section>

      <section id="experience" className="bg-white py-16 text-black sm:py-20">
        <div className="section-shell">
          <SectionHeader kicker="Journey" title={<>Professional</>} accent={<span className="masked-text-light">Milestones</span>} />

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
          <SectionHeader kicker="Selected Work" title={<>Projects</>} />

          <div className="space-y-14">
            <div>
              <p className="mb-5 font-heading text-[clamp(1.1rem,3.4vw,1.75rem)] uppercase tracking-[0.08em] text-neon-purple">Web3 and DeFi</p>
              <div className="grid gap-4 md:grid-cols-2">
                {projectGroups.web3.map(project => (
                  <ProjectCard key={project.id} title={project.title} type={project.type} desc={project.desc} tags={project.tags} url={project.url} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-5 font-heading text-[clamp(1.1rem,3.4vw,1.75rem)] uppercase tracking-[0.08em] text-neon-cyan">SaaS and Platforms</p>
              <div className="grid gap-4 md:grid-cols-2">
                {projectGroups.saas.map(project => (
                  <ProjectCard key={project.id} title={project.title} type={project.type} desc={project.desc} tags={project.tags} url={project.url} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-5 font-heading text-[clamp(1.1rem,3.4vw,1.75rem)] uppercase tracking-[0.08em] text-white/75">Digital Experiences</p>
              <div className="grid gap-4 md:grid-cols-2">
                {projectGroups.sites.map(project => (
                  <ProjectCard key={project.id} title={project.title} type={project.type} desc={project.desc} tags={project.tags} url={project.url} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stack" className="bg-[#080808] py-16 sm:py-20">
        <div className="section-shell">
          <SectionHeader kicker="Technology" title={<>Technical</>} accent={<span className="masked-text-dark">Arsenal</span>} />

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
          <SectionHeader kicker="Connect" title={<>Start a</>} accent={<span className="masked-text-dark">Conversation</span>} />

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
  )
}
