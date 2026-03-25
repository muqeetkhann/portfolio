import { PERSONAL } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="text-center py-5 border-t border-[#0F172A] text-[#1E293B] text-[11px] tracking-[0.1em]">
      DESIGNED &amp; BUILT BY {PERSONAL.name.toUpperCase()} · {new Date().getFullYear()}
    </footer>
  )
}
