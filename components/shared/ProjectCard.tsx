'use client'

import { useRef } from 'react'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { UI_COPY, type Project } from '@/lib/data'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { asset, cn } from '@/lib/utils'

export function ProjectCard({ project, onOpen }: { project: Project; onOpen?: (project: Project) => void; variant?: 'desktop' | 'mobile' }) {
  const video = useRef<HTMLVideoElement>(null)
  const placeholder = project.media.cover.endsWith('.svg')
  return (
    <article className="project-card" onPointerEnter={event => { if (event.pointerType === 'mouse' && !prefersReducedMotion()) video.current?.play().catch(() => {}) }} onPointerLeave={() => { if (video.current) { video.current.pause(); video.current.currentTime = 0 } }}>
      <div className={cn('project-media', project.media.video && 'has-video')}>
        {placeholder ? <div className="project-empty"><strong>{project.title}</strong><span>{UI_COPY.projectPreview}</span></div> : <img src={asset(project.media.cover)} alt={project.media.coverAlt ?? `${project.title} · ${project.type}`} loading="lazy" decoding="async" width={1600} height={900} />}
        {project.media.video ? <video ref={video} src={asset(project.media.video)} muted loop playsInline preload="none" aria-hidden /> : null}
        <span className="project-number" aria-hidden>{project.num}</span>
      </div>
      <div className="project-body"><p className="project-category">{project.type}</p><h3>{project.title}</h3><p className="project-description">{project.desc}</p><ul className="project-tags" aria-label={UI_COPY.builtWith}>{project.tags.slice(0,3).map(tag => <li key={tag}>{tag}</li>)}</ul><button type="button" className="project-card-open" aria-label={`${UI_COPY.projectCase}: ${project.title}`} onClick={() => onOpen?.(project)}>{UI_COPY.projectCase}<ArrowUpRightIcon size={20} aria-hidden /></button></div>
    </article>
  )
}
