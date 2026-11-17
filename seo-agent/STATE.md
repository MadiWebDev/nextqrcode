# STATE.md — SEO program state, freeqrcode.tools

**Last updated:** 2026-11-17 (Phase 0 + metadata/schema batch, run 1).
**Current phase:** Phase 0 complete; the Phase 3B/4A/4B subset authorised for this
run (metadata + FAQ schema only) is implemented, verified and **staged, not
pushed**. Phase 1 diagnosis is prepared but **not concluded** — it is blocked on
the owner data in QUESTIONS.md (#1–3 especially).
**Remote main at run start:** `462c0bb9` (verified via GitHub API before editing).
**Staging:** `~/workspace/seo-push/` — three commits for branch
`seo/metadata-faq-schema` (see CHANGELOG.md for contents). Nothing was pushed or
deployed by this run; production still serves the pre-change state.

## Where things stand, in one paragraph

The site has 2,121 sitemap URLs and earned 69 clicks / 7,122 impressions in the
GSC window Oct 4 – Nov 15 (E-001) before impressions fell off a one-day cliff on
Oct 28 and stayed at ~zero (E-002). Today the site is technically healthy on every
check this run could perform (E-016, E-019), so the collapse is a historical event
whose cause is not yet proven: the leading pair is a technical break in the
Oct 28 – Nov 12 deploy-failure window (incl. a sitemap-index 404, E-011/E-012)
plus a scaled templated-content footprint that earns little re-indexing urgency
(H1+H2/H3, PHASE1-PREP.md). This run fixed what was provably wrong and safe to
touch without indexability changes: homepage metadata + false on-page counts,
six snippet rewrites on pages that rank but don't get clicked, and FAQPage
schema for every page that renders FAQs without it (35 URLs). No rankings claims
are made anywhere; success is measured in indexed pages, impressions, clicks and
tool completions.

## Repository map (verified 2026-11-17)

One Next.js 16 app (`MadiWebDev/nextqrcode`, main), three public sites routed by
`src/proxy.ts` (E-027): apex → main QR site; `invoicegenerator.freeqrcode.tools`
→ `src/app/invoice-site/`; `imageresizer.freeqrcode.tools` →
`src/app/imageresizer-site/`. Static prerendering throughout; the CSP header is
deliberately nonce-less (documented in proxy.ts).

| Route family | Where it lives | Rendering / data | Metadata + schema source | Sitemap |
|---|---|---|---|---|
| Core pages (home, about, tools hub…) | `src/app/*/page.tsx`, home = `src/app/page.tsx` + `src/components/home/HomePage.tsx` | Static; home content via i18n messages + data modules | Per-page `metadata`; root layout adds Organization + WebSite JSON-LD to **every** page incl. subdomains | §0 (16) |
| Tool pages (~190) | `src/app/<slug>/page.tsx` | Static; many client components | Per-page metadata; schema varies per page (this run normalised FAQPage, C-007) | §1 (128) + §2 generators (61) + §3 bulk (32) + §4 suites (30) |
| QR-type / landing pages | bitcoin, upi, url, vcard, whatsapp + `whatsapp-qr/[slug]`, `payment-qr/[slug]`, `qr-labels/[slug]`, `[locale]/text` | `src/components/LandingGenerator.tsx` over `src/lib/landingData.ts` | LandingGenerator metadata; FAQPage added this run (C-006) | §2/§7 (13 = 5 WhatsApp + 3 schemes + 5 labels) |
| Blog (1,591) | `src/app/blog/[slug]/page.tsx` | `src/lib/articles.ts` = ARTICLES + NEW_ARTICLES batches (`src/lib/pages/Batch*.ts`, positional `art()` helper) | generateMetadata from article fields (+ `metaTitle`/`metaDescription` overrides added this run, C-005); TechArticle + FAQPage from article data | §5 (1,591) |
| Content families (166) | `src/app/{scan-guide,glossary,industries,size-guide,templates}/[slug]/page.tsx` | Adapters in `src/content/families/*` over `src/data/*`; `dynamicParams=false` | `buildFamilyMetadata`; FAQPage + (audit-gated) BreadcrumbList/WebPage from the same entry data | §6 (glossary 40 + industries 40 + scan 30 + size 26 + templates 30) |
| Invoice site (23) | `src/app/invoice-site/` | Static; `SeoLanding` component for landing pages | Own layout/metadata; homepage @graph (SoftwareApplication price 0, WebSite, FAQPage); SeoLanding emits FAQPage from rendered faqs | §8 (23) |
| Imageresizer site (61) | `src/app/imageresizer-site/` | 38 tools + 13 guides + 10 categories over `src/lib/imageresizer/*` | `homeJsonLd`/`toolJsonLd` builders (WebApplication price 0, guarded FAQPage, BreadcrumbList) | §9 (61) |

Cross-cutting facts:

- **Canonicals:** `metadataBase` = apex origin in the root layout; pages are
  self-canonical by default (crawl found 0 non-self canonicals, E-016).
- **Robots:** `src/app/robots.ts` (allow-all + sitemap reference; proxy bypasses
  it). Per-page robots for family/blog pages pass through the internal
  `auditVerdict()` gate (E-026) — an existing Oct-19 content-program mechanism,
  mapped, not modified.
- **Sitemap:** `generateSitemaps()` ids 0–9 in `src/app/sitemap.ts`; the public
  index is the hand-maintained static `public/sitemap.xml` — **any new section
  must be added to both** (E-017).
- **Counts in sitemap vs data:** reconcile exactly (E-017/E-020) — 2,121 entries,
  2,120 unique URLs (`/bulk-vcard-qr` listed twice).
- **Breadcrumbs:** shared `<Breadcrumbs>` component in 253 page files;
  BreadcrumbJsonLd in only 15 (E-030) — deferred fix, D-005.
- **Verification:** GSC meta value is a filename, served from a Vercel env var
  (E-015) — owner action, QUESTIONS #11.
- **Ads:** `src/components/ads/AdSlot.tsx` reserves fixed-height space; the
  "Advertisement space reserved" string is screen-reader-only (E-025).

## Verification of this run (2026-11-17)

- vitest: **374/374 passed** (25 files) — same as pre-change baseline (E-031).
- tsc `--noEmit`: exit 0. ESLint on all 22 changed files: **0 errors** (E-032).
- Production build: exit **0**. Local serve check: **57/57 assertions PASS**
  (titles/descriptions as designed, H1s byte-identical, FAQPage present in served
  HTML on all sampled schema pages incl. the inherited re-exports, all JSON-LD
  parses) — E-033.

## Open items / next steps (in order)

1. **Owner:** answer QUESTIONS.md #1–3 (Indexing reasons, Manual Actions/Security
   confirmation, Crawl Stats) → Phase 1 verdicts can be finalised.
