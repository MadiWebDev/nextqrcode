# CHANGELOG — Invoice Generator mobile update (side-scroll editor + preview)

Scope: `invoicegenerator.freeqrcode.tools` only. The existing app was improved
in place — no feature was removed or rebuilt. Desktop (≥1024px) keeps the
previous side-by-side layout (editor left, sticky preview right) throughout.
All changes were verified with the production build, the existing browser
suite, and a new mobile spec (`e2e/invoice-mobile.spec.ts`).

## `src/app/invoice-site/InvoiceApp.tsx`

### Mobile layout (Phase M1)
- Below 1024px the create view's editor and live preview are now two
  full-width panels in one horizontal scroll-snap scroller
  (`snap-x snap-mandatory`, `overscroll-x-contain`, each panel
  `w-full shrink-0 snap-start`, height `calc(100dvh - 3.75rem)`); each panel
  scrolls vertically on its own. At ≥1024px the same container is the
  original 2-column grid.
- Sticky segmented **Edit | Preview** toggle above the panels
  (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, roving
  tabindex, ArrowLeft/ArrowRight keyboard support). A throttled
  IntersectionObserver keeps the active tab in sync with swiping; tapping a
  tab smooth-scrolls to its panel (instant under `prefers-reduced-motion`).
- Floating **Preview** button on the Edit panel and a **Back to edit**
  button on the Preview panel.
- One-time **"Swipe to see the preview"** hint with a subtle nudge
  animation; dismissed permanently (localStorage
  `invoicegenerator:swipe-hint-seen`, read via `useSyncExternalStore` so
  hydration matches the server HTML) on first arrival at the preview or on
  its close button.
- Editor scroll position is captured on panel switch and restored on
  return; panels stay mounted so their scroll survives regardless.

### Live preview intelligence (Phase M2)
- Every edit path (`patchDraft`, `patchSettings`, `patchItem`, add /
  duplicate / remove item) reports its field's preview region
  (`REGION_BY_KEY`): the region **flashes** softly for ~1s
  (`.inv-flash` in `globals.css`) and, while the user is on the Edit panel,
  the Preview tab and floating button show an **"Updated"** badge that
  clears when the preview is viewed.
- `InvoicePreview` gained optional `flashRegion` / `onRegionTap` props and
  `data-region` anchors (business header in all 5 header styles, Bill-to
  client, invoice meta, items table, each item row, totals, payment QR,
  notes, terms, footer). The read-only `/v` share page passes neither prop
  and renders exactly as before.
- **Tap-to-edit:** tapping a preview region returns to the Edit panel and
  focuses the matching field (invoice number, client name, item
  description, discount %, payment amount, notes, terms, footer). The
  business header jumps to Business & clients with the business-name field
  focused, because that is where business identity is edited.
- **PreviewScaler** (mobile only; desktop renders the preview untouched):
  the preview renders at a fixed 794px width (A4 at 96dpi) and is scaled
  with a CSS transform — **Fit** (whole page), **100%** (true size, pan by
  scrolling), **pinch** between Fit×0.75 and 250%, and **double-tap** to
  toggle Fit/100%, with a live percentage readout. Text scales as vectors
  and stays crisp. Preview/PDF parity is unchanged by design: both render
  from the same template definitions, totals engine and money formatting.

### Polish (Phase M3)
- **Sticky bottom action bar** on mobile (Save / PDF / Print) using
  `position: sticky` inside the create view — it hugs the viewport bottom
  only while the workspace is on screen and scrolls away before the page
  content and ad slots below it, so it can never cover them. Safe-area
  inset padded. The floating Preview button and hint were re-offset above
  it; panels carry matching bottom padding.
- **Item cards:** touch reorder via up/down buttons (the drag handle is
  mouse-only; desktop keeps drag), larger taxable checkbox on mobile.
- **Print on iOS Safari fixed:** `printPdf` now opens its tab
  synchronously inside the click (Safari drops the user-activation across
  an `await` and blocked the old flow); if a popup is still blocked it
  falls back to downloading the PDF.
- Client email/phone fields use `type`/`inputMode`/`autoComplete`
  (`email`, `tel`), client name `autoComplete="organization"`; numeric
  fields already used `inputMode="decimal"`.
- New editor focus anchors (`data-focus`) and two aria-labels (discount %,
  payment amount) that tap-to-edit uses; both also help screen readers.
- Accessibility semantics fixed (found by the Lighthouse pass): the
  workspace view switcher and the settings section switcher used
  `role="tablist"` around plain buttons (invalid — a tablist requires
  `role="tab"` children). They are now `role="group"` with
  `aria-current` on the active button. The new Edit | Preview control is
  a genuine tablist with real tabs. Lighthouse `aria-required-children`
  went from failing to passing; Accessibility 84 → 88. The audits still
  failing (Radix combobox names, unassociated Field labels, ad-label
  contrast, page heading order) are pre-existing patterns outside this
  program's elements.

## `src/app/globals.css`
- `@keyframes inv-hint-nudge` + `.inv-hint-arrow`, `@keyframes
  inv-flash-fade` + `.inv-flash`, with `prefers-reduced-motion` disabling
  the hint animation and shortening the flash. (External stylesheet on
  purpose — this site's CSP refuses inline `<style>`.)
- Invoice-scoped mobile ergonomics under `.invoice-site-root` below
  1024px: inputs, select triggers, buttons and select items are at least
  44px tall (icon buttons 44px wide), and all form fields render at 16px
  so iOS Safari does not auto-zoom on focus. Other sites are unaffected.

## `src/app/invoice-site/_components/InvoiceHeader.tsx`
- Mobile menu button 40px → 44px tap target.

## `e2e/invoice-mobile.spec.ts` (new)
- Mobile-project Playwright battery: scroll-snap contract + scroll-driven
  toggle sync, hint-once across reload, editor scroll memory, live preview
  update + flash + Updated badge, tap-to-edit focus, Fit/100% zoom,
  ≥44px tap-target audit, touch reorder, action-bar save, zero page-level
  horizontal overflow at 320/360/375/390/414/768px and in landscape, and a
  desktop-width guard (toggle hidden, panels side by side).

## Docs
- `docs/CHANGELOG-MOBILE.md` (this file) and `docs/TESTING-MOBILE.md`.
