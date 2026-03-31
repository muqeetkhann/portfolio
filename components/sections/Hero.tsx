'use client'
import { motion } from 'framer-motion'
import { PERSONAL } from '@/lib/data'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] },
})

export default function Hero() {
  return (
    <div className="section-inner">

      {/* Background neon orbs */}
      <div className="animate-glow" style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 'clamp(300px,40vw,600px)', height: 'clamp(300px,40vw,600px)',
        background: 'radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-5%', left: '20%',
        width: 'clamp(200px,30vw,400px)', height: 'clamp(200px,30vw,400px)',
        background: 'radial-gradient(circle, rgba(188,19,254,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Vertical section label */}
      <div className="side-label" style={{ color: 'rgba(255,255,255,0.18)' }}>
        01 // Introduction
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 'clamp(32px, 6vw, 100px)',
        width: '100%',
        alignItems: 'center',
        paddingLeft: 'clamp(32px, 4vw, 64px)',
      }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 700 }}>

          {/* Badge */}
          <motion.div {...fadeUp(0)} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(24px,4vh,48px)' }}>
            <span style={{ width: 32, height: 1, background: '#00F5FF', display: 'block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: '#00F5FF' }}>
              AVAILABLE FOR NEW PROJECTS
            </span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00F5FF', animation: 'glow-pulse 2s infinite' }} />
          </motion.div>

          {/* Name */}
          <motion.h1 {...fadeUp(0.15)} className="hero-title" style={{ lineHeight: 0.92, marginBottom: 'clamp(16px,2vh,28px)', letterSpacing: '-0.03em', fontFamily: 'Syne, sans-serif', textTransform: 'uppercase' }}>
            {PERSONAL.name.split(' ').slice(0, 2).join(' ')}<br />
            <span style={{
              WebkitTextStroke: '1.5px rgba(255,255,255,0.15)',
              color: 'transparent',
            }}>
              {PERSONAL.name.split(' ')[2] ?? ''}
            </span>
          </motion.h1>

          {/* Role */}
          <motion.p {...fadeUp(0.25)} style={{ fontSize: 'clamp(13px,1.4vw,18px)', fontWeight: 600, letterSpacing: '0.08em', color: '#00F5FF', marginBottom: 'clamp(12px,2vh,20px)' }}>
            {PERSONAL.role}
          </motion.p>

          {/* Bio */}
          <motion.p {...fadeUp(0.35)} style={{ fontSize: 'clamp(13px,1.2vw,16px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: 490, marginBottom: 'clamp(24px,4vh,44px)' }}>
            {PERSONAL.bio}
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.45)} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href={PERSONAL.github} target="_blank" rel="noreferrer"
              style={{
                padding: '14px 36px', background: '#fff', color: '#000',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textDecoration: 'none',
                textTransform: 'uppercase', transition: 'background 0.25s, color 0.25s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#00F5FF' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff' }}
            >
              GitHub ↗
            </a>
            <a href={`mailto:${PERSONAL.email}`}
              style={{
                padding: '14px 36px', background: 'transparent', color: '#fff',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textDecoration: 'none',
                textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)',
                transition: 'border-color 0.25s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#00F5FF' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
            >
              Let's Talk
            </a>
          </motion.div>
        </div>

        {/* Right — blended ambient animation */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            gap: 16,
            width: 'clamp(240px, 24vw, 380px)',
            height: 'clamp(360px, 56vh, 560px)',
          }}
          className="hidden lg:flex mt-auto"
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
              borderRadius: '50% 50% 44% 56% / 44% 58% 42% 56%',
            }}
          >
            <motion.div
              animate={{ x: [-24, 20, -24], y: [-16, 14, -16], scale: [0.94, 1.04, 0.94] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '8%',
                left: '-16%',
                width: '78%',
                height: '56%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,245,255,0.36) 0%, rgba(0,245,255,0.12) 42%, transparent 78%)',
                filter: 'blur(34px)',
                mixBlendMode: 'screen',
              }}
            />

            <motion.div
              animate={{ x: [18, -18, 18], y: [12, -14, 12], scale: [1, 0.9, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                right: '-18%',
                bottom: '8%',
                width: '76%',
                height: '56%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(188,19,254,0.28) 0%, rgba(188,19,254,0.1) 42%, transparent 80%)',
                filter: 'blur(36px)',
                mixBlendMode: 'screen',
              }}
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: '22%',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,0.18), rgba(255,255,255,0), rgba(0,245,255,0.24), rgba(255,255,255,0))',
                filter: 'blur(6px)',
                opacity: 0.68,
              }}
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: '32%',
                borderRadius: '50%',
                background: 'conic-gradient(from 90deg, rgba(255,255,255,0), rgba(188,19,254,0.24), rgba(255,255,255,0), rgba(255,255,255,0.14), rgba(255,255,255,0))',
                filter: 'blur(5px)',
                opacity: 0.66,
              }}
            />

            <motion.div
              animate={{ opacity: [0.08, 0.2, 0.08] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: '42%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 72%)',
                filter: 'blur(3px)',
              }}
            />

            <div
              style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 58% 64%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 24%, transparent 62%)',
              mixBlendMode: 'screen',
            }}
            />

            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 32%, rgba(0,0,0,0.72) 100%)',
            }} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            style={{
              marginTop: 'auto',
              alignSelf: 'center',
            }}
          >
            <a
              href="./m_muqeet_khan_CV.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 22px',
                background: 'transparent',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.45)',
                transition: 'background 0.25s, color 0.25s, border-color 0.25s',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.background = '#fff'
                ;(e.currentTarget as HTMLElement).style.color = '#000'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#fff'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.color = '#fff'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.45)'
              }}
            >
              View Resume
            </a>
          </motion.div>
        </motion.div>

      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', right: '4%', bottom: 40,
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 9, fontWeight: 700, letterSpacing: '0.45em',
        color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
      }}>
        Scroll →
        <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.15)' }} />
      </div>
    </div>
  )
}
