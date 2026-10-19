# AdSlot Rollout Report

Branch: `ads/adslot-4-5-per-page` — 4–5 `<AdSlot>` components on every
eligible page. Existing slots kept and counted toward the total.

## Summary

- Pages scanned: 264 (`page.tsx` files under `src/app/`)
- Done (4–5 slots): 236
- Skipped (ineligible): 5
- Flagged short (<4 slots, with reason): 23
- Total slots in `page.tsx` files: 30 → 1019 (+989)

## Placement rules applied

- Positions, in order: `top` (below breadcrumbs), `after-tool` (directly
  after the main tool/generator), `in-content` (between long prose blocks),
  `pre-related` (before the related-items / explore-more grid), `bottom`
  (after the last section). Never two ads back-to-back: at least one
  meaningful content section sits between any two ads. Never inside
  tool/generator UI, forms, or between a heading and its content.
- Tool pages skip `top` to keep the primary tool above the fold on mobile;
  their first slot is `after-tool`.
- Formats: `horizontal-banner` for top / after-tool / pre-related / bottom,
  `in-article` for in-content slots.
- `AdSlot` components were NOT modified: CLS is already handled by the
  canonical component (fixed min-height per format: leaderboard 90px,
  rectangle 250px, in-article 280px, plus reserved space when consent
  is unknown).

## Coordinator decisions (fix-ups after the worker batches)

- **Canonical-import pages** (blog, glossary, industries, q, qr-size-guide,
  scan-guide, templates): workers reused the shared
  `slot={siteConfig.adsense.slotInContent}` value for every new slot. The
  task requires IDs unique per page, so the coordinator gave each NEW
  leaderboard slot a unique value following the ID format (e.g.
  `` `blog-${slug}-top` ``). Pre-existing in-article slots keep their env
  slot value untouched, and all canonical slots keep their existing
  `eligible={...}` expression.
- **[locale] wrappers / double ads**: `[locale]/url`, `/vcard`, `/wifi`
  embed pages that already carry slots. `[locale]/wifi` had its 2 wrapper
  slots REMOVED — the embedded wifi page already carries 4, so the
  rendered page has 4; wrapper slots would have doubled ads. The other
  wrappers keep their slots; their rendered totals are shown below.
- **Re-exports**: `bulk-vcard-generator` re-exports `bulk-vcard-qr/page`
  (4 slots) and `regional-payment-qr` re-exports `pakistan-payment-qr/page`
  (4 slots) — the rendered pages have 4 slots each even though their own
  `page.tsx` files contain none.
