# TOOLS — 100 More: Batch 1 Verification (20 generator tools)

Batch 1 builder verification. All 20 routes built as `src/app/<slug>/page.tsx`, left
uncommitted. No other files touched. No full `typecheck` / `build` / `content:audit`
run (coordinator-owned whole-project gates run later; other builders writing
concurrently). Verification per tool below: re-read of each file, a single
`npx eslint` pass over all 20 files (exit 0, 0 errors, 0 warnings), and a grep
for TODO / FIXME / lorem / "coming soon" (0 matches). Every tool follows the
`email-qr-code-generator` pattern: `'use client'`, Breadcrumbs, grid layout,
controls + sticky QR card, encoded-payload card with copy button, PNG download
via `qrcode` `toDataURL` + SVG download via `qrcode` `toString`, QR preview-size
slider, editorial article, FAQ section, SoftwareApplication + FAQPage JSON-LD.

- `/qr-link-menu-generator` — QR encodes the entered menu page URL via `qrcode` toDataURL; add/remove link rows update a live clickable menu preview; invalid menu or link URLs block generation with an inline error; PNG + SVG downloads wired.
- `/app-review-link-qr-generator` — platform select builds the correct review URL (iOS `apps.apple.com/app/id…?action=write-review`, Android Play details URL with `showAllReviews=true`); iOS App ID must be digits, Android package-name shape validated; payload shown verbatim; PNG + SVG downloads wired.
- `/vcard-photo-qr-generator` — uploaded photo is resized client-side via canvas to max 240px JPEG and embedded as a vCard 3.0 `PHOTO;ENCODING=b;TYPE=JPEG:` line; contact-card preview shows the photo; payload character count displayed; PNG + SVG downloads wired.
- `/event-countdown-qr-generator` — 1-second ticker countdown (days/hours/minutes/seconds) to the entered start time, "event has started" state after it passes; QR encodes the event page URL; PNG + SVG downloads wired.
- `/gift-card-qr-generator` — code / amount / currency / expiry render a styled gift-card preview; QR encodes a structured `GIFTCARD:CODE=…;AMOUNT=…;EXPIRES=…` payload (plus recipient / redeem URL when given); PNG + SVG downloads wired.
- `/membership-card-qr-generator` — card preview shows tier badge + expiry; QR encodes a structured `MEMBERSHIP:ORG=…;ID=…;TIER=…;EXP=…;NAME=…` payload; PNG + SVG downloads wired.
- `/parking-spot-qr-generator` — spot number + action (pay/extend/report) are appended as query parameters to the parking page URL; spot-label preview shows the spot number large; PNG + SVG downloads wired.
- `/table-order-qr-generator` — table number is appended as a `table` query parameter to the ordering URL; table-stand preview shows the restaurant + table number; PNG + SVG downloads wired.
- `/room-booking-qr-generator` — room name is appended as a `room` query parameter to the booking URL; room-label preview shows room name + capacity; PNG + SVG downloads wired.
- `/shipment-tracking-qr-generator` — tracking number + carrier build the carrier tracking URL (UPS / FedEx / DHL / USPS patterns, Custom uses the entered tracking page URL with a `tracking` parameter); tracking summary card shown; PNG + SVG downloads wired.
- `/invoice-payment-qr-generator` — invoice number + amount are appended as query parameters to the payment URL; invoice summary shows number, amount, due date, bill-to; PNG + SVG downloads wired.
- `/fundraiser-qr-generator` — goal / raised render a live progress bar with percentage, remaining amount, and days left; QR encodes the campaign URL; PNG + SVG downloads wired.
- `/course-enrollment-qr-generator` — course code is appended as a `code` query parameter to the enrollment URL; course card shows title, code, instructor; PNG + SVG downloads wired.
- `/webinar-join-qr-generator` — QR encodes the join URL verbatim (any platform, nothing rewritten); join card shows title, host, and formatted start time; PNG + SVG downloads wired.
- `/pet-adoption-qr-generator` — QR encodes the adoption page URL; adoption profile card shows pet name, breed, age, sex, shelter, and description; PNG + SVG downloads wired.
- `/job-application-qr-generator` — QR encodes the application form URL; job card shows title, company, location, reference; PNG + SVG downloads wired.
- `/car-listing-qr-generator` — QR encodes the listing URL; listing card shows title, price, year, mileage, VIN; VIN validated as 17 characters excluding I/O/Q; PNG + SVG downloads wired.
- `/property-tour-qr-generator` — QR encodes the virtual tour URL; tour card shows title, address, price, bedrooms, bathrooms; PNG + SVG downloads wired.
- `/prescription-refill-qr-generator` — Rx number is appended as an `rx` query parameter to the refill URL; refill card shows pharmacy, Rx number, optional medication; PNG + SVG downloads wired.
- `/geo-qr-code-generator` — latitude / longitude validated to −90…90 / −180…180 produce a scannable QR via `qrcode` toDataURL from a `geo:lat,lng` payload (optional `?q=` label); coordinates shown with an OpenStreetMap pin link; PNG + SVG downloads wired.

Fixes applied during verification: removed unused `withParam` / `isValidUrl` helpers
from files that do not use them (unused-var warnings), replaced `Date.now()` in the
fundraiser `useMemo` with a ticking state value (react-hooks/purity error), and
escaped 18 apostrophes in JSX text as `&apos;` (react/no-unescaped-entities errors).
Final `npx eslint` over all 20 files: exit 0, 0 errors, 0 warnings.
