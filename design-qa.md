# Design QA

final result: passed

## Target and evidence

Target: the approved service-led hero concept
`exec-d76acde9-ca1d-4e4a-a0d3-096b329c8078.png` (1536×1024).

Evidence directory:
`/Users/muqeet-khan/.codex/visualizations/2026/10/19/01a15387-c363-78d1-baf0-c1b30a614660/`

Inspected source and render together in `qa-hero-comparison.jpg`; also inspected
paired focused crops `qa-hero-type.jpg`, `qa-hero-services.jpg` and
`qa-hero-preview.jpg`. Final page screenshots include `final-hero-desktop.jpg`,
`final-hero-mobile.jpg`, `final-mobile-projects.jpg`, `final-mobile-menu.jpg`,
`final-projects-desktop.jpg`, `final-stack-desktop.jpg` and
`final-contact-desktop.jpg`. Baseline screenshots are recorded in
`docs/REDESIGN-AUDIT.md`.

## Visual comparison

- Composition: rounded nav rail, three headline lines, cyan emphasis, two-column
  service list, compact real project preview, availability/location baseline.
- Type: retained self-hosted fonts; Satoshi gives bold headings readable word
  spacing. Increased supporting text, service heading and preview sizes after
  comparison. Reference font rendering is interpreted using the site's fonts.
- Color: dark/cyan identity remains; static dot field replaces unrelated art and
  multiple active background shaders. Secondary ink and separators stay quiet.
- Images: original project images and galleries retained; contain crops preserve
  interface screenshots. Missing-media states use text, not fake product art.
- Icons: consistent Phosphor family for the refreshed UI; labels retained for
  icon-only controls. Existing case-study controls remain functional.
- Responsive composition: two columns on wide screens, stacked hero on narrower
  tablets/phones, single-column project cards and dark mobile navigation.

## Issues corrected during validation

| Severity | Finding | Resolution |
|---|---|---|
| P2 | Dense display lettering | Adjusted font family and type scale |
| P2 | Compact preview and CTA too small relative to target | Enlarged preview, heading, body and action |
| P2 | Project actions did not align across different titles | Flex column card bodies and bottom-aligned actions |
| P2 | Anchor spacing applied twice on mobile | Removed redundant CSS scroll margin |
| P2 | Compact controls exceeded narrow hero container | Icon-only autoplay below 360px, with accessible label |
| P2 | Tablet location could sit under WhatsApp | Reserved space at the right edge |
| P1 | Keyboard focus created an independent hidden project scroll | Clip wrappers, explicit min-height:0, focus tied to the GSAP timeline |

No known P0/P1/P2 findings remain within the tested layouts and interactions.

## Verification

- Browser sizes: 1536×1024, 1280×720, 1024×768, 768×1024, 375×812 and 320×740.
- Desktop navigation across all five panels; native inner scrolling in Experience
  and continuation into the track; project list scrolls at measured content speed.
- Keyboard focus reaches later/final project rows without creating a private
  scroll offset. Confirmed all three clipping containers keep scrollTop=0;
  focus updates the shared page/timeline scroll position.
- Expertise opens its matching project; previous/next project and gallery controls
  work; modal size stays 1180×820 at the tested desktop frame.
- Autoplay starts and advances after Play, stops after Pause, manual navigation
  holds selection. Metadata and images transition without changing the frame.
- Mobile menu opens/closes, Escape returns focus, body unlocks, Projects anchor
  lands at approximately 96px below the fixed header.
- No horizontal document overflow at the tested widths. At 320px, compact controls
  end at 268px inside the hero's 285px right edge.
- Original data preserved: lib/data.ts diff adds presentation copy only, with no
  deleted or modified original entries. All 17 projects and 14 skill groups remain.
- Standard production build and final GitHub Pages static build passed, including
  type/lint checks. Export script paths use /portfolio; resume and hero media exist.
- Fresh production browser error checks found no runtime errors. Historical dev
  errors before the icon dependency was installed are not production errors.
- Reduced-motion paths inspected in code: GSAP entrance/pin early-outs, reactive
  Lenis cleanup, native scroll fallback, disabled autoplay, final CSS states. The
  browser tool does not expose media preference emulation, so this was not an
  automated live reduced-motion browser test.

## Remaining limits

Ten projects still need real product images; TripPak uses its existing concept
illustration. See the inventory in `docs/REDESIGN-AUDIT.md`. Lighthouse/Core Web
Vitals were not measured; no performance score is claimed. Static build reports
232 kB first-load JavaScript. Public publishing was not requested.

## Hero background update — 20 October 2026

