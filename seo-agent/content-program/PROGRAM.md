# Full-Site Content Update Program — freeqrcode.tools suite

**Owner order (2026-11-25):** update ALL pages listed in the sitemap / present in
the application to the AdSense-approval content standard demonstrated by the
exemplar article (`~/workspace/your_files/how-to-create-a-wifi-qr-code.md`,
"How to Create a WiFi QR Code").

**Status:** Inventory built · Batch 1 (top 10 REWRITE articles) rewritten and
gated · Batches 2–172 queued in `QUEUE.csv`.

---

## 1. The standard (from the exemplar)

For **article pages** (blog posts, guides):

- **2,200–3,000 words** total (body + FAQs), as long as it takes to be genuinely
  useful — no padding, no repetition, no keyword stuffing.
- Problem-first intro stating who the page is for.
- Step-by-step instructions for **our** tool, with links to the real tool pages.
- Practical, specific tips where relevant: sizes, contrast, error-correction
  levels, print resolution, testing before printing.
- Concrete real-world use cases with named settings (not abstractions).
- Common mistakes **and how to fix them**.
- Privacy & security notes that are truthful about our apps: processing happens
  in the visitor's browser, no uploads, no accounts, static QR codes never
  expire, no scan tracking. **Never invent features or statistics** — only
  verifiable claims (QR spec values, published standards, our real behaviour).
- FAQ of **6–8 real questions** (drives the FAQPage schema; structure preserved).
- Short conclusion pointing to the tool.
- **Meta title < 60 characters, meta description < 155 characters** (enforced
  per article via `META_OVERRIDES` in `src/lib/articles-seed.ts` where the H1
  or description would exceed the limits).
- H2/H3 structure (in the article corpus this is the `### N.` numbered-section
  markdown convention), short paragraphs, plain language, original wording.
- YMYL-adjacent topics (health, food safety, money, legal-adjacent): general
  information framing only, no advice beyond general information, and a short
  disclaimer line where the topic warrants it.

For **tool / generator / hub pages**: the standard's spirit — complete,
original, useful copy that helps the visitor complete the task; not a forced
2,500-word blog format.

For **sub-site pages** (invoice / imageresizer / socialcalendar / resumebuilder):
adapted per app — the content is app UI + guides; complete, original, useful;
applied last.

## 2. Inventory (INVENTORY.csv — 2,149 rows)

Built by running the site's real sitemap generator (`src/app/sitemap.ts`,
sections 0–11) and merging the Step-4 classification
(`seo-agent/output/url-actions.csv`), the indexing policy
(`src/lib/seo/indexing-policy.ts`) and the 2026-11-23 GSC Performance export.
Rebuild: `npx tsx seo-agent/tools/extract-sitemap-urls.mts` then
`python3 seo-agent/tools/build-content-inventory.py`.

**By sitemap presence:** 2,059 URLs emitted by the sitemap today + 90 classified
URLs it does not emit (87 REMOVE-410 + 3 ASSET-UTILITY).

**By type:**

| Type | Count |
|---|---:|
| Blog article | 1,591 |
| Tool page | 127 |
| Generator page | 61 |
| Sub-site page (imageresizer) | 61 |
| Industry page | 40 |
| Glossary | 40 |
| Bulk tool page | 32 |
| Suite page | 30 |
| Scan-guide | 30 |
| Template page | 30 |
| QR-size-guide | 26 |
| Sub-site page (invoice) | 23 |
| Sub-site page (resumebuilder) | 18 |
| Core page | 16 |
| Sub-site page (socialcalendar) | 8 |
| Label sheet page | 5 |
| WhatsApp country page | 5 |
| Payment scheme page | 3 |
| Classified non-sitemap URL (assets) | 3 |

**By Step-4 class:** KEEP-INDEX-READY 431 · PROTECT 191 · IMPROVE (rewrite) 144 ·
REMOVE 87 · ASSET-UTILITY 3 · unclassified 1,293 (mostly never in the Coverage
exports: the bulk of the tool/generator pages, family pages beyond the sample,
and all 110 sub-site URLs).