2. **Parent/owner:** push the three staged commits to `seo/metadata-faq-schema`
   (approval taps), review, merge, deploy; record the deploy date in
   CHANGELOG.md and annotate GSC.
3. **Phase 2 (gated, needs owner approval):** indexability decisions — duplicate
   pairs (E-024), www 307 → permanent (E-014), verification-meta fix (E-015),
   YMYL risk-class review (E-008) **before** any pruning discussion.
4. **Follow-ups noted, not scheduled:** non-English locale hub-card corrections
   (R-007); BreadcrumbList dedupe fix (D-005); scan-guide `metaTitle` split
   (D-002); blog future `publishedAt` dates (E-028) — decide policy in Phase 2/3.

---

## Addendum — 2026-11-17, Indexing Fix Steps 1–3 (this run)

**Steps 1–3 are COMPLETE. Step 4 has NOT started and awaits the site owner's
approval of the diagnosis** (`seo-agent/DIAGNOSIS.md`), per the Indexing Fix
brief's stop rule. No code, sitemap, robots, redirect or indexability change
was made in this run; no `url-actions.csv` was produced.

- **Step 1 (technical audit) — done.** All 856 drilldown URLs audited
  (`output/audit.csv`): 856/856 HTTP 200 today, zero noindex, self-canonical
  except the 3 assets + /qr-image-metadata-auditor (E-046); 853/856 in the
  sitemap (the 3 exceptions are asset files, E-045); link graph over 2,123
  URLs (845/853 pages at depth ≤ 2, median 2 inlinks, E-038); Googlebot-UA
  pass clean (E-036); sitemap audit (E-037); robots history clean, sitemap.ts
  changed Oct 27 (E-044). Rendered-DOM sample environment-blocked and
  substituted (E-047).
- **Step 2 (duplication + scoring) — done.** 1,279 near-duplicate pairs
  ≥ 0.8 (blog: 37 clusters / 406 pages); all 856 scored (`output/scores.csv`
  + `scores-README.md`); PROTECT = 280 pages (E-042); YMYL = 213 flagged,
  26-page sample: 0 disclaimers, 15/26 no sourcing (E-041).
