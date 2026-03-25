'use client'
import { useEffect, useState } from 'react'
import { PERSONAL } from '@/lib/data'

const LINKS = ['About', 'Experience', 'Projects', 'Skills', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState('About')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase())
    if (!el) return
    const lenis = (window as any).__lenis
    if (lenis) {
      lenis.scrollTo(el, { offset: -80, duration: 1.4 })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setActive(id)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 px-[6%] flex items-center justify-between transition-all duration-500 ${
      scrolled ? 'bg-[rgba(8,11,18,0.95)] backdrop-blur-xl border-b border-white/5' : ''
    }`}>
      <div className="text-[20px] font-black text-green tracking-widest">
        {PERSONAL.initials}<span className="text-dim">.</span>
      </div>
      <div className="flex gap-7">
        {LINKS.map(l => (
          <button
            key={l}
            onClick={() => scrollTo(l)}
            className={`text-[13px] font-medium tracking-widest pb-1 border-b transition-all duration-200 ${
              active === l
                ? 'text-green border-green'
                : 'text-muted border-transparent hover:text-green hover:border-green'
            }`}
          >{l}</button>
        ))}
      </div>
    </nav>
  )
}
