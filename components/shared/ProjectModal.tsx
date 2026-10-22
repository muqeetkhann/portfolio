'use client'

import dynamic from 'next/dynamic'

/**
 * Lazy entry point for the case-study modal. Keeps the case-study implementation
 * behind a client-only dynamic boundary.
 */
export const ProjectModal = dynamic(
  () => import('./ProjectDetail').then(m => m.ProjectDetail),
  { ssr: false },
)
