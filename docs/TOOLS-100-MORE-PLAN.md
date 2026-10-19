# TOOLS — 100 More: Build Manifest

Status: **PLAN ONLY — no routes built, no shared files edited.**
Branch: `growth/100-more-tools` (branched from `growth/100-features-1000-articles` @ `eecd1fa`).
Deliverable: this file, left **uncommitted**. Do NOT push, merge, or commit from this plan alone.
Wiring (sitemap, homepage, registry) is a **separate later step** — see §3. Builders touch ONLY
their own `src/app/<slug>/page.tsx` files.

Counts verified by script (see §5): **145 existing** top-level routes, **100 new** tools, zero overlap.

---

## 1. Existing top-level routes (145)

Method (run 2026-10-19, do NOT use `git ls-files 'src/app/*/page.tsx'` alone — it also
matches nested dynamic routes such as `blog/[slug]`):

```sh
for d in src/app/*/; do [ -f "$d/page.tsx" ] && echo "${d#src/app/}" | tr -d '/'; done | sort
```

Result: **145** directories directly under `src/app/` containing a `page.tsx`.
`[locale]` is a dynamic segment, not a tool — it renders the localized home page.
Every slug below is a directory name; the route is `/<slug>` (root `/` itself is
`src/app/page.tsx`, not a directory, and is not counted).

```
[locale]
about
animated-qr-transfer
app-store-qr-code-generator
barcode-generator
bitcoin-qr-code-generator
blog
bulk-asset-tag-qr-generator
bulk-business-card-qr-generator
bulk-coupon-qr-generator
bulk-donation-qr-generator
bulk-email-qr-generator
bulk-event-badge-qr-generator
bulk-feedback-qr-generator
bulk-generator
bulk-inventory-qr-generator
bulk-pdf-qr-generator
bulk-sms-qr-generator
bulk-student-id-qr-generator
bulk-table-tent-qr-generator
bulk-ticket-qr-generator
bulk-url-qr-generator
bulk-vcard-generator
bulk-vcard-qr
bulk-wifi-qr-generator
calendar-event-qr-code-generator
church-qr-suite
clinic-qr-suite
contact
cookie-policy
coupon-qr-code-generator
crypto-wallet-qr-code-generator
dashboard
disclaimer
donation-qr-code-generator
email-qr-code-generator
error-correction-simulator
event-rsvp-qr-code-generator
farm-qr-suite
feedback-qr-code-generator
glossary
gym-qr-suite
hotel-qr-suite
industries
library-qr-suite
login
loyalty-card-qr-code-generator
mecard-qr-code-generator
medical-id-qr
menu-qr-code-generator
museum-qr-suite
pakistan-payment-qr
payment-qr
pdf-qr-code-generator
pet-tag-qr
pharmacy-qr-suite
playlist-qr-code-generator
podcast-qr-code-generator
printed-qr-tester
privacy
qr-a-b-test-planner
qr-allowlist-builder
qr-analytics-simulator
qr-api-playground
qr-batch-cost-calculator
qr-batch-renamer
qr-batch-validator
qr-billboard-size-calculator
qr-call-to-action-builder
qr-campaign-planner
qr-checksum-generator
qr-code-cropper
qr-code-rotator
qr-color-pair-tester
qr-consent-note-builder
qr-contrast-checker
qr-curved-surface-calculator
qr-data-capacity-calculator
qr-dpi-calculator
qr-embed-code-builder
qr-error-budget-calculator
qr-expiry-checker
qr-fade-risk-checker
qr-frame-designer
qr-gradient-maker
qr-image-enhancer
qr-ink-coverage-estimator
qr-label-count-calculator
qr-labels
qr-logo-safe-area-calculator
qr-metadata-stripper
qr-minimum-size-checker
qr-module-size-calculator
qr-offline-verifier
qr-payload-inspector
qr-phishing-pattern-trainer
qr-placement-guide
qr-print-cost-calculator
qr-print-proof-checklist
qr-print-sheet-planner
qr-quiet-zone-adder
qr-quiet-zone-calculator
qr-redirect-chain-viewer
qr-safety-checker
qr-scan-instruction-card
qr-scan-log
qr-scanner
qr-signature-note-builder
qr-size-calculator
qr-size-guide
qr-size-presets
qr-splitter-scanner
qr-sticker-sheet-printer
qr-svg-png-pdf-exporter
qr-tamper-evidence-planner
qr-to-pdf-converter
qr-typosquat-checker
qr-zip-packager
real-estate-qr-suite
regional-payment-qr
restaurant-qr-suite
resume-qr-code-generator
retail-qr-suite
salon-qr-suite
scan-guide
school-qr-suite
sitemap-page
sms-qr-code-generator
social-profile-qr-code-generator
survey-qr-code-generator
taxi-qr-suite
templates
terms
ticket-qr-code-generator
upi-qr-code-generator
url-qr-code-generator
utm-builder
vcard-qr-code-generator
view
warehouse-qr-suite
whatsapp-qr
whatsapp-qr-code-generator
wifi-qr-code-generator
wifi-sign-generator
zoom-meeting-qr-code-generator
```

Notes:

- 133 of the 145 appear as literal paths in `src/app/sitemap.ts`. The 12 that do not:
  `[locale]` (dynamic segment), `dashboard`, `login`, `view` (app pages — the wiring step
  must confirm each is intentionally excluded, e.g. noindex, rather than adding it),
  `glossary`, `industries`, `qr-labels`, `qr-size-guide`, `scan-guide`, `templates`,
  `payment-qr`, `whatsapp-qr` (hub / parent segments whose children are covered by
  programmatic sitemap entries — `familyEntries()`, `labelEntries`, `countryEntries`,
  `paymentEntries` — and whose hub pages the `FUTURE SECTIONS` comment in `sitemap.ts`
  says are intentionally not added until they pass the quality gate).
- The previous 100 tools are already inside the 145. Do not re-propose any slug above.

---

