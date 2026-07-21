import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional Tailwind classes without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolve a public/ asset path so it works in dev (/) AND on GitHub Pages
 * (/portfolio/). Pass paths WITHOUT a leading slash: asset('projects/x/cover.svg').
 */
export function asset(path: string) {
  const clean = path.replace(/^\.?\//, '')
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  return `${base}/${clean}`
}
