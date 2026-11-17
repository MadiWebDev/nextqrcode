# CHANGELOG.md — SEO program change log

Every change: what, where, before → after, evidence IDs, hypothesis, rollback.
This run (2026-11-17) is restricted to **metadata + structured data**. No
indexability, sitemap, robots.txt, redirect or deletion changes were made.
Staged as three commits on branch `seo/metadata-faq-schema` (off main `462c0bb9`);
**not pushed, not deployed** — production still serves the "before" state until the
branch is merged and deployed. Annotation date for measurement: the deploy date of
this branch (record it here when it happens).

## Commit A — "seo: homepage + snippet metadata"

### C-001 — Homepage title + description (main site)
- File: `src/app/page.tsx` (page metadata + Open Graph).
- Title before: "Free QR Code Generator & Optical Engineering Suite — QR Code Tools" (66 chars, E-018).
  After: **"Free QR Code Generator — No Sign-Up, PNG, SVG & PDF" (51 chars)**.
- Description before: "Generate beautiful, professional QR codes & barcodes 100% in
  your browser. 40+ types, instant vector SVG/PDF download, distance calculator,
  safety inspector, and offline file transfer. Zero tracking." (199 chars).
  After: **"Generate free QR codes for URLs, WiFi, WhatsApp, vCards, payments and
  more — with custom colors and logos. Download PNG, SVG or PDF. No sign-up." (144 chars)**.
