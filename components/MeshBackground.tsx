'use client'
export default function MeshBackground() {
  return (
    <div className="mesh-bg" aria-hidden>
      {/* Large green orb top-right */}
      <div className="mesh-orb" style={{
        width: 700, height: 700,
        top: '-15%', right: '-10%',
        background: 'radial-gradient(circle, #6EE7B7 0%, transparent 70%)',
        animationDelay: '0s',
      }} />
      {/* Blue orb bottom-left */}
      <div className="mesh-orb" style={{
        width: 500, height: 500,
        bottom: '5%', left: '-8%',
        background: 'radial-gradient(circle, #93C5FD 0%, transparent 70%)',
        animationDelay: '2s',
        animationDuration: '10s',
      }} />
      {/* Purple orb center */}
      <div className="mesh-orb" style={{
        width: 400, height: 400,
        top: '40%', left: '40%',
        background: 'radial-gradient(circle, #C4B5FD 0%, transparent 70%)',
        animationDelay: '4s',
        animationDuration: '12s',
        opacity: 0.04,
      }} />
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(110,231,183,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(110,231,183,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, #080B12 100%)',
      }} />
    </div>
  )
}
