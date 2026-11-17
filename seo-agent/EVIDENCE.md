# EVIDENCE.md — Evidence ledger, freeqrcode.tools SEO program

Every claim in every deliverable cites an ID from this ledger. Confidence labels:
CONFIRMED (verified in data/code/live site) · LIKELY (strong indirect evidence) ·
HYPOTHESIS (plausible, untested) · UNVERIFIED (could not check).
Ledger started 2026-11-17. Live-fetch timestamps are Asia/Karachi (PKT).

## A. Search Console export (user-provided, received 2026-11-17)

Source file: `seo-agent/baseline/freeqrcode.tools-Performance-on-Search-2026-11-17__2.zip`
(Filters.csv: Search type = Web, Date = Last 3 months; export rows capped at 1,000,
so tail conclusions are sampled.)

- **E-001 — Export totals. CONFIRMED.** Chart.csv (43 daily rows, 2026-10-04 → 2026-11-15)
  sums to exactly **69 clicks / 7,122 impressions**. First impressions 2026-10-06
  (2 impressions, 1 click, position 1).
- **E-002 — The collapse is a one-day cliff. CONFIRMED.** Chart.csv daily rows:
  Oct 26 = 470 impressions, **Oct 27 = 464 → Oct 28 = 101 → Oct 29 = 10 → Oct 30 = 1**,
  Oct 31 = 3, Nov 1 = 4, and ≈0–4/day thereafter (Nov 15 = 0). **Zero clicks after
  Oct 27.** The site did not decay; it fell off a cliff and stayed at ~zero for 19 days.
- **E-003 — http:// homepage is indexed and earning. CONFIRMED.** Pages.csv row:
  `http://freeqrcode.tools/` — 2 clicks, 3 impressions, 66.67% CTR, position 1.33.
  A protocol variant of the homepage holds its own (tiny but real) search presence.
- **E-004 — Device split. CONFIRMED.** Devices.csv: Mobile 1,851 impressions @ avg
  position 17.74, CTR 2.11%, 39 clicks; Desktop 5,225 impressions @ position 51.1,
  CTR 0.56%, 29 clicks; Tablet 46 impressions. The deep-position bulk is a desktop
  phenomenon; mobile positions were far healthier.
- **E-005 — Target queries are nearly absent. CONFIRMED.** Queries.csv (1,000 rows):
  **zero** queries containing "invoice"; "image/resize" appears only inside QR-image
  queries. The exact head term "free qr code generator" does **not** appear at all
  (only long-tail variants). Top query by impressions: "whatsapp qr code generator",
  48 impressions @ position 84.48; "dynamic qr code generator" 19 @ 77.05.
