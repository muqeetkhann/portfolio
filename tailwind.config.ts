import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-clash)', 'Syne', 'sans-serif'],
        sans: ['var(--font-satoshi)', 'Inter', 'sans-serif'],
      },
      colors: {
        neon: {
          cyan: '#00F5FF',
        },
      },
    },
  },
  plugins: [],
}
export default config