- OG title/description set to the same new values (previously a second jargon variant).
- Evidence: E-018 (served lengths), E-005 (head term absent from queries — the title
  must carry the exact primary keyword cleanly), spec Phase 3B (remove "Optical
  Engineering Suite" jargon; ≤60 / ≤155 limits).
- Hypothesis: a non-truncated title led by the exact primary keyword, plus a
  within-limits description naming the top intents, improves the homepage's snippet
  relevance and CTR for generator queries. Falsifier: no change in homepage
  impressions/CTR for generator-family queries 4 weeks after deploy vs the Oct
  baseline (E-001), controlling for the indexing situation.
- H1: verified exactly one, already "Free QR Code Generator" (E-018) — unchanged.
- Rollback: restore the two string pairs in `src/app/page.tsx`.

### C-002 — Homepage country-count chip made truthful and data-derived
- File: `src/components/home/HomePage.tsx` (one line).
- Before: `{t('countries.more', { count: 40 })}` → rendered "+40 more" beside chips
  for all 5 countries in the data.
- After: `{t('countries.all', { count: countries.length })}` → renders "All 5
  countries", derived from `getAllCountries()` at render time, so it can never drift
  from the data again. (The same key+pattern was already used for the section-header
  link directly above, so no locale file needs a new key.)
- Evidence: E-020 (5 countries), E-021(a).
- Hypothesis: not a ranking change — a factual-accuracy fix (spec hard rule: no
  unverifiable on-page claims).
- Rollback: restore the one line.

### C-003 — Hub-card descriptions corrected to data-verified facts (English locale)
- File: `src/i18n/messages/en.json` (two strings; other locales untouched — they
  carry their own translations and are flagged in STATE.md as a follow-up).
- Payment QR Scheme Library, before: "Official spec generators for Pix, UPI, Raast,
  SGQR, Swiss QR-Bill, SEPA, PromptPay, and 25+ more payment networks."
  After: **"Official spec generators for Brazil Pix, Singapore SGQR and the Swiss
  QR-Bill — each built to its scheme's published specification."**
- Label & Sticker Sheet Library, before: "Print-ready QR sheet generators for 30+
  Avery, Herma, Dymo, Brother, and Zebra label formats. Exact margin calibration,
  zero-drift layout."
  After: **"Print-ready QR label sheets with exact margin calibration and
  zero-drift layout — Avery 5160, 5163, L7160, round stickers, and Herma 4682."**
- Evidence: E-020 (3 schemes; 5 sheets, Avery+Herma only), E-021(b,c). Claims
  verified TRUE and deliberately left unchanged: glossary, industries and
  size-guide card counts (E-021(d)).
- Rollback: restore the two strings.

### C-004 — Snippet rewrites: six scan-guide pages (title + description only)
- File: `src/data/devices.ts` (`title`, `metaDescription` fields only). The visible
  H1 of every page is **byte-identical** before/after (asserted programmatically:
  the pre-colon title segment from which the H1 derives, E-029, is unchanged).
- Data: Pages.csv positions/CTRs in E-007. Pattern: good positions (6.2–11.2),
  weak CTR, served titles 64–77 chars (truncated). Hypothesis for all six: removing
  the truncated ": Complete Guide"-style suffix and front-loading the exact device
  intent lifts CTR at unchanged positions; descriptions rewritten to name the actual
  scanning method from each guide's own data (verified per guide, E-020 method).

| Page | GSC (E-007) | Title field before → after (served incl. " \| QR Studio") | Description |
|---|---|---|---|
| scan-qr-code-fire-tablet | 96 impr, pos 6.84, CTR 2.08% | 59 → 43 chars (served 71 → **55**): "How to Scan QR Codes on Amazon Fire Tablets" | 133 → 145: leads with the verified fact Fire tablets have **no built-in scanner**; names Appstore app / Silk web scanner |
| scan-qr-code-realme | 78 impr, pos 6.59, CTR 0% | 65 → 49 (served 77 → **61**): "How to Scan QR Codes on Realme Phones (Realme UI)" | 153 → 145: Camera app / Google Lens + Realme UI settings |
| scan-qr-code-nokia | 70 impr, pos 7.0, CTR 2.86% | 52 → 36 (served 64 → **48**): "How to Scan QR Codes on Nokia Phones" | 146 → 143: Camera app / Google Lens, older-model tips |
| scan-qr-code-honor | 62 impr, pos 11.19, CTR 0% | 62 → 46 (served 74 → **58**): "How to Scan QR Codes on Honor Phones (MagicOS)" | 149 → 146: Camera app / Control Center Scan shortcut |
| scan-qr-code-oppo | 34 impr, pos 6.47, CTR 2.94% | 61 → 45 (served 73 → **57**): "How to Scan QR Codes on Oppo Phones (ColorOS)" | 151 → 142: Camera app / Google Lens, ColorOS settings |
| fix-qr-camera-permission | 41 impr, pos 10.46, CTR 4.88% | **unchanged** (see note) | 160 → 145: black-screen symptom + the three fix locations |

- Note (fix-qr-camera-permission): its title contains no colon, so the title *is*
  the H1; any title edit would change visible content, which this run's gate
  forbids. Description-only. Splitting meta-title from H1 for this page is a Phase 3
  candidate (DECISIONS D-002).
- Note (realme): served title is 61 chars — 1 char over the 60-char guideline —
  accepted deliberately to keep the H1 byte-identical (DECISIONS D-003).
- Rollback: restore the six entries' `title`/`metaDescription` values (table above
  + git history of the branch).

### C-005 — Snippet rewrite: blog/why-your-qr-code-shows-a-404-error
- Files: `src/lib/articles.ts` (Article gains optional `metaTitle`/`metaDescription`;
  a documented `META_OVERRIDES` map applied at composition), `src/app/blog/[slug]/page.tsx`
  (generateMetadata uses the overrides; title via `{ absolute: … }` so the layout
  template and the " — QR Code Tools" suffix no longer stack).
- Before: served title "Why Your QR Code Shows A 404 Error and How to Fix It —
  QR Code Tools | QR Studio" (**81 chars**); description 141 chars.
- After: title **"Why Your QR Code Shows a 404 Error (and How to Fix It)" (54 chars)**;
  description **"QR code scans to a 404 page? Find the cause — moved page, deleted
  page, typo or broken redirect — test each in order, and fix it before reprinting."
  (147 chars)**.
- The visible H1, body, TechArticle headline and byline keep the editorial title —
  only the SERP snippet changes. OG/Twitter titles use the override too.
