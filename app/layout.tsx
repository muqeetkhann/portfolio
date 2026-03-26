import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en" style={{ overflow: 'hidden', height: '100%' }}>
      <body style={{ overflow: 'hidden', height: '100%', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}

