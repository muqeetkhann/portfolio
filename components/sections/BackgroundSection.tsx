import type { RefObject } from 'react'
import { BackgroundSequence, type BackgroundSequenceController } from '@/components/sections/BackgroundSequence'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { BACKGROUND_COPY, UI_COPY } from '@/lib/data'
import { cn } from '@/lib/utils'

/** One combined career/toolkit body for both scrolling layouts. */
export function BackgroundSection({ variant = 'mobile', scrollable = false, active, sequenceController }: {
  variant?: 'desktop' | 'mobile'
  scrollable?: boolean
  active?: boolean
  sequenceController?: RefObject<BackgroundSequenceController | null>
}) {
  return (
    <div className={cn('site-container background-section', variant === 'desktop' && 'desktop-section-shell')}>
      <div className="background-heading">
        <SectionHeader {...UI_COPY.sections.background} active={active} />
      </div>
      <div
        role="region"
        aria-label={BACKGROUND_COPY.regionLabel}
        tabIndex={scrollable ? 0 : undefined}
        className={cn('background-window', scrollable && 'background-window-desktop')}
      >
        <BackgroundSequence variant={variant} enabled={variant === 'mobile' || scrollable} controller={sequenceController} />
      </div>
    </div>
  )
}
