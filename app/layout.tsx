import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Self-hosted from Fontshare (free). Variable fonts, weight range baked in.
const clashDisplay = localFont({
  src: './fonts/ClashDisplay-Variable.woff2',
  variable: '--font-clash',
  display: 'swap',
  weight: '200 700',
  fallback: ['Syne', 'system-ui', 'sans-serif'],
})

const satoshi = localFont({
  src: './fonts/Satoshi-Variable.woff2',
  variable: '--font-satoshi',
  display: 'swap',
  weight: '300 900',
  fallback: ['Inter', 'system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://muqeetkhann.github.io/portfolio'),
  title: 'MK | Portfolio',
  description: 'MERN Stack Developer building full-stack web apps with MongoDB, Express, React, Node.js, Next.js, and TypeScript.',
  keywords: ['MERN Stack Developer', 'Full-Stack Developer', 'React', 'Node.js', 'MongoDB', 'Next.js', 'TypeScript', 'Portfolio', 'Islamabad'],
  openGraph: {
    title: 'Muhammad Muqeet Khan | MERN Stack Developer',
    description: 'Full-stack MERN work across SaaS, fintech, e-commerce, and Web3.',
    type: 'website',
    images: [{ url: 'og-image.png', width: 1200, height: 630, alt: 'Muhammad Muqeet Khan — MERN Stack Developer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Muqeet Khan | MERN Stack Developer',
    description: 'Full-stack MERN work across SaaS, fintech, e-commerce, and Web3.',
    images: ['og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${clashDisplay.variable} ${satoshi.variable} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