Kept the existing hero layout/content and softened the dotted texture. Added
14 sparse static stars and three CSS shooting-star trails; mobile shows seven
stars and two slower trails. Only transform/opacity animate. No new dependency,
canvas, WebGL context or JavaScript frame loop.

Validation: standard and static production builds passed. At 1536×1024 the title,
actions, project preview, expertise and nav bounding rectangles matched the
pre-change measurements exactly. Desktop navigation to Experience paused all
three trails. At 375×812, two 24-second trails were enabled, no document overflow
was introduced, and navigating to Projects paused the mobile field. The hidden
tab and reduced-motion early-outs were inspected in code; media preference
emulation is unavailable in the current browser tool.

Screenshots: `hero-background-before.jpg`, `hero-background-after.jpg` and
`hero-background-mobile.jpg` in the evidence directory above.


## Single fixed starfield — 20 October 2026

Supersedes the hero-only dotted background and trails above. The root layout now
mounts one `StarfieldBackground` with a CSS module at `100dvw × 100dvh`.
Both layout shells use transparent sections. Removed the five old OriginKit
backgrounds, per-panel ambient wrapper, hero starfield/dot image, unused R3F
scenes, glass fallback image and background sync script. Uninstalling the unused
Three.js/R3F dependencies removed 65 packages. Non-background UI and project
media remain intact.

Verified on the exported preview at `http://127.0.0.1:4173/portfolio/`:

- Desktop 1536×1024: exactly one fixed field with bounds x=0, y=0,
  width=1536, height=1024 on Intro, Experience and Contact. All five desktop
  panels compute transparent backgrounds. No canvas and no horizontal overflow.
- Mobile 375×812: exactly one field with 30 visible stars, versus 60 desktop.
  After scrolling 2923px to Projects, background bounds remain 0,0,375,812;
  the section heading lands at 100px below the fixed header. No overflow.
- Observed changing star opacities and fresh meteor positions/lengths while
  navigating. Source varies every twinkle cycle and meteor speed, angle and
  interval. Only native opacity/transform animations run, with one meteor and
  no JavaScript frame/drawing loop.
- Reduced-motion early-outs, hidden-tab cancellation, preference/breakpoint
  updates and timer/listener/animation cleanup inspected in code. Media
  preference emulation is unavailable in the browser tool; no live reduced-
  motion test or performance score is claimed.
- `npm run build`, `npm run build:static`, and `git diff --check` passed.
  Static export reports 231 kB first-load JavaScript. Fresh production console
  check returned no warnings or errors.

Evidence: `site-starfield-desktop.jpg`, `site-starfield-experience.jpg`,
`site-starfield-mobile.jpg`, `site-starfield-mobile-projects.jpg` in the evidence
directory listed above. The preview tab is retained. No commit, push or publish
was requested or performed.


## Wider shared site shell — 20 October 2026

One `SiteShell` now wraps site content in `app/layout.tsx`; its CSS module is the
single source for `.site-container` width, maximum and gutters. The header,
hero, Experience, Projects heading/list, Stack and Contact/footer use that
primitive. Removed separate 1264px width rules and independent header gutters.
Viewport panels and the horizontal pin/track remain full-width.

Verified on the exported preview:

- 1536×1024: content expanded from 1264px to 1413.1px, with matching 61.4px
  left/right insets for navigation and every desktop section. Exactly one root
  shell and one fixed starfield; no horizontal document overflow.
- Navigation through all five desktop sections still lands correctly. Projects
  heading/list align, all 17 cards remain, and the wider grid has three columns.
  Footer width matches navigation/content width.
- 1920×1080: both hero and navigation reach the shared 1680px maximum.
- 1280×720: both use 1177.6px; settled pin and document remain viewport-wide.
  Hero headline lines do not overflow. Added 52px clearance for location/footer
  content beside the floating contact button on short desktop screens.
- 1024×768 and 375×812: header and all section containers align at the same
  32px / 20px gutters. Existing mobile body width is preserved; no document
  overflow. Responsive swaps retain exactly one root shell/background.
- Final `npm run build:static` passed, including type/lint checks. `git diff
  --check` passed. Fresh browser console check returned no warnings or errors.

Evidence: `site-width-before.jpg`, `site-width-desktop.jpg`,
`site-width-wide-desktop.jpg`, `site-width-experience.jpg`,
`site-width-projects.jpg`, `site-width-contact.jpg`, `site-width-mobile.jpg`.
No content/data changes, commit, push or deployment were made for this update.


## Combined Background page — 20 October 2026