- Evidence: E-007 (59 impr @ pos 6.22, CTR 1.69%). Hypothesis: de-truncated title +
  symptom-led description lifts CTR at position ~6. The shared `art()` helper used
  by ~1,500 batch articles was deliberately not modified (DECISIONS D-004).
- Rollback: delete the override entry (and optionally the two optional fields).

## Commit B — "seo: FAQPage question-type structured data + schema gaps"

### C-006 — FAQPage added to the shared LandingGenerator component
- File: `src/components/LandingGenerator.tsx`. Emits an FAQPage block generated from
  `data.faqs` — the exact array the component renders in its visible accordion —
  guarded by `data.faqs.length > 0` (the imageresizer builders' pattern).
- Covers 18 sitemap URLs (E-023a): bitcoin, upi, url, vcard, whatsapp generator
  pages; whatsapp-qr ×5 countries; payment-qr ×3 schemes; qr-labels ×5 sheets
  (+ the [locale] text page, same component).
- Evidence: E-022, E-023. Hypothesis: pages with visible FAQs but no FAQPage markup
  are ineligible for question-type rich treatment and semantically incomplete;
  generating the schema from the rendered data makes mismatch impossible.
- Rollback: remove the block + import.

### C-007 — FAQPage added to 15 individual tool pages
- Files: `src/app/<slug>/page.tsx` for animated-qr-transfer, barcode-generator,
  bulk-vcard-qr, error-correction-simulator, medical-id-qr, pakistan-payment-qr,
  pet-tag-qr, printed-qr-tester, qr-placement-guide, qr-safety-checker,
  qr-splitter-scanner, qr-sticker-sheet-printer, utm-builder,
  wifi-qr-code-generator, wifi-sign-generator.
- Each page gains an FAQPage block generated from its own local `faqs`/`FAQS` array
  — the exact questions/answers rendered in its visible FAQ section — using the
  shared `JsonLd` component (same pattern as the scan-guide template).
- `/regional-payment-qr` and `/bulk-vcard-generator` inherit the fix via their
  one-line re-exports (E-023c). With C-006, **all 35 unique URLs** the baseline
  crawl found with visible FAQs but no FAQPage are covered (E-022).
- Includes both current winners: /pakistan-payment-qr (E-007) and
  /qr-splitter-scanner (E-007).
- Rollback: remove the added block + import per file.

### C-008 — Structured-data gaps checked; nothing else added
- Organization + WebSite: present on all three sites (root layout + per-site
  blocks, E-018). WebApplication/SoftwareApplication with offers price 0: present
  on all three tool homepages (main: SoftwareApplication; invoice:
  SoftwareApplication; imageresizer: WebApplication). FAQPage: complete after
  C-006/C-007. **Schema-without-visible-FAQ found: none (0 URLs, E-022)** — nothing
  to remove and nothing silently "fixed". BreadcrumbList: present in content
  families and imageresizer; the main-site shared-component gap (E-030) is deferred
  to Phase 4 by decision (D-005), not silently skipped.
- No ratings, reviews or HowTo markup was added anywhere (spec rule).

## Commit C — "seo: placeholder label fix + seo-agent state files"

### C-009 — AdSlot placeholder: investigated, NO code change
- Finding: the "Advertisement space reserved" string is screen-reader-only
  (`sr-only`, E-025) — not a visible placeholder. The run's instructions: if the
  label is not visible to end users, report instead of changing. **No change made.**
  The visible "Advertisement" caption + empty reserved box when ads don't load is
  recorded for Phase 9 (ads policy/UX), not touched here.

### C-010 — seo-agent/ state files + baseline (new)
- `seo-agent/` created at repo root: STATE.md, EVIDENCE.md, DECISIONS.md,
  ASSUMPTIONS.md, CHANGELOG.md, RISKS.md, QUESTIONS.md, PHASE1-PREP.md,
  `tools/` (crawl_baseline.py, summarize_crawl.py), `baseline/` (GSC export zip,
  crawl CSV with 2,121 rows, Googlebot spotcheck CSV, summary-by-family.md,
  README.md).
