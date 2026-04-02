'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="section-shell flex min-h-screen flex-col items-start justify-center gap-5 py-16 text-white">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neon-cyan">Application Error</p>
      <h1 className="font-heading text-[clamp(2rem,7vw,4.5rem)] uppercase leading-[0.9]">Something broke</h1>
      <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base">
        The page failed to render correctly. Try refreshing, or use the button below to retry without leaving the site.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:border-neon-cyan hover:text-neon-cyan"
      >
        Try again
      </button>
    </div>
  )
}
