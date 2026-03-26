'use client'
import { motion } from 'framer-motion'
import { SKILLS } from '@/lib/data'

export default function Skills() {
  return (
    <div className="section-inner" style={{ background: '#080808', paddingLeft: 'clamp(48px, 8vw, 120px)', flexDirection: 'column', justifyContent: 'center' }}>

      <div className="side-label" style={{ color: 'rgba(255,255,255,0.12)' }}>06 // Technology</div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="section-title"
        style={{ color: '#fff', lineHeight: 1, marginBottom: 'clamp(28px, 5vh, 56px)', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', flexShrink: 0 }}
      >
        Technical <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.2)' }}>Arsenal</span>
      </motion.h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(110px,14vw,180px), 1fr))',
        gap: 'clamp(24px, 4vw, 56px)',
        width: '100%',
        flexShrink: 0,
      }}>
        {SKILLS.map((set, i) => (
          <motion.div
            key={set.cat}
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', color: 'rgba(0,245,255,0.5)' }}>
                (0{i + 1})
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <h3 style={{ fontSize: 'clamp(11px,1vw,13px)', fontWeight: 700, letterSpacing: '0.2em', color: '#fff', textTransform: 'uppercase', fontFamily: 'Syne, sans-serif' }}>
              {set.cat}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {set.items.map(item => (
                <span key={item} style={{ fontSize: 'clamp(11px,1vw,13px)', color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#fff')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ghost bg text */}
      <div style={{
        position: 'absolute', bottom: '5%', right: '4%',
        fontSize: 'clamp(60px, 10vw, 140px)', fontFamily: 'Syne, sans-serif', fontWeight: 800,
        textTransform: 'uppercase', color: 'transparent',
        WebkitTextStroke: '1px rgba(255,255,255,0.03)',
        userSelect: 'none', pointerEvents: 'none', lineHeight: 1,
      }}>
        STACK
      </div>
    </div>
  )
}
