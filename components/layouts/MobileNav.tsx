'use client'

import { useEffect, useState } from 'react'
import { PERSONAL } from '@/lib/data'

const links = [
  { href: '#intro', label: 'Introduction' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
]

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const isSolidHeader = isScrolled || isOpen

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    let lastScrollY = window.scrollY
    const scrollThreshold = 18

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollY

      setIsScrolled(currentScrollY > 12)

      if (currentScrollY <= 16) {
        setIsVisible(true)
      } else if (Math.abs(scrollDelta) < scrollThreshold) {
        return
      } else if (scrollDelta > 0) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${isVisible || isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="section-shell pt-[max(1rem,env(safe-area-inset-top))] pb-4 sm:pt-7 sm:pb-6">
          <div
            className={`flex items-center justify-between rounded-full border px-4 py-3 transition-[border-color,box-shadow,backdrop-filter] duration-200 sm:px-5 ${isSolidHeader ? 'border-white/14 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl' : 'border-white/12 shadow-[0_14px_40px_rgba(0,0,0,0.32)] backdrop-blur-lg'}`}
            style={{ backgroundColor: isSolidHeader ? 'rgba(0, 0, 0, 0.88)' : 'rgba(0, 0, 0, 0.78)' }}
          >
            <a href="#intro" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white sm:text-[13px] sm:tracking-[0.28em]">
              {PERSONAL.initials} // Portfolio
            </a>

            <button
              type="button"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen(open => !open)}
              className={`relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur transition-colors duration-200 ${isSolidHeader ? 'border-white/10 bg-white/5' : 'border-white/10 bg-black/45'}`}
            >
              <span className="flex flex-col gap-1.5">
                <span className={`block h-px w-5 bg-white transition duration-200 ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                <span className={`block h-px w-4 bg-white transition duration-200 ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-px w-5 bg-white transition duration-200 ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[55] transition-opacity duration-150 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button type="button" aria-label="Close menu" onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/68 backdrop-blur-[2px]" />
        <div className={`absolute inset-x-0 top-0 mx-auto mt-20 w-[min(92vw,68rem)] overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,#ffffff_0%,#f6f6f6_100%)] text-black shadow-[0_30px_90px_rgba(0,0,0,0.36)] transition duration-200 ${isOpen ? 'translate-y-0 scale-100' : '-translate-y-4 scale-[0.985]'}`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          <div className="grid gap-10 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:p-10">
            <nav className="flex flex-col gap-4 sm:gap-5">
              {links.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-baseline gap-4 rounded-2xl px-2 py-1 text-left transition-colors hover:bg-black/[0.035]"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/30">0{index + 1}</span>
                  <span className="font-heading text-[clamp(1.8rem,6vw,4.8rem)] uppercase leading-[0.95] transition-transform duration-200 group-hover:translate-x-2">
                    {link.label}
                  </span>
                </a>
              ))}
            </nav>

            <div className="space-y-8 rounded-[28px] border border-black/8 bg-black/[0.025] p-5 text-left md:text-right">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-black/35">Contact</p>
                <a href={`mailto:${PERSONAL.email}`} className="block font-heading text-lg uppercase leading-tight text-black sm:text-xl">
                  {PERSONAL.email}
                </a>
                <a href={`tel:${PERSONAL.phone}`} className="block font-heading text-lg uppercase leading-tight text-black sm:text-xl">
                  {PERSONAL.phone}
                </a>
              </div>

              <div className="flex gap-5 text-[11px] font-bold uppercase tracking-[0.2em] md:justify-end">
                <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer" className="text-black/70 transition hover:text-neon-cyan">
                  LinkedIn
                </a>
                <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="text-black/70 transition hover:text-neon-cyan">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
