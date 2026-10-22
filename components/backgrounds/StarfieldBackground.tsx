'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { prefersReducedMotion, useReducedMotion } from '@/lib/reduced-motion'
import styles from './StarfieldBackground.module.css'

const STAR_COUNT = 60
const MOBILE_STAR_COUNT = 30
const random = (min: number, max: number) => min + Math.random() * (max - min)

// Stable server/client markup. Motion is randomized after hydration.
const STARS = Array.from({ length: STAR_COUNT }, (_, index) => {
  const noise = (salt: number) => {
    const value = Math.sin((index + 1) * salt) * 10000
    return value - Math.floor(value)
  }
  return {
    x: noise(127.1) * 100,
    y: noise(311.7) * 100,
    size: 1 + noise(74.7) * 1.2,
    opacity: 0.2 + noise(269.5) * 0.28,
  }
})

/** One viewport-sized field, independent of the desktop track and mobile flow. */
export function StarfieldBackground() {
  const root = useRef<HTMLDivElement>(null)
  const meteor = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const element = root.current
    const trail = meteor.current
    if (!element || !trail || reduced || prefersReducedMotion()) return
    if (typeof element.animate !== 'function') return

    const compact = window.matchMedia('(max-width: 767px)')
    const stars = Array.from(element.querySelectorAll<HTMLSpanElement>('[data-star]'))
    const animations = new Set<Animation>()
    let timer: ReturnType<typeof setTimeout> | undefined
    let running = false

    const stop = () => {
      running = false
      element.dataset.running = 'false'
      clearTimeout(timer)
      animations.forEach(animation => animation.cancel())
      animations.clear()
    }

    const twinkle = (star: HTMLSpanElement, index: number, initial = false) => {
      const base = STARS[index].opacity
      const peak = random(0.3, 0.7)
      const animation = star.animate([
        { opacity: base, offset: 0 },
        { opacity: base * 0.3, offset: peak - 0.18 },
        { opacity: random(0.5, 0.85), offset: peak },
        { opacity: base * 0.5, offset: peak + 0.18 },
        { opacity: base, offset: 1 },
      ], {
        duration: random(4000, 10000),
        delay: random(0, initial ? 6000 : 2500),
        easing: 'ease-in-out',
      })
      animations.add(animation)
      animation.onfinish = () => {
        animations.delete(animation)
        if (running) twinkle(star, index)
      }
    }

    const scheduleMeteor = (delay = random(2500, 6500)) => {
      timer = setTimeout(() => {
        if (!running) return
        const distance = random(compact.matches ? 150 : 260, compact.matches ? 280 : 560)
        const angle = random(22, 40)
        const radians = angle * Math.PI / 180
        const x = Math.cos(radians) * distance
        const y = Math.sin(radians) * distance
        const transform = (progress: number) => `translate3d(${x * progress}px, ${y * progress}px, 0) rotate(${angle}deg)`

        trail.style.left = `${random(-10, 80)}%`
        trail.style.top = `${random(4, 76)}%`
        trail.style.width = `${random(compact.matches ? 55 : 80, compact.matches ? 100 : 160)}px`

        const animation = trail.animate([
          { transform: transform(0), opacity: 0, offset: 0 },
          { transform: transform(0.12), opacity: 0.65, offset: 0.12 },
          { transform: transform(0.72), opacity: 0.5, offset: 0.72 },
          { transform: transform(1), opacity: 0, offset: 1 },
        ], { duration: distance / random(180, 380) * 1000, easing: 'linear' })

        animations.add(animation)
        animation.onfinish = () => {
          animations.delete(animation)
          if (running) scheduleMeteor()
        }
      }, delay)
    }

    const sync = () => {
      stop()
      if (document.hidden) return
      running = true
      element.dataset.running = 'true'
      stars.slice(0, compact.matches ? MOBILE_STAR_COUNT : STAR_COUNT).forEach((star, index) => twinkle(star, index, true))
      scheduleMeteor(random(700, 1800))
    }

    document.addEventListener('visibilitychange', sync)
    compact.addEventListener('change', sync)
    sync()

    return () => {
      stop()
      document.removeEventListener('visibilitychange', sync)
      compact.removeEventListener('change', sync)
    }
  }, [reduced])

  return (
    <div ref={root} className={styles.background} data-site-background data-running="false" aria-hidden="true">
      {STARS.map((star, index) => (
        <span key={index} data-star className={styles.star} style={{
          left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size,
          '--star-opacity': star.opacity,
        } as CSSProperties} />
      ))}
      <span ref={meteor} className={styles.meteor} />
    </div>
  )
}
