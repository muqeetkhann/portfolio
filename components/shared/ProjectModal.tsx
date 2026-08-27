'use client'

import dynamic from 'next/dynamic'

/**
 * Lazy entry point for the case-study modal. Motion (framer) is imported only
 * by ProjectDetail, so keeping it behind next/dynamic keeps it out of the main
 * bundle until a project is actually opened.
 */
export const ProjectModal = dynamic(
  () => import('./ProjectDetail').then(m => m.ProjectDetail),
  { ssr: false },
)