- **Step 3 (diagnosis) — done.** `seo-agent/DIAGNOSIS.md`: H1 LIKELY
  (site-level form; per-pair form rejected by the twin test, E-043), H2
  LIKELY as mechanism, H3 REJECTED as current cause (historical break stays
  Phase 0's LIKELY), H4 REJECTED (weak form = hypothesis), H5 PARTIALLY
  CONFIRMED, H6 UNVERIFIED (owner-only), H7 REJECTED.
- **Discovery during this run:** the Phase 0 metadata batch
  (`seo/metadata-faq-schema`, head `87048c14`) is **live on production** —
  merged + deployed between the Phase 0 baseline crawl and the Googlebot
  pass on 2026-11-17 (E-036). Production now serves the new titles on the
  5 changed pages. Recommend the owner annotate the deploy date in GSC.
- **Next action (owner):** read DIAGNOSIS.md and approve / amend / reject
  the diagnosis. Only then does Step 4 (per-URL classification into
  url-actions.csv) begin. Still-missing inputs are re-ordered at the end of
  DIAGNOSIS.md (Manual Actions confirmation is #1).

---

## Addendum — 2026-11-17, Indexing Fix Step 4 (this run)

**Step 4 is COMPLETE; Step 5 awaits the owner's approval of the lists.**
The owner approved the diagnosis and Step 4 began; it produced lists
only — no code, sitemap, robots, redirect or indexability change.

- **Classification (`output/url-actions.csv`, E-050):** KEEP-INDEX-READY
  431, PROTECT 191 (+89 protect pages inside KEEP with status recorded
  = 280 gated, E-042), IMPROVE 144, REMOVE 87, ASSET-UTILITY 3,
  CONSOLIDATE 0. All binding verifications pass (0 PROTECT in
  CONSOLIDATE/REMOVE; 0 clicks>0 in REMOVE).
- **CONSOLIDATE = 0 is a finding, not a gap (E-051, D-014):** in-set
  ≥0.8 pairs are noun-swap siblings; same-topic slug twins have
  dissimilar bodies; the two verbatim pairs straddle the set boundary
  (targets indexed) and are recommended as a separately approved
  Step 5 extension.
- **YMYL re-screen executed on all 213 (E-052):** SOURCED 24,
  UNSOURCED-ADVICE 145, MENTION-OR-TOOL 44; unsourced earners (66)
  are the largest PROTECT-deferred sub-list.
- **Deliverables:** `seo-agent/STEP4-REPORT.md` (rules, counts,
  clusters, examples, red-team, approvals), `output/url-actions.csv`,
  `tools/step4_classify.py`, `output/step4-workings.json`.
- **Next action (owner):** approve the lists as a whole or with line
  vetoes; decide the PROTECT sub-lists and the consolidation extension
  separately (QUESTIONS Step 4 addendum). H6 (Manual Actions) remains
  UNVERIFIED and is still the #1 background blocker.

---

## Addendum — 2026-11-17, Indexing Fix Step 5 (this run)

**Step 5 is BUILT, VERIFIED and STAGED — not pushed.** The owner
approved the Step 4 lists and Step 5 on 2026-11-17. Work is staged in
`~/workspace/seo-push/step5-{0,A,B}/` (each with a NUL-delimited
manifest.txt) for branch **`seo/step5-indexing-controls`**, based on
remote main **`532177e7`** (the merge of seo/metadata-faq-schema,
verified via the GitHub API; tree spot-checked byte-identical, E-053).

- **Commit 0 — evidence:** the Step 1–4 seo-agent outputs not yet on
  main (input/, output/, new tools/, DIAGNOSIS.md, STEP4-REPORT.md,
  state-file updates incl. this addendum). Excluded:
  `output/content/` (17 MB extracted-text corpus, reproducible from
  tools/audit.py; cannot travel via the snapshot push channel).
- **Commit A — indexing controls, removals NOT active (safe to merge
  first):** the generated policy module
  `src/lib/seo/indexing-policy.ts` (856 classified / 87 REMOVE,
  E-054) + generator; sitemap filtered through the policy in every
  apex section (2,121 → 2,033 URLs, E-055) with honest blog lastmod;
  /qr-image-metadata-auditor canonical fixed via a new layout.tsx
  (E-046 closed); www → apex 308 in the proxy (D-018, R-014);
  internal-link filtering on every computed surface (blog hub,
  homepage cards + count, HTML sitemap, 5 family hubs, industries +
  scan-guide related links, LandingGenerator related types) — the
  in-body remainder is **0** (E-057); homepage gains the /templates
  hub card so template pages sit at depth 2 (D-020); 10 CI guards.
  Verified: vitest 384/384, tsc 0, ESLint 0 errors, content:audit
  1757/1757, build exit 0, full serve check green (E-056).
- **Commit B — removal activation (2 files: src/proxy.ts + guard
  tests). DO NOT MERGE** until the fresh uncapped Performance export
  re-verifies the 87 (QUESTIONS Step 5 addendum item 3). Verified
  locally: 87/87 answer a real 410, everything else untouched
  (E-058); full tree A+B: vitest 386/386.
- **Merge order:** 0 → A → deploy → observe (Step 6 windows) →
  fresh export → B. IMPROVE rewrites (144), the PROTECT deferred
  sub-lists and the two boundary 301s remain separate approvals and
  were not touched.
