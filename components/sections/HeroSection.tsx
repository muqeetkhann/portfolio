'use client'

import { useRef, useState } from 'react'
import { ArrowUpRightIcon, BrowserIcon, DeviceMobileIcon, GraphIcon, MapPinIcon } from '@phosphor-icons/react'
import { HeroIntro } from '@/components/sections/HeroIntro'
import ProjectSpotlight from '@/components/shared/ProjectSpotlight'
import { EXPERTISE, HERO_COPY, PERSONAL, PROJECTS, type Project } from '@/lib/data'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefersReducedMotion, useReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'

const ICONS = { web: BrowserIcon, mobile: DeviceMobileIcon, automation: GraphIcon }

/** One service-led hero, composed for both the horizontal and vertical shells. */
export function HeroSection({
  onExplore,
  onOpen,
  variant = 'mobile',
  active,
  previewPaused = false,
}: {
  onExplore: () => void
  onOpen: (project: Project) => void
  variant?: 'desktop' | 'mobile'
  active?: boolean
  previewPaused?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState<string>(EXPERTISE[0].id)
  const [preview, setPreview] = useState<string>(EXPERTISE[0].project)

  useGSAP(() => {
    if (reduced || prefersReducedMotion()) return
    gsap.fromTo('[data-hero-line]', { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.075, ease: 'power3.out', clearProps: 'transform,opacity',
    })
    gsap.fromTo('[data-hero-reveal]', { opacity: 0, y: 14 }, {
      opacity: 1, y: 0, duration: 0.65, delay: 0.18, stagger: 0.07, ease: 'power2.out', clearProps: 'transform,opacity',
    })
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true })

  const select = (item: typeof EXPERTISE[number]) => {
    setSelected(item.id)
    setPreview(item.project)
  }

  return (
    <div ref={root} className={cn('site-container hero-section', variant === 'desktop' && 'hero-section-desktop')}>
      <div className="hero-layout">
        <div className="hero-left">
          <HeroIntro onExplore={onExplore} />
          <div className="hero-recent" data-hero-reveal>
            <ProjectSpotlight initialSlug={EXPERTISE[0].project} projectSlug={preview} onOpen={onOpen} active={active} suspended={previewPaused} />
          </div>
        </div>
        <div className="expertise" data-hero-reveal>
          <h2 className="sr-only">{HERO_COPY.expertise}</h2>
          <ul className="expertise-list">
            {EXPERTISE.map((item, index) => {
              const Icon = ICONS[item.icon]
              const project = PROJECTS.find(project => project.slug === item.project)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={cn('expertise-item', selected === item.id && 'is-active')}
                    onPointerEnter={event => { if (event.pointerType === 'mouse') select(item) }}
                    onFocus={() => select(item)}
                    onClick={() => { select(item); if (project) onOpen(project) }}
                    aria-label={`${item.title} · ${HERO_COPY.previewLabel}: ${project?.title ?? item.title}`}
                  >
                    <Icon className="expertise-icon" weight="light" aria-hidden />
                    <span className="expertise-copy">
                      <span className="expertise-index" aria-hidden>{String(index + 1).padStart(2, '0')}</span>
                      <span className="expertise-title">{item.title}</span>
                      <span className="expertise-description">{item.description}</span>
                    </span>
                    <ArrowUpRightIcon className="expertise-arrow" weight="light" aria-hidden />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="hero-status" data-hero-reveal>
        <span className="availability"><span aria-hidden />{PERSONAL.availability}</span>
        <span className="hero-location"><MapPinIcon size={17} aria-hidden />{PERSONAL.location}</span>
      </div>
    </div>
  )
}
