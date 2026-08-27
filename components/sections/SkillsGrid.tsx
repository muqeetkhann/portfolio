import { SKILLS } from '@/lib/data'
import { cn } from '@/lib/utils'

/** Tech-stack panels, grouped by category. */
export function SkillsGrid({ variant = 'mobile' }: { variant?: 'desktop' | 'mobile' }) {
  const isDesktop = variant === 'desktop'

  return (
    <div className={cn('grid gap-4', isDesktop ? 'grid-cols-4' : 'sm:grid-cols-2 xl:grid-cols-3')}>
      {SKILLS.map(skill => (
        <article key={skill.cat} className={cn('panel p-5', isDesktop ? 'h-full' : 'sm:p-6')}>
          <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white">{skill.cat}</h3>
          <ul className="space-y-2 text-sm text-white/65">
            {skill.items.map(item => (
              <li key={`${skill.cat}-${item}`}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
