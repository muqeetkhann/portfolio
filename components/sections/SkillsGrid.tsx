import { BACKGROUND_COPY, FEATURED_SKILLS } from '@/lib/data'

export function SkillsGrid({ variant = 'mobile' }: { variant?: 'desktop' | 'mobile' }) {
  return (
    <div className="toolkit toolkit-featured" data-variant={variant}>
      <div className="toolkit-heading"><h3 className="background-label">{BACKGROUND_COPY.selectedStack}</h3><p>{BACKGROUND_COPY.stackDescription}</p></div>
      <div className="skills-grid">
        {FEATURED_SKILLS.map((skill, index) => (
          <article key={skill.cat} className="skill-group">
            <span className="skill-group-index" aria-hidden>{String(index + 1).padStart(2, '0')}</span>
            <h4>{skill.cat}</h4>
            <p>{skill.description}</p>
            <ul>{skill.items.map(item => <li key={item}>{item}</li>)}</ul>
          </article>
        ))}
      </div>
    </div>
  )
}
