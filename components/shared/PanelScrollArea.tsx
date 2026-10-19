import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Native inner scrolling hands input back to Lenis at either boundary. */
export function PanelScrollArea({
  children,
  label,
  enabled,
}: {
  children: ReactNode
  label: string
  enabled: boolean
}) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={enabled ? 0 : undefined}
      className={cn(
        'min-h-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-purple',
        enabled && 'panel-scroll flex-1 overflow-y-auto pr-3',
      )}
    >
      {children}
    </div>
  )
}
