# Featured work artwork

The featured-work artwork uses the existing dark palette, Clash/Satoshi
typography, rounded cards, project order, and case-study flow.

The generated originals are retained in the Codex generated-images folder.
The deployed TripPak concept illustration lives in
`public/projects/trippak/cover.webp`; its description and caption are maintained
in `lib/data.ts`. Other projects retain their existing product screenshots.
Missing images use textual previews rather than unrelated decorative artwork.
The unused glass fallback image has been removed.

The site background is independent of project media: one fixed
`StarfieldBackground` component, mounted by the root layout, serves all sections.

The compact hero preview rotates automatically every five seconds and pauses
for hover, focus, open case studies, hidden tabs and inactive/offscreen panels.
Manual navigation resets the countdown; it resumes when interaction ends. A
borderless timing bar spans the full width directly below the image, preserving remaining
time during temporary pauses. Project images crossfade with a
small directional slide while the text transitions separately, keeping the
card dimensions and case-study button stable. Reduced motion disables these
transitions and autoplay.
