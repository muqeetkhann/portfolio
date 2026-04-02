import type { ReactNode } from 'react'

export function SectionHeader({
  kicker,
  title,
  accent,
  variant = 'mobile',
}: {
  kicker: string
  title: ReactNode
  accent?: ReactNode
  variant?: 'desktop' | 'mobile'
}) {
  const isDesktop = variant === 'desktop'
  
  return (
    <div className={isDesktop ? 'mb-8' : 'mb-10'}>
      <p className="section-kicker">{kicker}</p>
      <h2 className={`section-title ${isDesktop ? 'text-white' : ''}`}>
        {title}
        {accent && isDesktop && typeof accent === 'string' ? (
          <> <span className="masked-text-dark">{accent}</span></>
        ) : accent ? (
          <> {accent}</>
        ) : null}
      </h2>
    </div>
  )
}
