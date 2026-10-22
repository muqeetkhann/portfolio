import { EDUCATION, JOURNEY_COPY } from '@/lib/data'

export function EducationList({ variant, overview = false }: { variant?: 'desktop' | 'mobile'; overview?: boolean }) {
  return (
    <div className="education" data-variant={variant} data-overview={overview || undefined}>
      <h3>{JOURNEY_COPY.educationTitle}</h3>
      <div className="education-grid">
        {EDUCATION.map(item => (
          <article key={item.qualification} className="education-card">
            <h4>{item.qualification}</h4>
            <p>{item.institution}</p>
            {!overview ? <><p>{item.location} · {item.level}</p><dl><dt>{JOURNEY_COPY.dateLabel}</dt><dd>{item.date}</dd></dl></> : null}
          </article>
        ))}
      </div>
    </div>
  )
}
