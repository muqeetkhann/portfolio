'use client'

import { useId } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { NAVIGATION, UI_COPY } from '@/lib/data'
import { useReducedMotion } from '@/lib/reduced-motion'

export function DesktopNav({ activeIndex, onNavigate }: { activeIndex: number; onNavigate: (index: number) => void }) {
  const layoutId = useId()
  const reduced = useReducedMotion()

  return (
    <header className="site-header desktop-header">
      <div className="site-container">
        <div className="site-nav">
          <LayoutGroup id={layoutId}>
            <nav aria-label={UI_COPY.navigation}>
              {NAVIGATION.map((item, index) => (
                <button key={item.id} type="button" aria-current={index === activeIndex ? 'page' : undefined} onClick={() => onNavigate(index)}>
                  {index === activeIndex ? (
                    <motion.span
                      className="nav-active-pill"
                      layoutId="active-page"
                      initial={false}
                      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36, mass: 0.8 }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="nav-label">{item.label}</span>
                </button>
              ))}
            </nav>
          </LayoutGroup>
        </div>
      </div>
    </header>
  )
}
