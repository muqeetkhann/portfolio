import { EDUCATION, JOURNEY_COPY } from '@/lib/data'

export function EducationList({ variant }: { variant?: 'desktop' | 'mobile' }) {
  return (
    <div className="education" data-variant={variant} data-overview>
      <h3>{JOURNEY_COPY.educationTitle}</h3>
      <div className="education-grid">
        {EDUCATION.map(item => (
          <article key={item.qualification} className="education-card">
            <h4>{item.qualification}</h4>
            <p>{item.institution}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
