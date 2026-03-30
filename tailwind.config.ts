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
        mono: ['var(--font-dm-mono)', 'monospace'],
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
        'opus': '0.25em',
        'tightest': '-0.04em',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-reveal': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'scroll-reveal': 'scroll-reveal 1s ease-out forwards',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config