## 2. Tool-page pattern (from reading 3 pages in full + repo-wide greps)

Read in full: `src/app/qr-contrast-checker/page.tsx`,
`src/app/email-qr-code-generator/page.tsx`, `src/app/qr-size-calculator/page.tsx`.
Also inspected: `src/app/clinic-qr-suite/page.tsx` (suite shape),
`src/app/qr-scanner/page.tsx` + `ScannerClient.tsx`, `src/app/bitcoin-qr-code-generator/page.tsx`,
`src/app/vcard-qr-code-generator/page.tsx`, `src/app/donation-qr-code-generator/page.tsx`,
`src/app/podcast-qr-code-generator/page.tsx`, `src/app/loyalty-card-qr-code-generator/page.tsx`,
`src/app/menu-qr-code-generator/page.tsx`, `src/components/home/HomePage.tsx`.

### 2.1 Structure every new tool page follows

1. `'use client';` first line (all three sampled pages; suites too).
2. Imports: `Breadcrumbs` from `@/components/Breadcrumbs`, `Card` / `Button` / `Input` /
   `Label` / `Slider` from `@/components/ui/*`, a `lucide-react` icon, and `QRCodeLib`
   from `qrcode` for generators (88/145 top-level pages import the `qrcode` lib).
3. Layout shell: `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">`
   → `Breadcrumbs` (`[{ label: 'Tools', href: '/#tools' }, { label: '<Tool>', href: '/<slug>' }]`).
4. Header: pill badge (icon + category label, e.g. "Scan-Safety Tool"), `h1`
   (3xl–4xl, extrabold), one-paragraph description.
5. Interactive core: two-column grid `grid grid-cols-1 lg:grid-cols-12 gap-8 items-start` —
   controls in `lg:col-span-7`, sticky result card in `lg:col-span-5 lg:sticky lg:top-20`.
   Results recompute live from state (`useState` + `useMemo`); generators regenerate the
   QR in a `useEffect` via `QRCodeLib.toDataURL(payload, { width: 512, margin: 2,
errorCorrectionLevel: 'M' })`.
6. Generator extras (follow `email-qr-code-generator`): an "Encoded payload" card showing
   the exact payload string, Copy-payload button, Download PNG + Download SVG buttons
   (SVG via `QRCodeLib.toString(payload, { type: 'svg', ... })` → Blob → object URL),
   and a QR preview-size slider (140–320px).
7. Editorial `<article>` below the tool (prose, several H3 sections, practical guidance).
8. FAQ section: `<section>` with heading "Frequently Asked Questions", cards in
   `grid gap-4 sm:grid-cols-2`, driven by a local `faqs` array (117/145 pages have one).
9. JSON-LD: two `<script type="application/ld+json">` blocks built with
   `dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }}` — a `SoftwareApplication`
   block (`name`, `applicationCategory`, `operatingSystem: 'All'`, free `Offer`) and a
   `FAQPage` block derived from the same `faqs` array (107/145 pages have JSON-LD).
10. Validation: inline error text with `role="alert"`; never generate a QR from invalid
    input (empty payload → placeholder box, not a broken image).

### 2.2 Metadata — two accepted patterns

- **Pattern A (dominant in the growth batches):** client-only page, NO exported metadata
  (a `'use client'` file cannot export `metadata`). SEO comes from the in-page JSON-LD
  in §2.1 step 9. All three sampled pages use this pattern.
- **Pattern B:** server-component wrapper that exports `metadata` (title, description,
  `alternates.canonical`) and renders a separate client component
  (e.g. `qr-scanner` → `ScannerClient`, `bitcoin-qr-code-generator` → shared
  `LandingGenerator`).
- Only 26/145 top-level pages export `metadata`. Either pattern is acceptable; do NOT
  try to export `metadata` from a `'use client'` file — Next.js forbids it.

### 2.3 Suite pattern (for the 15 industry suites in §4.5)

Follow `clinic-qr-suite`: `'use client'`, a `PRESETS` array of
`{ id, name, hint, fields: [{ key, label }], template }`, a preset picker, one form per
preset, QR via `QRCodeLib`, plus FAQ + JSON-LD. Each new suite's presets MUST be
industry-specific (listed per suite in §4.5) — no re-skinned clinic presets.

### 2.4 Bulk pattern (for the 15 bulk tools in §4.4)

CSV / pasted-rows input → one QR per row → per-row PNG/SVG download (+ ZIP where the
pattern supports it). Per-row errors must be reported per row without blocking valid
rows. Mirror the nearest existing bulk tool (`bulk-url-qr-generator`,
`bulk-coupon-qr-generator`, …) for layout and download behaviour.

### 2.5 Standing rules (from the repo's growth program)

- No stubs, no TODOs, no placeholders. Every tool genuinely works client-side.
- No ranking guarantees or invented data. Do not invent measured values (scores,
  counts, ratings) — compute everything from user input.
- `qrcode` `toDataURL` / `toString` for QR output; `jsQR` is available for decoding
  (used by `qr-scanner` via `ScannerClient.tsx`) if a tool needs to read a QR image.
- Keep the quiet zone, keep contrast high, keep payloads short — say so in each FAQ.

---

## 3. Registration / wiring — NOTE ONLY, do NOT edit these files in the build step

A later wiring step (coordinator-owned) does all shared-file edits. Builders must NOT
touch `src/app/sitemap.ts`, `src/components/home/HomePage.tsx`,
`src/app/sitemap-page/page.tsx`, or `src/data/page-registry.ts`.

### 3.1 `src/app/sitemap.ts` — the exact pattern (verified)

- Helper: `entry(path, opts?)` returns `{ url: \`${BASE}${path}\`, lastModified,
  changeFrequency, priority }`, with `BASE = siteConfig.url`.
