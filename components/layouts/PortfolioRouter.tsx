'use client'

import { useEffect, useState } from 'react'
import DesktopPortfolio from '@/components/layouts/DesktopPortfolio'
import MobilePortfolio from '@/components/layouts/MobilePortfolio'

/** Breakpoint that splits the horizontal desktop track from vertical mobile. */
const DESKTOP_QUERY = '(min-width: 1280px)'

export default function PortfolioRouter() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktop(media.matches)

    update()
    setReady(true)
    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [])

  // null until the viewport is known — avoids a hydration mismatch.
  if (!ready) return null

  return isDesktop ? <DesktopPortfolio /> : <MobilePortfolio />
}
