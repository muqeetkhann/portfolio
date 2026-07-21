'use client'

import { useEffect, useRef, useState } from 'react'
import { SPOTLIGHT, type Project } from '@/lib/data'
import { asset, cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

const ROTATE_MS = 4200

/**
 * Hero showpiece: a self-rotating card that cycles the featured projects
 * (cover art + stack + live link). Replaces the old static profile.json block.
 * Auto-advances on a ≤5s loop (design rule 4), pauses on hover, and freezes on
 * the first frame under prefers-reduced-motion. Clicking opens the case modal.
 */
export default function ProjectSpotlight({
  onOpen,
  className,
}: {
  onOpen?: (project: Project) => void
  className?: string
}) {
  const reduced = useReducedMotion()
  const projects = SPOTLIGHT
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const active = projects[index]

  useEffect(() => {
    if (reduced || paused || projects.length < 2) return
    const id = window.setInterval(() => setIndex(i => (i + 1) % projects.length), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [reduced, paused, projects.length])

  if (!active) return null

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* accent glow blobs behind the card */}
      <div className="animate-glow absolute inset-[6%_10%_2%_14%] rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.16)_0%,rgba(0,245,255,0.05)_34%,transparent_72%)] blur-3xl" />
      <div className="absolute inset-[30%_2%_-6%_22%] rounded-full bg-[radial-gradient(circle,rgba(188,19,254,0.16)_0%,rgba(188,19,254,0.05)_36%,transparent_74%)] blur-3xl" />

      <button
        type="button"
        onClick={() => onOpen?.(active)}
        style={{ ['--accent' as string]: active.accent }}
        className="group relative block w-full max-w-[30rem] cursor-pointer overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,22,0.72)_0%,rgba(5,7,14,0.55)_100%)] p-4 text-left shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1 lg:w-[min(34vw,27rem)]"
      >
        {/* header */}
        <div className="mb-4 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
            Featured Work
          </span>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/40">
            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {/* cover */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] border border-white/10 bg-black/50">
          <div key={active.slug} className="animate-hero-fade absolute inset-0">
            <img
              src={asset(active.media.cover)}
              alt={`${active.title} — ${active.type}`}
              className="ken-burns h-full w-full object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(3,5,10,0.82)_100%)]" />
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-black"
            style={{ backgroundColor: active.accent }}
          >
            {active.num}
          </span>
          <div className="absolute inset-x-4 bottom-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">{active.type}</p>
            <h3 className="font-heading text-[1.6rem] uppercase leading-[0.95] text-white">{active.title}</h3>
          </div>
        </div>

        {/* body */}
        <div key={active.id} className="animate-hero-fade px-1 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {active.tags.slice(0, 3).map(tag => (
              <span
                key={`${active.slug}-${tag}`}
                className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span
              className="truncate text-[11px] font-semibold lowercase tracking-[0.04em]"
              style={{ color: active.accent }}
            >
              {active.urlLabel || 'view case study'}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 transition group-hover:text-white">
              Open <span aria-hidden>-&gt;</span>
            </span>
          </div>
        </div>

        {/* progress dots */}
        <div className="mt-5 flex items-center gap-1.5 px-1">
          {projects.map((p, i) => (
            <span
              key={p.id}
              onClick={e => {
                e.stopPropagation()
                setIndex(i)
              }}
              className={cn(
                'h-1 rounded-full transition-all duration-500',
                i === index ? 'w-7' : 'w-2 bg-white/20',
              )}
              style={i === index ? { backgroundColor: active.accent } : undefined}
            />
          ))}
        </div>
      </button>
    </div>
  )
}
