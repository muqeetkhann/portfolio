'use client'

import { ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { HERO_COPY, PERSONAL } from '@/lib/data'

/** The shared introduction owns copy; the surrounding hero owns composition. */
export function HeroIntro({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="hero-intro">
      <p className="hero-identity" data-hero-reveal>
        <span>{PERSONAL.name}</span><span aria-hidden className="hero-identity-dot" /><span>{PERSONAL.role}</span>
      </p>
      <h1 className="hero-title" aria-label={HERO_COPY.lines.join(' ')}>
        {HERO_COPY.lines.map((line, index) => (
          <span className="hero-title-mask" key={line}><span className="hero-title-line" data-hero-line>
            {index === HERO_COPY.lines.length - 1 ? <>{line.slice(0, -HERO_COPY.accent.length)}<span className="text-neon-cyan">{HERO_COPY.accent}</span></> : line}
          </span></span>
        ))}
      </h1>
      <p className="hero-description" data-hero-reveal>{HERO_COPY.description}</p>
      <div className="hero-actions" data-hero-reveal>
        <MagneticButton strength={0.12}>
          <a className="primary-action" href={`mailto:${PERSONAL.email}`}>
            {HERO_COPY.contact}<span className="primary-action-icon"><ArrowUpRightIcon size={22} aria-hidden /></span>
          </a>
        </MagneticButton>
        <button type="button" className="text-action" onClick={onExplore}>
          {HERO_COPY.explore}<ArrowRightIcon size={22} aria-hidden />
        </button>
      </div>
    </div>
  )
}
