import FadeIn from './FadeIn'

interface SectionTitleProps {
  num: string
  title: string
  center?: boolean
}

export default function SectionTitle({ num, title, center }: SectionTitleProps) {
  return (
    <FadeIn className={`flex items-center gap-4 mb-14 ${center ? 'justify-center' : ''}`}>
      <span className="text-[11px] text-green font-bold tracking-[0.18em]">{num}</span>
      <div className="w-9 h-px bg-green flex-shrink-0" />
      <h2 className="text-[clamp(26px,3.5vw,40px)] font-extrabold tracking-tight">{title}</h2>
    </FadeIn>
  )
}
