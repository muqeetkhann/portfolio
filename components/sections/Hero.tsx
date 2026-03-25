'use client'
import { motion } from 'framer-motion'
import { PERSONAL } from '@/lib/data'

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    const lenis = (window as any).__lenis
    if (lenis && el) lenis.scrollTo(el, { offset: -80, duration: 1.4 })
    else el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="about" className="relative min-h-screen flex items-center px-[8%] pt-20 overflow-hidden">

      {/* Hero content */}
      <div className="max-w-[700px] z-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-7 h-[2px] bg-green rounded" />
          <span className="text-[12px] text-green font-semibold tracking-[0.18em]">AVAILABLE FOR WORK</span>
          <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-black leading-[0.95] mb-5 tracking-[-0.03em]"
          style={{ fontSize: 'clamp(50px,7vw,90px)' }}
        >
          Muhammad<br />
          <span style={{
            WebkitTextStroke: '1.5px rgba(226,232,240,0.2)',
            color: 'transparent',
          }}>
            Muqeet
          </span>
        </motion.h1>

        {/* Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-bold text-green tracking-[0.04em] mb-5"
          style={{ fontSize: 'clamp(16px,2vw,22px)' }}
        >
          {PERSONAL.role}
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-[15px] text-muted leading-[1.8] max-w-[500px] mb-10"
        >
          {PERSONAL.bio}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex gap-4 flex-wrap"
        >
          <button
            onClick={() => scrollTo('projects')}
            data-hover
            className="bg-green text-bg px-7 py-3 rounded-lg font-bold text-[13px] tracking-widest
              shadow-[0_0_24px_rgba(110,231,183,0.2)] hover:shadow-[0_8px_32px_rgba(110,231,183,0.35)]
              hover:-translate-y-[2px] transition-all duration-200"
          >
            View Projects ↓
          </button>
          <button
            onClick={() => scrollTo('contact')}
            data-hover
            className="border border-border text-[#94A3B8] px-7 py-3 rounded-lg font-semibold text-[13px] tracking-widest
              hover:border-green hover:text-green transition-all duration-200"
          >
            Contact Me
          </button>
        </motion.div>
      </div>

      {/* Floating code block */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute right-[4%] top-1/2 -translate-y-1/2 font-mono text-[12px] leading-[2.2]
          text-green pointer-events-none select-none hidden lg:block"
      >
        {[
          'const dev = {',
          '  name: "M. Muqeet",',
          '  role: "Frontend Dev",',
          '  stack: ["React","Next.js"],',
          '  web3: true,',
          '  available: true',
          '};',
        ].map((l, i) => <div key={i}>{l}</div>)}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-9 left-[8%] flex items-center gap-3 text-dim text-[11px] tracking-[0.12em]"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-dim animate-pulse2" />
        SCROLL
      </motion.div>
    </section>
  )
}
