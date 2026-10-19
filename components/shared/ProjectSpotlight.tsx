'use client'

import { AnimatePresence, motion, useIsPresent, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { SPOTLIGHT, SPOTLIGHT_COPY, type Project } from '@/lib/data'
import { asset, cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/reduced-motion'

const ROTATE_MS = 5000
const SLIDE_EASE = [0.22, 1, 0.36, 1] as const
const previewVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 24, scale: 1.035 }),
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -16, scale: 0.985 }),
}
const detailsVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 14, y: 4 }),
  visible: { opacity: 1, x: 0, y: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -10, y: -2 }),
}

type Slide = { index: number; direction: number; revision: number }

/** A shared, accessible project carousel. Manual navigation holds the selection. */
export default function ProjectSpotlight({
  onOpen,
  className,
  active,
}: {
  onOpen?: (project: Project) => void
  className?: string
  /** Desktop must use the panel index; mobile uses intersection visibility. */
  active?: boolean
}) {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const [slide, setSlide] = useState<Slide>({ index: 0, direction: 1, revision: 0 })
  const cycleRef = useRef({ revision: 0, remaining: ROTATE_MS })
  const [manuallyPaused, setManuallyPaused] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(true)
  const { index } = slide
  const playing = !reduced && !manuallyPaused && !hovered && !focused && documentVisible && (active ?? visible)
  const current = SPOTLIGHT[index]

  useEffect(() => {
    if (active !== undefined || reduced) return
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      entries => setVisible(entries.some(entry => entry.isIntersecting)),
      { threshold: 0.2 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [active, reduced])

  useEffect(() => {
    const update = () => setDocumentVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    // Keep the countdown and its CSS progress in sync through temporary pauses.
    if (cycleRef.current.revision !== slide.revision) {
      cycleRef.current = { revision: slide.revision, remaining: ROTATE_MS }
    }
    if (!playing || SPOTLIGHT.length < 2) return
    const remaining = cycleRef.current.remaining
    const started = performance.now()
    const timer = window.setTimeout(() => {
      setSlide(value => ({ index: (value.index + 1) % SPOTLIGHT.length, direction: 1, revision: value.revision + 1 }))
    }, remaining)
    return () => {
      window.clearTimeout(timer)
      cycleRef.current.remaining = Math.max(0, remaining - (performance.now() - started))
    }
  }, [playing, slide.revision])

  useEffect(() => {
    if (!(active ?? visible)) return
    // Warm adjacent covers so even the first manual change can crossfade cleanly.
    for (const offset of [-1, 1]) {
      const project = SPOTLIGHT[(index + offset + SPOTLIGHT.length) % SPOTLIGHT.length]
      const image = new Image()
      image.decoding = 'async'
      image.fetchPriority = 'low'
      image.src = asset(project.media.cover.endsWith('.svg') ? SPOTLIGHT_COPY.artwork : project.media.cover)
    }
  }, [index, active, visible])

  if (!current) return null

  const select = (next: number | ((value: number) => number), direction: number) => {
    setSlide(value => {
      const target = typeof next === 'function' ? next(value.index) : next
      const index = (target + SPOTLIGHT.length) % SPOTLIGHT.length
      return index === value.index ? value : { index, direction, revision: value.revision + 1 }
    })
    setManuallyPaused(true)
  }

  return (
    <section
      ref={rootRef}
      aria-label={SPOTLIGHT_COPY.heading}
      aria-roledescription="carousel"
      className={cn('spotlight relative w-full max-w-[30rem]', className)}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false) }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          const direction = event.key === 'ArrowRight' ? 1 : -1
          select(value => value + direction, direction)
        }
      }}
    >
      <div className="spotlight-card">
        <div className="flex min-h-[68px] items-center justify-between gap-3 px-5 py-2 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">{SPOTLIGHT_COPY.heading}</p>
          {!reduced && SPOTLIGHT.length > 1 ? (
            <button
              type="button"
              aria-label={manuallyPaused ? SPOTLIGHT_COPY.resumeLabel : SPOTLIGHT_COPY.pauseLabel}
              onClick={() => {
                setManuallyPaused(value => !value)
                // An explicit Play request can start while this button has focus.
                setHovered(false)
                setFocused(false)
              }}
              className="spotlight-rotation"
              data-enabled={!manuallyPaused}
              data-playing={playing}
              title={SPOTLIGHT_COPY.autoplay}
            >
              <span aria-hidden className={cn('spotlight-playback-icon', !manuallyPaused && 'is-pause')} />
              <span>{manuallyPaused ? SPOTLIGHT_COPY.resume : SPOTLIGHT_COPY.pause}</span>
              <span aria-hidden className="spotlight-playback-track">
                <span key={slide.revision} className="spotlight-playback-progress" style={{ animationDuration: `${ROTATE_MS}ms` }} />
              </span>
            </button>
          ) : null}
        </div>

        {/* Animate the visual layers, keeping the stretched CTA mounted for focus and its full-card hit area. */}
        <div aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="group relative text-left">
            <div className="spotlight-stage relative mx-3 overflow-hidden rounded-[20px] bg-[#102023] sm:mx-4">
              <AnimatePresence initial={false} custom={slide.direction}>
                <SpotlightVisual key={slide.revision} project={current} direction={slide.direction} reduced={reduced} />
              </AnimatePresence>
            </div>

            <div className="px-5 pb-5 pt-5 sm:px-6">
              <div className="spotlight-details relative">
                <AnimatePresence initial={false} custom={slide.direction}>
                  <SpotlightMetadata key={slide.revision} project={current} direction={slide.direction} reduced={reduced} />
                </AnimatePresence>
              </div>

              <button
                type="button"
                aria-label={`${SPOTLIGHT_COPY.open}: ${current.title}`}
                onClick={() => {
                  setManuallyPaused(true)
                  onOpen?.(current)
                }}
                className="spotlight-open mt-3 flex w-full items-center justify-between border-t border-white/10 pt-4 text-left text-[12px] font-semibold text-neon-cyan before:absolute before:inset-0 before:cursor-pointer"
              >
                <span>{SPOTLIGHT_COPY.open}</span>
                <span aria-hidden className="text-xl leading-none transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none">↗</span>
              </button>
            </div>
        </div>

        {SPOTLIGHT.length > 1 ? (
          <div className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-2 sm:px-5">
            <div role="group" aria-label={SPOTLIGHT_COPY.navigation} className="flex items-center">
              {SPOTLIGHT.map((project, position) => (
                <button
                  key={project.id}
                  type="button"
                  aria-label={`${SPOTLIGHT_COPY.select}: ${project.title}`}
                  aria-pressed={position === index}
                  onClick={() => select(position, position >= index ? 1 : -1)}
                  className="spotlight-dot flex h-10 w-7 items-center justify-center rounded-full sm:w-8"
                >
                  <span aria-hidden className={cn('h-1.5 rounded-full transition-[background-color,transform] duration-200', position === index ? 'w-5 bg-neon-cyan' : 'w-1.5 bg-white/30')} />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button type="button" aria-label={SPOTLIGHT_COPY.previous} onClick={() => select(value => value - 1, -1)} className="spotlight-arrow">←</button>
              <button type="button" aria-label={SPOTLIGHT_COPY.next} onClick={() => select(value => value + 1, 1)} className="spotlight-arrow">→</button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function SpotlightVisual({ project, direction, reduced }: { project: Project; direction: number; reduced: boolean }) {
  const present = useIsPresent()

  return (
    <motion.div
      aria-hidden={!present || undefined}
      className="pointer-events-none absolute inset-0"
      custom={direction}
      variants={previewVariants}
      initial={reduced ? false : 'enter'}
      animate={reduced ? { opacity: 1, x: 0, scale: 1 } : 'visible'}
      exit={reduced ? { opacity: 0 } : 'exit'}
      transition={{ duration: reduced ? 0 : 0.65, ease: SLIDE_EASE }}
    >
      <SpotlightPreview project={project} />
    </motion.div>
  )
}

function SpotlightMetadata({ project, direction, reduced }: { project: Project; direction: number; reduced: boolean }) {
  const present = useIsPresent()
  // The category distinguishes the two portals while their shared name stays compact.
  const title = project.title.split(' — ')[0]

  return (
    <motion.div
      aria-hidden={!present || undefined}
      className="pointer-events-none absolute inset-0"
      custom={direction}
      variants={detailsVariants}
      initial={reduced ? false : 'enter'}
      animate={reduced ? { opacity: 1, x: 0, y: 0 } : 'visible'}
      exit={reduced ? { opacity: 0 } : 'exit'}
      transition={{ duration: reduced ? 0 : 0.45, ease: SLIDE_EASE }}
    >
      <p className="text-[10px] font-semibold uppercase leading-5 tracking-[0.14em] text-white/60">{project.type}</p>
      <h2 className="mt-1 font-heading text-[clamp(1.65rem,3vw,2.15rem)] leading-[1.08] tracking-[-0.025em] text-white">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-white/65">
        {project.tags.slice(0, 3).map(tag => <li key={tag}>{tag}</li>)}
      </ul>
    </motion.div>
  )
}

function SpotlightPreview({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const placeholder = project.media.cover.endsWith('.svg')

  return (
    <div className={cn('spotlight-preview absolute inset-0', !loaded && 'spotlight-preview-loading')}>
      {!failed ? (
        <img
          src={asset(placeholder ? SPOTLIGHT_COPY.artwork : project.media.cover)}
          alt={placeholder ? '' : (project.media.coverAlt ?? `${project.title} preview`)}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn('h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none', placeholder && 'opacity-60')}
        />
      ) : null}
      {placeholder || failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-5 text-center">
          <span className="font-heading text-4xl text-white">{project.title}</span>
          {failed ? <span className="text-xs text-white/65">{SPOTLIGHT_COPY.unavailable}</span> : null}
        </div>
      ) : null}
      {project.media.caption ? <span className="sr-only">{project.media.caption}</span> : null}
    </div>
  )
}
