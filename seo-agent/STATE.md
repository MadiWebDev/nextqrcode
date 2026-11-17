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
