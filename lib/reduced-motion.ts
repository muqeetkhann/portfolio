'use client'

import { useEffect, useState } from 'react'

/**
 * Reactive `prefers-reduced-motion`. Starts `false` on the server/first paint
 * (so SSR markup matches), then syncs to the real value after mount and on change.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}
