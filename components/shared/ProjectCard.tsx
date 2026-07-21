'use client'

import { useRef } from 'react'
import type { Project } from '@/lib/data'
import { asset, cn } from '@/lib/utils'

export function ProjectCard({
  project,
  onOpen,
  variant = 'mobile',
}: {
  project: Project
  onOpen?: (project: Project) => void
  variant?: 'desktop' | 'mobile'
}) {
  const isDesktop = variant === 'desktop'
  const videoRef = useRef<HTMLVideoElement>(null)
  const { title, type, desc, tags, media } = project
  const hasVideo = Boolean(media?.video)

  const handleEnter = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }
  const handleLeave = () => {
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
    }
  }

  return (
    <article
      onClick={() => onOpen?.(project)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        'panel group flex h-full cursor-pointer flex-col overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1',
        isDesktop ? 'p-0' : 'p-0',
      )}
    >
      {/* cover */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-black/40">
        <img
          src={asset(media.cover)}
          alt={`${title} — ${type}`}
          loading="lazy"
          className={cn(
            'h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]',
            hasVideo && 'group-hover:opacity-0',
          )}
        />
        {hasVideo ? (
          <video
            ref={videoRef}
            src={asset(media.video!)}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        ) : null}
        <span
          className="pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-black"
          style={{ backgroundColor: project.accent }}
        >
          {project.num}
        </span>
      </div>

      {/* body */}
      <div className={cn('flex flex-1 flex-col', isDesktop ? 'p-4' : 'p-5')}>
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{type}</p>
        <h3 className={cn('mb-2 font-heading uppercase leading-[1.02] text-white', isDesktop ? 'text-[1.15rem]' : 'text-[clamp(1.1rem,2.6vw,1.6rem)]')}>
          {title}
        </h3>
        <p className={cn('mb-4 flex-1 text-sm leading-6 text-white/60', isDesktop && 'line-clamp-3')}>{desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, isDesktop ? 3 : 4).map(tag => (
            <span key={`${title}-${tag}`} className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">
              {tag}
            </span>
          ))}
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-neon-cyan opacity-0 transition group-hover:opacity-100">
          View case <span aria-hidden>-&gt;</span>
        </span>
      </div>
    </article>
  )
}
