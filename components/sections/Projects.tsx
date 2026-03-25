'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, FILTERS, PERSONAL } from '@/lib/data'
import SectionTitle from '@/components/SectionTitle'
import FadeIn from '@/components/FadeIn'

export default function Projects() {
  const [active,  setActive]  = useState('all')
  const [hovered, setHovered] = useState<number | null>(null)

  const filtered = active === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.cat.includes(active))

  return (
    <section id="projects" className="px-[8%] py-28" style={{ background: 'rgba(255,255,255,0.012)' }}>
      <SectionTitle num="03" title="Projects" />

      {/* Filter tabs */}
      <FadeIn className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            data-hover
            className={`px-4 py-[6px] rounded-full text-[12px] font-semibold tracking-[0.05em] border transition-all duration-200 ${
              active === f.value
                ? 'text-green border-green bg-[rgba(110,231,183,0.06)]'
                : 'text-muted border-border hover:text-green hover:border-green'
            }`}
          >
            {f.label}
          </button>
        ))}
      </FadeIn>

      {/* Grid */}
      <motion.div
        layout
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative rounded-xl p-7 overflow-hidden transition-all duration-300"
              style={{
                background: '#0D1117',
                border: `1px solid ${hovered === p.id ? p.accent + '35' : '#1E293B'}`,
                transform: hovered === p.id ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hovered === p.id ? `0 16px 48px ${p.accent}10` : 'none',
              }}
            >
              {/* Glow */}
              <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${p.accent}12 0%, transparent 70%)` }}
              />

              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-[#475569] font-bold tracking-[0.14em]">
                  {p.type.toUpperCase()}
                </span>
                <span className="text-[28px] font-black leading-none" style={{ color: p.accent, opacity: 0.15 }}>
                  {p.num}
                </span>
              </div>

              <h3 className="text-[20px] font-bold text-[#F1F5F9] mb-1">{p.title}</h3>

              {p.urlLabel && (
                <div className="mb-3">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    data-hover
                    className="text-[11px] tracking-[0.03em] opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: p.accent }}
                  >
                    {p.urlLabel} ↗
                  </a>
                </div>
              )}

              <p className="text-[13px] text-[#475569] leading-[1.75] mb-4">{p.desc}</p>

              <ul className="space-y-[7px] mb-5">
                {p.highlights.map((h, j) => (
                  <li key={j} className="flex gap-2 text-[12px] text-muted leading-[1.6]">
                    <span className="flex-shrink-0" style={{ color: p.accent }}>▸</span>
                    {h}
                  </li>
                ))}
              </ul>

              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-[6px]">
                  {p.tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] font-bold px-[9px] py-[3px] rounded-full tracking-[0.05em]"
                      style={{ color: p.accent, background: `${p.accent}12` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* GitHub CTA */}
      <FadeIn delay={0.2} className="text-center mt-12">
        <a
          href={PERSONAL.github}
          target="_blank"
          rel="noreferrer"
          data-hover
          className="inline-flex items-center gap-2 text-[#475569] border border-border px-7 py-3 rounded-lg
            text-[13px] font-semibold tracking-widest hover:text-green hover:border-green transition-all duration-200"
        >
          VIEW ALL ON GITHUB ↗
        </a>
      </FadeIn>
    </section>
  )
}
