'use client'

import { AnimatePresence, motion, useIsPresent, type Variants } from 'motion/react'
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { HERO_COPY, SPOTLIGHT, SPOTLIGHT_COPY, UI_COPY, type Project } from '@/lib/data'
import { asset, cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/reduced-motion'

const ROTATE_MS = 5000
const SLIDE_EASE = [0.22, 1, 0.36, 1] as const
const previewVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 24, scale: 1.035 }),
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -16, scale: 0.985 }),
}

type Slide = { index: number; direction: number; revision: number }

/** The compact carousel rotates automatically; interaction pauses its countdown. */
export default function ProjectSpotlight({
  onOpen,
  active,
  initialSlug,
  projectSlug,
  suspended = false,
}: {
  onOpen?: (project: Project) => void
  /** Desktop must use the panel index; mobile uses intersection visibility. */
  active?: boolean
  initialSlug?: string
  projectSlug?: string
  suspended?: boolean
}) {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const [slide, setSlide] = useState<Slide>({ index: Math.max(0, SPOTLIGHT.findIndex(project => project.slug === initialSlug)), direction: 1, revision: 0 })
  const cycleRef = useRef({ revision: 0, remaining: ROTATE_MS })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(true)
  const { index } = slide
  const playing = !reduced && !suspended && !hovered && !focused && documentVisible && (active ?? visible)
  const current = SPOTLIGHT[index]

  useEffect(() => {
    const next = SPOTLIGHT.findIndex(project => project.slug === projectSlug)
    if (next < 0) return
    setSlide(value => value.index === next ? value : { index: next, direction: next > value.index ? 1 : -1, revision: value.revision + 1 })
  }, [projectSlug])

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
      if (project.media.cover.endsWith('.svg')) continue
      const image = new Image()
      image.decoding = 'async'
      image.fetchPriority = 'low'
      image.src = asset(project.media.cover)
    }
  }, [index, active, visible])

  if (!current) return null

  const select = (next: number | ((value: number) => number), direction: number) => {
    setSlide(value => {
      const target = typeof next === 'function' ? next(value.index) : next
      const index = (target + SPOTLIGHT.length) % SPOTLIGHT.length
      return index === value.index ? value : { index, direction, revision: value.revision + 1 }
    })
  }

  return (
    <section ref={rootRef} className="spotlight spotlight-compact" aria-label={SPOTLIGHT_COPY.heading} aria-roledescription="carousel"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false) }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          const direction = event.key === 'ArrowRight' ? 1 : -1
          select(value => value + direction, direction)
        }
      }}
    >
      <div className="spotlight-compact-main group relative" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        <div className="spotlight-compact-preview" data-playing={playing}>
          <div className="spotlight-stage spotlight-compact-stage">
            <AnimatePresence initial={false} custom={slide.direction}>
              <SpotlightVisual key={slide.revision} project={current} direction={slide.direction} reduced={reduced} />
            </AnimatePresence>
          </div>
          {!reduced && SPOTLIGHT.length > 1 ? (
            <div className="spotlight-compact-timing" aria-hidden="true">
              <span key={slide.revision} className="spotlight-compact-progress" style={{ animationDuration: `${ROTATE_MS}ms` }} />
            </div>
          ) : null}
        </div>
        <div key={slide.revision} className="spotlight-compact-copy animate-hero-fade">
          <p>{HERO_COPY.recent}</p>
          <h2>{current.title.split(' — ')[0]}</h2>
          <span className="spotlight-compact-caption">{current.media.caption ?? current.title.split(' — ')[1] ?? current.type}</span>
        </div>
        <button className="spotlight-compact-open" type="button" aria-label={`${SPOTLIGHT_COPY.open}: ${current.title}`} onClick={() => onOpen?.(current)}><ArrowUpRightIcon size={24} aria-hidden /></button>
      </div>
      <div className="spotlight-compact-controls">
        <button type="button" aria-label={SPOTLIGHT_COPY.previous} onClick={() => select(value => value - 1, -1)}><ArrowLeftIcon size={16} aria-hidden /></button>
        <button type="button" aria-label={SPOTLIGHT_COPY.next} onClick={() => select(value => value + 1, 1)}><ArrowRightIcon size={16} aria-hidden /></button>
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

function SpotlightPreview({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const placeholder = project.media.cover.endsWith('.svg')

  return (
    <div className={cn('spotlight-preview absolute inset-0', !placeholder && !loaded && !failed && 'spotlight-preview-loading')}>
      {!placeholder && !failed ? (
        <img
          src={asset(project.media.cover)}
          alt={project.media.coverAlt ?? `${project.title} preview`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none"
        />
      ) : null}
      {placeholder || failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-5 text-center">
          <span className="font-heading text-4xl text-white">{project.title}</span>
          <span className="text-xs text-white/65">{failed ? SPOTLIGHT_COPY.unavailable : UI_COPY.projectPreview}</span>
        </div>
      ) : null}
      {project.media.caption ? <span className="sr-only">{project.media.caption}</span> : null}
    </div>
  )
}