Experience and Stack now share `BackgroundSection`, second-last in both layouts:
Intro → Projects → Background → Contact. The section pairs a career timeline
and education with a framed technical toolkit. Skills use wrapping tags and
four collection filters. Both role dates, all original responsibilities (two
shown initially, expandable), both education entries and all 14 skill groups
remain in `lib/data.ts`. Native scrollbars are hidden globally; overflow remains
scrollable. The shared site shell and single fixed starfield are preserved.

The desktop timeline now builds measured transitions from `NAVIGATION`. Projects
is the second panel; hero navigation and keyboard focus use its derived index.
The combined Background page uses one native scroll region that releases wheel
input to the track at its boundaries.

Verified:

- `npm run build` and `npm run build:static` passed, including type/lint checks.
  One-off data checks confirmed four ordered pages, complete/unique filter
  coverage of all 14 skill groups, both roles/education entries and 17 projects.
- At 1536×1024, navigation contains Intro, Projects, Background, Contact; the
  combined page reports 03 / 04. Both timeline and skills display together.
  All 14 groups render by default, with no horizontal document overflow.
- AI & integrations selects exactly five matching groups. Expanding Fexen shows
  all six original responsibilities; collapsing restores two. Mobile Workflow
  selects its three matching groups. Filter buttons expose pressed state and
  the displayed group count updates through a polite live region.
- One downward wheel gesture scrolls the merged region from 0 to its ~445px
  bottom without moving page Y=5666. A further gesture advances to Contact at
  Y=7202, counter 04 / 04. Computed scrollbar-width is none, overflow-y is auto.
- Hero Explore my work opens Projects at Y=1536. Keyboard focus on the final
  project reaches its visible final row; all clipping containers keep scrollTop
  0. The Projects segment remains on the shared measured timeline.
- At 375×812, mobile menu has four ordered links and Background lands ~96px
  below the fixed header. Main sections are intro/projects/background/contact.
  Career/toolkit stack into one column; filters work, scrollbars stay hidden,
  no horizontal overflow, and only one global background is mounted.
- At 1280×720, the merged layout retains two columns with a 482px scroll region,
  no visible scrollbar or horizontal overflow. Normal viewport restored after
  responsive checks and the preview tab retained on Background.
- Fresh browser error/warning check returned none. Reduced-motion behavior was
  inspected in source (pin skipped, panels stack, native scrolling, transitions
  disabled); media preference emulation is unavailable in this browser tool.
- `git diff --check` passed. No commit, push or deployment performed.

Evidence: `background-page-before.jpg`, `background-page-desktop.jpg`,
`background-page-mobile.jpg`, `background-toolkit-mobile.jpg`,
`background-page-laptop.jpg` in the evidence directory listed above.

## Scroll effects — 20 October 2026

Added the four selected effects: masked hero/section heading entrances, staggered
project card entrances, career timeline progression, and native scroll-edge
shadows in the Background panel and case-study modal. Page order, content,
background and the existing Lenis/GSAP scroll distances remain unchanged.

Implementation uses the active desktop panel plus one-shot visibility observers;
mobile observes normal vertical flow. Card entrance transforms sit on wrappers,
leaving hover transforms on the cards. Keyboard focus reveals a wrapper
immediately and navigates using its measured offset. Timeline/edge measurements
run only in queued frames after scroll/resize/load events, with observer/listener
cleanup and no new animation dependency. Reduced motion renders final headings,
cards and static timeline accents; text is never dimmed during timeline scrolling.

Verified:

- `npm run build` and `npm run build:static` pass type/lint/build checks; First
  Load JS reports 233kB. `git diff --check` passes. No performance score claimed.
- Pure calculation checks cover no overflow, top/bottom and fractional-bottom
  boundaries, overscroll clamping, monotonic timeline progression and native
  scroller coordinate invariance.
- At 1756×1224, hero heading height remains 272.8125px, matching its prior layout.
  Visible project cards finish at opacity 1 without a residual transform.
  Keyboard focus reaches The Flame in the final row, while clipping wrappers
  retain scrollTop 0. The Projects vertical segment still works.
- Background native scrolling updates the timeline and edge shadows. At its
  bottom the lower shadow clears; a subsequent gesture advances to Contact.
  The Contact heading reveals normally. Modal navigation retains 1180×820 size.
- At 375×812, Projects headings/cards reveal, document width remains 375px,
  and menu navigation still works. Mobile timeline progress responds to window
  scrolling (first line ~0.50 near entry, ~0.96 after a downward gesture).
  Modal stays 351×788; its body scrolls from 0 to 372 with a fixed footer, and
  its copy area remains in natural vertical flow.
