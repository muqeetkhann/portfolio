'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { PROJECT_DETAIL_COPY as COPY, type Project } from '@/lib/data'
import { getLenis } from '@/components/providers/SmoothScroll'
import { ScrollEdges } from '@/components/shared/ScrollEdges'
import { useReducedMotion } from '@/lib/reduced-motion'
import { asset, cn } from '@/lib/utils'

type Slide = { type: 'video' | 'image'; src: string }

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className={dir === 'left' ? '' : 'rotate-180'}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ProjectDetail({
  project,
  projects = [],
  onChange,
  onClose,
}: {
  project: Project | null
  projects?: Project[]
  onChange?: (project: Project) => void
  onClose: () => void
}) {
  const reduced = useReducedMotion()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [selection, setSelection] = useState({ projectId: project?.id, index: 0 })
  const isOpen = project !== null

  const slides = useMemo<Slide[]>(() => {
    if (!project) return []
    const list: Slide[] = []
    if (project.media.video) list.push({ type: 'video', src: project.media.video })
    list.push({ type: 'image', src: project.media.cover })
    project.media.gallery?.forEach(src => list.push({ type: 'image', src }))
    return list
  }, [project])

  // A new project starts at its first preview on the same render, even when
  // the previous gallery selection was beyond the new gallery's end.
  const imageIndex = selection.projectId === project?.id ? selection.index : 0
  const active = slides[imageIndex] ?? slides[0]
  const projectIndex = project ? projects.findIndex(item => item.id === project.id) : -1
  const canNavProjects = Boolean(onChange) && projects.length > 1 && projectIndex >= 0
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length]
  const next = projects[(projectIndex + 1) % projects.length]
  const hasMultipleImages = slides.length > 1

  const selectImage = useCallback((index: number) => {
    if (!project || !slides.length) return
    setSelection({ projectId: project.id, index: (index + slides.length) % slides.length })
  }, [project, slides.length])

  const goImage = useCallback((direction: number) => {
    if (!project || slides.length < 2) return
    setSelection(current => ({
      projectId: project.id,
      index: ((current.projectId === project.id ? current.index : 0) + direction + slides.length) % slides.length,
    }))
  }, [project, slides.length])

  const goProject = useCallback((direction: number) => {
    if (!onChange || !canNavProjects) return
    onChange(projects[(projectIndex + direction + projects.length) % projects.length])
  }, [onChange, canNavProjects, projects, projectIndex])

  useEffect(() => {
    setSelection({ projectId: project?.id, index: 0 })
    bodyRef.current?.scrollTo({ top: 0, behavior: 'instant' })
    copyRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [project?.id])

  useEffect(() => {
    const rail = galleryRef.current
    const selected = rail?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
    if (rail && selected) {
      rail.scrollTo({ left: Math.max(0, selected.offsetLeft - (rail.clientWidth - selected.offsetWidth) / 2), behavior: 'instant' })
    }
  }, [project?.id, imageIndex])

  // The portal keeps the fixed frame outside the translated desktop track.
  // Lock the page once per opening, rather than unlocking on every project.
  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const siblings = Array.from(document.body.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== dialogRef.current?.parentElement)
      .map(element => ({ element, inert: element.inert }))
    siblings.forEach(({ element }) => { element.inert = true })
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'
    const lenis = getLenis()
    const wasStopped = lenis?.isStopped
    lenis?.stop()
    closeRef.current?.focus({ preventScroll: true })

    return () => {
      siblings.forEach(({ element, inert }) => { element.inert = inert })
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      if (!wasStopped) lenis?.start()
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const target = event.target
        if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
        if (target instanceof HTMLVideoElement) return
        event.preventDefault()
        goImage(event.key === 'ArrowRight' ? 1 : -1)
      } else if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]):not([tabindex="-1"]), a[href], video[controls]')
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (!dialogRef.current?.contains(document.activeElement)) {
          event.preventDefault()
          first.focus()
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, goImage])

  return createPortal(
    <AnimatePresence>
      {project ? (
        <motion.div
          className="case-study-overlay"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}
        >
          <motion.div
            ref={dialogRef}
            className="case-study-dialog"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : 8 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <header className="case-study-header">
              <div className="flex min-w-0 items-center gap-3">
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: project.accent }} />
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.17em] text-white/60">
                  {COPY.heading}<span aria-hidden className="mx-3 text-white/20">/</span>{project.type}
                </p>
              </div>
              <button ref={closeRef} type="button" aria-label={COPY.close} onClick={onClose} className="case-study-icon">
                <span aria-hidden className="text-xl leading-none">×</span>
              </button>
            </header>

            <div className="case-study-content-frame scroll-frame">
              <div ref={bodyRef} data-lenis-prevent className="case-study-body case-study-scroll">
                <section aria-label={COPY.preview} className="case-study-media">
                  <div className="flex h-10 shrink-0 items-center justify-between gap-3 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                    <span>{COPY.preview}</span>
                    <div className="flex items-center gap-4">
                      {active?.type === 'image' && !active.src.endsWith('.svg') ? <a href={asset(active.src)} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center text-white/70 underline underline-offset-4 hover:text-neon-cyan">{COPY.fullSize}<span aria-hidden> ↗</span></a> : null}
                      <span className="font-mono tracking-[0.1em]">{String(imageIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
                    </div>
                  </div>
                  <div className="case-study-stage">
                    {active ? <MediaPreview key={`${project.id}-${active.src}`} project={project} slide={active} index={imageIndex} /> : null}
                  </div>
                  <div className="case-study-gallery">
                    <button type="button" aria-label={COPY.previousImage} disabled={!hasMultipleImages} onClick={() => goImage(-1)} className="case-study-icon shrink-0"><Chevron dir="left" /></button>
                    {hasMultipleImages ? (
                      <div ref={galleryRef} className="case-study-thumbnails" role="group" aria-label={COPY.selectImage}>
                        {slides.map((slide, index) => (
                          <button
                            key={slide.src}
                            type="button"
                            aria-label={`${COPY.selectImage} ${index + 1}`}
                            aria-pressed={index === imageIndex}
                            onClick={() => selectImage(index)}
                            className={cn('case-study-thumbnail', index === imageIndex && 'case-study-thumbnail-active')}
                          >
                            {slide.type === 'image' ? <img src={asset(slide.src)} alt="" loading="lazy" /> : <span className="text-[10px]">{COPY.video}</span>}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="px-2 text-center text-xs text-white/50">{project.media.caption ?? `${slides.length} ${COPY.image.toLowerCase()}`}</p>
                    )}
                    <button type="button" aria-label={COPY.nextImage} disabled={!hasMultipleImages} onClick={() => goImage(1)} className="case-study-icon shrink-0"><Chevron dir="right" /></button>
                  </div>
                </section>

                <div className="case-study-copy-frame scroll-frame">
                  <div ref={copyRef} data-lenis-prevent className="case-study-copy case-study-scroll">
                    <h2 id={titleId} className="font-heading text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.08] tracking-[-0.025em] text-white">{project.title}</h2>
                    <section className="mt-7" aria-label={COPY.overview}>
                      <h3 className="case-study-label">{COPY.overview}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/70">{project.desc}</p>
                    </section>
                    {project.highlights.length > 0 ? (
                      <section className="mt-7" aria-label={COPY.highlights}>
                        <h3 className="case-study-label">{COPY.highlights}</h3>
                        <ul className="mt-3 space-y-3">
                          {project.highlights.map(highlight => (
                            <li key={highlight} className="flex gap-3 text-[13px] leading-6 text-white/65">
                              <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: project.accent }} />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null}
                    <section className="mt-7" aria-label={COPY.technologies}>
                      <h3 className="case-study-label">{COPY.technologies}</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map(tag => <li key={tag} className="rounded-md border border-white/10 bg-white/[0.025] px-2.5 py-1.5 text-[11px] text-white/65">{tag}</li>)}
                      </ul>
                    </section>
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noreferrer" className="case-study-visit mt-7">
                        <span>{COPY.visit}</span><span aria-hidden>↗</span>
                      </a>
                    ) : null}
                  </div>
                  <ScrollEdges target={copyRef} refreshKey={project.id} />
                </div>
              </div>
              <ScrollEdges target={bodyRef} refreshKey={project.id} />
            </div>

            <footer className="case-study-footer">
              {canNavProjects ? (
                <>
                  <button type="button" aria-label={`${COPY.previousProject}: ${previous.title}`} onClick={() => goProject(-1)} className="case-study-project-nav">
                    <Chevron dir="left" />
                    <span><span className="block text-xs font-semibold">{COPY.previous}</span><span className="case-study-nav-title">{previous.title}</span></span>
                  </button>
                  <p aria-live="polite" aria-atomic="true" className="shrink-0 font-mono text-xs tracking-[0.13em] text-white/50">
                    <span className="sr-only">{project.title} · </span>{String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </p>
                  <button type="button" aria-label={`${COPY.nextProject}: ${next.title}`} onClick={() => goProject(1)} className="case-study-project-nav text-right">
                    <span><span className="block text-xs font-semibold">{COPY.next}</span><span className="case-study-nav-title">{next.title}</span></span>
                    <Chevron dir="right" />
                  </button>
                </>
              ) : <span className="text-xs text-white/50">{COPY.heading}</span>}
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function MediaPreview({ project, slide, index }: { project: Project; slide: Slide; index: number }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const placeholder = slide.type === 'image' && slide.src.endsWith('.svg')

  if (placeholder || failed) {
    return (
      <div className="case-study-empty">
        <span className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">{failed ? COPY.unavailable : COPY.comingSoon}</span>
        <p className="max-w-sm text-balance font-heading text-[clamp(1.6rem,3vw,2.8rem)] leading-tight text-white/80">{project.title}</p>
      </div>
    )
  }

  if (slide.type === 'video') {
    return <video src={asset(slide.src)} poster={asset(project.media.cover)} aria-label={`${project.title} ${COPY.video.toLowerCase()}`} controls playsInline preload="metadata" onError={() => setFailed(true)} className="h-full w-full object-contain" />
  }

  return (
    <img
      src={asset(slide.src)}
      alt={slide.src === project.media.cover && project.media.coverAlt ? project.media.coverAlt : `${project.title} · ${COPY.image.toLowerCase()} ${index + 1}`}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      aria-busy={!loaded}
      className={cn('h-full w-full object-contain transition-opacity duration-150 motion-reduce:transition-none', loaded ? 'opacity-100' : 'opacity-0')}
    />
  )
}
