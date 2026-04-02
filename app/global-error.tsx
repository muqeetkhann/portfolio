'use client'

export default function GlobalError() {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#00F5FF' }}>Fatal Error</p>
          <h1 style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', lineHeight: 0.95, textTransform: 'uppercase', margin: '12px 0' }}>Something went wrong</h1>
          <p style={{ maxWidth: 640, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>
            A fatal rendering error occurred. Reload the page to restart the app.
          </p>
        </div>
      </body>
    </html>
  )
}
