import { EXPERIENCE } from '@/lib/data'

/** Career summaries and timeline accents, shared by both layouts. */
export function ExperienceList({ variant }: { variant?: 'desktop' | 'mobile' }) {
  return (
    <div className="experience-grid" data-variant={variant} data-overview>
      {EXPERIENCE.map(item => (
        <article key={item.company} className="experience-card">
          <span className="experience-line" aria-hidden="true" />
          <span className="experience-point" aria-hidden="true" />
          <h4>{item.company}</h4>
          <p className="experience-role">{item.role}</p>
          <p className="experience-summary">{item.summary}</p>
        </article>
      ))}
    </div>
  )
}
