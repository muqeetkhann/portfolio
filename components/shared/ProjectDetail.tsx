'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Project } from '@/lib/data'
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
  const [imageIndex, setImageIndex] = useState(0)

  // All media for the active project as ordered slides (video first, then cover + gallery).
  const slides = useMemo<Slide[]>(() => {
    if (!project) return []
    const list: Slide[] = []
    if (project.media?.video) list.push({ type: 'video', src: project.media.video })
    if (project.media?.cover) list.push({ type: 'image', src: project.media.cover })
    project.media?.gallery?.forEach(src => list.push({ type: 'image', src }))
    return list
  }, [project])

  const projectIndex = project ? projects.findIndex(p => p.id === project.id) : -1
  const canNavProjects = Boolean(onChange) && projects.length > 1 && projectIndex >= 0
  const hasMultipleImages = slides.length > 1

  const goProject = useCallback(
    (dir: number) => {
      if (!onChange || projects.length < 2 || projectIndex < 0) return
      const next = (projectIndex + dir + projects.length) % projects.length
      onChange(projects[next])
    },
    [onChange, projects, projectIndex],
  )

  const goImage = useCallback(
    (dir: number) => {
      setImageIndex(i => (slides.length ? (i + dir + slides.length) % slides.length : 0))
    },
    [slides.length],
  )

  // Restart the image carousel whenever the project changes.
  useEffect(() => {
    setImageIndex(0)
  }, [project?.id])

  // Lock background scroll while open: body overflow AND Lenis (which hijacks
  // the wheel and would keep scrolling the page behind the modal otherwise).
  useEffect(() => {
    if (!project) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // @ts-expect-error — Lenis set by SmoothScroll
    const lenis = window.__lenis
    lenis?.stop()
    return () => {
      document.body.style.overflow = prevOverflow
      lenis?.start()
    }
  }, [project])

  // Keyboard: Esc closes, ←/→ steps through the current project's images.
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goImage(-1)
      else if (e.key === 'ArrowRight') goImage(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, onClose, goImage])

  const active = slides[imageIndex]

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
        >
          <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            className="panel relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden bg-[#0a0a0a]"
            initial={{ y: 32, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <button
              type="button"
              aria-label="Close case study"
              onClick={onClose}
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:border-neon-cyan hover:text-neon-cyan"
            >
              <span aria-hidden className="text-lg leading-none">×</span>
            </button>

            <div className="min-h-0 overflow-y-auto">
              {/* media carousel — cover + gallery, loops */}
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-black/40">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${project.id}-${imageIndex}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {active?.type === 'video' ? (
                      <video src={asset(active.src)} muted loop autoPlay playsInline className="h-full w-full object-cover" />
                    ) : active ? (
                      <img src={asset(active.src)} alt={`${project.title} — view ${imageIndex + 1}`} className="ken-burns h-full w-full object-cover" />
                    ) : null}
                  </motion.div>
                </AnimatePresence>

                <span
                  className="absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black"
                  style={{ backgroundColor: project.accent }}
                >
                  {project.num} · {project.type}
                </span>

                {hasMultipleImages ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() => goImage(-1)}
                      className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:border-neon-cyan hover:text-neon-cyan"
                    >
                      <Chevron dir="left" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() => goImage(1)}
                      className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:border-neon-cyan hover:text-neon-cyan"
                    >
                      <Chevron dir="right" />
                    </button>
                    <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
                      {slides.map((s, i) => (
                        <button
                          key={s.src}
                          type="button"
                          aria-label={`Go to image ${i + 1}`}
                          onClick={() => setImageIndex(i)}
                          className={cn('h-1.5 rounded-full transition-all duration-300', i === imageIndex ? 'w-6' : 'w-1.5 bg-white/40 hover:bg-white/70')}
                          style={i === imageIndex ? { backgroundColor: project.accent } : undefined}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] uppercase leading-[0.95] text-white">{project.title}</h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/70">{project.desc}</p>

                {project.highlights.length > 0 ? (
                  <div className="mt-7">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">Highlights</p>
                    <ul className="space-y-3">
                      {project.highlights.map(h => (
                        <li key={h} className="flex gap-3 text-sm leading-6 text-white/70">
                          <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: project.accent }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-7 flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/65">
                      {tag}
                    </span>
                  ))}
                </div>

                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-neon-cyan"
                  >
                    Visit {project.urlLabel || 'project'} <span aria-hidden>-&gt;</span>
                  </a>
                ) : null}
              </div>
            </div>

            {/* project navigation — loops through the full list */}
            {canNavProjects ? (
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#0a0a0a] px-4 py-3 sm:px-6">
                <button
                  type="button"
                  onClick={() => goProject(-1)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 transition hover:border-neon-cyan hover:text-neon-cyan"
                >
                  <Chevron dir="left" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-white/40">
                  {String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => goProject(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 transition hover:border-neon-cyan hover:text-neon-cyan"
                >
                  <span className="hidden sm:inline">Next</span>
                  <Chevron dir="right" />
                </button>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
