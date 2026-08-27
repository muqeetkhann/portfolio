'use client'

import type { RefObject } from 'react'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { HERO_DOMAINS, PERSONAL } from '@/lib/data'
import { cn } from '@/lib/utils'

const NAME_PARTS = PERSONAL.name.split(' ')
const LAST_NAME = NAME_PARTS[NAME_PARTS.length - 1] ?? ''
const FIRST_NAMES = NAME_PARTS.slice(0, -1).join(' ')

const CTAS = [
  { label: 'GitHub', href: PERSONAL.github, external: true, tone: 'bg-white text-black hover:bg-neon-cyan' },
  { label: "Let's talk", href: `mailto:${PERSONAL.email}`, external: false, tone: 'border border-white/15 text-white hover:border-neon-cyan hover:text-neon-cyan' },
  { label: 'Resume PDF', href: './m_muqeet_khan_CV.pdf', external: true, tone: 'border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10' },
]

/**
 * Hero copy block — availability + location, name, role + domains, bio, CTAs.
 * Shared by both layouts; `variant` tunes the type scale and, on desktop, opts
 * into the GSAP entrance (`data-hero-fade` targets + magnetic CTAs).
 */
export function HeroIntro({
  variant = 'mobile',
  titleRef,
}: {
  variant?: 'desktop' | 'mobile'
  titleRef?: RefObject<HTMLHeadingElement | null>
}) {
  const isDesktop = variant === 'desktop'
  const fade: Record<string, string> = isDesktop ? { 'data-hero-fade': '' } : {}

  return (
    <div className={cn('relative', isDesktop ? 'min-w-0 max-w-4xl' : 'max-w-3xl')}>
      <div
        className={cn(
          'absolute top-10 rounded-full bg-neon-cyan/10 blur-3xl',
          isDesktop ? '-left-10 h-28 w-28' : '-left-6 hidden h-24 w-24 sm:block',
        )}
      />

      <div {...fade} className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.24em]">
        <span className="inline-flex items-center gap-2 text-neon-cyan">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
          </span>
          Available for new projects
        </span>
        <span className="text-white/35">{PERSONAL.location}</span>
      </div>

      <h1
        ref={titleRef}
        className={cn(
          'font-heading uppercase leading-[0.86] tracking-[-0.05em]',
          isDesktop ? 'text-[clamp(3.4rem,7vw,6.4rem)]' : 'text-[clamp(2.2rem,9vw,6rem)]',
        )}
      >
        {FIRST_NAMES} <span className="masked-text-dark">{LAST_NAME}</span>
      </h1>

      <div {...fade} className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <p className={cn('font-semibold uppercase tracking-[0.1em] text-neon-cyan/90', isDesktop ? 'text-[17px]' : 'text-[15px] sm:text-lg')}>
          {PERSONAL.role}
        </p>
        <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
        <ul className="flex flex-wrap gap-2">
          {HERO_DOMAINS.map(domain => (
            <li key={domain} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
              {domain}
            </li>
          ))}
        </ul>
      </div>

      <p {...fade} className={cn('mt-6 max-w-2xl text-white/70', isDesktop ? 'text-base leading-8' : 'text-sm leading-7 sm:text-base')}>
        {PERSONAL.bio}
      </p>

      <div {...fade} className="mt-8 flex flex-wrap gap-3">
        {CTAS.map(cta => {
          const link = (
            <a
              key={cta.label}
              href={cta.href}
              {...(cta.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className={cn('rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition', isDesktop && 'inline-block', cta.tone)}
            >
              {cta.label}
            </a>
          )
          return isDesktop ? <MagneticButton key={cta.label}>{link}</MagneticButton> : link
        })}
      </div>
    </div>
  )
}
