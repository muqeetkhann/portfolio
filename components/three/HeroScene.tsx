'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import type { Group } from 'three'

/**
 * The 3D showpiece: a slowly rotating glass torus knot with bloom + subtle
 * chromatic aberration, drifting toward the pointer. Loaded ONLY via
 * HeroCanvas (next/dynamic, ssr:false) — never import this directly.
 *
 * No drei <Environment> on purpose: presets fetch HDRs from a CDN at runtime,
 * which we don't want on a static GitHub Pages deploy. Lighting is local.
 */
function GlassKnot() {
  const group = useRef<Group>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.x += delta * 0.1
    g.rotation.y += delta * 0.16
    // scroll-linked drift: as the pinned intro scrolls away, the knot rolls
    // back and recedes (scrollY is the pin progress on the desktop layout)
    const drift = Math.min(window.scrollY / window.innerHeight, 2.5)
    g.rotation.z = drift * 0.35
    // ease toward pointer for a parallax feel, receding with scroll
    g.position.x += (state.pointer.x * 0.45 - g.position.x) * 0.04
    g.position.y += (state.pointer.y * 0.35 - g.position.y) * 0.04
    g.position.z += (-drift * 0.9 - g.position.z) * 0.06
  })

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.7}>
        <mesh>
          <torusKnotGeometry args={[1, 0.32, 200, 32]} />
          <MeshTransmissionMaterial
            thickness={0.9}
            roughness={0.12}
            transmission={1}
            ior={1.4}
            chromaticAberration={0.35}
            anisotropicBlur={0.4}
            distortion={0.4}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#9be8ef"
          />
        </mesh>
      </Float>
    </group>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-5, -2, -3]} intensity={2.2} color="#00f5ff" />
      <pointLight position={[5, -3, 2]} intensity={1.6} color="#bc13fe" />
      <GlassKnot />
      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.55} mipmapBlur />
        <ChromaticAberration offset={[0.0012, 0.0008]} />
      </EffectComposer>
    </Canvas>
  )
}
