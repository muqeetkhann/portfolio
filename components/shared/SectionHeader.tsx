import { cn } from '@/lib/utils'

/**
 * Kicker + display title, with an optional gradient-masked accent word.
 * `tone` picks the gradient that reads against the section background —
 * 'light' for the inverted (white) Experience section.
 */
export function SectionHeader({
  kicker,
  title,
  accent,
  tone = 'dark',
  className,
}: {
  kicker: string
  title: string
  accent?: string
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <div className={cn('mb-10', className)}>
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-title">
        {title}
        {accent ? (
          <> <span className={tone === 'light' ? 'masked-text-light' : 'masked-text-dark'}>{accent}</span></>
        ) : null}
      </h2>
    </div>
  )
}
