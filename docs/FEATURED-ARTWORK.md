# Featured work artwork

The featured-work artwork uses the existing dark palette, Clash/Satoshi
typography, rounded cards, project order, and case-study flow.

The generated originals are retained in the Codex generated-images folder.
Optimized WebP assets are deployed from:

- `public/images/featured-sculpture.webp` — fallback artwork inside featured cards
- `public/projects/trippak/cover.webp` — the mint travel health-kit illustration

The TripPak image is a concept illustration, with its description and caption
maintained in `lib/data.ts`. Other projects retain their existing screenshots;
the featured carousel uses the glass artwork behind titles without screenshots.
The hero background uses the existing dotted network field from
`components/originkit/ui/network-lines.tsx`, assigned in `PanelAmbient.tsx`.

Rotation is opt-in through Play and pauses for hover, focus, hidden tabs,
inactive panels, and reduced-motion preferences. Manual navigation holds the
selection. The playback pill shows progress toward the next project, preserving
the remaining time during temporary pauses. Project images crossfade with a
small directional slide while the text transitions separately, keeping the
card dimensions and case-study button stable. Reduced motion disables these
transitions and autoplay.
