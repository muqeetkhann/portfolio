'use client'

import dynamic from 'next/dynamic'
import { AmbientLayer } from '@/components/shared/AmbientLayer'

// The OriginKit backgrounds are raw WebGL and client-only, so each is
// code-split behind next/dynamic with ssr:false — three.js-free, but still not
// something to run through renderToString or ship in the initial bundle.
//
// Intro uses the original dotted network field. Contact runs smokey-shader rather than the
// sonar-bloom the shortlist originally named: sonar-bloom turned out to be a
// PAID registry component, not a quota-blocked one, so it can never arrive on
// the free tier — see scripts/originkit-sync.sh.
// next/dynamic's options must be an inline object literal — the SWC plugin reads
// them statically, so a shared `opts` const fails the build.
const NetworkLines = dynamic(() => import('@/components/originkit/ui/network-lines'), { ssr: false, loading: () => null })
const MoireLattice = dynamic(() => import('@/components/originkit/ui/moire-lattice'), { ssr: false, loading: () => null })
const DotLens = dynamic(() => import('@/components/originkit/ui/dot-lens'), { ssr: false, loading: () => null })
const HexComb = dynamic(() => import('@/components/originkit/ui/hex-comb'), { ssr: false, loading: () => null })
const SmokeyShader = dynamic(() => import('@/components/originkit/ui/smokey-shader'), { ssr: false, loading: () => null })

export type PanelKey = 'intro' | 'experience' | 'projects' | 'stack' | 'contact'

/**
 * The props the registry components share. Every OriginKit background exposes
 * this core (colour trio + density/speed) and then adds its own dials, so the
 * shared shape is typed and the per-component extras ride along in the index
 * signature rather than forcing `any` at each call site.
 */
type BackdropProps = {
  background?: string
  baseColor?: string
  accentColor?: string
  density?: number
  speed?: number
  style?: React.CSSProperties
  [key: string]: unknown
}

type Backdrop = React.ComponentType<BackdropProps>

/**
 * Kills the components' 1200×800 minimum. Each one floors its root box before
 * spreading `style`, because in Framer an auto-sized instance would otherwise
 * collapse to nothing — but here the root is an inset-0 absolute layer that
 * already has a size, and a 1200px floor would crop the field to its top-left
 * corner on any phone.
 */
const FILL: React.CSSProperties = { minWidth: 0, minHeight: 0, width: '100%', height: '100%' }

/** Brand palette. Cyan carries the field, magenta the highlights. */
const CYAN = '#00F5FF'
const MAGENTA = '#BC13FE'

/**
 * Per-panel backdrop assignment — the single place backgrounds are picked and
 * tuned. Four axes are set per panel:
 *
 *  - `blend`: 'screen' on the dark panels, so black is a no-op and only the lit
 *    geometry reaches the page. dot-lens *requires* it (its shader writes alpha
 *    1.0, so it would otherwise paint a solid black rectangle over Projects).
 *    Experience is the one white panel and stays 'normal' with darkened ink;
 *    screen there would wash the lattice out into the white.
 *  - `opacity`: strength, kept low so section copy stays readable.
 *  - the component's own dials, all pulled well below their shipped defaults —
 *    the brief is ambient texture, not a hero animation.
 *  - `mobile`: overrides for the vertical shell. These are NOT cosmetic. Every
 *    one of these components takes density as a COUNT (nodes in the field, or
 *    dots across the frame height), not as a per-area rate, so a value tuned on
 *    a 1440×900 panel packs into a 375px-wide phone panel and turns a subtle
 *    field into a busy one. Each panel re-tunes density (and opacity) for the
 *    narrow shell; everything else is inherited.
 *
 * Pointer dials are zeroed throughout: AmbientLayer is `pointer-events-none` so
 * the panel stays clickable, which means no pointer event ever reaches these.
 * Zeroing them is honest about that and skips the follow/smoothing work; the
 * autonomous drift is what actually animates the field.
 */
type PanelConfig = {
  Bg: Backdrop
  opacity: number
  blend?: 'normal' | 'screen'
  props: BackdropProps
  /** Merged over the desktop values when rendered from the mobile shell. */
  mobile?: { opacity?: number; props?: BackdropProps }
}