Note: the brief's "~2,033 URLs" was the Step-5-era sitemap count. The live
generator now emits **2,059** (blog section is 1,506 after REMOVE filtering;
sub-site sections 8–11 add 110). The inventory reflects the measured tree, not
the older figure.

## 3. Sequencing & batch plan (QUEUE.csv — 2,049 rows, batches of 12)

Treatment order fixed by the execution rules:

| Phase | Class / set | Treatment | Rows | Planned batches |
|---|---|---|---:|---|
| 1 | IMPROVE (rewrite) | Full rewrite to the standard | 144 (10 done in Batch 1, 134 queued) | 1 + 2–12 |
| 2 | KEEP-INDEX-READY | Verify-and-strengthen: fill missing sections, fix thin parts, no churn of strong content | 431 | 13–48 |
| 3 | PROTECT / NONE-DEFERRED | **Light touch only** — these earn clicks at positions 5–15; never restructure or retitle; at most add a genuinely missing FAQ/privacy note | 191 | 49–64 |
| 4 | Unclassified apex pages | Standard update (tools, generators, families, hubs) | 1,183 | 65–163 |
| 5 | Sub-site pages (sections 8–11) | Per-app adaptation | 110 | 164–172 |
| — | REMOVE-410 (87) + ASSET-UTILITY (3) | **DO NOT TOUCH** — not in the queue | 0 | — |

Within phases 1–3 the order is GSC earnings: clicks desc, impressions desc,
position asc, then Step-4 score desc. Within phase 4: sitemap section, then
earnings. Within phase 5: section, then URL.

**Total programme: 172 batches** (Batch 1 done; 171 remaining in QUEUE.csv with
`planned_batch` pre-assigned at 12 pages/batch).

## 4. Batch 1 — top 10 REWRITE articles (DONE, gated)

Selection: the 10 IMPROVE-class articles with the highest GSC earnings in the
2026-11-23 export (all 144 IMPROVE URLs were ranked clicks → impressions →
position; the top 10 all had 0 clicks, 11–13 impressions — the class earns
almost nothing yet, which is why it is rewritten first).

Each article: URL/slug preserved, FAQ schema structure preserved (3 → 7 FAQs),
category/keyword/publishedAt preserved, `updatedAt` unchanged (corpus-wide
helper constant), readTime recomputed from the real word count, meta enforced
via `META_OVERRIDES`. Word counts are content + FAQ words, measured on the
loaded article objects.

| # | Slug (batch file) | Before | After | Read | Title chars | Meta title | Meta desc |
|---|---|---:|---:|---|---:|---:|---:|
| 1 | qr-code-for-travel-agencies (Batch20) | 703 | 2,425 | 13 min | 75 | 47 | 148 |
| 2 | qr-code-for-airport-luggage (Batch24) | 732 | 2,371 | 12 min | 63 | 49 | 147 |
| 3 | kenya-mpesa-qr-code (Batch7) | 731 | 2,297 | 12 min | 59 | 48 | 148 |
| 4 | qr-code-for-car-dealerships (Batch26) | 715 | 2,220 | 12 min | 60 | 47 | 150 |
| 5 | qr-code-vs-data-matrix (Batch1) | 589 | 2,261 | 12 min | 53 | 45 | 147 |
| 6 | printing-bulk-shipping-labels-qr-codes (Batch159) | 1,082 | 2,269 | 12 min | 43 | 43 | 152 |
| 7 | qr-code-for-food-labelling (Batch8) | 716 | 2,404 | 13 min | 57 | 48 | 151 |
| 8 | how-to-print-a-qr-code-on-a-business-card (Batch115) | 1,129 | 2,342 | 12 min | 41 | 41 | 146 |
| 9 | qr-code-for-outdoor-billboards (Batch18) | 767 | 2,260 | 12 min | 59 | 47 | 147 |
| 10 | qr-code-for-hotels-and-hospitality (Batch38) | 778 | 2,251 | 12 min | 55 | 44 | 152 |

