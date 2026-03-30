'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS } from '@/lib/data'

const SAAS_PROJECTS = PROJECTS.filter(p => p.cat.includes('saas') || p.cat.includes('ecom'))

export default function ProjectsSaaS() {
  const [active, setActive] = useState(0)
  const project = SAAS_PROJECTS[active]

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#F0EEE9',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '0 8%', position: 'relative', overflow: 'hidden', color: '#000',
    }}>
      {/* Side label */}
      <div style={{
        position: 'absolute', left: '2%', top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        fontSize: 10, fontWeight: 700, letterSpacing: '0.5em',
        color: 'rgba(0,0,0,0.15)', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        04 // SaaS &amp; Platforms
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'center', height: '80%' }}>

        {/* Left — project detail */}
        <div>
          <motion.p
            key={`label-${active}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: 12 }}
          >
            SaaS · E-Commerce · Logistics
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: 'clamp(28px,4vw,52px)', fontFamily: 'Syne,sans-serif', fontWeight: 800, textTransform: 'uppercase', color: '#000', lineHeight: 1, marginBottom: 'clamp(16px,2vh,24px)' }}
          >
            SaaS &amp;<br />Platforms
          </motion.h2>

          {/* Active project detail */}
          <motion.div key={active} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', marginBottom: 6 }}>
              {project.type}
            </p>
            <h3 style={{ fontSize: 'clamp(22px,3vw,40px)', fontFamily: 'Syne,sans-serif', textTransform: 'uppercase', color: '#000', lineHeight: 1, marginBottom: 14 }}>
              {project.title}
            </h3>
            <p style={{ fontSize: 'clamp(12px,1.1vw,14px)', color: 'rgba(0,0,0,0.6)', lineHeight: 1.75, marginBottom: 20, maxWidth: 460 }}>
              {project.desc}
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {project.highlights.map((h, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 'clamp(11px,1vw,13px)', color: 'rgba(0,0,0,0.55)', lineHeight: 1.55 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#000', marginTop: 5, flexShrink: 0 }} />
                  {h}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              {project.tags.slice(0, 4).map(t => (
                <span key={t} style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 10px', background: '#000', color: '#fff', textTransform: 'uppercase' }}>
                  {t}
                </span>
              ))}
            </div>
            {project.url && (
              <a href={project.url} target="_blank" rel="noreferrer"
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', color: '#000', borderBottom: '1px solid rgba(0,0,0,0.3)', paddingBottom: 2, transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#BC13FE')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#000')}
              >
                Visit Platform ↗
              </a>
            )}
          </motion.div>
        </div>

        {/* Right — project switcher list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px,1.5vh,16px)' }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>
            All Projects
          </p>
          {SAAS_PROJECTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              style={{
                all: 'unset',
                padding: 'clamp(12px,1.5vh,18px) clamp(16px,2vw,28px)',
                background: active === i ? '#000' : 'transparent',
                color: active === i ? '#fff' : 'rgba(0,0,0,0.4)',
                fontFamily: 'Syne,sans-serif', fontWeight: 800,
                fontSize: 'clamp(14px,1.5vw,20px)', textTransform: 'uppercase',
                letterSpacing: '-0.01em', lineHeight: 1,
                borderLeft: `2px solid ${active === i ? '#000' : 'rgba(0,0,0,0.1)'}`,
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 16, cursor: 'none',
              }}
            >
              <span>{p.title}</span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', opacity: 0.5 }}>{p.type}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
