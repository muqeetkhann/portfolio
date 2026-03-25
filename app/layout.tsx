import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import Cursor from '@/components/Cursor'
import MeshBackground from '@/components/MeshBackground'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Muhammad Muqeet Khan — Frontend Developer',
  description: 'Mid-Level Frontend Developer specializing in React, Next.js, TypeScript, and Web3. 2+ years, 10+ production projects.',
  keywords: ['Frontend Developer', 'React', 'Next.js', 'TypeScript', 'Web3', 'Islamabad'],
  openGraph: {
    title: 'Muhammad Muqeet Khan — Frontend Developer',
    description: '2+ years delivering production frontends across SaaS, fintech, e-commerce, and Web3.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <MeshBackground />
        <Cursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
