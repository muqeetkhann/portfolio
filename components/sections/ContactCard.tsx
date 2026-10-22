import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { PERSONAL, UI_COPY } from '@/lib/data'

const CONTACTS = [
  { label: UI_COPY.contacts[0], href: `mailto:${PERSONAL.email}`, text: PERSONAL.email },
  { label: UI_COPY.contacts[1], href: `tel:${PERSONAL.phone}`, text: PERSONAL.phone },
  { label: UI_COPY.contacts[2], href: PERSONAL.linkedin, text: PERSONAL.linkedin.replace('https://', '') },
  { label: UI_COPY.contacts[3], href: PERSONAL.github, text: PERSONAL.github.replace('https://', '') },
]

export function ContactCard() {
  return (
    <div className="contact-layout">
      <div className="contact-invitation">
        <h3>{UI_COPY.contactTitle}</h3>
        <p>{UI_COPY.contactDescription}</p>
        <a className="primary-action" href={`mailto:${PERSONAL.email}`}>{UI_COPY.contactAction}<span className="primary-action-icon"><ArrowUpRightIcon size={22} aria-hidden /></span></a>
        <p className="contact-note">{PERSONAL.bio}</p>
      </div>
      <div className="contact-links">
        {CONTACTS.map(contact => (
          <a key={contact.label} href={contact.href} {...(contact.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
            <span><span className="contact-label">{contact.label}</span><span className="contact-value">{contact.text}</span></span>
            <ArrowUpRightIcon size={23} aria-hidden />
          </a>
        ))}
      </div>
    </div>
  )
}
