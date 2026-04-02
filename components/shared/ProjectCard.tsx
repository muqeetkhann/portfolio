import type { ReactNode } from 'react'

export function ProjectCard({
  title,
  type,
  desc,
  tags,
  url,
  variant = 'mobile',
}: {
  title: string
  type: string
  desc: string
  tags: string[]
  url?: string
  variant?: 'desktop' | 'mobile'
}) {
  const isDesktop = variant === 'desktop'
  
  return (
    <article className={`panel h-full ${isDesktop ? 'p-5' : 'p-5 sm:p-6'}`}>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{type}</p>
      <h3 className={`mb-3 font-heading uppercase leading-[1.02] text-white ${isDesktop ? 'break-words text-[1.2rem]' : 'text-[clamp(1.1rem,2.6vw,1.7rem)]'}`}>
        {title}
      </h3>
      <p className={`text-sm leading-6 text-white/65 ${isDesktop ? 'mb-4' : 'mb-5'}`}>
        {desc}
      </p>
      <div className={`flex flex-wrap gap-2 ${isDesktop ? 'mb-4' : 'mb-5'}`}>
        {tags.slice(0, 4).map(tag => (
          <span key={`${title}-${tag}`} className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70">
            {tag}
          </span>
        ))}
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className={`font-bold uppercase tracking-[0.2em] text-neon-cyan transition hover:text-white ${isDesktop ? 'inline-block break-words text-[11px]' : 'text-[11px]'}`}>
          Visit project -&gt;
        </a>
      ) : null}
    </article>
  )
}
