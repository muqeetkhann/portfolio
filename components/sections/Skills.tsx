import { SKILLS } from '@/lib/data'
import SectionTitle from '@/components/SectionTitle'
import FadeIn from '@/components/FadeIn'

export default function Skills() {
  return (
    <section id="skills" className="px-[8%] py-28">
      <SectionTitle num="04" title="Skills" />

      <div className="max-w-[720px] space-y-0">
        {SKILLS.map((row, i) => (
          <FadeIn key={row.cat} delay={i * 0.07}>
            <div className="grid gap-5 py-[18px] border-b border-[#0F172A]"
              style={{ gridTemplateColumns: '160px 1fr' }}>
              <span className="text-[11px] text-dim font-bold tracking-[0.1em] pt-1">
                {row.cat.toUpperCase()}
              </span>
              <div className="flex flex-wrap gap-[7px]">
                {row.items.map(s => (
                  <span
                    key={s}
                    className="text-[12px] text-muted bg-bg2 border border-border px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}

        {/* React Native note */}
        <FadeIn delay={0.5}>
          <div className="pt-4 text-[13px] text-muted italic leading-relaxed">
            <span className="text-[#475569] not-italic font-semibold">React Native:</span>{' '}
            Familiar with mobile development — built practice apps independently. Yet to work on a large-scale production mobile project.
          </div>
        </FadeIn>

        {/* Learning note */}
        <FadeIn delay={0.55}>
          <div className="pt-2 text-[13px] text-muted italic leading-relaxed">
            <span className="text-[#475569] not-italic font-semibold">Currently Learning:</span>{' '}
            Node.js & NestJS — building toward full-stack MERN/NestJS development.
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