Notes per article:

- All 10 dropped the corpus's shared boilerplate tail ("Putting this into
  practice / Common mistakes / Quick checklist" — identical text across the
  corpus, a core thin-content signal) in favour of original, topic-specific
  sections.
- **qr-code-for-food-labelling** (YMYL-adjacent): rewritten on the rule
  "mandatory declarations stay on the pack; the code carries the extended
  layer", with an explicit general-information/not-legal-advice line.
- **kenya-mpesa-qr-code** (money-adjacent): no invented integration claims —
  the code carries till details for the customer to confirm; the confirmation
  screen + PIN remain the safety check; sticker-swap fraud covered with
  daily-inspection habits.
- **qr-code-for-outdoor-billboards**: leads with the honest constraint —
  drivers must never be the audience; sizing follows the one-tenth rule.
- Corpus invariants after regeneration: **1,591 articles, 1,591 unique slugs,
  slug order byte-identical** to pre-batch (`articles-meta.generated.ts`,
  `articles-sitemap-meta.generated.ts`, `loaders.generated.ts` regenerated).

**Gates:** typecheck `tsc --noEmit` clean · vitest **600/600 passed** ·
production build — see §5 · serve spot-check — see §5.

## 5. Batch 1 verification results (2026-11-25)

- **Typecheck:** `npm run typecheck` (`tsc --noEmit`) — clean, exit 0.
- **Tests:** `npm run test:run` — **600/600 passed**.
- **Production build:** `npm run build` — **exit 0**, "Generating static pages
  (2359/2359)" — page count unchanged (2,193 routes + 166 OG images).
- **Corpus invariants:** after `npx tsx scripts/generate-article-meta.ts` —
  1,591 metadata entries, 1,591 unique slugs, slug order byte-identical to
  the pre-batch list (diff-verified).
- **Serve spot-check** (`next start`, production build): 3 of 3 sampled
  rewritten articles returned **HTTP 200** with the new content present and
  the **FAQPage schema intact** carrying the new questions:
  - `/blog/qr-code-for-travel-agencies` — new §1 heading present; `<title>`
    serves the override "QR Codes for Travel Agencies: A Practical Guide".
  - `/blog/kenya-mpesa-qr-code` — "sticker swapping" section present; FAQPage
    with the sticker-swap question; override title served.
  - `/blog/qr-code-for-food-labelling` — "What must stay on the pack" section
    present; allergen FAQ in schema; override title served.
- **Staging:** `~/workspace/seo-push/content-batch1/` — 19 files (10 batch
  data files, `articles-seed.ts` overrides, 3 regenerated files, this
  programme's INVENTORY/QUEUE/PROGRAM docs, 2 inventory tools), NUL manifest
  with trailing NUL verified. Not pushed.

## 6. Working rules for every future batch

1. Edit article data in place (`src/lib/pages/Batch*.ts`, `articles-seed.ts`);
   match the `art()` schema exactly; never hand-edit `*.generated.ts`.
2. After any title/description/date change, re-run
   `npx tsx scripts/generate-article-meta.ts` and stage the regenerated files.
3. Corpus invariants are hard: 1,591 articles, slug uniqueness and order
   preserved; any exception must be reported, not silently shipped.
4. PROTECT pages: light touch only. REMOVE-410 pages: never touch.
5. Gates per batch: typecheck clean, full vitest green, production build
   exit 0 with the page count unchanged, per-article word/meta report,
   serve spot-check of a sample.
6. Stage each batch under `~/workspace/seo-push/content-batch<N>/` with a
   NUL-delimited manifest (trailing NUL). **Never push** — pushes are the
   parent agent's step, on the owner's tap.
