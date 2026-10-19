import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { SITE_METADATA } from '@/lib/data'
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
  metadataBase: new URL(SITE_METADATA.url),
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  keywords: SITE_METADATA.keywords,
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    type: 'website',
    images: [{ url: SITE_METADATA.image, width: 1200, height: 630, alt: SITE_METADATA.imageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [SITE_METADATA.image],
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
