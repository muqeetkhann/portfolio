'use client'

import { PERSONAL } from '@/lib/data'
import { cn } from '@/lib/utils'

/** Panel labels, in track order. Index === panel index. */
export const DESKTOP_NAV = ['Intro', 'Experience', 'Projects', 'Stack', 'Contact']

/** Fixed pill nav for the horizontal desktop layout. */
export function DesktopNav({
  activeIndex,
  onNavigate,
}: {
  activeIndex: number
  onNavigate: (index: number) => void
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="section-shell pb-5 pt-[max(1rem,env(safe-area-inset-top))] xl:pt-6">
        <div
          className="flex items-center justify-between rounded-full border border-white/14 px-5 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)' }}
        >
          <span className="text-[12px] font-bold uppercase tracking-[0.24em] text-white">
            {PERSONAL.initials} // Portfolio
          </span>
          <nav className="flex items-center gap-2">
            {DESKTOP_NAV.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => onNavigate(index)}
                className={cn(
                  'rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition',
                  activeIndex === index ? 'bg-white text-black' : 'text-white/65 hover:text-white',
                )}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