- At 1280×720, hero lines fit, the document stays viewport-wide, and Background
  retains its native 482px scroll region. Normal viewport restored afterward.
- Reduced-motion fallback and cleanup paths inspected in source; live media
  preference emulation is unavailable in this browser tool.
- Initial empty-target GSAP warnings were addressed by skipping grids with no
  unseen cards. Console records show no new warnings/errors after the final
  exported build was reloaded and Projects/Background were visited.
- No commit, push or deployment performed.

Evidence: `scroll-effects-projects-desktop.jpg`,
`scroll-effects-background-desktop.jpg`, `scroll-effects-background-laptop.jpg`,
`scroll-effects-background-mobile.jpg`, `scroll-effects-modal-mobile.jpg` in the
same evidence directory listed above.

## Two-slide Background overview — 20 October 2026

Replaced the simultaneous career/toolkit layout with a native-scroll sequence.
The final direction has two stages: Experience & Education together, followed by
Selected Stack. The first renders short role summaries and qualifications with
institutions; dates, detailed responsibilities and education metadata are omitted
from this view. The second retains the grid presentation with six curated skill
areas. All complete original experience/education/skills data remains in data.ts.

Both bodies use the available frame with balanced vertical spacing. Desktop pairs
career and education columns and uses three columns for the featured stack; the
layouts collapse naturally on tablet/phone. Stage controls provide direct access.
Native scroll progress drives a 40px slide/fade between stages, and tall content
gets its full travel before the next stage. No wheel interception or new scrolling
library was added. Inactive stages are inert and aria-hidden; reduced motion uses
normal vertical flow with both stages visible. The existing modal and Projects
scroll behavior remain intact.

Verified:

- Standard and static builds pass type/lint checks; static First Load JS is 235kB.
  git diff --check passes. No performance score is claimed.
- One-off checks verify two ordered stages, contiguous transition ranges, overflow
  travel for short/large viewports, six curated stack areas, and preservation of
  both roles, both education entries and all 14 detailed skill groups in data.
- 1756×1224: paired career/education timelines, no dates in their rendered text,
  six stack groups in three columns, and only the current stage exposed to focus
  and assistive technology. Direct stage navigation works both directions.
- 1280×720: native inner scrolling reveals the final stack row completely; a
  further gesture releases to Contact. No document-width overflow.
- 375×812: menu navigation works, document width stays 375px, the shared sequence
  viewport sticks at 96px below the header, and all selected content remains
  reachable. The final workflow group fits above the frame boundary at the end.
- Verification used a separate preview tab because the user's original preview
  had an element-inspection overlay that intercepted some control actions.
  The clean preview console returned no warnings/errors.
- Reduced-motion paths were reviewed in source; this tool does not expose live
  preference emulation. Observers, timeline and pending refresh frames clean up
  on responsive swaps, motion changes and unmount.
- No commit, push or deployment performed.

Evidence: background-two-slides-overview.jpg, background-two-slides-stack-wide.jpg,
background-two-slides-stack.jpg and background-two-slides-mobile.jpg in the
existing evidence directory above. The wide desktop captures show the final
spacing revision.

## Compact centered header — 20 October 2026

The navigation capsule now uses fit-content width inside the shared site-container
wrapper, centered on desktop and mobile. Empty header space passes pointer input
through; the capsule and its controls remain interactive. Desktop uses one shared
Motion layout pill, driven by the existing active panel state, with a restrained
spring and immediate switching under reduced motion. No scroll controller,
navigation labels or page offsets changed.

Validation: standard and static builds pass with type/lint checks; git diff
--check passes. At 1280px the desktop capsule measures 450.734px and is centered
within 0.01px. Scrolling Intro → Projects updates the active pill; its settled
bounds match the active button exactly. Direct Background navigation retains the
same capsule width. Keyboard and mobile menu checks are recorded with the final
browser verification. Reduced-motion handling is inspected in source; no live
media-preference emulation is claimed. Evidence: header-fit-centered-desktop.jpg
and header-fit-centered-mobile.jpg in the existing evidence directory.

Final header checks: keyboard activation of Contact switches the same single pill
and preserves focus; pill and active-button bounds match exactly. At 375px the
mobile capsule measures 209.1875px, centered at x=82.90625 with no document overflow.
Opening the menu, navigating to Background and restoring focus all work. Browser
console returned no warnings/errors. Temporary test tab closed, viewport reset
requested, and the original preview refreshed. No commit, push or deployment.

## Experience content update — 20 October 2026