- Two manual lists, then mapped to entries:
  - `toolPaths` — **99** entries → `toolPaths.map((p) => entry(p, { changeFrequency:
weekly, priority: 0.9 }))`. Holds calculators, checkers, validators, bulk tools,
    and suites. Examples: `'/qr-contrast-checker'`, `'/bulk-url-qr-generator'`,
    `'/restaurant-qr-suite'`.
  - `generatorPaths` — **26** entries → `generatorPaths.map((p) => entry(p, {
changeFrequency: monthly, priority: 0.85 }))`. Holds single-purpose QR generators.
    Examples: `'/email-qr-code-generator'`, `'/url-qr-code-generator'`.
  - Together 125 tool/generator entries. Previous growth added 80 to `toolPaths` and 20
    to `generatorPaths`.
- Other sections are programmatic or trust pages (labels, WhatsApp countries, payment
  schemes, audited blog articles, trust/legal) — do not touch.
- **Wiring instruction for the 100 new tools:** add the 33 generators of §4.1 to
  `generatorPaths` and the other 67 tools (§4.2–§4.5) to `toolPaths`, keeping each list
  alphabetically tidy and the existing `entry(...)` mapping unchanged. Bulk tools go in
  `toolPaths` (precedent: all existing `bulk-*` are there), even though they generate QRs.

### 3.2 Homepage — do NOT expand the featured grid

- `src/app/page.tsx` is only metadata + `<HomePageContent />` from
  `@/components/home/HomePage.tsx`.
- The homepage tool grid is `FEATURED_TOOL_META` (15 entries) in `HomePage.tsx`,
  index-coupled to i18n copy `home.tools.cards` across 14 locale files. Per
  `docs/GROWTH-PLAN.md`, the previous growth **intentionally did NOT expand** this grid
  (index-coupled across locales; expanding it risks misaligned cards). New tools are
  reachable via sitemap, `/sitemap-page`, article links, and breadcrumbs.
- **Wiring instruction:** leave `FEATURED_TOOL_META` and the i18n tool cards untouched.

### 3.3 `/sitemap-page` — stale, wiring step decides

- `src/app/sitemap-page/page.tsx` is a hand-maintained link directory. Its copy still
  says "29 free QR tools" and it lists only 21 tool links — it was NOT updated for the
  previous 100 tools. **Wiring instruction:** decide whether to extend it with the 100 new
  tools (and fix the "29" copy) or leave it as a curated subset; do not let builders
  hand-edit it piecemeal.

### 3.4 `src/data/page-registry.ts` — do NOT extend

- Per `docs/GROWTH-PLAN.md`, the registry was NOT extended for the previous 100 tools:
  its schema carries measured fields (`qualityScore`, `wordCount`, `inboundLinks`) that
  would have to be invented for new routes, and inventing those values would be
  fabricated data. Sitemap + index wiring already covers reachability. Leave it alone
  unless real measured values exist.

---

## 4. The 100 new tools

Format per tool: route slug (→ `src/app/<slug>/page.tsx`), one-line spec (what it does +
who it is for), and a **Working means** acceptance line — the concrete output/interaction
that proves it works. **Differs from** notes appear only where a near-neighbour exists,
to record the deliberate differentiation.

### 4.1 Generators (33) → `generatorPaths` in wiring

### G1. `qr-link-menu-generator`

- **Spec:** One QR opening a multi-link menu (link-in-bio) page with a title + links, for creators and small shops.
- **Working means:** Entering links updates a live menu preview and the QR (via `qrcode` `toDataURL`) encodes the menu link; PNG download works.
- **Differs from:** `social-profile-qr-code-generator` is one profile link; this is many links on one page.

### G2. `app-review-link-qr-generator`

- **Spec:** QR that opens an app's store review sheet directly, for iOS/Android app owners.
- **Working means:** Entering an app ID + platform builds the correct review URL and the QR encodes it; the payload is shown verbatim.

### G3. `vcard-photo-qr-generator`

- **Spec:** vCard QR with an embedded headshot photo + printable contact card, for people who hand out cards.
- **Working means:** Uploading a photo + contact fields generates a QR whose decoded vCard contains a `PHOTO` entry, and a card preview shows the photo.
- **Differs from:** the existing vCard generator has no photo field (verified — no photo/image handling in its source).

### G4. `event-countdown-qr-generator`

- **Spec:** QR to a live countdown page for an event, for hosts and marketers.
- **Working means:** The countdown ticks down to the entered date/time and the QR encodes the countdown page link.

### G5. `gift-card-qr-generator`

- **Spec:** Gift-card QR with code, amount, and expiry, for small shops.
- **Working means:** Entering code/amount/expiry renders a gift-card preview and a QR encoding the gift-card payload.

### G6. `membership-card-qr-generator`

- **Spec:** Membership-card QR with member number, tier, and expiry, for clubs and gyms.
- **Working means:** The card preview shows tier + expiry and the QR encodes the membership payload.
- **Differs from:** `loyalty-card-qr-code-generator` is stamps-based; this is identity + tier + expiry, no stamps.

### G7. `parking-spot-qr-generator`

- **Spec:** QR for one parking spot (pay / extend / report), for car-park operators.
- **Working means:** Spot ID + action URL produce a QR plus a spot-label preview showing the spot number.

### G8. `table-order-qr-generator`

- **Spec:** QR on a restaurant table that opens ordering/checkout for that table, for restaurants.
- **Working means:** Table number + order URL produce a QR encoding the order URL with the table parameter; the preview shows the table number.
- **Differs from:** `menu-qr-code-generator` shows the menu; this opens ordering for a specific table.

### G9. `room-booking-qr-generator`

- **Spec:** QR on a room door to check availability / book it, for offices and hotels.
- **Working means:** Room name + booking URL produce a QR plus a room-label preview.

### G10. `shipment-tracking-qr-generator`

- **Spec:** QR with tracking number + carrier tracking link, for sellers and shippers.
- **Working means:** Tracking number + carrier produce a QR plus a tracking summary card.

### G11. `invoice-payment-qr-generator`

