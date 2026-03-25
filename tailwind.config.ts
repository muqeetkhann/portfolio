import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        bg:     '#080B12',
        bg2:    '#0D1117',
        border: '#1E293B',
        green:  '#6EE7B7',
        blue:   '#93C5FD',
        pink:   '#FCA5A5',
        purple: '#C4B5FD',
        yellow: '#FDE68A',
        muted:  '#64748B',
        dim:    '#334155',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '0.3' },
          '50%':      { opacity: '1' },
        },
        gradientShift: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        fadeUp:        'fadeUp 0.7s ease both',
        pulse2:        'pulse2 2s infinite',
        gradientShift: 'gradientShift 8s ease infinite',
        float:         'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