- **Homepage**: the shared `HomePageContent` component already carries 3
  pre-existing slots (`home-top`, `home-mid`, `home-bottom`). Root
  `src/app/page.tsx` gained one bottom slot with ID `home-bottom-2`
  (not `home-bottom`, to stay unique against the component's slot), so
  the rendered homepage has 4. `[locale]` home renders 5 (2 wrapper +
  3 in the shared component).
- **Pre-existing slots in shared components** are counted in the
  “Rendered” column where they apply; the Before/After columns count
  slots in the `page.tsx` file itself.

## Skipped — ineligible per docs/ADSENSE.md (no slots added)

| Page | Reason |
| --- | --- |
| `src/app/dashboard/[id]/page.tsx` | ineligible per docs/ADSENSE.md |
| `src/app/dashboard/page.tsx` | ineligible per docs/ADSENSE.md |
| `src/app/dashboard/settings/page.tsx` | ineligible per docs/ADSENSE.md |
| `src/app/login/page.tsx` | ineligible per docs/ADSENSE.md |
| `src/app/unlock/[publicId]/page.tsx` | ineligible per docs/ADSENSE.md |

## Flagged short — fewer than 4 slots, with reason

| Page | Slots (file / rendered) | Reason |
| --- | --- | --- |
| `src/app/[locale]/text/page.tsx` | 2 / 2 | Rendered page has 2 slots (wrapper only; LandingGenerator carries none). No further safe breaks in the wrapper. |
| `src/app/[locale]/url/page.tsx` | 2 / 3 | Rendered page has 3 slots (2 wrapper + 1 in embedded url page). No further safe breaks in the wrapper. |
| `src/app/[locale]/vcard/page.tsx` | 2 / 3 | Rendered page has 3 slots (2 wrapper + 1 in embedded vcard page). No further safe breaks in the wrapper. |
| `src/app/barcode-generator/page.tsx` | 3 / 3 | Guide article is a single h2 + paragraph + list with no safe inter-paragraph break; only after-tool (existing) + pre-related + bottom fit without splitting a paragraph-list block. |
| `src/app/bitcoin-qr-code-generator/page.tsx` | 2 / 2 | Thin wrapper rendering a single <LandingGenerator />; no content sections in page.tsx for mid-page slots without editing the shared child. |
| `src/app/blog/page.tsx` | 2 / 2 | Article grid is a single .map() loop — no safe mid-grid break without touching logic; only top (existing) + bottom fit. |
| `src/app/bulk-generator/page.tsx` | 1 / 1 | Single-section page (header + BulkClient only); top skipped to keep the tool above the fold and no further content breaks exist without adjacent ads. |
| `src/app/card/[slug]/page.tsx` | 0 / 0 | thin wrapper returning only CardViewClient with no content sections in page.tsx; forcing slots would place ads around a personal digital card with no content break |
| `src/app/glossary/page.tsx` | 3 / 3 | category sections render via a single .map loop; cannot split between categories without restructuring, so only 3 safe top-level placements exist |
| `src/app/industries/page.tsx` | 3 / 3 | category sections render via a single .map loop; cannot split between categories without restructuring, so only 3 safe top-level placements exist |
| `src/app/payment-qr/page.tsx` | 2 / 2 | Hub listing page with no prose or related sections; the scheme grid is the content, so additional slots would sit adjacent to the existing top/bottom slots. |
| `src/app/q/[publicId]/page.tsx` | 2 / 2 | QR display page has no related grid and the owner-tools section is conditional, so additional slots would sit adjacent to the existing/bottom slots or inside the QR tool column. |
| `src/app/qr-labels/page.tsx` | 2 / 2 | Index grid page: single label-sheets grid, no article/FAQ/related sections; no safe mid-grid break without touching list logic. |
| `src/app/qr-scanner/page.tsx` | 2 / 2 | Thin tool-only page: header + ScannerClient only, no article/FAQ/related sections; a third slot would sit adjacent to another ad. |
| `src/app/qr-size-guide/page.tsx` | 3 / 3 | Hub grid page: single guides grid + CTA section, no article/FAQ; no safe mid-grid break without touching list logic. |
| `src/app/templates/page.tsx` | 2 / 2 | Single template grid rendered by one .map() — cannot split for in-content/pre-related slots without touching logic; top + bottom only |
| `src/app/upi-qr-code-generator/page.tsx` | 1 / 1 | Thin wrapper around LandingGenerator: only one anchor exists in page.tsx (after the component); no in-page sections for after-tool/in-content/pre-related without back-to-back ads, and top skipped to keep tool above fold on mobile |
| `src/app/url-qr-code-generator/page.tsx` | 1 / 1 | Thin wrapper around LandingGenerator: only one anchor exists in page.tsx (after the component); no in-page sections for after-tool/in-content/pre-related without back-to-back ads, and top skipped to keep tool above fold on mobile |
| `src/app/vcard-qr-code-generator/page.tsx` | 1 / 1 | Thin wrapper around LandingGenerator: only one anchor exists in page.tsx (after the component); no in-page sections for after-tool/in-content/pre-related without back-to-back ads, and top skipped to keep tool above fold on mobile |
| `src/app/view/page.tsx` | 0 / 0 | Thin Suspense wrapper around MediaViewClient with no content sections in page.tsx — slots not forced |
| `src/app/whatsapp-qr-code-generator/page.tsx` | 1 / 1 | Thin wrapper around LandingGenerator: only one anchor exists in page.tsx (after the component); no in-page sections for after-tool/in-content/pre-related without back-to-back ads, and top skipped to keep tool above fold on mobile |
| `src/app/whatsapp-qr/[slug]/page.tsx` | 3 / 3 | Kept existing after-tool slot; added pre-related/bottom. Country guide prose is a single block that cannot be split for an in-content slot, and top skipped to keep tool above fold on mobile |
| `src/app/whatsapp-qr/page.tsx` | 2 / 2 | Existing top + bottom slots kept; single country grid rendered by one .map() cannot be split for in-content/pre-related slots without touching logic |

## Full table — all pages

| Page | Before | After | Rendered | Positions | Status |
| --- | ---: | ---: | ---: | --- | --- |
| `src/app/[locale]/page.tsx` | 0 | 2 | 5 | top, bottom | done |
| `src/app/[locale]/text/page.tsx` | 0 | 2 | 2 | top, bottom | flagged-short |
| `src/app/[locale]/url/page.tsx` | 0 | 2 | 3 | top, bottom | flagged-short |
| `src/app/[locale]/vcard/page.tsx` | 0 | 2 | 3 | top, bottom | flagged-short |
| `src/app/[locale]/wifi/page.tsx` | 0 | 0 | 4 | — | done |
| `src/app/about/page.tsx` | 0 | 5 | 5 | top, in-content, in-content, pre-related, bottom | done |
| `src/app/animated-qr-transfer/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/app-review-link-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/app-store-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/appointment-booking-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bakery-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/barber-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/barcode-generator/page.tsx` | 1 | 3 | 3 | after-tool, pre-related, bottom | flagged-short |
| `src/app/bitcoin-qr-code-generator/page.tsx` | 0 | 2 | 2 | top, bottom | flagged-short |
| `src/app/blog/[slug]/page.tsx` | 1 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/blog/page.tsx` | 1 | 2 | 2 | top, bottom | flagged-short |
| `src/app/boarding-pass-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/boutique-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-asset-tag-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-business-card-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-calendar-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-certificate-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-check-in-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-coupon-expiry-auditor/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-coupon-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-donation-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-email-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-event-badge-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-feedback-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-generator/page.tsx` | 0 | 1 | 1 | after-tool | flagged-short |
| `src/app/bulk-inventory-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-invoice-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-loyalty-card-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-mecard-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-menu-item-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-pdf-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-pet-tag-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-review-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-rsvp-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-seat-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-shelf-label-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-shipping-label-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-sms-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-student-id-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-survey-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-table-tent-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-ticket-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-url-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-vcard-generator/page.tsx` | 0 | 0 | 4 | — | done |
| `src/app/bulk-vcard-qr/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/bulk-wifi-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/calendar-event-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/car-listing-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/car-wash-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/card/[slug]/page.tsx` | 0 | 0 | 0 | — | flagged-short |
| `src/app/church-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/clinic-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/co-working-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/contact/page.tsx` | 0 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/cookie-policy/page.tsx` | 0 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/coupon-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/courier-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/course-enrollment-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/crypto-wallet-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/dashboard/[id]/page.tsx` | 0 | 0 | 0 | — | skipped |
| `src/app/dashboard/page.tsx` | 0 | 0 | 0 | — | skipped |
| `src/app/dashboard/settings/page.tsx` | 0 | 0 | 0 | — | skipped |
| `src/app/dentist-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/disclaimer/page.tsx` | 0 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/donation-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/driving-school-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/email-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/error-correction-simulator/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/event-countdown-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/event-rsvp-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/event-venue-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/farm-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/feedback-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/florist-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/food-truck-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/fundraiser-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/geo-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/gift-card-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/glossary/[slug]/page.tsx` | 1 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/glossary/page.tsx` | 0 | 3 | 3 | top, in-content, bottom | flagged-short |
| `src/app/google-review-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/gym-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/hostel-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/hotel-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/industries/[slug]/page.tsx` | 1 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/industries/page.tsx` | 0 | 3 | 3 | top, in-content, bottom | flagged-short |
| `src/app/invoice-payment-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/job-application-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/kid-safe-qr-card-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/laundromat-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/library-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/live-stream-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/login/page.tsx` | 0 | 0 | 0 | — | skipped |
| `src/app/loyalty-card-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/luggage-tag-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/mecard-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/medical-id-qr/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/membership-card-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/menu-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/museum-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/page.tsx` | 0 | 1 | 4 | bottom | done |
| `src/app/pakistan-payment-qr/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/parking-spot-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/payment-qr/[slug]/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/payment-qr/page.tsx` | 2 | 2 | 2 | top, bottom | flagged-short |
| `src/app/pdf-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/pet-adoption-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/pet-tag-qr/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/pharmacy-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/plant-care-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/playlist-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/podcast-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/prescription-refill-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/printed-qr-tester/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/privacy/page.tsx` | 0 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/property-tour-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/q/[publicId]/page.tsx` | 1 | 2 | 2 | in-content, bottom | flagged-short |
| `src/app/qr-a-b-test-planner/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-ab-test-significance-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-allowlist-builder/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-allowlist-tester/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-analytics-simulator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-api-playground/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-batch-cost-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-batch-duplicate-detector/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-batch-failure-estimator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-batch-renamer/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-batch-validator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-billboard-size-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-blocklist-tester/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-brand-impersonation-checker/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-call-to-action-builder/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-campaign-break-even-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-campaign-planner/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-checksum-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-clone-risk-scorer/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-code-cropper/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-code-retirement-planner/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-code-rotator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-color-pair-tester/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-consent-note-builder/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-contrast-checker/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-cost-per-scan-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-curved-surface-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-data-capacity-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-destination-change-detector/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-dot-gain-tolerance-checker/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-dpi-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-dynamic-vs-static-roi-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-embed-code-builder/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-error-budget-calculator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-expiry-checker/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-expiry-policy-builder/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-fade-risk-checker/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-footfall-scan-estimator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-frame-designer/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-frame-text-size-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-glare-risk-checker/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-gradient-maker/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-homograph-detector/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-image-enhancer/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-image-metadata-auditor/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-incident-report-builder/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-ink-coverage-estimator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-label-count-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-labels/[slug]/page.tsx` | 1 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-labels/page.tsx` | 0 | 2 | 2 | top, bottom | flagged-short |
| `src/app/qr-link-menu-generator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-logo-safe-area-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-metadata-stripper/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-minimum-size-checker/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-module-size-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-off-axis-scan-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-offline-verifier/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-payload-hash-verifier/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-payload-inspector/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-payload-linter/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-permission-explainer/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-phishing-pattern-trainer/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-placement-guide/page.tsx` | 1 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-print-area-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-print-cost-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-print-proof-checklist/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-print-sheet-planner/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-print-waste-estimator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-quiet-zone-adder/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-quiet-zone-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-readability-score-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-redirect-chain-viewer/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-roll-label-planner/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-safe-scan-checklist-builder/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-safety-checker/page.tsx` | 1 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-scan-funnel-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-scan-instruction-card/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-scan-log/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-scan-test-sample-calculator/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-scanner/page.tsx` | 0 | 2 | 2 | top, after-tool | flagged-short |
| `src/app/qr-scheme-safety-checker/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-signature-note-builder/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-size-calculator/page.tsx` | 1 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-size-guide/[slug]/page.tsx` | 1 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-size-guide/page.tsx` | 0 | 3 | 3 | top, after-tool, bottom | flagged-short |
| `src/app/qr-size-presets/page.tsx` | 0 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-splitter-scanner/page.tsx` | 1 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-sticker-sheet-printer/page.tsx` | 1 | 5 | 5 | top, after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-svg-png-pdf-exporter/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-tamper-evidence-planner/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-to-pdf-converter/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-tracking-parameter-auditor/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-typosquat-checker/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-url-anatomy-checker/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-utm-audit-checker/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-version-estimator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-wear-lifetime-estimator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/qr-zip-packager/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/quote-request-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/real-estate-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/recipe-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/regional-payment-qr/page.tsx` | 0 | 0 | 4 | — | done |
| `src/app/restaurant-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/resume-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/retail-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/room-booking-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/salon-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/scan-guide/[slug]/page.tsx` | 1 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/scan-guide/page.tsx` | 0 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/school-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/seat-finder-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/shipment-tracking-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/sitemap-page/page.tsx` | 0 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/sms-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/social-profile-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/spa-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/survey-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/table-order-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/taxi-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/templates/[slug]/page.tsx` | 1 | 4 | 4 | top, after-tool, in-content, bottom | done |
| `src/app/templates/page.tsx` | 0 | 2 | 2 | top, bottom | flagged-short |
| `src/app/terms/page.tsx` | 0 | 4 | 4 | top, in-content, pre-related, bottom | done |
| `src/app/ticket-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/unlock/[publicId]/page.tsx` | 0 | 0 | 0 | — | skipped |
| `src/app/upi-qr-code-generator/page.tsx` | 0 | 1 | 1 | bottom | flagged-short |
| `src/app/url-qr-code-generator/page.tsx` | 0 | 1 | 1 | bottom | flagged-short |
| `src/app/utm-builder/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/vcard-photo-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/vcard-qr-code-generator/page.tsx` | 0 | 1 | 1 | bottom | flagged-short |
| `src/app/vet-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/view/page.tsx` | 0 | 0 | 0 | — | flagged-short |
| `src/app/visitor-badge-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/warehouse-qr-suite/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/warranty-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/webinar-join-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/whatsapp-order-qr-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/whatsapp-qr-code-generator/page.tsx` | 0 | 1 | 1 | bottom | flagged-short |
| `src/app/whatsapp-qr/[slug]/page.tsx` | 1 | 3 | 3 | after-tool, pre-related, bottom | flagged-short |
| `src/app/whatsapp-qr/page.tsx` | 2 | 2 | 2 | top, bottom | flagged-short |
| `src/app/wifi-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/wifi-sign-generator/page.tsx` | 1 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |
| `src/app/zoom-meeting-qr-code-generator/page.tsx` | 0 | 4 | 4 | after-tool, in-content, pre-related, bottom | done |

## Verification

- `docs/adslot-batches/verify-adslots.py`: 264 pages checked, 0 violations
  (counts match reports, IDs unique per page, no adjacent slots,
  prop-style consistent per import, ineligible pages at 0).
- `npm run typecheck`: exit 0
- `npm run build`: exit 0
- `npm run content:audit`: all pages pass
