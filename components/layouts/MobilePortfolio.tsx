'use client'

import { useState } from 'react'
import MobileNav from '@/components/layouts/MobileNav'
import SmoothScroll, { scrollToTarget } from '@/components/providers/SmoothScroll'
import { BackgroundSection } from '@/components/sections/BackgroundSection'
import { ContactCard } from '@/components/sections/ContactCard'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { ProjectModal } from '@/components/shared/ProjectModal'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SiteFooter } from '@/components/shared/SiteFooter'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { PROJECTS, UI_COPY, type Project } from '@/lib/data'

export default function MobilePortfolio() {
  const [selected, setSelected] = useState<Project | null>(null)
  return (
    <SmoothScroll>
      <MobileNav /><WhatsAppButton />
      <ProjectModal project={selected} projects={PROJECTS} onChange={setSelected} onClose={() => setSelected(null)} />
      <main id="main-content" tabIndex={-1}>
        <section id="intro" className="mobile-hero"><HeroSection previewPaused={!!selected} onExplore={() => scrollToTarget('#projects', -100)} onOpen={setSelected} /></section>
        <section id="projects" className="mobile-section"><div className="site-container"><SectionHeader {...UI_COPY.sections.projects} /><ProjectGrid onOpen={setSelected} /></div></section>
        <section id="background" className="mobile-section"><BackgroundSection /></section>
        <section id="contact" className="mobile-section"><div className="site-container"><SectionHeader {...UI_COPY.sections.contact} /><Reveal><ContactCard /></Reveal><SiteFooter onIntro={() => scrollToTarget('#intro')} /></div></section>
      </main>
    </SmoothScroll>
  )
}
