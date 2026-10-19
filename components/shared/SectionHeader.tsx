'use client'

import { useEffect, useState, type ComponentType } from 'react'
import { useReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'

type SweepProps = {
  inline?: boolean
  tag?: string
  text?: string
  font?: React.CSSProperties
  color?: string
  waveColor?: string
  startY?: number
  stagger?: number
  transition?: Record<string, unknown>
  appearTrigger?: 'default' | 'hover' | 'scroll'
  scrollConfig?: { position: 'top' | 'bottom'; distance: number }
}

/** Cyan on the dark panels, a deeper blue on the inverted white one. */
const WAVE = { dark: '#00F5FF', light: '#0EA5E9' } as const

/**
 * Kicker + display title, with an optional gradient-masked accent word.
 * `tone` picks the gradient that reads against the section background —
 * 'light' for the inverted (white) Experience section.
 *
 * The title runs a per-letter colour sweep on reveal. Only the base title is
 * swept: the accent keeps its gradient mask, which sets
 * `-webkit-text-fill-color: transparent` and would swallow any per-letter
 * colour the sweep set anyway.
 *
 * The sweep is imported by hand rather than through `next/dynamic` so the plain
 * title stays on screen until the chunk has actually resolved. A `next/dynamic`
 * `loading` fallback can't see the title text, so the heading would blink empty
 * on the way in; here the sweep only ever replaces text that is already
 * rendered. The motion runtime still stays out of the initial bundle.
 *
 * Note this buys nothing for SEO or no-JS: `PortfolioRouter` returns null until
 * it has measured the viewport, so the whole portfolio is client-rendered and
 * the exported HTML carries only the <head> metadata either way. The win is
 * purely that the heading never flashes empty after hydration.
 *
 * Triggering differs by shell, for the same reason `PanelAmbient` takes
 * `active`. The sweep decides visibility from `getBoundingClientRect()` against
 * the viewport, and every panel of the desktop track sits at y=0 inside the
 * translated row — so a scroll trigger there fires all four at once, off-screen,
 * and the user sees none of them. Desktop instead passes `active` and the sweep
 * is remounted by `key` when its panel becomes current. Mobile is an ordinary
 * vertical flow, where the scroll trigger is correct.
 */
export function SectionHeader({
  kicker,
  title,
  accent,
  tone = 'dark',
  className,
  active,
  variant,
}: {
  kicker: string
  title: string
  accent?: string
  tone?: 'dark' | 'light'
  className?: string
  /** Desktop: the panel is current. Drives the remount that runs the sweep. */
  active?: boolean
  /** 'desktop' selects the active-gated trigger; omit for the scroll trigger. */
  variant?: 'desktop'
}) {
  const reduced = useReducedMotion()
  const isDesktop = variant === 'desktop'
  const [Sweep, setSweep] = useState<ComponentType<SweepProps> | null>(null)

  useEffect(() => {
    if (reduced) return
    let alive = true
    import('@/components/originkit/ui/text-colour-sweep').then(m => {
      if (alive) setSweep(() => m.default as ComponentType<SweepProps>)
    })
    return () => {
      alive = false
    }
  }, [reduced])

  return (
    <div className={cn('mb-10', className)}>
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-title">
        {Sweep && !reduced ? (
          <Sweep
            // Remounting is what replays the sweep: the component runs its
            // entrance once per mount, so on desktop the key flips with the
            // panel and the title animates as that panel arrives.
            key={isDesktop ? `${title}-${active}` : title}
            inline
            tag="span"
            text={title}
            // Empty on purpose — an inline-block span inside the h2 inherits
            // .section-title (Clash, the clamped size, the -0.03em tracking)
            // rather than re-declaring the type scale in JS where it would
            // drift from globals.css.
            font={{}}
            color={tone === 'light' ? '#000000' : '#FFFFFF'}
            waveColor={tone === 'light' ? WAVE.light : WAVE.dark}
            startY={18}
            stagger={0.03}
            transition={{ type: 'tween', duration: 0.5, ease: 'easeOut' }}
            appearTrigger={isDesktop ? 'default' : 'scroll'}
            scrollConfig={{ position: 'top', distance: 85 }}
          />
        ) : (
          title
        )}
        {accent ? (
          <> <span className={tone === 'light' ? 'masked-text-light' : 'masked-text-dark'}>{accent}</span></>
        ) : null}
      </h2>
    </div>
  )
}
