'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse   = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0, rotation: 0 })
  const rafId   = useRef<number>(0)
  const isHover = useRef(false)
  const isClick = useRef(false)

  useEffect(() => {
    const dot   = dotRef.current
    const ringEl= ringRef.current
    if (!dot || !ringEl) return

    /* ── track mouse ── */
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      // move the central dot instantly
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    /* ── hover detection ── */
    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, input, [data-cursor-hover]')) {
        isHover.current = true
      }
    }
    const onLeave = () => { isHover.current = false }
    const onDown  = () => { isClick.current = true }
    const onUp    = () => { isClick.current = false }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onEnter)
    window.addEventListener('mouseout',  onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)

    /* ── lerp animation ── */
    const animate = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t

      // follow the mouse with some lag
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.15)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.15)
      
      // continuous slow rotation, speeds up on hover
      ring.current.rotation += isHover.current ? 2 : 0.4

      const scale = isClick.current ? 0.7 : isHover.current ? 1.4 : 1
      const opacity = isHover.current ? 1 : 0.4

      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) rotate(${ring.current.rotation}deg) scale(${scale})`
      ringEl.style.opacity   = String(opacity)
      // When hovering interactables, scale expands. Since it's difference blended, we just keep it white
      ringEl.style.color     = '#fff'

      rafId.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onEnter)
      window.removeEventListener('mouseout',  onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      {/* Instant tiny target dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: -2, left: -2,
          width: 4, height: 4,
          background: '#fff',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      />
      {/* Sci-fi Reticle */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: -20, left: -20,
          width: 40, height: 40,
          pointerEvents: 'none',
          zIndex: 99998,
          mixBlendMode: 'difference',
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff'
        }}
      >
        {/* SVG geometric target crosshair */}
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 30" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <path d="M 50 0 L 50 15 M 50 85 L 50 100 M 0 50 L 15 50 M 85 50 L 100 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </>
  )
}