- **Spec:** QR printed on an invoice to pay that invoice, for freelancers and small businesses.
- **Working means:** Invoice number + amount + pay link produce a QR plus an invoice summary; the payload shows the invoice reference.

### G12. `fundraiser-qr-generator`

- **Spec:** QR to a fundraiser campaign page with goal, raised amount, and deadline, for charities and creators.
- **Working means:** Goal / raised / deadline render a progress bar and the QR encodes the campaign link.
- **Differs from:** `donation-qr-code-generator` takes suggested amounts; this is a goal-progress campaign page.

### G13. `course-enrollment-qr-generator`

- **Spec:** QR for course enrollment with a course code, for educators.
- **Working means:** Course URL + code produce a QR plus a course card showing the code.

### G14. `webinar-join-qr-generator`

- **Spec:** Platform-agnostic webinar join QR, for webinar hosts.
- **Working means:** Join URL + start time produce a QR plus a join card showing the start time.
- **Differs from:** `zoom-meeting-qr-code-generator` is Zoom-specific; this accepts any join link.

### G15. `pet-adoption-qr-generator`

- **Spec:** QR for a pet adoption profile, for shelters and rescues.
- **Working means:** Pet name / breed / shelter link produce a QR plus an adoption profile card.
- **Differs from:** `pet-tag-qr` is lost-and-found; this is adoption.

### G16. `job-application-qr-generator`

- **Spec:** QR on a job posting that opens the application form, for recruiters.
- **Working means:** Application URL + job title produce a QR plus a job card.

### G17. `car-listing-qr-generator`

- **Spec:** QR for a car listing (VIN, price, specs), for dealers.
- **Working means:** Listing URL + VIN / price produce a QR plus a listing card.

### G18. `property-tour-qr-generator`

- **Spec:** QR for a virtual property tour, for estate agents.
- **Working means:** Tour URL + property summary produce a QR plus a tour card.
- **Differs from:** `real-estate-qr-suite` is a multi-preset hub; this is a single-purpose tour generator.

### G19. `prescription-refill-qr-generator`

- **Spec:** QR to refill a prescription, for pharmacies and patients.
- **Working means:** Pharmacy + Rx number + refill link produce a QR plus a refill card.
- **Differs from:** `pharmacy-qr-suite` is a multi-preset hub; this is a single refill tool.

### G20. `geo-qr-code-generator`

- **Spec:** `geo:` URI map-pin QR for any place, for print and signage.
- **Working means:** Latitude / longitude produce a scannable QR via `qrcode` `toDataURL` from a `geo:` payload; coordinates are shown.
- **Differs from:** `qr-payload-inspector` only detects `geo:` payloads; nothing generates them.

### G21. `whatsapp-order-qr-generator`

- **Spec:** WhatsApp pre-filled order-message QR, for small sellers.
- **Working means:** Product + quantity produce a QR encoding a `wa.me` link with the order message pre-filled.
- **Differs from:** `whatsapp-qr-code-generator` is a generic message link; this builds an order message.

### G22. `live-stream-qr-generator`

- **Spec:** QR to a scheduled live stream, for creators.
- **Working means:** Stream URL + start time produce a QR plus a live card showing the scheduled time.
- **Differs from:** `playlist-qr-code-generator` is recorded playlists; `social-profile-qr-code-generator` is a profile link.

### G23. `google-review-qr-generator`

- **Spec:** QR to a business's Google review form, for local businesses.
- **Working means:** Review link / Place ID produce a QR plus a review-prompt card.

### G24. `boarding-pass-qr-generator`

- **Spec:** QR linking to airline check-in with a booking reference, for travellers and airlines.
- **Working means:** Check-in URL + booking reference produce a QR plus a check-in card.

### G25. `luggage-tag-qr-generator`

- **Spec:** Luggage-tag QR with owner + itinerary, for travellers.
- **Working means:** Owner + flight produce a QR plus a printable tag preview.

### G26. `plant-care-qr-generator`

- **Spec:** QR on a plant tag that opens care instructions, for nurseries.
- **Working means:** Plant name + light / water produce a QR plus a care card.

### G27. `recipe-qr-generator`

- **Spec:** QR on a recipe card that opens the full recipe / video, for food creators.
- **Working means:** Recipe URL + title produce a QR plus a recipe summary card.

### G28. `warranty-qr-generator`

- **Spec:** QR for product warranty registration, for brands.
- **Working means:** Registration URL + product / serial produce a QR plus a warranty card.

### G29. `visitor-badge-qr-generator`

- **Spec:** Single visitor-badge QR with host + expiry, for offices.
- **Working means:** Visitor + host + expiry produce a QR plus a badge preview.
- **Differs from:** `bulk-event-badge-qr-generator` is bulk event badges; this is one visitor badge.

### G30. `seat-finder-qr-generator`

- **Spec:** Seat-specific QR (venue / section / row / seat → seat map), for venues.
- **Working means:** Seat fields produce a QR encoding the seat locator plus a seat-label preview.

### G31. `appointment-booking-qr-generator`

- **Spec:** QR that opens a booking page for a service provider, for clinics, salons, and pros.
- **Working means:** Booking URL + service / provider produce a QR plus a booking card.
- **Differs from:** `calendar-event-qr-code-generator` creates a calendar entry; this opens a booking page.

### G32. `quote-request-qr-generator`

- **Spec:** QR that opens a request-a-quote form, for trades and services.
- **Working means:** Quote-form URL + service / reference produce a QR plus a quote card.

### G33. `kid-safe-qr-card-generator`

- **Spec:** QR + printable "ask a grown-up first" card, for classrooms and parents.
- **Working means:** Destination + child-facing label produce a QR plus a printable permission card.

### 4.2 Calculators / checkers (20) → `toolPaths` in wiring

### C1. `qr-batch-failure-estimator`

- **Spec:** Estimate a print batch's failure rate from sample scan results, for print buyers.
- **Working means:** Entering sample size + failures recomputes the estimated failure % with a binomial confidence interval on every input change.
- **Differs from:** `qr-batch-validator` validates payload formats; this is sampling statistics on scan outcomes.

