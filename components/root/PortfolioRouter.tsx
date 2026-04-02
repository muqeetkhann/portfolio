'use client'

import { useEffect, useState } from 'react'
import DesktopPortfolio from '@/components/desktop/DesktopPortfolio'
import PortfolioPage from '@/components/portfolio/PortfolioPage'

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

    return () => {
      media.removeEventListener('change', update)
    }
  }, [])

  if (!ready) {
    return null
  }

  return isDesktop ? <DesktopPortfolio /> : <PortfolioPage />
}
