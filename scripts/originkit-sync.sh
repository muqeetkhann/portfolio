#!/bin/zsh
# Pull the OriginKit shortlist into components/originkit/ui/.
#
# OriginKit's free tier has TWO caps, and the weekly one is the real constraint:
#   * 5 component fetches per WEEK
#   * 3 component fetches per DAY   <- hits first: a 5-item run needs two days
# Sections (kind: section) are exempt from the weekly cap; components are not.
#
# Two rules keep a spent quota from costing us anything:
#
#   1. One component per `add` call. The CLI fetches every argument before it
#      writes anything, so a batch that trips the cap on its last item discards
#      every component that already fetched successfully.
#   2. Stub-aware overwrite. components/originkit/ui/ is pre-populated with
#      no-op modules carrying an ORIGINKIT_STUB marker so every import resolves
#      and the app builds with or without the real components. We pass -o to
#      replace a stub, but skip any file that no longer carries the marker —
#      that's a real component already in place.
#
# A rejected add costs no quota, so re-running this any time is free — and it has
# to be re-run: at 3 fetches a day the five-item shortlist always stops partway
# through the first run and finishes on the next day's.
#
# Usage: scripts/originkit-sync.sh [--wait]
#   --wait   poll every 10 min through the daily cap instead of exiting

cd "$(dirname "$0")/.." || exit 1

# The five panel backdrops, one per section. All five are present now, so a run
# only re-checks them — it is a no-op unless a file is deleted or reverted.
#
# NOT sonar-bloom. The original shortlist named it for the Contact panel, but it
# is a PAID registry component: `add` refuses it with "is a paid component and
# your plan does not include it", which no amount of waiting fixes. There is no
# way to tell free from paid before fetching — `list --json` carries name,
# category, kind, description and tags, and nothing about entitlement — so the
# only signal is the add itself. That rejection reads as an authorization
# failure rather than a metered one, so it appears not to burn a fetch, but
# don't rely on that: prefer a component whose sibling in the same category has
# already been fetched successfully. smokey-shader took its place.
COMPS=(network-lines moire-lattice dot-lens hex-comb smokey-shader)

WAIT=0
[ "$1" = "--wait" ] && WAIT=1

for c in $COMPS; do
  f="components/originkit/ui/$c.tsx"
  if [ -f "$f" ] && ! grep -q "ORIGINKIT_STUB" "$f"; then
    echo "SKIP  $c (real component already present)"
    continue
  fi
  while true; do
    out=$(npx -y originkit@latest add "$c" -o 2>&1)
    # A rejected add costs no quota, so bailing out here is free. Stop the whole
    # run rather than marking every remaining component FAILED — once either cap
    # is hit, nothing further can succeed until it resets.
    if echo "$out" | grep -qE "(Daily|Weekly) limit reached"; then
      if [ "$WAIT" -eq 1 ] && echo "$out" | grep -q "Daily limit reached"; then
        sleep 600
        continue
      fi
      echo "QUOTA $c — $(echo "$out" | grep -oE '(Daily|Weekly) limit reached') ($(echo "$out" | grep -oE 'resets in [^)]*'))"
      exit 0
    fi
    if [ -f "$f" ] && ! grep -q "ORIGINKIT_STUB" "$f"; then
      echo "ADDED $c"
    else
      echo "FAILED $c :: $(echo "$out" | tail -2 | tr '\n' ' ')"
    fi
    break
  done
done
echo "DONE"
