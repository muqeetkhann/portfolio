import { tsParticles } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

await loadSlim(tsParticles)

await tsParticles.load('particles-canvas', {
  fullScreen: { enable: false },
  zIndex: 0,
  background: { color: { value: 'transparent' } },
  particles: {
    color: { value: '#1EBF7A' },
    links: {
      enable: true,
      color: '#1EBF7A',
      opacity: 0.2,
      distance: 150
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: 'none',
      outModes: { default: 'bounce' }
    },
    number: {
      value: 40,
      density: { enable: true, area: 800 }
    },
    opacity: { value: 0.4 },
    size: { value: { min: 1, max: 2.5 } }
  }
})
