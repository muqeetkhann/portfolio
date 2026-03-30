'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PERSONAL } from '@/lib/data'
import { useEffect } from 'react'

export default function Navbar({ onNavigate }: { onNavigate?: (idx: number) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const links = [
    { name: 'Introduction', idx: 0, num: '01' },
    { name: 'Experience', idx: 1, num: '02' },
    { name: 'Projects', idx: 2, num: '03' },
    { name: 'Stack', idx: 5, num: '04' },
    { name: 'Contact', idx: 6, num: '05' },
  ]

  const handleScroll = (index: number) => {
    setIsOpen(false)
    if (onNavigate) {
      onNavigate(index)
    }
  }

  return (
    <>
      <nav className="fixed left-0 top-0 z-[100] flex w-full items-center justify-between px-[5%] pb-4 pt-[max(1.1rem,env(safe-area-inset-top))] 2xl:mix-blend-difference sm:px-[4%] sm:pb-6 sm:pt-8">
        
        {/* Logo */}
        <div className="pointer-events-auto">
          <span className="select-none text-[11px] font-bold uppercase tracking-[0.15em] text-white sm:text-[14px] sm:tracking-[0.28em]">
            {PERSONAL.initials} // PORTFOLIO
          </span>
        </div>

        {/* Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto flex flex-col gap-1.5 group relative z-[110]"
        >
          <div className={`h-[1px] bg-white transition-all duration-300 ${isOpen ? 'w-8 rotate-45 translate-y-2 !bg-black' : 'w-8'}`} />
          <div className={`h-[1px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-6'}`} />
          <div className={`h-[1px] bg-white transition-all duration-300 ${isOpen ? 'w-8 -rotate-45 -translate-y-2 !bg-black' : 'w-4 group-hover:w-8'}`} />
        </button>

      </nav>

      {/* Fullscreen Menu */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] overflow-y-auto bg-white"
          >
            <div className="grid min-h-screen w-full grid-cols-1 gap-10 px-[8%] pb-10 pt-24 md:grid-cols-2 md:gap-20 md:pb-14 md:pt-28">
              
              <div className="flex flex-col gap-6 self-center sm:gap-8">
                {links.map((link, i) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    onClick={() => handleScroll(link.idx)}
                    className="group flex items-baseline gap-4 text-left sm:gap-6"
                  >
                    <span className="text-[12px] font-bold tracking-widest text-black/20 group-hover:text-neon-cyan transition-colors">
                      {link.num}
                    </span>
                    <span className="font-heading text-[clamp(26px,8vw,80px)] leading-[0.95] text-black transition-all group-hover:pl-4">
                      {link.name}
                    </span>
                  </motion.button>
                ))}
              </div>


              <div className="hidden md:flex flex-col justify-end items-end gap-10">
                <div className="text-right">
                  <p className="text-[10px] font-bold tracking-[0.4em] text-black/40 uppercase mb-4">Contact Info</p>
                  <p className="text-[20px] font-heading text-black">{PERSONAL.email}</p>
                  <p className="text-[20px] font-heading text-black">{PERSONAL.phone}</p>
                </div>
                
                <div className="flex gap-8">
                  <a href={PERSONAL.linkedin} target="_blank" className="text-[12px] font-bold tracking-widest text-black hover:text-neon-cyan uppercase">LinkedIn</a>
                  <a href={PERSONAL.github} target="_blank" className="text-[12px] font-bold tracking-widest text-black hover:text-neon-cyan uppercase">GitHub</a>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