### C2. `qr-cost-per-scan-calculator`

- **Spec:** Campaign cost per scan, for marketers.
- **Working means:** Entering spend + scans recomputes cost per scan on every input change.

### C3. `qr-dynamic-vs-static-roi-calculator`

- **Spec:** Dynamic vs static QR ROI comparison, for marketers choosing between them.
- **Working means:** Entering costs + expected scans recomputes both ROI figures and the winner on every input change.

### C4. `qr-frame-text-size-calculator`

- **Spec:** Minimum legible call-to-action / frame text size by viewing distance, for designers.
- **Working means:** Entering distance + viewing conditions recomputes the minimum font size (pt / mm) on every input change.

### C5. `qr-roll-label-planner`

- **Spec:** Roll-label planning (labels per roll, rolls needed) from roll length, gap, label height, and core, for label buyers.
- **Working means:** Entering roll specs recomputes labels per roll + rolls needed on every input change.
- **Differs from:** `qr-print-sheet-planner` is flat sheets; this is continuous rolls.

### C6. `qr-off-axis-scan-calculator`

- **Spec:** Effective code width at an oblique viewing angle + size uplift, for signage designers.
- **Working means:** Changing the viewing angle recomputes effective width (cosine) + recommended size on every change.
- **Differs from:** `qr-size-calculator` is head-on distance; `qr-curved-surface-calculator` is cylinder curvature; this is oblique viewing angle.

### C7. `qr-glare-risk-checker`

- **Spec:** Glare risk from surface finish + light position, for print buyers.
- **Working means:** Selecting finish + lighting updates a glare-risk verdict + mitigation on every selection change.
- **Differs from:** `qr-fade-risk-checker` is UV fading over time; this is reflection/glare at scan time.

### C8. `qr-wear-lifetime-estimator`

- **Spec:** Replacement interval for a printed code by material + environment + lamination, for facilities teams.
- **Working means:** Selecting material / environment / lamination recomputes the estimated lifetime + next-replacement date on every change.

### C9. `qr-print-waste-estimator`

- **Spec:** Expected misprints / waste + true cost for a print run, for print buyers.
- **Working means:** Entering run size + printer type + misprint rate recomputes waste count + total cost on every change.
- **Differs from:** `qr-batch-cost-calculator` / `qr-print-cost-calculator` price the good codes; this prices the waste.

### C10. `qr-campaign-break-even-calculator`

- **Spec:** Scans needed to break even on a QR campaign, for marketers.
- **Working means:** Entering campaign cost + value per scan recomputes break-even scans on every change.

### C11. `qr-dot-gain-tolerance-checker`

- **Spec:** Whether a module size survives printer dot gain / misregistration, for print production.
- **Working means:** Entering module size + dot gain recomputes pass/fail + minimum safe module on every change.

### C12. `qr-footfall-scan-estimator`

- **Spec:** Expected scans from foot traffic + placement quality, for venues and retailers.
- **Working means:** Entering footfall + placement factors recomputes an expected-scans range on every change.

### C13. `qr-scan-funnel-calculator`

- **Spec:** Scan → landing → conversion funnel with stage drop-offs, for marketers.
- **Working means:** Entering stage conversion rates recomputes stage counts + overall conversion % on every change.
- **Differs from:** `qr-analytics-simulator` simulates analytics data; this calculates a funnel from rates.

### C14. `qr-ab-test-significance-calculator`

- **Spec:** Statistical significance (chi-square) for A/B scan results, for marketers.
- **Working means:** Entering scans + conversions per variant recomputes the p-value + significant/not verdict on every change.
- **Differs from:** `qr-a-b-test-planner` plans a test; this evaluates its results.

### C15. `qr-scan-test-sample-calculator`

- **Spec:** Sample size needed for scan tests / A/B tests, for QA and marketers.
- **Working means:** Entering confidence + margin + baseline rate recomputes the required sample size on every change.

### C16. `qr-utm-audit-checker`

- **Spec:** Paste a URL, audit its UTM parameters, for marketers.
- **Working means:** Editing the URL flags missing / malformed UTM parameters + an overall verdict on every edit.
- **Differs from:** `utm-builder` builds UTM links; this audits an existing URL.

### C17. `qr-version-estimator`

- **Spec:** QR version needed for a payload + error-correction level, for developers and designers.
- **Working means:** Editing the payload or EC level recomputes the version + module count on every change.
- **Differs from:** `qr-data-capacity-calculator` gives max characters; this gives the version a given payload needs.

### C18. `qr-print-area-calculator`

- **Spec:** Usable print area after margins / bleed, for designers.
- **Working means:** Entering stock size + margins / bleed recomputes the usable area on every change.

### C19. `qr-readability-score-calculator`

- **Spec:** Composite 0–100 readability score from size + contrast + density + lighting, for designers.
- **Working means:** Changing any factor recomputes the score + grade on every change. (Composite score — it does not replace the single-factor checkers.)

### C20. `qr-code-retirement-planner`

- **Spec:** When to retire / replace codes (expiry + campaign end + link health), for campaign owners.
- **Working means:** Entering expiry + campaign end + review cadence recomputes a retirement date + reason on every change.
- **Differs from:** `qr-expiry-checker` checks one code's expiry; this plans retirement across reasons.

### 4.3 Validators / security (17) → `toolPaths` in wiring

### V1. `qr-homograph-detector`

- **Spec:** Detect Unicode confusable (homograph) characters in a domain, for security reviewers.
- **Working means:** Editing a domain flags confusable characters + shows the ASCII lookalike on every edit.
- **Differs from:** `qr-typosquat-checker` generates typo permutations of a known-good domain; this checks one domain for Unicode spoofing.

### V2. `qr-payload-linter`

