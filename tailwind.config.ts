import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-syne)', 'sans-serif'],
        sans: ['var(--font-space-grotesk)', 'Inter', 'sans-serif'],
      },
      colors: {
        bg: '#000000',
        card: '#0D0D0D',
        border: 'rgba(255, 255, 255, 0.1)',
        neon: {
          cyan: '#00F5FF',
          purple: '#BC13FE',
          magenta: '#FF00CC',
          green: '#39FF14',
          yellow: '#FFCC00',
        },
        muted: '#A1A1AA',
        dim: '#3F3F46',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
export default config
