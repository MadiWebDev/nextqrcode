# TOOLS — 100 More: Batch 4 Verification

Batch 4 — 10 validators/security + 10 bulk. All 20 routes built as `src/app/<slug>/page.tsx`, left uncommitted. No push, no merge, no shared-file edits.

Verification performed per tool: full re-read of the duplicate-detector and certificate pages, structural grep over all 20 (each starts `'use client'`, has Breadcrumbs, two JSON-LD blocks, an FAQ section), `npx eslint` over all 20 files (0 errors; 9 `<img>` warnings only, same pattern as the existing bulk-coupon page), and grep for TODO / FIXME / lorem / "coming soon" (0 matches). Full-project typecheck/build/content-audit intentionally NOT run (other builders writing concurrently; coordinator runs whole-project gates later).

- /qr-permission-explainer — selecting an OS + scan context shows the permission list for that pair, what each permission is for, and where to control it, with tick-box progress.
- /qr-image-metadata-auditor — uploading a JPEG parses the real EXIF/TIFF blocks (camera, software, dates, GPS coordinates) and PNG text/EXIF chunks via DataView, listing each field with its privacy warning; files are read locally only.
- /qr-url-anatomy-checker — editing the URL re-parses it with the URL parser and lists scheme, host, registrable domain, TLD, subdomain depth, path, fragment, and every query parameter, with risk flags for HTTP, IP host, punycode, deep subdomains, embedded credentials, and long URLs.
- /qr-payload-hash-verifier — hash verifier computes the real SHA-256 / SHA-384 / SHA-512 / SHA-1 of the payload via crypto.subtle and compares it against the pasted expected hash (normalised for case/whitespace) with a match/mismatch verdict.
- /qr-batch-duplicate-detector — editing the pasted list recomputes exact duplicate groups after normalisation (case, trailing slash, scheme, www.) plus near-duplicate pairs via Levenshtein edit distance.
- /qr-tracking-parameter-auditor — editing the URL re-classifies every query parameter as tracking (utm_*, gclid, fbclid, etc.), personal data (email/phone/name/token names, email-shaped values), possible identifier, or other, with counts and a privacy-risk verdict.
- /qr-safe-scan-checklist-builder — selecting a context regenerates the checklist for that context (base checks + context checks) with tick boxes, progress bar, copy, and print.
- /qr-incident-report-builder — entering the details generates a filled structured incident report (payload, location, behaviour, actions, evidence) with copy and .txt download.
- /qr-brand-impersonation-checker — entering a brand + suspect domain scores impersonation tricks (prefix/suffix, trust keywords, brand-in-subdomain, near-miss spelling via edit distance, digit lookalikes, punycode, unusual TLD) and lists each trick found.
- /qr-destination-change-detector — pasting a current destination compares it against the baseline saved in localStorage and lists scheme/host/path/port/parameter changes; saving and clearing the baseline work.
- /bulk-calendar-qr-generator — bulk tool generates one VEVENT QR per pasted CSV row; per-row PNG download + ZIP download wired; per-row errors reported without blocking valid rows.
- /bulk-mecard-generator — bulk tool generates one MeCard QR per pasted CSV row; per-row PNG download + ZIP download wired; per-row errors reported without blocking valid rows.
- /bulk-survey-qr-generator — bulk tool generates one survey QR per pasted CSV row, with cohort/respondent parameters appended to the survey URL; per-row PNG download + ZIP download wired.
- /bulk-menu-item-qr-generator — bulk tool generates one per-dish QR per pasted CSV row (dish URL when given, otherwise dish details as text); per-row PNG download + ZIP download wired.
- /bulk-shipping-label-qr-generator — bulk tool generates one shipping-label QR per pasted CSV row (tracking, carrier, recipient, order); per-row PNG download + ZIP download wired.
- /bulk-shelf-label-qr-generator — bulk tool generates one shelf-label QR per pasted CSV row (product, SKU, price, aisle); per-row PNG download + ZIP download wired.
- /bulk-certificate-qr-generator — bulk tool generates one certificate QR per pasted CSV row with a per-recipient verification code (entered, or deterministically derived from recipient + course + issue date when blank); per-row PNG download + ZIP download wired.
- /bulk-coupon-expiry-auditor — bulk tool audits a pasted CSV of coupons, flagging each row expired / expiring soon (configurable window) / valid / invalid date / missing code, with counts, status filters, copyable summary, and audited CSV download.
- /bulk-check-in-qr-generator — bulk tool generates one check-in QR per pasted CSV row (attendee, event, session, ticket); per-row PNG download + ZIP download wired.
- /bulk-rsvp-qr-generator — bulk tool generates one per-guest RSVP QR per pasted CSV row (guest parameter appended to the RSVP URL, or guest details as text when no URL); per-row PNG download + ZIP download wired.
