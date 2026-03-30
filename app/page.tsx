'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import Experience from '@/components/sections/Experience'
import ProjectsWeb3 from '@/components/sections/ProjectsWeb3'
import ProjectsSaaS from '@/components/sections/ProjectsSaaS'
import ProjectsSites from '@/components/sections/ProjectsSites'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'
import CustomCursor from '@/components/CustomCursor'
import ResponsivePortfolio from '@/components/ResponsivePortfolio'

const TOTAL_SECTIONS = 7
const DESKTOP_QUERY = '(min-width: 1536px)'

function DesktopPortfolio() {
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isScrolling = useRef(false)
  const lastWheelTime = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    const progress = progressRef.current
    if (!track) return

    track.scrollTo({
      left: activeIndex * window.innerWidth,
      behavior: 'smooth',
    })

    if (progress) {
      const pct = activeIndex / (TOTAL_SECTIONS - 1)
      progress.style.width = `${pct * 100}%`
    }
  }, [activeIndex])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const now = Date.now()
      if (now - lastWheelTime.current < 1000 || isScrolling.current) return

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX

      if (Math.abs(delta) > 5) {
        if (delta > 0 && activeIndex < TOTAL_SECTIONS - 1) {
          isScrolling.current = true
          lastWheelTime.current = now
          setActiveIndex(prev => prev + 1)
          setTimeout(() => {
            isScrolling.current = false
          }, 1000)
        } else if (delta < 0 && activeIndex > 0) {
          isScrolling.current = true
          lastWheelTime.current = now
          setActiveIndex(prev => prev - 1)
          setTimeout(() => {
            isScrolling.current = false
          }, 1000)
        }
      }
    }

    let touchStartY = 0
    let touchStartX = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheelTime.current < 1000 || isScrolling.current) return

      const deltaY = touchStartY - e.touches[0].clientY
      const deltaX = touchStartX - e.touches[0].clientX
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)
      const delta = isHorizontal ? deltaX : deltaY

      if (Math.abs(delta) > 30) {
        if (delta > 0 && activeIndex < TOTAL_SECTIONS - 1) {
          isScrolling.current = true
          lastWheelTime.current = now
          setActiveIndex(prev => prev + 1)
          setTimeout(() => {
            isScrolling.current = false
          }, 1000)
        } else if (delta < 0 && activeIndex > 0) {
          isScrolling.current = true
          lastWheelTime.current = now
          setActiveIndex(prev => prev - 1)
          setTimeout(() => {
            isScrolling.current = false
          }, 1000)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    const handleResize = () => {
      track.scrollTo({ left: activeIndex * window.innerWidth, behavior: 'auto' })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [activeIndex])

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        width: '100dvw',
        height: '100dvh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <CustomCursor />

      <Navbar onNavigate={setActiveIndex} />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          height: 2,
          background: 'rgba(255,255,255,0.08)',
          width: '100%',
          zIndex: 8999,
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            background: '#00F5FF',
            width: '0%',
            transition: 'width 0.8s cubic-bezier(0.87, 0, 0.13, 1)',
          }}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 'clamp(20px, 4%, 60px)',
          zIndex: 9000,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.3em',
          color: 'rgba(255,255,255,0.3)',
          fontFamily: 'Syne, sans-serif',
        }}
      >
        0{activeIndex + 1} / 0{TOTAL_SECTIONS}
      </div>

      <div
        id="h-track"
        ref={trackRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}
      >
        <section style={{ width: '100dvw', height: '100dvh', flexShrink: 0 }}>
          <Hero />
        </section>
        <section style={{ width: '100dvw', height: '100dvh', flexShrink: 0 }}>
          <Experience />
        </section>
        <section style={{ width: '100dvw', height: '100dvh', flexShrink: 0 }}>
          <ProjectsWeb3 />
        </section>
        <section style={{ width: '100dvw', height: '100dvh', flexShrink: 0 }}>
          <ProjectsSaaS />
        </section>
        <section style={{ width: '100dvw', height: '100dvh', flexShrink: 0 }}>
          <ProjectsSites />
        </section>
        <section style={{ width: '100dvw', height: '100dvh', flexShrink: 0 }}>
          <Skills />
        </section>
        <section style={{ width: '100dvw', height: '100dvh', flexShrink: 0 }}>
          <Contact />
        </section>
      </div>
    </main>
  )
}

export default function Home() {
  const [isDesktopMode, setIsDesktopMode] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktopMode(media.matches)

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return isDesktopMode ? <DesktopPortfolio /> : <ResponsivePortfolio />
}
