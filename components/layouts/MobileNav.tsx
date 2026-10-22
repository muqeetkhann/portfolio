'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRightIcon, ListIcon, XIcon } from '@phosphor-icons/react'
import { getLenis, scrollToTarget } from '@/components/providers/SmoothScroll'
import { HERO_COPY, NAVIGATION, PERSONAL, UI_COPY } from '@/lib/data'

/** Native dialog supplies focus containment, Escape and background inertness. */
export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('intro')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) })
    }, { rootMargin: '-15% 0px -65% 0px' })
    NAVIGATION.forEach(item => { const element = document.getElementById(item.id); if (element) observer.observe(element) })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return
    const previousOverflow = document.body.style.overflow
    const lenis = getLenis()
    const stopped = lenis?.isStopped
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (!stopped) lenis?.start()
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  const navigate = (id: string) => {
    setOpen(false)
    requestAnimationFrame(() => scrollToTarget(`#${id}`, -96))
  }

  return (
    <>
      <header className="site-header mobile-header"><div className="site-container"><div className="site-nav">
        <button ref={toggleRef} className="menu-toggle" type="button" aria-label={UI_COPY.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><ListIcon size={25} aria-hidden /></button>
      </div></div></header>
      <dialog ref={dialogRef} id="mobile-navigation" className="mobile-menu" aria-label={UI_COPY.navigation} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-heading"><button autoFocus className="menu-toggle" type="button" aria-label={UI_COPY.closeMenu} onClick={() => setOpen(false)}><XIcon size={23} aria-hidden /></button></div>
          <nav aria-label={UI_COPY.navigation}>{NAVIGATION.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'page' : undefined} onClick={event => { event.preventDefault(); navigate(item.id) }}><span className="mobile-menu-index">0{index + 1}</span><span>{item.mobileLabel}</span><ArrowUpRightIcon size={28} aria-hidden /></a>)}</nav>
          <div className="mobile-menu-contact"><a href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}<ArrowUpRightIcon size={18} aria-hidden /></a><a href={PERSONAL.resume} target="_blank" rel="noreferrer">{HERO_COPY.resume}<ArrowUpRightIcon size={18} aria-hidden /></a></div>
        </div>
      </dialog>
    </>
  )
}
