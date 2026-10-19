'use client'

import { useId, useState } from 'react'
import { EXPERIENCE, JOURNEY_COPY } from '@/lib/data'
import { cn } from '@/lib/utils'

/** Experience cards. Rendered on the inverted (white) section in both layouts. */
export function ExperienceList({ variant = 'mobile' }: { variant?: 'desktop' | 'mobile' }) {
  const isDesktop = variant === 'desktop'

  return (
    <div className={cn('grid gap-5', isDesktop ? 'xl:grid-cols-2' : 'lg:grid-cols-2')}>
      {EXPERIENCE.map(item => <ExperienceCard key={item.company} item={item} isDesktop={isDesktop} />)}
    </div>
  )
}

function ExperienceCard({ item, isDesktop }: { item: typeof EXPERIENCE[number]; isDesktop: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()

  return (
    <article
      // Solid white, not a tint: the moire lattice backdrop sits behind this
      // panel and at bg-black/[0.03] its dots ran through the bullet copy.
      // The card is the reading surface; the lattice reads in the gutters.
      className={cn(
        'rounded-[28px] border border-black/[0.08] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.07)]',
        isDesktop ? 'h-full' : 'sm:p-7',
      )}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className={cn('font-heading uppercase leading-none', isDesktop ? 'text-[1.8rem]' : 'text-[1.55rem] sm:text-[1.8rem]')}>
          {item.company}
        </h3>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">{item.period}</p>
      </div>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-neon-purple">{item.role}</p>
      <ul id={listId} className="space-y-2.5">
        {item.bullets.map((bullet, index) => (
          <li key={bullet} hidden={!expanded && index >= 4} className="text-sm leading-6 text-black/70">
            {bullet}
          </li>
        ))}
      </ul>
      {item.bullets.length > 4 ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded(value => !value)}
          className="mt-5 rounded-full border border-black/15 px-4 py-2 text-xs font-bold text-black/75 transition hover:border-neon-purple hover:text-neon-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-purple"
        >
          {expanded ? JOURNEY_COPY.showLess : JOURNEY_COPY.showMore}
        </button>
      ) : null}
    </article>
  )
}
