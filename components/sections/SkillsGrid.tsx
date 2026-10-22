'use client'

import { useId, useState } from 'react'
import { BACKGROUND_COPY, FEATURED_SKILLS, SKILLS, SKILL_COLLECTIONS } from '@/lib/data'

export function SkillsGrid({ variant = 'mobile', featured = false }: { variant?: 'desktop' | 'mobile'; featured?: boolean }) {
  const [selected, setSelected] = useState<string>(SKILL_COLLECTIONS[0].id)
  const gridId = useId()
  const collection = SKILL_COLLECTIONS.find(item => item.id === selected) ?? SKILL_COLLECTIONS[0]
  const skills = collection.categories.length
    ? SKILLS.filter(skill => collection.categories.some(category => category === skill.cat))
    : SKILLS

  if (featured) return (
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

  return (
    <div className="toolkit" data-variant={variant}>
      <div className="toolkit-heading">
        <h3 className="background-label">{BACKGROUND_COPY.skills}</h3>
        <p aria-live="polite">{skills.length} {BACKGROUND_COPY.groups}</p>
      </div>
      <div className="skills-filters" role="group" aria-label={BACKGROUND_COPY.filterLabel}>
        {SKILL_COLLECTIONS.map(item => (
          <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls={gridId} onClick={() => setSelected(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div id={gridId} className="skills-grid">
        {skills.map(skill => (
          <article key={skill.cat} className="skill-group">
            <h4>{skill.cat}</h4>
            <ul>{skill.items.map(item => <li key={item}>{item}</li>)}</ul>
          </article>
        ))}
      </div>
    </div>
  )
}
