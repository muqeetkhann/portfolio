import { EDUCATION, JOURNEY_COPY } from '@/lib/data'
import { cn } from '@/lib/utils'

/** Education shares the Journey panel with employment in both layouts. */
export function EducationList({ variant = 'mobile' }: { variant?: 'desktop' | 'mobile' }) {
  return (
    <div className="mt-9">
      <h3 className="mb-4 font-heading text-xl uppercase text-black">{JOURNEY_COPY.educationTitle}</h3>
      <div className={cn('grid gap-4', variant === 'desktop' ? 'grid-cols-2' : 'sm:grid-cols-2')}>
        {EDUCATION.map(item => (
          <article key={item.qualification} className="rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h4 className="font-heading text-lg uppercase leading-tight text-black">{item.qualification}</h4>
            <p className="mt-2 text-sm font-semibold text-black/75">{item.institution}</p>
            <p className="mt-1 text-xs text-black/60">{item.location} · {item.level}</p>
            <dl className="mt-4 flex flex-wrap gap-x-2 text-xs text-black/60">
              <dt>{JOURNEY_COPY.dateLabel}</dt>
              <dd className="font-semibold text-black/75">{item.date}</dd>
            </dl>
          </article>
        ))}
      </div>
    </div>
  )
}