- **Spec:** Lint a QR payload's syntax for known schemes (`mailto:`, `WIFI:`, `VCARD`, `geo:`, …), for developers.
- **Working means:** Editing the payload lists errors / warnings per line on every edit.
- **Differs from:** `qr-payload-inspector` decodes and displays a payload; this validates it.

### V3. `qr-allowlist-tester`

- **Spec:** Test a URL against a user-supplied allowlist with wildcard matching, for security teams.
- **Working means:** Editing the URL or the list recomputes an allow/deny verdict on every edit.
- **Differs from:** `qr-allowlist-builder` creates a policy; this tests a URL against one.

### V4. `qr-blocklist-tester`

- **Spec:** Test a URL against a user-supplied blocklist with wildcard matching, for security teams.
- **Working means:** Editing the URL or the list recomputes a block/allow verdict on every edit.

### V5. `qr-scheme-safety-checker`

- **Spec:** Classify a QR destination's URL scheme and flag dangerous schemes, for security reviewers.
- **Working means:** Editing the URL shows the scheme classification (`https`, `http`, `javascript:`, `data:`, `intent:`, …) + a risk verdict on every edit.
- **Differs from:** `qr-safety-checker` gives a general safety verdict; this is scheme-specific.

### V6. `qr-expiry-policy-builder`

- **Spec:** Build an expiry / retention policy + reminder schedule for a QR campaign, for campaign owners.
- **Working means:** Entering campaign dates + review cadence generates policy text + reminder dates.
- **Differs from:** `qr-expiry-checker` checks one code's expiry; this writes the policy.

### V7. `qr-clone-risk-scorer`

- **Spec:** Score how easily a printed code could be cloned / overlaid, for security reviewers.
- **Working means:** Selecting placement / lamination / exposure recomputes a risk score + mitigations on every change.
- **Differs from:** `qr-tamper-evidence-planner` plans tamper evidence; this scores clone risk.

### V8. `qr-permission-explainer`

- **Spec:** Explain what a scan requests (camera, location, …) per OS / app, for end users.
- **Working means:** Selecting an OS + scan context shows the permission list + what each permission is for.

### V9. `qr-image-metadata-auditor`

- **Spec:** Audit EXIF / metadata in an uploaded QR image file, for privacy reviewers.
- **Working means:** Uploading an image lists the metadata fields found + privacy warnings for that file.
- **Differs from:** `qr-metadata-stripper` removes metadata; this reports it.

### V10. `qr-url-anatomy-checker`

- **Spec:** Parse a destination URL into its parts (subdomain depth, TLD, parameters, punycode, IP host) with risk flags, for security reviewers.
- **Working means:** Editing the URL parses it + flags risky parts on every edit.
- **Differs from:** `qr-safety-checker` gives a verdict; this shows the anatomy.

### V11. `qr-payload-hash-verifier`

- **Spec:** Verify a QR payload against an expected hash, for operators proving a code is unchanged.
- **Working means:** Entering a payload + expected hash recomputes the hash + a match/mismatch verdict on every edit.
- **Differs from:** `qr-checksum-generator` generates a checksum; this verifies one.

### V12. `qr-batch-duplicate-detector`

- **Spec:** Paste a list of payloads / URLs, find exact + near-duplicates, for campaign owners.
- **Working means:** Editing the list updates duplicate groups on every edit.
- **Differs from:** `qr-batch-validator` validates formats; this finds duplicates.

### V13. `qr-tracking-parameter-auditor`

- **Spec:** Audit tracking / PII parameters in a destination URL, for privacy reviewers.
- **Working means:** Editing the URL lists tracking parameters found + a privacy-risk note on every edit.

### V14. `qr-safe-scan-checklist-builder`

- **Spec:** Personalized pre-scan checklist by context (street poster vs email vs package), for end users.
- **Working means:** Selecting a context regenerates the checklist for that context.
- **Differs from:** `qr-print-proof-checklist` is for printing; this is for scanning safely.

### V15. `qr-incident-report-builder`

- **Spec:** Build a malicious-QR incident report (payload, location, timeline), for security teams.
- **Working means:** Entering the details generates a filled report, copyable / downloadable.

### V16. `qr-brand-impersonation-checker`

- **Spec:** Check whether a suspect domain impersonates a brand, for brand-protection reviewers.
- **Working means:** Entering a brand name + suspect domain scores impersonation + lists the tricks found (prefix / suffix / TLD).
- **Differs from:** `qr-typosquat-checker` permutes a known-good domain; this compares a suspect domain against a brand name across prefix / suffix / TLD tricks.

### V17. `qr-destination-change-detector`

- **Spec:** Detect when a dynamic QR's destination has changed vs a saved baseline, for campaign owners.
- **Working means:** Pasting a current destination compares it against the baseline saved in `localStorage` and flags changes; saving a baseline works.
- **Differs from:** `qr-redirect-chain-viewer` shows one redirect chain now; this detects change over time (hijack detection).

### 4.4 Bulk tools (15) → `toolPaths` in wiring

All bulk tools follow §2.4: CSV / pasted-rows input → one QR per row → per-row PNG/SVG
download. **Working means (all 15):** pasting an N-row CSV yields N codes, each
downloadable; per-row errors are reported per row without blocking valid rows.

### B1. `bulk-calendar-qr-generator`

- **Spec:** Bulk calendar-event (VEVENT) QRs from CSV, for event organisers.
- **Differs from:** `calendar-event-qr-code-generator` is one event; this is many.
- **Working means:** Pasting an N-row CSV yields N VEVENT codes, each downloadable; per-row errors are reported per row.

### B2. `bulk-mecard-generator`

- **Spec:** Bulk MeCard QRs from CSV, for teams that need compact contact codes.
- **Differs from:** `bulk-vcard-generator` is vCard; MeCard is a distinct, more compact contact format.
- **Working means:** Pasting an N-row CSV yields N MeCard codes, each downloadable; per-row errors are reported per row.

### B3. `bulk-survey-qr-generator`

