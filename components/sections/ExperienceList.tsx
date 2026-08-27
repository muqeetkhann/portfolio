import { EXPERIENCE } from '@/lib/data'
import { cn } from '@/lib/utils'

/** Experience cards. Rendered on the inverted (white) section in both layouts. */
export function ExperienceList({ variant = 'mobile' }: { variant?: 'desktop' | 'mobile' }) {
  const isDesktop = variant === 'desktop'

  return (
    <div className={cn('grid gap-5', isDesktop ? 'xl:grid-cols-2' : 'lg:grid-cols-2')}>
      {EXPERIENCE.map(item => (
        <article
          key={item.company}
          className={cn('rounded-[28px] border border-black/10 bg-black/[0.03] p-6', isDesktop ? 'h-full' : 'sm:p-7')}
        >
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className={cn('font-heading uppercase leading-none', isDesktop ? 'text-[1.8rem]' : 'text-[1.55rem] sm:text-[1.8rem]')}>
              {item.company}
            </h3>
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
  )
}
