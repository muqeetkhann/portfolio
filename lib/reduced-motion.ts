'use client'

import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** One-shot check — for imperative code (event handlers, GSAP setup). */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(QUERY).matches
}

/**
 * Reactive `prefers-reduced-motion`. Starts `false` on the server/first paint
 * (so SSR markup matches), then syncs to the real value after mount and on change.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}
