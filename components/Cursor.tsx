'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return
    const dotEl = dot
    const ringEl = ring

    let mouseX = -100, mouseY = -100
    let ringX  = -100, ringY  = -100
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('a,button,[data-hover]')) {
        dotEl.style.transform  = 'translate(-50%,-50%) scale(2.5)'
        ringEl.style.transform = 'translate(-50%,-50%) scale(1.8)'
        ringEl.style.borderColor = 'rgba(110,231,183,0.6)'
      }
    }
    const onOut = () => {
      dotEl.style.transform  = 'translate(-50%,-50%) scale(1)'
      ringEl.style.transform = 'translate(-50%,-50%) scale(1)'
      ringEl.style.borderColor = 'rgba(110,231,183,0.35)'
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      dotEl.style.left  = mouseX + 'px'
      dotEl.style.top   = mouseY + 'px'
      ringEl.style.left = ringX  + 'px'
      ringEl.style.top  = ringY  + 'px'
      raf = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout',  onOut)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout',  onOut)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 8, height: 8, borderRadius: '50%',
        background: '#6EE7B7', pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%,-50%)',
        transition: 'transform 0.15s ease',
        left: -100, top: -100,
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 36, height: 36, borderRadius: '50%',
        border: '1px solid rgba(110,231,183,0.35)',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%,-50%)',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        left: -100, top: -100,
      }} />
    </>
  )
}
