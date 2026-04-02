const codeLines = [
  '{',
  '  "role": "Frontend Engineer",',
  '  "stack": ["JavaScript", "TypeScript", "React", "React Native", "Next.js"],',
  '  "focus": {',
  '    "ui": "polished",',
  '    "perf": "fast",',
  '    "shipping": true',
  '  }',
  '}',
]

export default function DeveloperSnapshot() {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute inset-[8%_8%_0_16%] rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.16)_0%,rgba(0,245,255,0.05)_34%,transparent_72%)] blur-3xl" />
      <div className="absolute inset-[28%_0_-6%_24%] rounded-full bg-[radial-gradient(circle,rgba(188,19,254,0.14)_0%,rgba(188,19,254,0.05)_36%,transparent_74%)] blur-3xl" />

      <div className="relative mt-16 w-[min(33vw,26rem)] min-w-[20rem] rounded-[36px] border border-white/5 bg-[linear-gradient(180deg,rgba(8,12,20,0.36)_0%,rgba(5,7,14,0.14)_100%)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.2)] backdrop-blur-[10px] [mask-image:radial-gradient(circle_at_center,black_60%,rgba(0,0,0,0.72)_80%,transparent_100%)]">
        <div className="mb-5 flex items-center gap-2 border-b border-white/5 pb-4 text-[10px] uppercase tracking-[0.24em] text-white/35">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="ml-3">profile.json</span>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/5 bg-black/10 p-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:100%_28px,28px_100%] opacity-60" />
          <div className="relative space-y-2 font-mono text-[13px] leading-7 text-white/70">
            {codeLines.map(line => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
