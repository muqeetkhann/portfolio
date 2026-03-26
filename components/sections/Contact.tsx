'use client'
import { motion } from 'framer-motion'
import { PERSONAL } from '@/lib/data'

export default function Contact() {
  return (
    <div className="section-inner" style={{ background: '#000', paddingLeft: 'clamp(48px, 8vw, 120px)' }}>

      <div className="side-label" style={{ color: 'rgba(255,255,255,0.15)' }}>07 // Connect</div>

      {/* Neon glow */}
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: 'clamp(300px,40vw,600px)', height: 'clamp(300px,40vw,600px)',
        background: 'radial-gradient(circle, rgba(188,19,254,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 100px)', width: '100%', alignItems: 'center' }}>

        {/* Left */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-title"
            style={{ color: '#fff', lineHeight: 1, marginBottom: 'clamp(32px, 5vh, 60px)', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase' }}
          >
            Start a<br />
            <span style={{ color: '#00F5FF', fontStyle: 'italic' }}>Conversation</span>
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>Email</p>
              <a href={`mailto:${PERSONAL.email}`}
                style={{ fontSize: 'clamp(16px, 2vw, 28px)', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.3s' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#00F5FF')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#fff')}
              >
                {PERSONAL.email}
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>Phone</p>
              <a href={`tel:${PERSONAL.phone}`}
                style={{ fontSize: 'clamp(16px, 2vw, 28px)', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.3s' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#00F5FF')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#fff')}
              >
                {PERSONAL.phone}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: 'clamp(200px, 30vh, 320px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 4 }}>Socials</p>
            {[
              { label: 'LinkedIn', href: PERSONAL.linkedin },
              { label: 'GitHub',   href: PERSONAL.github   },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                style={{
                  fontSize: 'clamp(28px, 4vw, 52px)',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  textTransform: 'uppercase', color: '#fff',
                  textDecoration: 'none', lineHeight: 1,
                  transition: 'color 0.3s, padding-left 0.3s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#BC13FE'; (e.currentTarget as HTMLElement).style.paddingLeft = '16px' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#fff';    (e.currentTarget as HTMLElement).style.paddingLeft = '0' }}
              >
                {s.label}
              </a>
            ))}
          </div>

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} {PERSONAL.name}
          </p>
        </div>

      </div>
    </div>
  )
}
