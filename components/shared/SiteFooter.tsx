'use client'

import { ArrowUpIcon, ArrowUpRightIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import { HERO_COPY, HERO_DOMAINS, PERSONAL, UI_COPY } from '@/lib/data'

export function SiteFooter({ onIntro }: { onIntro: () => void }) {
  return (
    <footer className="site-footer">
      <p className="footer-domains"><span>{UI_COPY.domains}</span>{HERO_DOMAINS.join(' · ')}</p>
      <div className="footer-row">
        <p>{UI_COPY.copyright} {new Date().getFullYear()} {PERSONAL.name}</p>
        <div className="footer-links">
          <a href={PERSONAL.resume} target="_blank" rel="noreferrer"><DownloadSimpleIcon size={17} aria-hidden />{HERO_COPY.resume}</a>
          <a href={PERSONAL.github} target="_blank" rel="noreferrer">{UI_COPY.contacts[3]}<ArrowUpRightIcon size={16} aria-hidden /></a>
          <button type="button" onClick={onIntro} aria-label={UI_COPY.backToTop}><ArrowUpIcon size={18} aria-hidden /></button>
        </div>
      </div>
    </footer>
  )
}
