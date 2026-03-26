'use client'
import { motion } from 'framer-motion'
import { EXPERIENCE } from '@/lib/data'

export default function Experience() {
  return (
    <div className="section-inner" style={{ background: '#fff', color: '#000', paddingLeft: 'clamp(48px, 8vw, 120px)' }}>

      <div className="side-label" style={{ color: 'rgba(0,0,0,0.15)' }}>
        02 // Journey
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 100px)', width: '100%', alignItems: 'center' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-title"
            style={{ lineHeight: 1, marginBottom: 'clamp(32px, 5vh, 56px)', color: '#000', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase' }}
          >
            Professional<br />
            <span style={{ color: 'rgba(0,0,0,0.2)' }}>Milestones</span>
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 4vh, 40px)' }}>
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }} viewport={{ once: true }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <h3 style={{ fontSize: 'clamp(18px, 2.2vw, 28px)', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', color: '#000' }}>
                    {exp.company}
                  </h3>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase' }}>
                    {exp.period}
                  </span>
                </div>

                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#BC13FE', textTransform: 'uppercase', marginBottom: 12 }}>
                  {exp.role}
                </p>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {exp.bullets.slice(0, 3).map((b, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, fontSize: 'clamp(11px, 1.1vw, 13px)', lineHeight: 1.65, color: 'rgba(0,0,0,0.6)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00F5FF', marginTop: 5, flexShrink: 0 }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — decorative */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{
            fontSize: 'clamp(80px, 14vw, 180px)',
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(0,0,0,0.06)',
            lineHeight: 1,
            writingMode: 'vertical-rl',
            userSelect: 'none', pointerEvents: 'none',
          }}>
            WORK
          </div>
        </div>

      </div>
    </div>
  )
}
