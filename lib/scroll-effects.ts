const clamp = (value: number) => Math.min(1, Math.max(0, value))

/** Ignore the last pixel: native scrolling can round a fractional scroll range. */
export function scrollEdges(top: number, content: number, viewport: number) {
  const maximum = Math.max(0, content - viewport)
  if (maximum <= 1) return { top: 0, bottom: 0 }
  return {
    top: clamp((top - 1) / 24),
    bottom: clamp((maximum - top - 1) / 24),
  }
}

/** Fill from the lower part of the frame until the role passes its midpoint. */
export function timelineProgress(top: number, height: number, frameTop: number, frameHeight: number) {
  if (frameHeight <= 0 || height <= 0) return 0
  return clamp((frameTop + frameHeight * 0.8 - top) / (height + frameHeight * 0.35))
}

/** Content gets its full overflow distance before the next stage enters. */
export function backgroundSequenceLayout(viewport: number, heights: number[]) {
  const hold = Math.max(160, viewport * 0.35)
  const transition = Math.max(180, Math.min(360, viewport * 0.45))
  let cursor = 0
  const stages = heights.map((height, index) => {
    const start = cursor
    const overflow = Math.max(0, height - viewport)
    const end = start + hold + overflow
    cursor = end + (index < heights.length - 1 ? transition : 0)
    return { start, end, hold, overflow }
  })
  return { stages, transition, distance: cursor }
}

/** The desktop sequence advances only while its horizontal panel is parked. */
export function backgroundSequenceProgress(position: number, start: number, distance: number) {
  return distance > 0 ? clamp((position - start) / distance) : 0
}
