'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS } from '@/lib/data'

const SITE_PROJECTS = PROJECTS.filter(p => p.cat.includes('site') && !p.cat.includes('web3'))

export default function ProjectsSites() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0A0A0A',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '0 8%', position: 'relative', overflow: 'hidden',
    }}>
      {/* Cyan glow */}
      <div style={{
        position: 'absolute', top: '-20%', right: '10%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 65%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Side label */}
      <div style={{
        position: 'absolute', left: '2%', top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        fontSize: 10, fontWeight: 700, letterSpacing: '0.5em',
        color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        05 // Digital Experiences
      </div>

      {/* Header */}
      <div style={{ marginBottom: 'clamp(16px,2.5vh,28px)', flexShrink: 0 }}>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', color: '#00F5FF', textTransform: 'uppercase', marginBottom: 10 }}
        >
          Marketing · Product · Real Estate
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: 'clamp(28px,4vw,56px)', fontFamily: 'Syne,sans-serif', fontWeight: 800, textTransform: 'uppercase', color: '#fff', lineHeight: 1 }}
        >
          Digital Experiences
        </motion.h2>
      </div>

      {/* Horizontal card strip */}
      <div style={{
        display: 'flex',
        gap: 'clamp(12px,1.5vw,20px)',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none',
        paddingBottom: 4,
        flexShrink: 0,
      }}>
        {SITE_PROJECTS.map((p, i) => {
          const isHov = hovered === p.id
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flexShrink: 0,
                width: isHov ? 'clamp(280px,28vw,380px)' : 'clamp(160px,16vw,220px)',
                height: 'clamp(200px,30vh,340px)',
                background: isHov ? 'rgba(0,245,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isHov ? 'rgba(0,245,255,0.25)' : 'rgba(255,255,255,0.05)'}`,
                padding: 'clamp(16px,2vw,24px)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1), background 0.3s, border-color 0.3s',
                overflow: 'hidden', position: 'relative',
              }}
            >
              {/* Ghost number */}
              <span style={{
                position: 'absolute', bottom: -10, right: 10,
                fontSize: 'clamp(48px,7vw,100px)', fontFamily: 'Syne,sans-serif', fontWeight: 800,
                color: isHov ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.03)',
                lineHeight: 1, pointerEvents: 'none', transition: 'color 0.3s',
              }}>{p.num}</span>

              <div style={{ flex: 1, overflow: 'hidden' }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: isHov ? '#00F5FF' : 'rgba(255,255,255,0.25)', textTransform: 'uppercase', display: 'block', marginBottom: 10, transition: 'color 0.3s' }}>
                  {p.type}
                </span>
                <h3 style={{
                  fontSize: isHov ? 'clamp(16px,2vw,24px)' : 'clamp(14px,1.6vw,18px)',
                  fontFamily: 'Syne,sans-serif', textTransform: 'uppercase', color: '#fff',
                  lineHeight: 1.1, marginBottom: 12,
                  transition: 'font-size 0.3s',
                }}>
                  {p.title}
                </h3>

                {/* Only show desc when expanded */}
                <div style={{
                  maxHeight: isHov ? 200 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease',
                  opacity: isHov ? 1 : 0,
                }}>
                  <p style={{ fontSize: 'clamp(11px,1vw,13px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 14 }}>
                    {p.desc}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                    {p.tags.slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', padding: '3px 7px', background: 'rgba(0,245,255,0.12)', color: '#00F5FF', textTransform: 'uppercase' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {p.url && (
                <a href={p.url} target="_blank" rel="noreferrer"
                  style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
                    textDecoration: 'none', color: isHov ? '#00F5FF' : 'rgba(255,255,255,0.2)',
                    transition: 'color 0.3s', flexShrink: 0,
                  }}
                >
                  Visit ↗
                </a>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
