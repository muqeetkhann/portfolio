'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { scrollEdges } from '@/lib/scroll-effects'

/** A non-interactive overlay; it never changes a scroller's dimensions/input. */
export function ScrollEdges({ target, refreshKey }: {
  target: RefObject<HTMLElement | null>
  refreshKey?: string | number
}) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroller = target.current
    const overlay = root.current
    if (!scroller || !overlay) return
    let frame = 0
    let disposed = false
    const update = () => {
      frame = 0
      if (disposed) return
      const edges = scrollEdges(scroller.scrollTop, scroller.scrollHeight, scroller.clientHeight)
      overlay.style.setProperty('--edge-top', String(edges.top))
      overlay.style.setProperty('--edge-bottom', String(edges.bottom))
    }
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update) }
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
    observer?.observe(scroller)
    Array.from(scroller.children).forEach(child => observer?.observe(child))
    scroller.addEventListener('scroll', schedule, { passive: true })
    scroller.addEventListener('load', schedule, true)
    window.addEventListener('resize', schedule)
    update()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer?.disconnect()
      scroller.removeEventListener('scroll', schedule)
      scroller.removeEventListener('load', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [target, refreshKey])

  return <div ref={root} className="scroll-edges" aria-hidden="true"><span className="scroll-edge-top" /><span className="scroll-edge-bottom" /></div>
}