- **E-006 — Blog dominates the export; the two subdomains are invisible. CONFIRMED.**
  Pages.csv (1,000 rows): **863 rows are /blog/** (6,222 of 7,908 page-row impressions);
  **340 blog pages have ≤2 impressions**. invoicegenerator host appears exactly **once**
  (1 impression, position 1, as the fragment URL `https://invoicegenerator.freeqrcode.tools/#templates`).
  imageresizer host appears **zero** times.
- **E-007 — Winners. CONFIRMED.** Pages.csv: `/pakistan-payment-qr` 6 clicks, 75 impr,
  8% CTR, pos 10.64; `/qr-splitter-scanner` 4 clicks, 15 impr, 26.67% CTR, pos 14.13;
  scan-guides at good positions with weak CTR — fire-tablet 96 impr @ 6.84 (CTR 2.08%),
  realme 78 @ 6.59 (0%), nokia 70 @ 7.0 (2.86%), honor 62 @ 11.19 (0%), oppo 34 @ 6.47
  (2.94%), fix-qr-camera-permission 41 @ 10.46 (4.88%); `/blog/why-your-qr-code-shows-a-404-error`
  59 impr @ 6.22 (CTR 1.69%).
- **E-008 — YMYL-adjacent templated posts are among the top earners. CONFIRMED — Phase 2
  risk class.** Pages.csv: `/blog/qr-code-for-election-voter-information` pos 5.43,
  3 clicks; `/blog/qr-code-for-mental-health-resources` pos 6.40, 2 clicks;
  `/blog/qr-code-for-immigration-documents` pos 15.14, 2 clicks;
  `/blog/qr-code-for-pharmacies-medication-tracking` pos 7.44, 2 clicks. Per the spec's
  hard rules these are high-risk (election, immigration, health) and must not be treated
  as ordinary pruning candidates.
- **E-009 — Countries. CONFIRMED.** Countries.csv: US 2,611 impressions @ pos 55.15,
  CTR 0.38% (10 clicks); India 527 @ 34.06, CTR 3.61% (19 clicks); Pakistan 191 @ 13.26,
  CTR 5.24% (10 clicks); UK 711 @ 40.01 (4 clicks). Pakistan has the best positions and
  CTR of the large markets; the US has the most impressions at the worst positions.

## B. External reference

- **E-010 — No confirmed Google ranking update aligns with Oct 28. CONFIRMED (dashboard
  feed); correlation-only for third-party reports.** Google Search Status Dashboard
  incidents feed (`status.search.google.com/incidents.json`, fetched 2026-11-17):
  September 2026 spam update ran 2026-09-24 → 2026-10-08; **no incident of any kind is
  listed between Oct 8 and Nov 10**; the November 2026 core update began 2026-11-10 —
  after the collapse. Third-party reporting (Search Engine Roundtable, via web search
  2026-11-17) logged *unconfirmed* volatility on Oct 16, 20–21, 24–25 and from Oct 27.
  Correlation is not causation; the dashboard evidence weakens the update theory (H7).

## C. Internal project history (supplied in the commissioning brief; not independently re-verifiable from the repo)

- **E-011 — Deployments failed Oct 28 – Nov 12, 2026; first successful deploy Nov 12.**
  LIKELY (internal project records). The live site therefore ran a stale build through
  the exact window in which impressions collapsed.
- **E-012 — The sitemap index `/sitemap.xml` returned 404 live until a fix was deployed
  2026-11-13.** LIKELY (internal records; the fix commit `de882958` added a static
  `public/sitemap.xml`). **The date the 404 began is UNVERIFIED** — if it began with the
  Oct 28 deploy failures, Google could not fetch the sitemap index during the collapse
  window.
- **E-013 — The Oct-19 all-at-once publish created the ~2,004-URL sitemap and the
  "Discovered – currently not indexed" backlog.** LIKELY (internal records + user report).

## D. Live-site checks, 2026-11-17 (this run)

- **E-014 — Protocol behaviour. CONFIRMED (curl, 2026-11-17 ~12:15 PKT).**
  `http://freeqrcode.tools/` → **308** → `https://freeqrcode.tools/` (1 hop, 200).
  `https://www.freeqrcode.tools/` → **307 (temporary)** → apex. `http://www.` → 308 →
  https www → 307 → apex (2 hops). The http→https redirect exists *now*; when it was
  introduced is UNVERIFIED. A temporary (307) www→apex redirect is a (minor) canonical
  hygiene defect. The verification-file URL in E-015 returns **404**.
- **E-015 — The GSC meta verification value is a filename, not a token. CONFIRMED.**
  Served homepage HTML contains
  `<meta name="google-site-verification" content="google77fce3f57266cc5a.html">`.
  The value comes from the `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var
  (`src/config/site.ts`, consumed in `src/app/layout.tsx`). The HTML-file method's
  filename was pasted where the meta-tag token belongs, and the file itself 404s
  (E-014) — so this meta tag cannot be what verifies the property. How the property
  *is* verified (DNS?) is UNVERIFIED — see QUESTIONS.md. (This value is served publicly
  to every visitor; it is not a credential.)
- **E-016 — Baseline crawl headline. CONFIRMED.** `seo-agent/baseline/crawl-2026-11-17.csv`
  (2,121 sitemap URLs fetched live 2026-11-17, ≤5 req/s, normal UA) +
  `summary-by-family.md`. 2,120 URLs returned 200; 1 fetch failed through this
  environment's proxy and returned **200 on immediate recheck** — effectively 100%
  200. **0 non-self canonicals, 0 noindex, 0 unexpected redirect chains.** Median
  response 0.79 s, p90 1.09 s (through a proxy; not a field/CrUX measurement). Median
  visible-text word counts: blog 996, scan-guide 933, size-guide 888, glossary 771,
  templates 767, tool-pages 749; only **37 of 2,121 pages (1.7%) are under 300 words**
  (mostly imageresizer category listing pages at 105–163 words and the /payment-qr hub
  at 158). Duplicate titles globally: 5 URLs (see E-024); duplicate descriptions: 29.
- **E-017 — Sitemap structure. CONFIRMED.** Static index `public/sitemap.xml` lists
  sections 0–9 generated by `src/app/sitemap.ts` (`generateSitemaps`). Live section
  counts 2026-11-17: 0 core = 16, 1 tools = 128, 2 generators = 61, 3 bulk = 32,
  4 suites = 30, 5 blog = 1,591, 6 families = 166, 7 labels/schemes = 13,
  8 invoice = 23, 9 imageresizer = 61 → **2,121 entries, 2,120 unique URLs**:
  `/bulk-vcard-qr` is listed in two sections (harmless duplication, logged).
  Section 6 reconciles exactly with data (glossary 40 + industries 40 + scan-guide 30
  + size-guide 26 + templates 30 = 166); section 7 = 5 WhatsApp countries + 3 payment
  schemes + 5 label sheets = 13.
- **E-018 — Homepage as served. CONFIRMED (crawl row + curl).** Title
  "Free QR Code Generator & Optical Engineering Suite — QR Code Tools" (**66 chars**),
  meta description **199 chars**, **exactly 1 H1** ("Free QR Code Generator", from the
  i18n `hero.title` string), ~1,519 words, self-canonical, schema present:
  Organization, WebSite, SoftwareApplication (offers price 0), FAQPage.
- **E-019 — Googlebot-UA spotcheck. CONFIRMED with caveat.**
  `seo-agent/baseline/googlebot-spotcheck-2026-11-17.csv`: 15 stratified URLs fetched
  with a Googlebot UA and a normal UA returned **identical** status, title, canonical,
  meta robots and byte size — no cloaking-like differences and no bot-challenge for the
  Googlebot UA. Caveat: a UA string does not reproduce Googlebot's IP ranges/ASN, so a
  WAF rule keyed on network identity would be invisible to this test; URL Inspection
  (user-side) is the decisive check.
- **E-020 — True counts from the data modules. CONFIRMED (executed via tsx, 2026-11-17).**
  Countries (`src/data/countries.ts`): **5**. Payment schemes (`src/data/payments.ts`):
  **3** — swiss-qr-bill, brazil-pix-emv, singapore-sgqr. Label sheets
  (`src/data/labels.ts`): **5** — 4× Avery (5160, 5163, L7160, round stickers) + 1× Herma
  (4682); **no Dymo, Brother or Zebra**. Device guides: 30. Glossary entries: 40.
  Industry pages: 40 across **10** distinct industries. Size guides: 26. Blog articles
  (`src/lib/articles.ts`): **1,591**.
- **E-021 — Homepage count claims vs reality. CONFIRMED (code).**
  (a) `src/components/home/HomePage.tsx` rendered a "+{count} more" chip with a
  **hardcoded count of 40** next to the country chips — while the data holds exactly 5
  countries and all 5 are rendered as chips on the same page (the "5 countries" figure
  was the true one; "+40 more" was false).
  (b) `src/i18n/messages/en.json` payment-hub card claimed "Pix, UPI, Raast, SGQR,
  Swiss QR-Bill, SEPA, PromptPay, and **25+ more** payment networks" — the schemes data
  contains 3 schemes, and UPI, Raast, SEPA and PromptPay are not among them.
  (c) The label-hub card claimed "**30+** Avery, Herma, **Dymo, Brother, and Zebra**
  label formats" — data holds 5 sheets from 2 brands.
  (d) Verified TRUE and left unchanged: glossary card (40 entries ≥ 7 named + "25+
  more"), industries card (6 named + "4 more" = 10 distinct industries), size-guide
  card ("20 specific use cases" ≤ 26 guides).
- **E-022 — FAQ / FAQPage audit. CONFIRMED (code cross-check of all 311 `page.tsx`
  files + live crawl).** 234 page files contain FAQPage markup generated from the same
  FAQ data they render. Content families (blog, scan-guide, glossary, industries,
  size-guide, templates) all emit FAQPage from `entry.faqs` and render the same faqs;
  **every entry in every family loader has ≥1 FAQ (zero-FAQ count = 0)**, so the
  unconditional emission produces no empty schema today. Invoice site: homepage and
  all SeoLanding pages emit FAQPage from the exact faqs they render. Imageresizer:
  builders emit FAQPage only when faqs exist (guarded) and the homepage/tools render
  the same faqs; guides/categories have no FAQs and no FAQ schema (consistent).
  **Live crawl: FAQPage schema on 2,033 URLs; visible-FAQ-without-schema on 36 rows /
  35 unique URLs (E-023); schema-without-visible-FAQ on 0 URLs.**
- **E-023 — The FAQPage gaps (pre-change). CONFIRMED.** (a) `src/components/LandingGenerator.tsx`
  renders `data.faqs` in a visible accordion but emitted **no JSON-LD**; it powers
  bitcoin, upi, url, vcard and whatsapp generator pages, `whatsapp-qr/[slug]` (5
  countries), `payment-qr/[slug]` (3 schemes), `qr-labels/[slug]` (5 sheets) and the
  [locale] text page → 18 sitemap URLs. (b) 15 individual tool pages render a local
  `faqs` array under a "Frequently Asked Questions…" heading with no FAQPage:
  animated-qr-transfer, barcode-generator, bulk-vcard-qr, error-correction-simulator,
  medical-id-qr, pakistan-payment-qr, pet-tag-qr, printed-qr-tester, qr-placement-guide,
  qr-safety-checker, qr-splitter-scanner, qr-sticker-sheet-printer, utm-builder,
  wifi-qr-code-generator, wifi-sign-generator. (c) `/regional-payment-qr` and
  `/bulk-vcard-generator` are one-line re-exports of the pakistan-payment-qr and
  bulk-vcard-qr pages, so they inherit (b)'s fix automatically.
- **E-024 — Duplicate-content page pairs. CONFIRMED (crawl + code).**
  `/pakistan-payment-qr` and `/regional-payment-qr` serve the identical component with
  the identical title "Regional Payment QR Generator | QR Studio", each
  self-canonical. `/bulk-vcard-generator` and `/bulk-vcard-qr` likewise ("Bulk vCard
  QR Code Generator | QR Studio"). Both pairs are re-export files
  (`export { default } from '../…/page'`). Consolidation is a Phase 2 decision —
  untouched in this run.
- **E-025 — AdSlot placeholder text is NOT visible to sighted users. CONFIRMED.**
  `src/components/ads/AdSlot.tsx:296` renders `<span className="sr-only">Advertisement
  space reserved</span>` — screen-reader-only. Served homepage HTML (2026-11-17)
  confirms the string occurs only inside that sr-only span. What a sighted visitor
  sees when no ad loads is a small "Advertisement" caption above an empty
  fixed-height box (min-height reserved — the CLS protection). Per the run's rules the
  label is therefore treated as non-visible: **no code change** (see DECISIONS D-001).
  Whether the empty box should exist at all before ads are live is a Phase 9 question.
- **E-026 — Internal content-audit gate. CONFIRMED (code).** `src/content/audit.ts`
  (`auditVerdict`) gates, per content-family URL: meta robots index/follow,
  BreadcrumbList/WebPage JSON-LD emission, and AdSlot eligibility. Sitemap family
  sections are built from the `getApproved*` data functions. This is an existing
  internal quality gate from the Oct-19 content program; it was mapped, not modified.
- **E-027 — Subdomain routing. CONFIRMED (code, `src/proxy.ts`).** One Next.js app:
  the proxy rewrites `invoicegenerator.freeqrcode.tools` → `/invoice-site/*` and
  `imageresizer.freeqrcode.tools` → `/imageresizer-site/*` (with a static-asset guard
  and three invoice tool-path exceptions), and sets a CSP header (deliberately
  nonce-less for static prerendering — documented in the file). robots.txt and
  sitemap.xml bypass the proxy matcher.
- **E-028 — Blog articles carry future dates. CONFIRMED (code), impact UNVERIFIED.**
  Batch article files (e.g. `src/lib/pages/Batch132.ts`) set `publishedAt` in **2027**
  (the 404-error article: '2027-07-27'); these dates surface in article metadata
  (publishedTime) and on-page bylines on pages that are live and earning impressions
  in 2026.
- **E-029 — Scan-guide title mechanics. CONFIRMED (code).** `src/app/scan-guide/[slug]/page.tsx`
  sets `<title>` from `entry.title`; the root layout template appends " | QR Studio"
  (12 chars). The visible H1 is derived from the title's pre-colon segment
  (`src/content/families/scan-guide.ts` `deriveH1`). Pre-change served titles for the
  six GSC-named guides (E-007): 64–77 chars — truncated in SERPs. Any title edit that
  keeps the pre-colon segment byte-identical provably leaves the H1 unchanged.
- **E-030 — BreadcrumbList coverage gap. CONFIRMED (code).** 253 main-site page files
  render the shared `<Breadcrumbs>` component; only 15 emit `BreadcrumbJsonLd`.
  Imageresizer emits BreadcrumbList in its schema builders; content families emit it
  (audit-gated, E-026). A single-point fix inside the shared component is possible but
  would double-emit on the 15 pages that already have it — deferred to Phase 4 with a
  dedupe requirement (DECISIONS D-005). Not a homepage issue: none of the three tool
  homepages renders a breadcrumb trail.

## E. Verification of this run's changes (2026-11-17)

- **E-031 — Test suite. CONFIRMED.** `npm run test:run` (vitest): **374/374 tests
  passed, 25 files** — identical to the pre-change baseline.
- **E-032 — Typecheck + lint. CONFIRMED.** `tsc --noEmit` exit 0, zero errors.
  ESLint on all 22 changed files: **0 errors** (63 warnings, all pre-existing
  patterns — unused vars, `<img>`, a pre-existing `window.location` — none on added
  lines).
- **E-033 — Production build + local serve check. CONFIRMED (2026-11-17).**
  `npm run build` exit **0** (full route table generated). `next start` serve check
  (57 assertions, all PASS): homepage serves the new 51-char title, 144-char
  description, exactly 1 H1, "All 5 countries" (no "+40 more"), corrected
  payment/label card text (no "Dymo"); the five edited scan guides serve titles of
  55/61/48/58/57 chars with H1s byte-identical to the pre-change H1s and
  descriptions ≤146 chars; fix-qr-camera-permission serves the new 145-char
  description with title/H1 unchanged; the blog 404 article serves the 54-char
  absolute meta title with the editorial H1 unchanged; FAQPage JSON-LD is present
  in served HTML on /wifi-qr-code-generator, /pakistan-payment-qr,
  /qr-splitter-scanner, /upi-qr-code-generator, /payment-qr/brazil-pix-emv,
  /regional-payment-qr, /bulk-vcard-generator, /bulk-vcard-qr,
  /whatsapp-qr/pakistan and /qr-labels/avery-5160 (the two re-export pages inherit
  it, as designed); **every JSON-LD block on every checked page parses as valid
  JSON**. Visible content is otherwise unchanged — the only body-text differences
  are the intended C-002/C-003 corrections.