Verified the TQMS entry against the saved text and page-two image of
muqeet_cv_2.2 in Documents/Codex/2026-10-08/new-chat/work/cv-review. Added one
Accountant role with a short summary of accounting operations, reconciliations,
reporting, ledger records and audit documentation. TQMS has no date field.
Stack One's displayed role is now Frontend Developer. The overview still hides
all experience/education dates. Grid rows now follow the actual number of entries
instead of assuming two roles; both responsive layouts use the shared data.

Static build passes type/lint checks; git diff --check passes. Browser validation
confirmed Fexen, Stack One and TQMS, the three intended role titles, and no dates
in the rendered overview. At 1280×720, native scrolling fully reveals TQMS while
the first stage remains opacity 1 (its bottom ~666px, frame bottom ~676px).
Evidence: experience-tqms-updated.jpg. No PDF, commit, push or deployment changed.

## Centered Background scroll segment — 20 October 2026

Removed the numbered slide toolbar, scroll hint and both Background edge shadows.
Deleted the unused PanelScrollArea wrapper. The desktop Background sequence now
belongs to the same measured page timeline as Projects: the track finishes its
horizontal entry, parks at Background, advances both scenes, then resumes its
horizontal exit. The child exposes measure/render through a controller; clamped
progress keeps the scenes at their initial/final state outside that segment.
There is no nested Background scroller or independent desktop ScrollTrigger.
Mobile keeps its ordinary document-scroll sequence; reduced motion uses static
flow. The modal keeps its existing overflow treatment and containment.

Verified:

- Standard and static builds pass type/lint checks. Static First Load JS is 235kB.
  git diff --check passes. No new dependency, commit, push or deployment.
- Pure scroll-gate checks cover entry, centered progress, exit, reverse scrolling
  and a zero-distance fallback. Intermediate progress exists only inside the
  measured Background range.
- At 1280×720, the Background panel enters at x≈492px and x≈312px while its first
  scene stays y=0/opacity 1 and Stack stays hidden. Further wheel input over the
  partially visible Background area continues horizontal movement.
- At x=0, vertical input advances the first scene (y≈-59.55px at window Y=7839).
  Both Background wrappers retain scrollTop 0; overflow is clip rather than auto.
  The full stack then appears at x=0 and opacity 1.
- After the Background segment, horizontal exit reaches x≈-389px. The final scene
  stays y=0/opacity 1. Reverse input brings x to ≈-209px without advancing either
  scene, then recenters the panel before the sequence reverses.
- Keyboard Page Down on the focusable Background region moves the main window
  from Y=7611 to Y=8291, revealing Stack while the panel stays at x=0. Inner
  scrollTop remains 0. Main navigation still reaches the measured section offsets.
- At 375×812, menu navigation works, viewport width stays 375px, the sequence sticks
  at y=96px, scenes transition in document flow, and the last skill group is fully
  reachable (bottom≈781.6px within a frame ending at 796px).
- Toolbar and Background shadow counts are 0 on both layouts. The test browser
  reports no warnings/errors. Reduced-motion lifecycle/fallback checked in source;
  no live media emulation or performance score is claimed.

Evidence: background-entry-gated.jpg, background-centered-stack.jpg and
background-centered-mobile.jpg in the existing evidence directory.

## Compact project image timing — 21 October 2026

Removed the compact autoplay button and its unused styles/icons. A 3px timing
bar now sits 10px inside the image's bottom and side edges. The five-second
rotation resumes after temporary interaction; navigation resets the cycle.
Both shells suspend the carousel while a case study is open.

- Standard and static builds passed lint/type checks; git diff --check passed.
- At 1280×720, the bar stays inside the image and autoplay advances projects.
  Manual Next resets the fill to zero and pauses it. The selected title stays
  unchanged for a six-second focus hold; leaving the carousel resumes playback.
- Opening a case study sets playback and CSS animation to paused. Navigating to
  Projects pauses it; returning to Intro resumes it. Browser console is clean.
- At 375×812, document and viewport widths are both 375px. The timing bar fits
  inside the 105×100px preview; both arrows retain 44×44px hit areas.
- Reduced-motion guards and hidden-tab cleanup checked in source. No runtime
  media emulation or performance benchmark is claimed.

Evidence: hero-image-timing-desktop.jpg and hero-image-timing-mobile.jpg in the
existing evidence directory.

Follow-up: the timing bar now spans the image's full width, flush immediately
below its outer bottom edge. It is 2px tall, with no border, shadow or rounded
caps. Desktop and 375px mobile DOM measurements confirm barTop = imageBottom
and barWidth = imageWidth; playback remains running and mobile has no horizontal
overflow. Static build and diff checks passed. Evidence: hero-flush-timing-bar.jpg.
