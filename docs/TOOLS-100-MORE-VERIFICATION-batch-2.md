# Batch 2 verification — 20 tools (13 generators + 7 calculators/checkers)

Built on branch `growth/100-more-tools`, left uncommitted. Every page follows the
tool-page pattern from `docs/TOOLS-100-MORE-PLAN.md` §2 (client component,
Breadcrumbs, grid layout, editorial article, FAQ section, SoftwareApplication +
FAQPage JSON-LD). Generators regenerate the QR in a `useEffect` via `qrcode`
`toDataURL`, with PNG download, SVG download (via `toString`), copy-payload, and a
preview-size slider. Calculators recompute from real formulas on every input change.
No stubs, TODOs, FIXMEs, lorem, coming-soon, or invented statistics in any file
(grepped: 0 matches, excluding input `placeholder=` attributes). Representative
payloads (wa.me order, Google writereview Place ID, plain-text luggage tag and
visitor badge) were generated through the repo's installed `qrcode` lib and produced
valid PNG data URLs + SVG output. Hand-computed checks: Wilson 100/5 → 5.00%,
CI 2.15%–11.18%; roll OD 200 / core 76 / 0.15 mm → 179.2 m, 3,381 labels/roll,
3 rolls for 10,000 labels, 143 leftover; off-axis 10 cm at 30° → effective 8.66 cm,
recommended 11.55 cm; frame text 2 m indoor → cap height 5.8 mm, 23.5 pt;
ROI static $120 / dynamic $420 / 5,000 scans × $0.40 → revenue $2,000,
static ROI 1566.7%, dynamic ROI 376.2%, break-even extra scans 750.

## Generators

- `/whatsapp-order-qr-generator` — phone + product + quantity + note build a `wa.me` link with the order message pre-filled; QR via `toDataURL`; PNG + SVG download and copy payload wired; phone digit-count and quantity validation with `role="alert"`.
- `/live-stream-qr-generator` — stream URL + title + start time + platform produce a QR of the stream URL plus a card showing title, platform, and formatted start time; URL validation.
- `/google-review-qr-generator` — review link or Place ID (ChIJ…) produce a QR: a Place ID builds `search.google.com/local/writereview?placeid=…`; review-prompt card shows the business name.
- `/boarding-pass-qr-generator` — check-in URL + booking reference produce a QR of the check-in URL plus a check-in card (passenger, flight, booking ref shown as text); copy states this is a check-in link, not an airline boarding pass.
- `/luggage-tag-qr-generator` — owner + contact + flight + destination build a plain-text QR plus a tag preview; owner and at least one contact required.
- `/plant-care-qr-generator` — plant + light + water + notes produce a QR: care-page URL when given, otherwise the care summary as plain text; care card mirrors the inputs.
- `/recipe-qr-generator` — recipe URL + title + time + servings produce a QR of the recipe URL plus a recipe summary card; servings validated ≥ 1.
- `/warranty-qr-generator` — registration URL + product + serial + purchase date produce a QR of the registration URL plus a warranty card (serial and formatted purchase date shown as text).
- `/visitor-badge-qr-generator` — visitor + host + company + expiry + purpose build a plain-text badge QR plus a badge preview with VISITOR heading, host, and formatted valid-until date.
- `/seat-finder-qr-generator` — venue + section + row + seat produce a QR: seat-map URL when given, otherwise the seat locator as plain text; seat-label preview (Section · Row · Seat).
- `/appointment-booking-qr-generator` — booking URL + service + provider produce a QR of the booking URL plus a booking card; copy states this opens a booking page, not a calendar entry.
- `/quote-request-qr-generator` — quote-form URL + service + reference produce a QR of the form URL plus a quote card with the reference shown as text.
- `/kid-safe-qr-card-generator` — destination URL + label + adult note produce a QR of the destination URL plus a permission card ("Ask a grown-up first", label, grown-up note); copy states the card is a reminder, not a safety filter.

## Calculators / checkers

- `/qr-batch-failure-estimator` — sample size + failures + batch size recompute the estimated failure % with a Wilson 95% confidence interval, expected failures in the batch, and the plausible range, on every input change; failures > sample size is rejected.
- `/qr-cost-per-scan-calculator` — spend + scans recompute cost per scan, cost per 1,000 scans, and scans per $100 on every input change.
- `/qr-dynamic-vs-static-roi-calculator` — static/dynamic costs + expected scans + value per scan recompute both ROI figures, the winner, and the extra scans the pricier option needs to break even, on every input change; zero cost yields "not defined" rather than an invented percentage.
- `/qr-frame-text-size-calculator` — distance + viewing conditions recompute minimum cap height (mm) and font size (pt, rounded up, plus px at 96 dpi) via the 10-arcminute angular-size rule with stated condition factors, on every input change.
- `/qr-roll-label-planner` — outer diameter + core diameter + thickness + label height + gap + total labels recompute roll length (annulus formula), labels per roll, rolls needed, leftover labels, and pitch, on every input change.
- `/qr-off-axis-scan-calculator` — code width + viewing-angle slider recompute effective width (cosine), width lost, size uplift, and recommended printed width, on every change; angles above 60° show a reposition warning.
- `/qr-glare-risk-checker` — surface finish + lighting selections recompute a 0–6 glare-risk score, a Low/Moderate/High verdict, and matching mitigation, on every selection change.

## Checks run

- `npx eslint` over all 20 files — 0 errors, 0 warnings (7 unused-import warnings found on first pass, removed, re-checked clean).
- Grep for `TODO|FIXME|lorem|coming soon` (excluding input `placeholder=` attributes) — 0 matches.
- Structural check on all 20 files: 2 JSON-LD blocks, Breadcrumbs, FAQ section, no unreplaced template tokens; all 13 generators contain `QRCodeLib.toDataURL`, PNG/SVG download, and copy-payload.
- Full `typecheck` / `build` / `content:audit` intentionally NOT run (coordinator-owned whole-project gates; other builders writing concurrently).
