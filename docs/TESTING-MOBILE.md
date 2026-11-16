# Testing the mobile side-scroll invoice workspace

## Automated (all run against the production build)

```bash
npm run build
npx playwright test e2e/invoice-mobile.spec.ts --project=mobile
npx playwright test e2e/invoice-workspace.spec.ts --project=chromium
npx vitest run
npx tsc --noEmit
npx eslint src/app/invoice-site/InvoiceApp.tsx src/app/invoice-site/_components/InvoiceHeader.tsx
```

`e2e/invoice-mobile.spec.ts` (Pixel 7 emulation) proves, in a real browser:

1. **Swipe/tab sync** — the scroll-snap CSS contract (mandatory snap,
   `overflow-x: auto`, snap-aligned panels) is asserted, and scrolling the
   container to a panel — where any real swipe lands — flips the
   segmented toggle's `aria-selected` via the IntersectionObserver;
   tapping the tabs does the same in reverse. (Headless Chromium cannot
   drive native touch-scroll from synthesized gestures — verified
   empirically — so the gesture leg itself is a real-device check; the
   container is a standard overflow scroller, which touch-scrolls
   natively on hardware.)
2. **Hint once** — "Swipe to see the preview" appears on a first visit,
   disappears when the preview is reached, and does not return after a
   reload.
3. **Scroll memory** — the editor's scroll position survives a round trip
   to the preview and back.
4. **Live preview + flash + badge** — typing a client name updates the
   preview's Bill-to region, flashes it (`.inv-flash`), and badges the
   Preview tab "Updated" until the preview is viewed.
5. **Tap-to-edit** — tapping the preview's totals returns to the Edit
   panel with the "Discount as a percentage" field focused.
6. **Zoom** — the readout starts at the Fit percentage, switches to 100%
   on demand, and back.
7. **Polish** — every input/select/button rendered in the editor panel is
   ≥44px tall; item up/down buttons reorder by touch; the sticky action
   bar's Save persists the invoice.
8. **No overflow** — `documentElement.scrollWidth <= clientWidth` at
   320/360/375/390/414/768px (both panels) and at 844×390 landscape; at
   1280px the toggle is hidden and the panels sit side by side.

`e2e/invoice-workspace.spec.ts` (desktop) guards the original flows:
hydration, currency switching, create → save → PDF, the share/view-QR
round trip, the 360px responsiveness checks and the PDF totals block.

## Manual checklist (5 minutes, any phone)

1. Open the invoice site, scroll to the workspace. The Edit | Preview
   toggle sticks to the top; the hint pill shows once.
2. Type in any field — the floating Preview button gains an "Updated"
   badge. Swipe left: the same value is in the preview, highlighted
   briefly. Swipe back: you are exactly where you left the form.
3. On the preview, use Fit / 100%, pinch, and double-tap; tap the client
   block, an item row and the totals — each returns you to the matching
   field, focused.
4. Add two items and reorder them with the up/down buttons.
5. Use the bottom bar: Save, then PDF (downloads), then Print (opens the
   PDF view). Rotate the phone — no sideways page scroll anywhere.
6. Desktop: resize past 1024px — the classic two-column layout returns,
   toggle and bottom bar gone.

## Not covered by automation here

- **Real iOS Safari / Android Chrome devices** were not available in the
  build environment; behaviour there is covered by standard APIs
  (scroll-snap, IntersectionObserver, pointer events) plus the iOS print
  fix, but a physical-device pass remains the owner's smoke test.
- **Pinch zoom** is implemented with pointer events and unit-verified in
  code review; the automated battery covers the Fit/100% controls and
  double-tap path rather than a synthesized two-finger gesture.

## Lighthouse (mobile, local production server)

Measured with Lighthouse against `next start` on this build VM (1.5
shared vCPUs, Lighthouse's own 4x CPU throttling on top): Performance
53-70 across runs (Total Blocking Time dominates and swings with host
load; FCP stable at about 1.4-1.5s), Accessibility 88, Best Practices
100, SEO 92-100, and **CLS 0 in every run**. Treat the Performance
number as environment-bound, not a production prediction — re-measure
on the deployed site for a trustworthy score. `aria-required-children`
failed before this program's semantics fix and passes after it.