- **Spec:** Bulk survey QRs (one per survey / cohort) from CSV, for researchers.
- **Differs from:** `survey-qr-code-generator` is one survey; this is many.
- **Working means:** Pasting an N-row CSV yields N survey codes, each downloadable; per-row errors are reported per row.

### B4. `bulk-menu-item-qr-generator`

- **Spec:** Per-dish QRs from CSV, for restaurants.
- **Differs from:** `menu-qr-code-generator` is one menu; this is one code per dish.
- **Working means:** Pasting an N-row CSV yields N per-dish codes, each downloadable; per-row errors are reported per row.

### B5. `bulk-shipping-label-qr-generator`

- **Spec:** Per-parcel shipping-label QRs from CSV, for shippers.
- **Working means:** Pasting an N-row CSV yields N shipping-label codes, each downloadable; per-row errors are reported per row.

### B6. `bulk-shelf-label-qr-generator`

- **Spec:** Per-product shelf-edge label QRs from CSV, for retailers.
- **Differs from:** `bulk-inventory-qr-generator` / `bulk-asset-tag-qr-generator` tag stock/assets; this makes shelf-edge price labels.
- **Working means:** Pasting an N-row CSV yields N shelf-label codes, each downloadable; per-row errors are reported per row.

### B7. `bulk-certificate-qr-generator`

- **Spec:** Per-recipient certificate QRs (verification code per recipient) from CSV, for trainers and schools.
- **Working means:** Pasting an N-row CSV yields N certificate codes with per-recipient verification codes, each downloadable.

### B8. `bulk-coupon-expiry-auditor`

- **Spec:** Audit a CSV of coupons for expired / expiring codes, for marketers.
- **Differs from:** `bulk-coupon-qr-generator` generates coupons; this audits expiry in an existing list.
- **Working means:** Pasting an N-row CSV of coupons flags each expired / expiring row with a status plus expired + expiring counts.

### B9. `bulk-check-in-qr-generator`

- **Spec:** Per-attendee / per-session check-in QRs from CSV, for event organisers.
- **Working means:** Pasting an N-row CSV yields N check-in codes, each downloadable; per-row errors are reported per row.

### B10. `bulk-rsvp-qr-generator`

- **Spec:** Per-guest RSVP QRs from CSV, for event organisers.
- **Differs from:** `event-rsvp-qr-code-generator` is one event RSVP; this is one link per guest.
- **Working means:** Pasting an N-row CSV yields N per-guest RSVP codes, each downloadable; per-row errors are reported per row.

### B11. `bulk-loyalty-card-qr-generator`

- **Spec:** Per-customer loyalty-card QRs from CSV, for shops.
- **Differs from:** `loyalty-card-qr-code-generator` is one card; this is many.
- **Working means:** Pasting an N-row CSV yields N loyalty-card codes, each downloadable; per-row errors are reported per row.

### B12. `bulk-seat-qr-generator`

- **Spec:** Per-seat QRs for a venue from CSV, for venues.
- **Differs from:** `seat-finder-qr-generator` (§4.1 G30) is one seat; this is many.
- **Working means:** Pasting an N-row CSV yields N per-seat codes, each downloadable; per-row errors are reported per row.

### B13. `bulk-pet-tag-qr-generator`

- **Spec:** Per-pet tag QRs from CSV, for shelters and vets.
- **Differs from:** `pet-tag-qr` is one tag; this is many.
- **Working means:** Pasting an N-row CSV yields N pet-tag codes, each downloadable; per-row errors are reported per row.

### B14. `bulk-invoice-qr-generator`

- **Spec:** Per-invoice payment QRs from CSV, for freelancers and small businesses.
- **Differs from:** `invoice-payment-qr-generator` (§4.1 G11) is one invoice; this is many.
- **Working means:** Pasting an N-row CSV yields N per-invoice payment codes, each downloadable; per-row errors are reported per row.

### B15. `bulk-review-qr-generator`

- **Spec:** Per-location review QRs from CSV, for multi-location businesses.
- **Differs from:** `google-review-qr-generator` (§4.1 G23) is one business; this is many locations.
- **Working means:** Pasting an N-row CSV yields N per-location review codes, each downloadable; per-row errors are reported per row.

### 4.5 Industry suites / utilities (15) → `toolPaths` in wiring

All suites follow §2.3 (clinic-qr-suite `PRESETS` shape). **Working means (all 15):**
selecting a preset + filling its fields generates a QR for that preset; switching
presets switches fields + template. Preset lists below are the floor — each suite must
ship at least these presets, each industry-specific.

### I1. `bakery-qr-suite`

- **Spec:** QR presets for bakeries. Presets: menu, daily-special, order-ahead, loyalty.
- **Working means:** Selecting the `menu` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I2. `barber-qr-suite`

- **Spec:** QR presets for barbershops. Presets: booking, price-list, review, walk-in waitlist.
- **Working means:** Selecting the `booking` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I3. `boutique-qr-suite`

- **Spec:** QR presets for boutiques. Presets: lookbook, new-arrivals, appointment, return-policy.
- **Working means:** Selecting the `lookbook` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I4. `car-wash-qr-suite`

- **Spec:** QR presets for car washes. Presets: wash-menu, membership, receipt/feedback, location.
- **Working means:** Selecting the `wash-menu` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I5. `co-working-qr-suite`

- **Spec:** QR presets for co-working spaces. Presets: day-pass, room-booking, WiFi, community-board.
- **Working means:** Selecting the `day-pass` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I6. `courier-qr-suite`

- **Spec:** QR presets for couriers. Presets: track-parcel, pickup-booking, rate-card, support.
- **Working means:** Selecting the `track-parcel` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I7. `dentist-qr-suite`

- **Spec:** QR presets for dental practices. Presets: appointment, aftercare, intake-form, review.
- **Differs from:** `clinic-qr-suite` is general medical; this is dental-specific (aftercare, insurance info).
- **Working means:** Selecting the `appointment` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I8. `driving-school-qr-suite`

