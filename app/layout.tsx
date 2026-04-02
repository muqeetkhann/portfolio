import type { Metadata } from 'next'
import { Space_Grotesk, Syne } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MK | Portfolio',
  description: 'Frontend Engineer specializing in React, Next.js, TypeScript, SaaS platforms, and polished product interfaces.',
  keywords: ['Frontend Engineer', 'React', 'Next.js', 'TypeScript', 'Portfolio', 'Islamabad'],
  openGraph: {
    title: 'Muhammad Muqeet Khan | Frontend Engineer',
    description: 'Production frontend work across SaaS, fintech, e-commerce, and Web3.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${syne.variable} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
