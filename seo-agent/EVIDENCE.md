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

## Section D — Indexing Fix Steps 1–3 (2026-11-17)

Source: owner-provided Coverage drilldowns, copied verbatim to
`seo-agent/input/crawled-not-indexed/` and `seo-agent/input/discovered-not-indexed/`
(Chart.csv, Table.csv, Metadata.csv each). Tooling: `tools/audit.py` (polite
fetcher, global 2 req/s, UA `QRStudio-SEOAudit/1.0`, robots Disallow prefixes
honoured) and `tools/similarity.py`. Outputs in `seo-agent/output/`.

- **E-034 — Drilldown inputs verified.** Crawled Table = **686 URLs**;
  Discovered Table = **170 URLs**, **all with Last crawled = 1970-01-01**
  (never crawled); the two sets share **zero** URLs; total **856**. Last-crawled
  clusters in the crawled set: **Oct 19–20 = 310** (blog 237, scan-guide 19,
  glossary 15, industries 12), **Oct 28–29 = 208** (blog 110, root 98),
  Nov 6–9 = 73. Drilldown timelines: "Discovered" peaked at **283 on
  2026-10-20**; "Crawled" reached its full 686 by 2026-11-10. (CONFIRMED —
  parsed from the owner's files.)
- **E-035 — Step 1 audit: the 856 are technically clean today.** All **856/856
  return HTTP 200** with no redirect; canonical is self-referencing on
  **852/856** and every canonical target returns 200 (exceptions: the 3 asset
  files + /qr-image-metadata-auditor, E-046); meta robots is "index, follow" on
  838 and absent (default index) on 18; **X-Robots-Tag is absent on all 2,123
  fetched URLs**; robots.txt blocks none of them; median main-content words
  **800** in raw (initial) HTML; H1 count = 1 on 821. JSON-LD parses on every
  page that carries it (0 invalid). Source: `output/audit.csv`, `output/graph.csv`.
  (CONFIRMED for 2026-11-17; says nothing about October — see E-011/E-012.)
- **E-036 — Googlebot-UA pass: no UA-based difference.** 856/856 identical
  status; title/canonical/robots identical after reclassification below. Five
  URLs initially diffed on title only (the 404-error blog post + fire-tablet,
  honor, oppo, realme scan guides) — these are exactly the Phase 0 metadata
  changes: a normal-UA fetch proves production **now serves the new titles**,
  i.e. **the `seo/metadata-faq-schema` batch was merged and deployed between
  the Phase 0 baseline crawl and this pass (2026-11-17)**. With those excluded,
  googlebot_diff = "none" for all 856. Same caveat as E-019: both passes come
  from one datacenter IP; network-keyed bot handling cannot be excluded.
  (CONFIRMED.)
- **E-037 — Sitemap audit, current state.** 10 sections, **2,121 entries /
  2,120 unique**; the only duplicate is `/bulk-vcard-qr` (E-017, still
  present); every entry returns 200, is canonical and indexable today; **no**
  asset/fragment entries. Lastmod: only blog §5 carries it — **1,571 entries
  share 2026-10-05** (a batch date); 530 entries have none. Section counts:
  0:16, 1:128, 2:61, 3:32, 4:30, 5:1591, 6:166, 7:13, 8:23, 9:61. Source:
  `output/sitemap-urls.csv`. (CONFIRMED.)
- **E-038 — Link graph: shallow, thinly endorsed, no orphans.** BFS over the
  2,123-URL graph: **845 of 853 pages at click depth ≤ 2**; the 8 `/templates`
  pages are the only depth-3 pages; median inlinks across the 856 = **2**
  (610 of 856 have 1–2); the only zero-inlink URLs are the 3 assets (E-045).
  All **170 discovered URLs are in the sitemap** (170/170) and linked
  (162 at depth 2, 8 at depth 1) yet have never been crawled. In-sitemap for
  the 856 overall: **853/856**. Sources: `output/graph.csv`, `output/outlinks.json`.
  (CONFIRMED.)
- **E-039 — Server behaviour gives no rationing excuse today.** TTFB over
  2,123 fetches (through the sandbox proxy, so inflated): median **0.66 s**,
  p90 0.94 s, max 1.87 s; only 6 of the 856 exceed 1.5 s. Across ~3,000 audit
  fetches **zero 5xx and zero 429** were observed. Historical (October)
  behaviour is unknowable from here — Crawl Stats would settle it. (CONFIRMED
  for today; October UNVERIFIED.)
- **E-040 — Near-duplication is extreme and blog-specific.** Word-5-shingle
  Jaccard within families over the full corpus: **19,381 pairs ≥ 0.5; 1,279
  pairs ≥ 0.8; 88 pairs ≥ 0.9**. Blog clusters (≥1 member in the 856):
  **37 clusters covering 406 pages at 0.8**; 30 clusters at 0.9. Root family:
  2 clusters / 4 pages. All other families: **zero** pairs ≥ 0.5 involving a
  drilldown page. Worst pairs: `qr-mistakes-clinics-avoid` ↔
  `qr-mistakes-veterinary-clinics-avoid` = **1.00** (identical text, topic noun
  swapped); `measuring-qr-results-for-clinics` ↔ veterinary variant = 1.00;
  coated/uncoated paper durability = 0.96; floor-vinyl/vinyl label cost =
  0.95. Of the 856: max-similarity ≥0.9 → 49 pages; 0.8–0.9 → 66; median
  max-sim crawled 0.57 vs discovered 0.30; blog median 0.60 vs root 0.04 and
  guides/glossary ≈ 0.02–0.05. Sources: `output/similarity-pairs.csv`,
  `output/similarity.md`, `output/unique-text.csv`. (CONFIRMED.)
- **E-041 — YMYL: 213 flagged; sampled pages unsourced and undisclaimed.**
  Word-boundary screening (slug + opening content) flags **213 of 856**
  (medical 74, financial 52, government 34, legal 27, donations 23, insurance
  21, tax 21, immigration 9, elections 6). (An earlier substring match
  over-flagged 560 — e.g. "tax" inside "taxi" — and was discarded; the 213
  figure is the corrected one.) Manual sample of **26 topical pages**
  (`output/ymyl-sample.md`): **0 of 26 carry any disclaimer signal**;
  **15 of 26 carry no source signal at all**, and present signals are
  passing mentions, not verifiable citations. (CONFIRMED for the sample;
  the 213 count is a screening class, not a per-page verdict.)
- **E-042 — Demand vacuum + PROTECT set.** Only **410 of 856** appear in the
  Performance export at all; only **38 have clicks > 0**; **280 meet the
  PROTECT rule** (clicks > 0, or impressions ≥ 15, or position ≤ 20 with
  impressions > 0) — **all 280 are in the crawled set** (a never-crawled
  page cannot have impressions, consistent). 607 of 856 score demand ≤ 1 on
  the documented mapping (`output/scores-README.md`); export absence is
  labelled, not treated as zero (A-002). Source: `output/scores.csv`.
  (CONFIRMED within export limits.)
- **E-043 — Twin test: per-pair duplicate triage is NOT the dominant
  mechanism.** Of 1,279 pairs ≥ 0.8: 182 have both members in the 856;
  **481 have the twin outside the 856 and earning impressions**; 616 have
  the twin outside and absent from the export (status unknown — indexed
  without window impressions, or in another coverage bucket). Within the
  856, pages **with** a ≥0.8 twin earn impressions at **53%** (61/115) vs
  **47%** (349/741) for pages without — having a near-twin does not predict
  exclusion. Duplication is real (E-040) but operates at site/family level,
  not pair level. (CONFIRMED within export limits; see DIAGNOSIS H1.)
- **E-044 — robots.txt did not change in the collapse window; sitemap.ts
  did.** GitHub API (list_commits, path-filtered): `src/app/robots.ts`
  (robots is generated; there is no public/robots.txt) was last touched
  **2026-10-18** (`cbdae5b`) and 2026-10-15 — **no commits Oct 19 – Nov 17**.
  `src/app/sitemap.ts` has commits on **Oct 19 (×3)** and **Oct 27 (×2,
  13:42 + 13:47 UTC)** — the day before the impressions cliff (E-002).
  Current robots.txt: allow-all with Disallow /api/ /r/ /dashboard/ /card/
  + sitemap reference. http→https is a 308; **www→apex is still a 307**
  (E-014 rechecked 2026-11-17). (CONFIRMED for history via API; the Oct-27
  sitemap change is a correlation, not a proven cause.)
- **E-045 — The 3 non-page "URLs" are assets behaving correctly.**
  `/_next/static/media/*.woff2` (×2) serve `font/woff2`; `/manifest.webmanifest`
  serves `application/manifest+json`; all 200. They are **not in the sitemap**
  and have **zero <a> inlinks** — Google discovered them via resource
  references (font preload / manifest link), and their presence in a
  "Crawled" report is a classification artefact, not a site defect.
  (CONFIRMED.)
- **E-046 — Single-page defect: /qr-image-metadata-auditor has no canonical.**
  It returns 200, is in sitemap §1, and serves **no canonical link at all**
  (the only page among the 856 in this state; 15 glossary pages omit meta
  robots, which defaults to index,follow and is not a defect). One-page
  fix candidate for a later approved step; not changed in this run.
  (CONFIRMED.)
- **E-047 — Rendered-DOM sample: environment-blocked, substituted.**
  Playwright Chromium cannot egress through this sandbox's proxy
  (ERR_TUNNEL_CONNECTION_FAILED for hostname and IP-literal forms), so the
  raw-vs-rendered comparison on the 44-URL stratified sample
  (`output/render-sample-urls.txt`) could not run here; `output/render-sample.csv`
  records the block explicitly rather than data. Substitute evidence: main
  content was extracted from **raw HTML with no JS executed** for all 856
  (median 800 words, E-035) and the Phase 0 repo map confirms SSG
  prerendering for all families — content is not JS-dependent. The rendered
  check itself remains **UNVERIFIED-in-this-environment**.
- **E-048 — Score distribution (rubric in output/scores-README.md).**
  853 pages scored (3 assets unscored): total /25 — **min 12, median 19,
  max 24**; bands 19–25 = 459 pages, 14–18 = 392, 9–13 = 2. Totals compress
  at the top because technical_health = 5 on 847/853; discrimination comes
  from uniqueness (5 on 398 pages, 0 on 7), demand and unique_value.
  **Totals must not be used as the sole Step 4 sort key.** (CONFIRMED as
  computed; the rubric's heuristic components are proxies — A-009.)
- **E-049 — Preview/staging indexability: UNVERIFIED.** Code search finds
  **no `vercel.app` references** and **no VERCEL_ENV-based noindex logic**
  in `src/app/robots.ts` or `src/proxy.ts`. Whether live Vercel preview
  deployments are publicly indexable could not be tested from this
  environment. (Code check CONFIRMED-negative; live behaviour UNVERIFIED.)
- **E-050 — Step 4 classification of the 856 (2026-11-17, owner-approved).**
  `output/url-actions.csv` (856 rows, classifier `tools/step4_classify.py`,
  workings `output/step4-workings.json`, report `STEP4-REPORT.md`):
  KEEP-INDEX-READY 431, PROTECT 191, IMPROVE 144, REMOVE 87,
  ASSET-UTILITY 3, CONSOLIDATE 0. Independently re-verified: URL set
  identical to the two input Table.csv files; 0 PROTECT pages in
  CONSOLIDATE/REMOVE; 0 clicks>0 in REMOVE; class/action vocabularies
  exact. Lists only — nothing applied.
- **E-051 — The two duplication failure modes never coincide inside the
  856.** Within-set pairs ≥0.8 (22 union-find groups, 97 pages) are
  noun-swap template siblings (different promised topics); the 10
  slug-equivalent same-topic groups have content similarity <0.5
  (independently templated bodies). The only ≥0.95 verbatim pairs with
  both feet visible straddle the set boundary: /bulk-vcard-qr ↔ indexed
  /bulk-vcard-generator and /regional-payment-qr ↔ indexed
  /pakistan-payment-qr (both 1.00). Hence CONSOLIDATE = 0 under the
  brief's rule (≥0.8 AND truly equivalent), and the consolidation
  opportunity is an extension decision, not an in-set action.
- **E-052 — YMYL re-screen of all 213 flagged pages (R-012 executed).**
  Full-content signal scan with a corroborated named-authority bar:
  SOURCED 24, UNSOURCED-ADVICE 145, MENTION-OR-TOOL 44. By class:
  unsourced → REMOVE 26 / IMPROVE 53 / PROTECT 66; sourced → KEEP 13 /
  IMPROVE 4 / PROTECT 7 / REMOVE 0; mention-or-tool → KEEP 38 /
  IMPROVE 6. Agreement with the E-041 sample's looser signal scan:
  17/26, with all 9 disagreements on PROTECT pages (no outcome change).

- **E-053 — Step 5 base and sync (2026-11-17).** Remote main head =
  `532177e72de0ccb3433fe7e53674062ebb8a270b` — "Merge pull request #6
  from MadiWebDev/seo/metadata-faq-schema" (2026-11-17T10:00:53Z), i.e.
  the Phase 0 branch merged on top of `462c0bb9`. Tree spot-check:
  `src/app/page.tsx` byte-identical to the remote main copy (SHA
  dbe707ab…). www-redirect mechanism search: **no www redirect exists
  in src/proxy.ts, next.config.ts or vercel.json** — the production
  307 (E-014) is produced outside the repo, most plausibly the hosting
  platform's domain settings (which platform setting exactly:
  UNVERIFIED from here). (CONFIRMED for repo state.)
- **E-054 — Indexing policy module.** `src/lib/seo/indexing-policy.ts`
  generated from `output/url-actions.csv` by
  `seo-agent/tools/generate_policy.py`: 856 classified paths,
  REMOVED_PATHS = 87 (85 /blog/*, 2 /industries/*). A vitest guard pins
  the module's REMOVE set and full classification to the CSV exactly,
  so the two can never drift silently. (CONFIRMED, local test run.)
- **E-055 — Sitemap before/after (Step 5 Commit A).** Generator output
  vs the live audit capture (E-037): §0 16→16, §1 128→127
  (−1: the duplicated /bulk-vcard-qr, E-017 — it now appears exactly
  once, in §3), §2 61→61, §3 32→32, §4 30→30, §5 1,591→1,506
  (−85 REMOVE posts), §6 166→164 (−2 REMOVE industries), §7 13→13,
  §8 23→23, §9 61→61. **Total 2,121→2,033.** Blog lastmod now comes
  only from each post's stored updatedAt/publishedAt; the fabricated
  shared fallback date ('2026-10-01') in the old code is gone.
  (CONFIRMED, generator + served-output counts identical.)
- **E-056 — Commit A verification (local, 2026-11-17).** vitest
  384/384 (374 baseline + 10 new policy guards); tsc exit 0; ESLint
  0 errors on all changed files (2 warnings, both pre-existing in
  untouched code); content:audit 1757/1757; production build exit 0.
  Serve check on the A build: all 10 sitemap sections 200 with the
  E-055 counts, 0 duplicates, 0 REMOVE URLs; /qr-image-metadata-auditor
  serves its canonical (E-046 fixed); sampled REMOVE pages still 200
  (removals inactive in A); homepage serves the new /templates hub
  card; /industries hub and /sitemap-page contain 0 links to removed
  URLs; Host www.freeqrcode.tools → 308 to the apex with path+query
  preserved; both subdomain homepages 200. (CONFIRMED locally;
  production behaviour after deploy is the owner's Step 6 check.)
- **E-057 — In-body link remainder = 0.** Two independent methods.
  (1) Full-text scan of every surviving blog article's
  content/FAQ/howTo fields and every surviving family entry's content
  field for the 87 removed paths (slug-boundary-aware): **0 links**.
  (2) Accounting of all 181 inlinks the 87 receive in the audit graph
  (output/outlinks.json): 87 self-references (die with the pages),
  85 from /sitemap-page's article list (filtered in Commit A),
  3 from industries internalLinks (render-filtered in A), 2 from
  blog-hub cards (filtered in A), 2 from the /industries hub
  (filtered in A), 2 from other removed pages (die with them). No
  uneditable in-body remainder exists. (CONFIRMED for code/data
  surfaces in the repo; client-side-only surfaces are R-015.)
- **E-058 — Commit B verification (local, 2026-11-17).** Build exit 0;
  vitest 386/386 on the A+B tree (12 policy guards incl. 410 tests).
  Serve check: **87/87 REMOVE paths answer 410** with the removal
  body; KEEP/PROTECT/IMPROVE samples 200; sitemap §5 still serves
  1,506; invoice + imageresizer homepages 200; a removed apex path
  requested on the invoice host answers 404 (that site's own routing),
  not 410 — the subdomain sites are unaffected by construction; the
  www 308 remains intact. (CONFIRMED locally.)