- **Spec:** QR presets for driving schools. Presets: lesson-booking, theory-test, price-list, instructor-contact.
- **Working means:** Selecting the `lesson-booking` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I9. `florist-qr-suite`

- **Spec:** QR presets for florists. Presets: catalogue, order-form, care-card, occasion-gift.
- **Working means:** Selecting the `catalogue` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I10. `food-truck-qr-suite`

- **Spec:** QR presets for food trucks. Presets: today's-location, menu, order-ahead, review.
- **Working means:** Selecting the `today's-location` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I11. `hostel-qr-suite`

- **Spec:** QR presets for hostels. Presets: check-in, city-guide, WiFi, events.
- **Working means:** Selecting the `check-in` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I12. `laundromat-qr-suite`

- **Spec:** QR presets for laundromats. Presets: machine-status, price-list, wash-and-fold order, feedback.
- **Working means:** Selecting the `machine-status` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I13. `spa-qr-suite`

- **Spec:** QR presets for spas. Presets: treatment-menu, booking, gift-card, aftercare.
- **Differs from:** `salon-qr-suite` is hair/beauty services; this is spa treatments / packages / aftercare.
- **Working means:** Selecting the `treatment-menu` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I14. `vet-qr-suite`

- **Spec:** QR presets for veterinary practices. Presets: appointment, pet-record, aftercare, emergency-contact.
- **Working means:** Selecting the `appointment` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

### I15. `event-venue-qr-suite`

- **Spec:** QR presets for event venues. Presets: entry-ticket, seating-map, schedule, vendor-list.
- **Working means:** Selecting the `entry-ticket` preset + filling its fields generates a QR for that preset; switching presets switches fields + template.

---

## 5. Self-verification (run before finishing this plan)

Script: parse this file — extract the 145 slugs from the §1 code block and the 100
slugs from the `### <GROUP><N>. \`<slug>\`` headings — then assert (i) the 100 new
slugs are all unique, (ii) none equals any of the 145 existing slugs, (iii) the count
is exactly 100.

```
Existing routes parsed : 145
New tools parsed      : 100 (33 generators + 20 calculators + 17 validators + 15 bulk + 15 suites)
New slugs unique      : yes (100/100 distinct)
Overlap with existing : none
Count == 100          : yes
```

(Verification output above was produced by the script run at plan time; re-run the
parser against this file if any slug is edited — do not trust a hand count.)

---

## 6. Decisions / cut list

- **Dropped as collisions (verified against source, not assumed):**
  - `podcast-episode-qr-generator` — the existing podcast generator already has
    `episodeTitle` + `episodeUrl` fields.
  - `donation-tiers-qr-generator` — the existing donation generator already has a
    "Suggested amounts" field; replaced by `fundraiser-qr-generator` (goal-progress
    campaign page).
  - `youtube-qr-code-generator` — the playlist generator already covers YouTube
    (playlists) and the social-profile generator already covers YouTube (channel link);
    replaced by `live-stream-qr-generator` (scheduled live stream).
  - `-v2` suggestions (`clinic-v2`, `gym-v2`, `bulk-coupon-v2`, `bulk-badge-v2`,
    `bulk-asset-v2`, `typosquat-v2`, `error-budget-v2`) — all collide with existing
    tools. **Zero `-v2` suffixes in the final 100.** Where the idea was still
    distinct, it got a descriptive slug (`bulk-mecard-generator`, `bulk-coupon-expiry-auditor`,
    `qr-brand-impersonation-checker`).
  - Near-clones folded into existing tools, not re-listed: scan-angle / viewing-distance
    (covered by `qr-size-calculator` + new `qr-off-axis-scan-calculator` for the
    genuinely distinct oblique-angle math), curvature-radius (`qr-curved-surface-calculator`),
    label-sheet-fit (`qr-print-sheet-planner` + `qr-label-count-calculator`), ink-per-code
    (`qr-ink-coverage-estimator`), module-count (`qr-module-size-calculator` +
    `qr-version-estimator`), quiet-zone-mm (`qr-quiet-zone-calculator` +
    `qr-quiet-zone-adder`), print-resolution-needed / DPI-for-distance
    (`qr-dpi-calculator`), logo-size-limit (`qr-logo-safe-area-calculator`), poster-size
    (`qr-billboard-size-calculator`), sticker-roll-count → kept only as the distinct
    roll-label angle (`qr-roll-label-planner`), print-tamper checklist
    (`qr-tamper-evidence-planner` + `qr-print-proof-checklist`), accessibility contrast
    for QR frames (`qr-contrast-checker` + `qr-color-pair-tester`), shortlink expander
    (`qr-redirect-chain-viewer`), metadata auditor → kept only as the distinct
    image-EXIF angle (`qr-image-metadata-auditor`), bulk table-card (too close to
    `bulk-table-tent-qr-generator`).
- **Kept after verification (not assumed distinct):**
  - `vcard-photo-qr-generator` — verified the existing vCard generator has no photo field.
  - `geo-qr-code-generator` — verified no generator emits `geo:` (only the inspector detects it).
  - `app-review-link-qr-generator`, `webinar-join-qr-generator`, `pet-adoption-qr-generator`
    — verified no review / webinar / adoption handling in the neighbouring generators.
- **Cut for count (valid ideas, not built):** `bulk-employee-badge-qr-generator`,
  `bulk-gift-card-qr-generator`, `newsletter-signup-qr-generator`,
  `waitlist-qr-generator`, `gift-registry-qr-generator`. If a slot opens, these are the
  first candidates — re-check against the then-current route list before using them.
- **Split:** 33 generators + 20 calculators/checkers + 17 validators/security + 15 bulk
  - 15 industry suites = 100. Validators went to 17 (destination-change detection and
    brand-impersonation are distinct enough to keep); generators to 33 (kid-safe card
    grouped there because it produces a QR).
- **Naming:** all slugs kebab-case, no `-v2`, no version suffixes, no duplicates.
