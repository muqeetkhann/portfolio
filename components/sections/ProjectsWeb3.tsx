'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS } from '@/lib/data'

const WEB3_PROJECTS = PROJECTS
  .filter(p => p.cat.includes('web3') && p.title !== 'More Projects')
  .sort((a, b) => {
    if (a.id === 10) return -1;
    if (b.id === 10) return 1;
    return a.id - b.id;
  })

export default function ProjectsWeb3() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#030303',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '0 8%', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', bottom: '-20%', left: '30%',
        width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(188,19,254,0.07) 0%, transparent 65%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Side label */}
      <div style={{
        position: 'absolute', left: '2%', top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        fontSize: 10, fontWeight: 700, letterSpacing: '0.5em',
        color: 'rgba(255,255,255,0.12)', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        03 // Web3 & DeFi
      </div>

      {/* Header */}
      <div style={{ marginBottom: 'clamp(20px,3vh,36px)', flexShrink: 0 }}>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', color: '#BC13FE', textTransform: 'uppercase', marginBottom: 12 }}
        >
          Blockchain · DeFi · Crypto
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: 'clamp(32px,5vw,64px)', fontFamily: 'Syne,sans-serif', fontWeight: 800, textTransform: 'uppercase', color: '#fff', lineHeight: 1 }}
        >
          Web3 &amp; DeFi
        </motion.h2>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(220px,22vw,300px), 1fr))',
        gap: 'clamp(12px,1.5vw,20px)',
        flexShrink: 0,
      }}>
        {WEB3_PROJECTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'relative',
              background: hovered === p.id ? 'rgba(188,19,254,0.06)' : 'rgba(255,255,255,0.025)',
              border: `1px solid ${hovered === p.id ? 'rgba(188,19,254,0.4)' : 'rgba(255,255,255,0.06)'}`,
              padding: 'clamp(16px,2vw,24px)',
              transition: 'background 0.3s, border-color 0.3s, transform 0.3s',
              transform: hovered === p.id ? 'translateY(-6px)' : 'translateY(0)',
              display: 'flex', flexDirection: 'column',
              minHeight: 'clamp(180px,24vh,260px)',
            }}
          >
            {/* Num */}
            <span style={{
              position: 'absolute', top: 12, right: 16,
              fontSize: 'clamp(32px,4vw,56px)', fontFamily: 'Syne,sans-serif', fontWeight: 800,
              color: hovered === p.id ? 'rgba(188,19,254,0.15)' : 'rgba(255,255,255,0.04)',
              lineHeight: 1, transition: 'color 0.3s',
            }}>{p.num}</span>

            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                {p.type}
              </span>
              <h3 style={{ fontSize: 'clamp(16px,1.8vw,22px)', fontFamily: 'Syne,sans-serif', textTransform: 'uppercase', color: '#fff', lineHeight: 1.1, marginBottom: 10 }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 'clamp(11px,1vw,13px)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {p.desc}
              </p>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                {p.tags.slice(0, 3).map(t => (
                  <span key={t} style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', padding: '3px 7px', background: 'rgba(188,19,254,0.15)', color: '#BC13FE', textTransform: 'uppercase' }}>
                    {t}
                  </span>
                ))}
              </div>
              {p.url && (
                <a href={p.url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', color: hovered === p.id ? '#BC13FE' : 'rgba(255,255,255,0.35)', transition: 'color 0.3s' }}
                >
                  Visit Platform ↗
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
