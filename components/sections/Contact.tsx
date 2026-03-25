import { PERSONAL } from '@/lib/data'
import SectionTitle from '@/components/SectionTitle'
import FadeIn from '@/components/FadeIn'

export default function Contact() {
  return (
    <section id="contact" className="px-[8%] py-28 text-center relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.04) 0%, transparent 65%)' }}
      />

      <div className="relative z-10">
        <SectionTitle num="05" title="Get In Touch" center />

        <FadeIn delay={0.1}>
          <p className="text-[15px] text-[#475569] max-w-[440px] mx-auto mb-10 leading-[1.8]">
            Open to full-time roles, freelance projects, or a good conversation about frontend craft.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <a
            href={`mailto:${PERSONAL.email}`}
            data-hover
            className="inline-block text-green border border-green px-10 py-4 rounded-lg font-bold text-[14px] tracking-[0.08em]
              hover:bg-green hover:text-bg transition-all duration-200"
          >
            SAY HELLO ↗
          </a>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex justify-center gap-8 mt-14">
            {[
              { label: 'GitHub',   href: PERSONAL.github },
              { label: 'LinkedIn', href: PERSONAL.linkedin },
              { label: PERSONAL.phone, href: `tel:${PERSONAL.phone.replace(/\s/g,'')}` },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-hover
                className="text-dim text-[12px] font-semibold tracking-[0.1em] hover:text-green transition-colors duration-200"
              >
                {s.label}
              </a>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