const PANELS: Record<PanelKey, PanelConfig> = {
  intro: {
    Bg: NetworkLines as Backdrop,
    opacity: 0.28,
    blend: 'screen',
    props: {
      background: 'transparent',
      baseColor: CYAN,
      accentColor: MAGENTA,
      density: 80,
      dotSize: 90,
      speed: 14,
      hover: 0,
      linkDistance: 140,
      network: { lineWidth: 70, halo: 180, pulse: 40 },
    },
    mobile: { opacity: 0.24, props: { density: 34, linkDistance: 100 } },
  },
  experience: {
    Bg: MoireLattice as Backdrop,
    // Kept low: this is the one panel with dark ink on a light ground, so the
    // lattice competes with the section header directly. Card body copy no
    // longer depends on this number at all — ExperienceList cards are solid
    // white — so this only has to keep the header and gutters clean.
    opacity: 0.14,
    // No screen: this is the white panel, so the lattice darkens instead.
    props: {
      background: 'transparent',
      glow: 'rgba(0,0,0,0)', // the built-in vignette would grey the white panel
      baseColor: '#0F8C99', // deepened cyan — #00F5FF is invisible on white
      accentColor: '#8A12C4', // deepened magenta, same reason
      // Density here is dots across the frame HEIGHT, and the twist is what
      // turns two lattices into rosettes. Too coarse and it reads as polka
      // dots over the copy rather than as paper texture.
      density: 56,
      dotSize: 30,
      speed: 22,
      overlay: { twist: 18, scale: 100 },
      cursor: { reach: 35, lift: 0, damping: 20 },
    },
    // The mobile Experience panel is ~1.4× the desktop panel's height, so the
    // same count draws proportionally fatter dots. Raise it to hold the texture.
    mobile: { opacity: 0.11, props: { density: 100, dotSize: 26 } },
  },
  projects: {
    Bg: DotLens as Backdrop,
    // The grid is dense and the cards are opaque (.panel), so the field only
    // ever reads in the gutters — which is the whole brief for it.
    opacity: 0.17,
    blend: 'screen',
    props: {
      background: '#000000', // opaque shader output; screen makes the black drop out
      baseColor: CYAN,
      accentColor: MAGENTA,
      density: 44,
      dotSize: 52,
      // reach/minSize set how far the lens falls off. The shipped 20/8 leaves
      // most of the field at a tenth of full size — invisible under an ambient
      // opacity — so the falloff is widened and the floor raised.
      reach: 50,
      minSize: 30,
      speed: 28,
      hover: 0,
    },
    // Density is cells across the layer's HEIGHT, and the mobile layer runs to
    // the 160vh cap rather than one viewport, so it needs proportionally more
    // cells than the count that looked right at a single screen height.
    mobile: { opacity: 0.14, props: { density: 108, dotSize: 44 } },
  },
  stack: {
    Bg: HexComb as Backdrop,
    // Far lower than the other panels, and it has to be. Every other backdrop
    // is sparse geometry on black — thin links, small dots — so most of the
    // frame stays empty and the opacity only has to tame what little is lit.
    // The comb is a full tessellation at 100% coverage, so the same 0.26 that
    // reads as texture elsewhere reads as a saturated honeycomb wallpaper here.
    opacity: 0.08,
    blend: 'screen',
    props: {
      background: '#000000', // opaque shader output, same as dot-lens — screen drops the black
      baseColor: CYAN,
      accentColor: MAGENTA,
      // 24 is the ceiling, not a preference: the component clamps density to
      // [3, 24] internally, so anything higher silently collapses to this and
      // the hexes never get finer. This is the one backdrop whose density is a
      // clamped absolute scale rather than a count, which is also why it needs
      // no separate mobile value — 24 is 24 on either shell.
      density: 24,
      gap: 14,
      // `lift` is the pointer-driven cell height and can never fire behind a
      // pointer-events-none layer. `swell` is the autonomous sine wave that
      // actually animates the comb, so that is the one worth keeping.
      lift: 0,
      swell: 70,
      speed: 30, // ships at 100
      finish: { grain: 2, vignette: 40 },
    },
    mobile: { opacity: 0.1 },
  },
  contact: {
    Bg: SmokeyShader as Backdrop,
    opacity: 0.18,
    blend: 'screen',
    props: {
      // Premultiplied alpha, so this one genuinely thins out over a transparent
      // backdrop rather than painting a quad — no black fill needed.
      background: 'transparent',
      // Ordered darkest-first on purpose. The shader ramps this array by noise
      // density and then keeps only the dense end (glow masks the rest), so the
      // LAST entry is what actually reads on the page and the first is nearly
      // invisible. Cyan leads the site's palette, so cyan goes last.
      colors: [MAGENTA, '#7B2FF7', CYAN],
      speed: 9, // already slow at its shipped 11
      scale: 150,
      glow: 48, // ships at 75; lower keeps the smoke wispy instead of a slab
      hover: 0,
      interactive: false,
      blur: 0,
    },
    // Smoke is a noise field, not a counted lattice, so it needs no density
    // re-tune for the narrow shell — only a touch less strength.
    mobile: { opacity: 0.14 },
  },
}

/**
 * The ambient backdrop for one section, shared by both layouts.
 *
 * Desktop passes `active` (the panel index) because all five panels are mounted
 * at once inside the translated track — an observer would call every one visible
 * and hold five live WebGL contexts. Mobile omits it and gets the observer path.
 *
 * `variant` follows the section-component convention: the desktop shell passes
 * it, the mobile shell doesn't. It selects the density tuning (see PANELS) —
 * these fields are sized by count, not by area, so one set of numbers cannot
 * serve a 1440px panel and a 375px one.
 */
export function PanelAmbient({
  panel,
  active,
  variant,
}: {
  panel: PanelKey
  active?: boolean
  variant?: 'desktop'
}) {
  const { Bg, opacity, blend, props, mobile } = PANELS[panel]
  const compact = variant !== 'desktop'
  const resolved = compact ? { ...props, ...mobile?.props } : props
  const resolvedOpacity = compact ? (mobile?.opacity ?? opacity) : opacity

  return (
    <AmbientLayer active={active} opacity={resolvedOpacity} blend={blend}>
      <Bg {...resolved} style={FILL} />
    </AmbientLayer>
  )
}
