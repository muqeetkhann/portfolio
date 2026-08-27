import { PERSONAL } from '@/lib/data'
import { cn } from '@/lib/utils'

const CONTACTS = [
  { label: 'Email', href: `mailto:${PERSONAL.email}`, text: PERSONAL.email, display: 'heading', breakAll: true },
  { label: 'Phone', href: `tel:${PERSONAL.phone}`, text: PERSONAL.phone, display: 'heading', breakAll: false },
  { label: 'LinkedIn', href: PERSONAL.linkedin, text: PERSONAL.linkedin.replace('https://', ''), display: 'link', breakAll: true },
  { label: 'GitHub', href: PERSONAL.github, text: PERSONAL.github.replace('https://', ''), display: 'link', breakAll: true },
] as const

/** Contact details panel — mailto / tel / profile links (no forms: static export). */
export function ContactCard({ variant = 'mobile' }: { variant?: 'desktop' | 'mobile' }) {
  const isDesktop = variant === 'desktop'

  return (
    <div className={cn('panel grid gap-6', isDesktop ? 'h-fit min-w-0 p-8' : 'p-6 sm:grid-cols-2 sm:p-8')}>
      {CONTACTS.map(contact => {
        const isHeading = contact.display === 'heading'
        const isExternal = contact.href.startsWith('http')
        // Long emails/URLs wrap; the desktop panel is wide enough to leave links intact.
        const breakAll = isHeading ? contact.breakAll : !isDesktop

        return (
          <div key={contact.label}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">{contact.label}</p>
            <a
              href={contact.href}
              {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
              className={cn(
                'transition',
                breakAll && 'break-all',
                isHeading
                  ? cn('font-heading uppercase leading-tight hover:text-neon-cyan', isDesktop ? 'text-[1.9rem]' : 'text-[clamp(1rem,4vw,1.55rem)]')
                  : cn('text-neon-cyan hover:text-white', isDesktop ? 'text-base' : 'text-sm'),
              )}
            >
              {contact.text}
            </a>
          </div>
        )
      })}
    </div>
  )
}
