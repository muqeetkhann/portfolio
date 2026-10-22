import type { ReactNode } from 'react'
import styles from './SiteShell.module.css'

/** One width system for content and the centered navigation wrapper. */
export function SiteShell({ children }: { children: ReactNode }) {
  return <div className={styles.shell} data-site-shell>{children}</div>
}
