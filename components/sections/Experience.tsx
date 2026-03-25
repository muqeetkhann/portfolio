import { EXPERIENCE } from '@/lib/data'
import SectionTitle from '@/components/SectionTitle'
import FadeIn from '@/components/FadeIn'

export default function Experience() {
  return (
    <section id="experience" className="px-[8%] py-28">
      <SectionTitle num="02" title="Experience" />

      <div className="max-w-[780px]">
        {EXPERIENCE.map((exp, i) => (
          <FadeIn key={i} delay={i * 0.12}>
            <div className="relative pl-8 mb-12" style={{ borderLeft: `2px solid ${exp.accent}18` }}>
              {/* Dot */}
              <div
                className="absolute -left-[5px] top-2 w-2 h-2 rounded-full"
                style={{ background: exp.accent, boxShadow: `0 0 12px ${exp.accent}60` }}
              />

              {/* Header */}
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div>
                  <div className="text-[18px] font-bold text-[#F1F5F9]">{exp.role}</div>
                  <div className="text-[13px] font-semibold mt-1 tracking-[0.04em]" style={{ color: exp.accent }}>
                    {exp.company}
                  </div>
                </div>
                <span className="text-[12px] text-[#475569] border border-border px-3 py-1 rounded-full tracking-[0.04em] whitespace-nowrap">
                  {exp.period}
                </span>
              </div>

              {/* Bullets */}
              <ul className="mt-4 space-y-[10px]">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3 text-muted text-[14px] leading-[1.7]">
                    <span className="flex-shrink-0 mt-[2px]" style={{ color: exp.accent }}>▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
