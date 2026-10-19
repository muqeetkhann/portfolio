'use client'

import { useState } from 'react'
import { PanelAmbient } from '@/components/backgrounds/PanelAmbient'
import MobileNav from '@/components/layouts/MobileNav'
import SmoothScroll from '@/components/providers/SmoothScroll'
import { ContactCard } from '@/components/sections/ContactCard'
import { EducationList } from '@/components/sections/EducationList'
import { ExperienceList } from '@/components/sections/ExperienceList'
import { HeroIntro } from '@/components/sections/HeroIntro'
import { SkillsGrid } from '@/components/sections/SkillsGrid'
import { ProjectCard } from '@/components/shared/ProjectCard'
import { ProjectModal } from '@/components/shared/ProjectModal'
import ProjectSpotlight from '@/components/shared/ProjectSpotlight'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeader } from '@/components/shared/SectionHeader'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { PERSONAL, PROJECTS, type Project } from '@/lib/data'

export default function MobilePortfolio() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <SmoothScroll>
      <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
        <MobileNav />
        <WhatsAppButton />
        <ProjectModal project={selected} projects={PROJECTS} onChange={setSelected} onClose={() => setSelected(null)} />

        <section
          id="intro"
          className="section-shell relative grid min-h-screen items-start gap-10 pb-16 pt-[max(6rem,calc(4.5rem+env(safe-area-inset-top)))] sm:gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
        >
          <PanelAmbient panel="intro" />
          <HeroIntro />
          <ProjectSpotlight onOpen={setSelected} className="mx-auto w-full max-w-[30rem] lg:mx-0" />
        </section>

        <section id="experience" className="relative overflow-hidden bg-white py-16 text-black sm:py-20">
          <PanelAmbient panel="experience" />
          <div className="section-shell relative z-10">
            <Reveal>
              <SectionHeader kicker="Journey" title="Professional" accent="Milestones" tone="light" />
            </Reveal>
            <ExperienceList />
            <EducationList />
          </div>
        </section>

        <section id="projects" className="relative overflow-hidden py-16 sm:py-20">
          <PanelAmbient panel="projects" />
          <div className="section-shell relative z-10">
            <Reveal>
              <SectionHeader kicker="Selected Work" title="Projects" />
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

        <section id="stack" className="relative overflow-hidden bg-[#080808] py-16 sm:py-20">
          <PanelAmbient panel="stack" />
          <div className="section-shell relative z-10">
            <Reveal>
              <SectionHeader kicker="Technology" title="Technical" accent="Arsenal" />
            </Reveal>
            <SkillsGrid />
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden py-16 sm:py-20">
          <PanelAmbient panel="contact" />
          <div className="section-shell relative z-10">
            <Reveal>
              <SectionHeader kicker="Connect" title="Start a" accent="Conversation" />
            </Reveal>
            <ContactCard />
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Copyright {new Date().getFullYear()} {PERSONAL.name}
            </p>
          </div>
        </section>
      </main>
    </SmoothScroll>
  )
}
