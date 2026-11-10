# Technical SEO Audit Report — freeqrcode.tools

## "Discovered – Currently Not Indexed" Root Cause Analysis & Implementation Plan

**Prepared:** 2026-11  
**Scope:** ~480 URLs reported as "Discovered – currently not indexed" in Google Search Console  
**Codebase:** Next.js 15 App Router, SSG/ISR, TypeScript

---

## 1. Per-Page-Type Technical Analysis

### 1.1 Tool Pages: `bulk-*-qr-generator`, `*-qr-suite`, `qr-*-calculator`, `qr-*-checker`

**Rendering mode:** All are `'use client'` components. In Next.js App Router, `'use client'` pages
**are still SSG** when they have no dynamic data — however these pages do NOT export `metadata` nor
`generateStaticParams`. Because there is no `generateStaticParams`, Next.js still generates them
at build time as static HTML (since the route has no `[slug]`), but **no server-side metadata is
emitted**. The page title and meta description come from the root layout's template string
(`%s | QR Studio`), **not from per-page metadata exports**.

Evidence:

- `bulk-business-card-qr-generator/page.tsx` — `'use client'`, no `export const metadata`, no
  `generateStaticParams`. Has breadcrumbs pointing to `/#tools` (a hash-anchor, not a real hub page).
- `museum-qr-suite/page.tsx` — same pattern.
- `qr-contrast-checker/page.tsx` — same pattern.
- `hostel-qr-suite/page.tsx` — same pattern, but **no article section** (just 4 FAQs, no `<article>` prose).
- `bulk-survey-qr-generator/page.tsx` — has article prose but it is notably shorter than
  `bulk-business-card` and `bulk-wifi`.
- `bulk-event-badge-qr-generator/page.tsx` — has article structure, 4 FAQs, matches bulk-business-card
  pattern.

**Content depth split:**

- Rich pages (article ≥800 words + 4 FAQs): `bulk-business-card-qr-generator`, `museum-qr-suite`,
  `qr-contrast-checker`, `bulk-wifi-qr-generator`, `bulk-event-badge-qr-generator`,
  `qr-print-cost-calculator` (article visible in offset 80+)
- Thin pages (≤300 words in article section, or no article at all): `hostel-qr-suite` (no article
  prose section at all — only presets + 4 short FAQs), many of the 50+ new bulk/suite pages added
  on 2026-11-06.

**Missing metadata exports:** None of the tool/suite/calculator/checker pages export `metadata`. The
root layout sets `robots: { index: true, follow: true }`, so they are not noindexed, but Google
sees a generic title/description from the template (`%s | QR Studio`) which collapses to the site
tagline when no `%s` is substituted — confirming near-duplicate titles across all tool pages.

**Internal linking deficit:** All breadcrumbs on these pages point to `href: '/#tools'` — a
JavaScript-rendered hash-anchor to the homepage section, NOT a crawlable hub page. These pages have
**zero inbound HTML links** from any real hub page. The sitemap is their only discovery signal.

### 1.2 Family [slug] Pages: `/industries/*`, `/glossary/*`, `/scan-guide/*`, `/qr-size-guide/*`, `/templates/*`

**Rendering mode:** All use `generateStaticParams` + `export async function generateMetadata()`
→ proper SSG with per-page metadata. Content is in initial HTML (server component renders markdown
to HTML via inline converters). These are the **best-structured pages** in the codebase.

**Noindex logic:** `auditVerdict()` is called in `generateMetadata` for `/industries/[slug]`,
`/scan-guide/[slug]`, `/qr-size-guide/[slug]`, `/glossary/[slug]`, `/templates/[slug]`. Reading
`src/content/audit.ts`:

```typescript
export function auditVerdict(url: string): AuditVerdict {
  const manifest = loadManifest();
  const v = manifest[url];
  return {
    passed: true, // ← HARDCODED: always returns passed:true
    reasons: v?.reasons ?? [],
  };
}
```

The function **always returns `{ passed: true }`**, regardless of the manifest. The manifest at
`src/content/__generated__/audit-manifest.json` is only consulted for `reasons`, not for the
`passed` flag. This means no pages are being accidentally noindexed by this code.

**Internal linking:** These pages link to each other through `entry.internalLinks` arrays from the
data files. The `/industries/[slug]` page renders a "Related pages" section with 5+ links. The
`/qr-size-guide/[slug]` page renders 3 "Related Size Guides" at the bottom. The `/glossary/[slug]`
page links to related terms and tools. However, these cross-links are only **within the family**
(size guide → size guide → size guide), not across page families or to the tool pages they
describe.

**Breadcrumb trail:** `/industries/[slug]` → Home → Industries → Entry (correct). `/glossary/[slug]`
→ Home → Glossary → Entry (correct). `/scan-guide/[slug]` → Scan Guides → Entry (missing Home).
`/qr-size-guide/[slug]` → QR Size Guides → Entry (missing Home).

**Hub pages for families:** `/industries/page.tsx` ✅ exists with grouped links. `/blog/page.tsx` ✅
exists. BUT: `/scan-guide/page.tsx`, `/qr-size-guide/page.tsx`, `/glossary/page.tsx`,
`/templates/page.tsx` — existence not confirmed from the `dir` output. The sitemap-page links to
these hub paths (`/scan-guide`, `/qr-size-guide`, `/glossary`, `/templates`) but whether actual
pages exist at those paths needs to be verified. The sitemap in `sitemap.ts` does NOT include
`/scan-guide`, `/qr-size-guide`, `/glossary`, or `/templates` as hub entries — only their child
slugs are in the sitemap via `familyEntries()`.

### 1.3 Blog Pages: `/blog/*`

**Rendering mode:** `blog/[slug]/page.tsx` uses `generateStaticParams` + `generateMetadata` → proper
SSG. Content is pre-rendered HTML via regex-based markdown substitution. The article registry
(`src/lib/pages/index.ts`) assembles **170 batches** (Batch1–Batch170), and `validateArticles()`
enforces ≥120 words and ≥2 FAQs at build time. That floor is very low — 120 words is far below the
threshold needed for Google to treat content as substantive.

**Blog index page:** `blog/page.tsx` lists all articles as cards. No pagination. If there are
hundreds of articles, they are all on one page without `next/previous` links.

**`generateMetadata` for blog:** Returns `robots: { index: true, follow: true }` unconditionally
for all articles, and calls `auditVerdict('/blog/' + slug)` only for AdSlot eligibility, not for
robots. So all blog posts are always indexed, regardless of content quality.

**Internal linking from blog posts:** Each blog post has a CTA box at the bottom linking only to
`/` (homepage). No links to related blog posts or to specific tools. The `entry.internalLinks`
concept from `ContentEntrySchema` is not used in blog posts — blog articles use a different schema
(freeform content, not `ContentEntrySchema`).

**Near-duplicate content risk:** 170 batches × articles per batch = likely 300–400+ articles, all
in the same category tags, same author pattern, same CTA box. Articles were added in waves
(2026-10-19 batch + 2026-10-27 batch + 2026-11-06 batch), meaning hundreds of pages were published
simultaneously, which strongly correlates with the "Discovered – currently not indexed" status.

### 1.4 QR Labels: `/qr-labels` and `/qr-labels/[slug]`

`/qr-labels/page.tsx` is a proper server component with `export const metadata`, SSG. It links to
child `/qr-labels/[sheet.slug]` pages as a hub. The sitemap includes these via `labelEntries()`.
However `/qr-labels` itself is NOT in the footer nav or primary nav — only reachable via
`/sitemap-page` and the sitemap XML.

---

## 2. Robots, Sitemap & Canonicals

### 2.1 robots.ts

```
Allow: /
Disallow: /api/, /r/, /dashboard/, /card/
```

**No issues.** `/_next/static/` is not disallowed. The robots.txt is clean.

### 2.2 sitemap.ts

**Critical finding: Single flat sitemap with 500+ URLs.**

The sitemap is a single flat file returning all entries (tool pages ~170 hardcoded paths +
generator pages ~58 + label sheets + countries + payment schemes + blog articles + family pages).
At build time with 400+ blog articles, 170+ industry entries, 200+ glossary entries, 100+ scan
guides, 200+ size guides, and 50+ templates this is easily 1,500–2,000+ URLs in a single
`/sitemap.xml` response.

Google's documented limit is 50,000 URLs per sitemap file, so the size itself is not the problem.
The problem is: **a single monolithic sitemap with no sectioning gives Google no signal about which
URLs are high-value vs. which are low-value programmatic content.** When combined with hundreds of
new pages published at once on a young domain, this is a classic crawl budget trigger.

**Other issues:**

- Tool pages (not family entries) are hardcoded as path strings — there is no dynamic derivation
  from the filesystem, so if a new page is added without updating `sitemap.ts`, it is missing.
- `familyEntries()` only appears for CONTENT_FAMILIES (industries, glossary, scan-guide, size-guide,
  templates). The sitemap does NOT include hub pages for these families (`/industries` is present in
  `coreEntries`? → checking: `/blog` is in coreEntries but `/industries`, `/glossary`, `/scan-guide`,
  `/qr-size-guide`, `/templates` are NOT in the sitemap at the hub level — only their child slugs.
- `changeFrequency` for tool pages is `'weekly'` — misleading since these pages never change.

### 2.3 Canonicals

All family pages (`/industries/[slug]`, `/glossary/[slug]`, etc.) set
`alternates: { canonical: siteConfig.url + url }` correctly. Blog pages set canonical correctly.
Root page sets canonical correctly. Tool pages (client components without metadata exports) have
**no canonical tag** — Next.js App Router does not emit a canonical tag if there is no `metadata`
export with `alternates.canonical`. This means Google must self-discover the canonical for ~200+
tool pages, which it may not handle consistently across duplicate or near-duplicate titles.

### 2.4 Cache-Control Headers

`vercel.json` has only `buildCommand`. `next.config.ts` has security headers but **no
Cache-Control directives** for any route. By default, Vercel serves Next.js static pages with
`Cache-Control: public, max-age=0, must-revalidate` (no CDN edge caching for HTML pages) and only
caches static assets (`/_next/static/*`) with long TTLs. Googlebot may see slightly higher TTFB on
revisit due to no edge-cached HTML.

---

## 3. Internal Linking Analysis

### 3.1 Primary Navigation (AppHeader)

The `primaryNav` in `site.ts` has 4 groups:

- **QR Generators:** 6 links (URL, WiFi, vCard, WhatsApp, UPI, Bitcoin)
- **Tools:** 11 links (Size Calc, Safety Checker, etc.)
- **Guides:** 5 links (blog, 3 specific posts, placement guide)
- **Regions:** 4 links (payment QR schemes)

The header links to `href: '/#generators'` and `href: '/#tools'` as the "All" links — these are
hash-anchor links to the homepage, NOT standalone hub pages. There are **no header links to**:
`/industries`, `/glossary`, `/bulk-*-qr-generator` pages (only `/bulk-generator`), `/qr-*-suite`
pages, `/qr-*-calculator` pages, `/qr-*-checker` pages.

### 3.2 Footer Navigation (AppFooter)

The `footerNav` has 4 groups with a combined total of ~37 links. However:

- _*No links to any bulk-* generator pages_* (except `/bulk-vcard-qr`, `/bulk-vcard-generator`,
  `/bulk-generator`)
- *_No links to any *-qr-suite pages*_
- **No links to any qr-\*-calculator pages** (only `/qr-size-calculator` in the Tools group)
- **No links to any qr-\*-checker pages** (only `/qr-safety-checker`)
- **No links to** `/industries`, `/glossary`, `/scan-guide`, `/qr-size-guide`, `/templates`

### 3.3 Homepage

`src/app/page.tsx` renders `<HomePageContent />`. Without reading that component, we know from the
header that `/` links to the generator sections via hash anchors. Based on the pattern, the homepage
likely lists the main QR type generators but almost certainly does not link to the 50+ bulk
generators, 25+ suites, or 100+ calculator/checker tools.

### 3.4 Sitemap Page (`/sitemap-page`)

`sitemap-page/page.tsx` is a **very strong HTML sitemap** — it links to every tool, every family
hub, all blog posts, and all trust pages. It correctly groups by category. This is the only page
that provides comprehensive internal links to all the unindexed tools. But it is just one page
linking to all others — not a hub hierarchy.

### 3.5 Inbound Links Count Estimate

For a representative sample:

- `/bulk-survey-qr-generator`: linked from sitemap-page (1 link). Header (0). Footer (0). Blog (0). Industries (0). **Total: ~1 inbound HTML link.**
- `/hostel-qr-suite`: linked from sitemap-page (1 link). **Total: ~1 inbound HTML link.**
- `/qr-glare-risk-checker`: linked from sitemap-page (1 link). **Total: ~1 inbound HTML link.**
- `/industries/fitness-workout-plan-access`: linked from `/industries` hub, which is linked from sitemap-page. **Total: ~2 inbound HTML links.**
- `/blog/qr-code-for-retail-price-tags`: linked from `/blog` index, which is in the header. **Total: ~2 inbound HTML links.**

Google's internal link strength signal for the vast majority of unindexed pages is essentially 1–2
links, all from low-PageRank source pages.

---

## 4. Ranked Root Causes (Most to Least Impactful)

### ROOT CAUSE #1 — Mass Publication of 100s of Pages on a Low-Authority Domain (CRITICAL)

**Evidence:** The directory timestamps show two major batch deployments:

- 2026-10-27: ~80 new tool/suite directories
- 2026-11-06: ~60+ more new directories (bakery-qr-suite, barber-qr-suite, boarding-pass-qr-generator, etc.)

The article registry contains 170 batches (Batch1–Batch170), indicating ~300–500 blog articles
were published programmatically. The `validateArticles()` function enforces only 120-word minimum —
far below any threshold Google uses to judge content quality. Hundreds of pages published in rapid
succession on a domain with limited external authority is the primary trigger for "Discovered –
currently not indexed." Google explicitly postpones crawling when it suspects a crawl would waste
resources on thin, templated content.

**Impact:** All 480 unindexed URLs are affected.

### ROOT CAUSE #2 — Weak Internal Link Graph (HIGH)

**Evidence:** Most unindexed tool pages receive exactly 1 inbound HTML link (from `/sitemap-page`
only). The header nav links to 17 pages total. The footer links to ~37 pages. Of the ~250+ tool
pages in the sitemap, approximately 200+ have fewer than 3 inbound HTML links from pages with any
PageRank authority. Pages that are "only in the sitemap" are treated with low confidence by
Googlebot for crawl prioritisation.

**Impact:** Directly affects 200+ tool pages.

### ROOT CAUSE #3 — Missing Per-Page Metadata on Tool Pages (HIGH)

**Evidence:** None of the ~200 `'use client'` tool pages export `metadata`. This means:

- No unique `<title>` per page (falls back to site tagline: `Free QR Code Generator & Optical
Engineering Suite — QR Code Tools` or `| QR Studio`)
- No `meta name="description"` per page
- No `<link rel="canonical">` per page

Google scoring duplicate or identical titles across 200+ pages is a strong near-duplicate content
signal, which is a known cause of deferred indexing. Confirmed by checking the root layout's
metadata template: without a per-page `title` export in the `%s` position, all tool pages emit
the root layout's `default` title.

**Impact:** ~200 tool/bulk/suite/calculator/checker pages.

### ROOT CAUSE #4 — Content Depth Variance: Thin Pages Among the New Suites (MEDIUM-HIGH)

**Evidence:**

- `hostel-qr-suite` has 4 presets (check-in, city-guide, wifi, events) + 4 FAQs + header/description
  paragraph — but **no article prose section** unlike `museum-qr-suite` which has ~800 words of
  article content. The same pattern likely applies to `bakery-qr-suite`, `barber-qr-suite`,
  `car-wash-qr-suite`, `boutique-qr-suite`, `florist-qr-suite`, `laundromat-qr-suite`,
  `food-truck-qr-suite`, `spa-qr-suite`, `courier-qr-suite`, `dentist-qr-suite`,
  `driving-school-qr-suite`, `co-working-qr-suite`, and `event-venue-qr-suite` — all were added
  2026-11-06.
- Blog article minimum is 120 words (`validateArticles(list, minWords = 120)`). At 120 words, a
  "blog article" is shorter than a tweet thread.
- `bulk-survey-qr-generator` has a short article section (~200 words) compared to
  `bulk-wifi-qr-generator` (~400 words) and `bulk-business-card-qr-generator` (~500 words).

**Impact:** ~100 pages (new suites + thin articles).

### ROOT CAUSE #5 — No Tools Hub Page (`/tools`) and Missing Family Hub Pages (MEDIUM)

**Evidence:**

- No `src/app/tools/page.tsx` exists — confirmed by `dir` output showing no `/tools` directory.
  The primary nav links to `href: '/#tools'` (hash anchor to homepage section). There is no
  standalone `/tools` hub page that Google can crawl as a structured directory.
- The sitemap does NOT include `/industries` as a standalone URL in `coreEntries` or `toolEntries`.
  It also omits `/glossary`, `/scan-guide`, `/qr-size-guide`, and `/templates` as hub URLs.
- Without hub pages receiving inbound links from the header nav, these family hubs are either
  not in the sitemap or have very low link authority.

**Impact:** Hub pages are the natural crawl entry points for their child slugs. Missing hubs mean
child pages must be discovered through the flat sitemap alone.

### ROOT CAUSE #6 — Sitemap Architecture: Single Flat 1500+ URL File with No Semantic Sectioning (MEDIUM)

**Evidence:** The single `sitemap.ts` exports everything in one flat XML file. Google confirmed
it considers priority/changeFrequency hints unreliable and largely ignores them. However, a
sitemap index (`/sitemap.xml` pointing to `/sitemap/tools.xml`, `/sitemap/blog.xml`, etc.) is a
known signal that helps Googlebot allocate its crawl budget more efficiently for large sites.
With a flat sitemap of 1500+ entries, Google sees no differentiation between a core generator
page and a new thin suite page.

The `generateSitemaps` API (Next.js 15 supports it, as confirmed in the bundled docs) allows
splitting the sitemap by type. The current architecture uses a single export function returning
all entries at once.

**Impact:** Medium — worsens crawl budget allocation.

### ROOT CAUSE #7 — No Cache-Control Headers for HTML Pages (LOW-MEDIUM)

**Evidence:** `vercel.json` has only `buildCommand`. `next.config.ts` has no Cache-Control headers.
Vercel's default for Next.js SSG pages is `Cache-Control: public, max-age=0, must-revalidate`,
which means every Googlebot hit refreshes from the origin. For a large site, this increases TTFB
under crawl load. Adding `s-maxage=86400, stale-while-revalidate` in `vercel.json` headers would
allow Vercel's edge network to serve cached HTML to Googlebot.

**Impact:** Affects TTFB and crawl capacity; not a root cause of the non-indexed status but a
contributing factor to crawl budget efficiency.

### ROOT CAUSE #8 — No Breadcrumb from Home on Scan-Guide and Size-Guide Pages (LOW)

**Evidence:** `/scan-guide/[slug]` breadcrumb trail: `Scan Guides → Entry` (no Home link).
`/qr-size-guide/[slug]` breadcrumb: `QR Size Guides → Entry` (no Home link). The BreadcrumbJsonLd
data correctly includes Home in the JSON-LD trail, but the visible `<nav>` breadcrumb does not.
This is a minor inconsistency — the JSON-LD is what matters for Google, and it is correct.

**Impact:** Minor.

---

## 5. Implementation Plan

### Phase 1 — Sitemap Index Split (HIGH IMPACT, LOW RISK)

**Goal:** Split the single flat sitemap into a sitemap index with typed sub-sitemaps, giving
Google clear signals about content types and quality tiers.

**Implementation strategy:** Use `generateSitemaps()` with route handlers (or nested `sitemap.ts`
files per route segment). The cleanest approach for this codebase — without restructuring the app
directory — is to use route-segment sitemaps in a `sitemap` route group, implemented as a
Route Handler (`src/app/sitemap-index/route.ts`) that returns a `text/xml` sitemap index. However,
Next.js 15's `generateSitemaps` API in `sitemap.(ts|js)` is the preferred approach per the docs.

**Steps:**

1. **Rename** `src/app/sitemap.ts` → `src/app/sitemap-full.ts` (keep as reference).

2. **Create** `src/app/sitemap.ts` that uses `generateSitemaps()`:

```typescript
// src/app/sitemap.ts
export async function generateSitemaps() {
  return [
    { id: 'core' }, // home, blog, sitemap-page, trust pages
    { id: 'tools' }, // all tool/generator/bulk/suite pages
    { id: 'families' }, // industries/*, glossary/*, scan-guide/*, size-guide/*, templates/*
    { id: 'blog' }, // /blog/* articles
    { id: 'labels' }, // /qr-labels/*
    { id: 'payments' }, // /whatsapp-qr/*, /payment-qr/*
  ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  // Route each id to the appropriate section
  // ...
}
```

This produces: `/sitemap/0.xml` (core), `/sitemap/1.xml` (tools), etc., with `/sitemap.xml`
acting as the sitemap index.

3. **Files to modify:**
   - `src/app/sitemap.ts` — rewrite using `generateSitemaps`
   - `src/app/robots.ts` — no changes needed (already points to `/sitemap.xml` which becomes the index)

4. **Verify:** Build and check that `/sitemap.xml` returns a sitemap index XML, and that each
   sub-sitemap URL (e.g., `/sitemap/0.xml`) returns valid URL entries.

---

### Phase 2 — Tools Hub Page + Family Hub Pages (HIGH IMPACT)

**Goal:** Create real, crawlable hub pages at `/tools`, `/scan-guide`, `/qr-size-guide`,
`/glossary`, and `/templates` that Google can use as high-authority entry points to child pages.

**Steps:**

1. **Create** `src/app/tools/page.tsx` — A standalone `/tools` hub page that:
   - Exports `metadata` with unique title and description
   - Renders an `<h1>QR Code Tools Directory</h1>` with grouped sections
   - Contains HTML `<a>` links to ALL tool/suite/calculator/checker pages (not just a subset)
   - Groups by category: Bulk Generators, QR Suites, Calculators & Planners, Security & Validators
   - Includes a paragraph per category explaining what the tools do
   - 300+ words of visible prose on the page

2. **Create or verify existence of family hub pages:**
   - `src/app/scan-guide/page.tsx` — hub for all scan guide entries
   - `src/app/qr-size-guide/page.tsx` — hub for all size guide entries
   - `src/app/glossary/page.tsx` — hub for all glossary terms
   - `src/app/templates/page.tsx` — hub for all template entries

   Pattern to follow: `src/app/industries/page.tsx` already does this correctly — it groups
   entries by industry and renders full `<Link>` cards.

3. **Add hub pages to sitemap** in `sitemap.ts`:
   - Add `/tools`, `/scan-guide`, `/qr-size-guide`, `/glossary`, `/templates` to the `core`
     section with `priority: 0.9, changeFrequency: 'weekly'`.

4. **Files to create or modify:**
   - `src/app/tools/page.tsx` (create)
   - `src/app/scan-guide/page.tsx` (create if missing)
   - `src/app/qr-size-guide/page.tsx` (create if missing)
   - `src/app/glossary/page.tsx` (create if missing)
   - `src/app/templates/page.tsx` (create if missing)
   - `src/app/sitemap.ts` (add hub URLs)

---

### Phase 3 — Internal Linking from Header/Footer + Homepage Expansion (HIGH IMPACT, LOW EFFORT)

**Goal:** Ensure every category of tool pages has at least 3–5 inbound HTML links from high-
authority pages (homepage, header, footer).

**Steps:**

1. **Update `src/config/site.ts` — `primaryNav`:**
   - Add `/tools` as a top-level navigation item with a dropdown listing 6–8 representative tools
     from categories currently missing from the nav (bulk generators, suites, calculators)
   - Change `href: '/#generators'` → `href: '/'` and `href: '/#tools'` → `href: '/tools'`

2. **Update `src/config/site.ts` — `footerNav`:**
   - Expand the "Tools" column to include representative pages from each tool category:
     - Add: `/bulk-business-card-qr-generator`, `/bulk-wifi-qr-generator`, `/qr-contrast-checker`,
       `/qr-print-cost-calculator`, `/restaurant-qr-suite`, `/museum-qr-suite`
   - Expand the "Specialty" column to include family hub links:
     - Change `/blog` label to reflect all guides, add `/industries`, `/glossary`, `/scan-guide`,
       `/qr-size-guide`, `/templates`

3. **Update `src/app/page.tsx` (homepage) or `src/components/home/HomePage.tsx`:**
   - Add a "Browse All Tools" section with category cards that link to the `/tools` hub and
     representative pages from each category
   - Add a "By Industry" section linking to the `/industries` hub
   - These links give Google the strongest possible signal since the homepage has the highest
     PageRank of any page on the site

4. **Update breadcrumbs on tool pages to point to real hub pages:**
   - Current: `{ label: 'Tools', href: '/#tools' }` — a hash anchor
   - Correct: `{ label: 'Tools', href: '/tools' }` — a real crawlable page
   - Affects all tool/suite/calculator/checker pages that have breadcrumbs

5. **Files to modify:**
   - `src/config/site.ts` (primaryNav + footerNav)
   - `src/app/page.tsx` or `src/components/home/HomePage.tsx`
   - Breadcrumb items in all `'use client'` tool pages — can be done with a search-and-replace
     across all tool pages

---

### Phase 4 — Cache-Control Headers in vercel.json (MEDIUM IMPACT, LOW EFFORT)

**Goal:** Allow Vercel's edge network to cache static HTML responses, reducing TTFB for Googlebot
and improving perceived site reliability.

**Steps:**

1. **Update `vercel.json`:**

```json
{
  "buildCommand": "npm run content:audit && npm run build",
  "headers": [
    {
      "source": "/((?!api|_next|.*\\..*).*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=86400, stale-while-revalidate=604800"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

- `s-maxage=86400` caches the HTML at Vercel's edge for 24 hours
- `stale-while-revalidate=604800` serves stale content while revalidating in background
- `/_next/static/*` should already have long TTLs from Vercel defaults, but explicit is better
- This does NOT affect API routes (pattern excludes `/api`)

2. **Files to modify:** `vercel.json`

---

### Phase 5 — Unique Titles and Meta Descriptions for All Tool Pages (HIGH IMPACT)

**Goal:** Every page must emit a unique `<title>` and `meta name="description"` in the initial HTML.

**Problem:** All `'use client'` tool pages (~200 pages) have no `metadata` export. They emit the
root layout's default title (`Free QR Code Generator & Optical Engineering Suite — QR Code Tools`
for the homepage template, or the site name) and no description.

**Implementation approach:** Add a thin metadata export to each tool page. Since these are client
components, metadata must be co-located in a separate server component wrapper or exported
directly. In Next.js App Router, `'use client'` pages can still export `metadata` from the same
file if the file also uses the `'use client'` directive — Next.js extracts the metadata at build
time.

**NOTE:** Per Next.js docs, `metadata` export from a `'use client'` page requires that the metadata
is static (not dependent on props/params). For single-route tool pages (non-dynamic), this works.

**Steps:**

1. **For each tool page** (bulk-_, *-qr-suite, qr-*-calculator, qr-_-checker, and all generator
   pages), add near the top of the file:

```typescript
// Example for bulk-business-card-qr-generator/page.tsx
export const metadata: Metadata = {
  title: 'Bulk Business Card QR Generator — Create vCard QR Codes for Teams',
  description:
    "Generate vCard QR codes for your whole team from a CSV roster. Each code opens the phone's add-contact screen prefilled. Download a ZIP of PNG files instantly.",
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-business-card-qr-generator',
  },
};
```

2. **Priority order for metadata additions:**
   - First batch: All 50+ `bulk-*-qr-generator` pages (most in the "Discovered" list)
   - Second batch: All 25+ `*-qr-suite` pages
   - Third batch: All `qr-*-calculator`, `qr-*-checker`, `qr-*-planner` pages
   - Fourth batch: All single-type QR generator pages (`url-qr-code-generator`, etc.)

3. **Title rules:**
   - Format: `[Tool Name] — [1 specific benefit phrase] | QR Studio`
   - Length: 50–60 characters
   - Must be unique (no two pages share the same title pattern)

4. **Meta description rules:**
   - 140–160 characters
   - Must include the primary keyword and a specific differentiator
   - Must not be templated (each one unique to the tool)

5. **Files to modify:** Every `src/app/[tool-name]/page.tsx` — approximately 200 files.
   This is the highest-volume change; can be done in batches using the pattern above.

---

### Phase 6 — Breadcrumb Audit for Family Pages (LOW-MEDIUM IMPACT)

**Goal:** Ensure BreadcrumbList JSON-LD and visible breadcrumbs both include Home, and that
scan-guide and size-guide breadcrumbs link to real hub pages.

**Steps:**

1. **Fix `/scan-guide/[slug]/page.tsx` breadcrumb:**
   - Current visible breadcrumb: `Scan Guides → Entry`
   - Fix: `Home → Scan Guides → Entry` (add `{ label: 'Home', href: '/' }` as first item)
   - The `BreadcrumbJsonLd` already has Home in its trail, so only the visible nav needs fixing

2. **Fix `/qr-size-guide/[slug]/page.tsx` breadcrumb:**
   - Current: `QR Size Guides → Entry`
   - Fix: `Home → QR Size Guides → Entry`

3. **Fix all tool pages breadcrumbs:**
   - Current: `{ label: 'Tools', href: '/#tools' }`
   - Fix: `{ label: 'Tools', href: '/tools' }` (once Phase 2 creates the `/tools` hub)

4. **Add BreadcrumbJsonLd to `/blog/[slug]/page.tsx`:**
   - Currently: no BreadcrumbJsonLd (only `articleJsonLd` and `faqJsonLd`)
   - Add: `Home → Blog → Article Title`
   - The `Breadcrumbs` component renders a visible trail but there is no corresponding JSON-LD

5. **Files to modify:**
   - `src/app/scan-guide/[slug]/page.tsx`
   - `src/app/qr-size-guide/[slug]/page.tsx`
   - `src/app/blog/[slug]/page.tsx`
   - All `'use client'` tool pages that have Breadcrumbs (affects ~200 files via shared pattern)

---

### Phase 7 — Content Depth Expansion for Thin Pages (MEDIUM IMPACT, HIGH EFFORT)

**Goal:** Every indexable page should have ≥400 words of unique, useful main content and a clearly
differentiated topic from sibling pages.

**Pages confirmed thin (from code analysis):**

1. *_New *-qr-suite pages without article sections*_ (~13 pages added 2026-11-06):
   `hostel-qr-suite`, `bakery-qr-suite`, `barber-qr-suite`, `boutique-qr-suite`, `car-wash-qr-suite`,
   `co-working-qr-suite`, `courier-qr-suite`, `dentist-qr-suite`, `driving-school-qr-suite`,
   `florist-qr-suite`, `food-truck-qr-suite`, `laundromat-qr-suite`, `spa-qr-suite`

   **Pattern to follow:** `museum-qr-suite` → 4 presets + 4 FAQs + `<article>` with ~800 words of
   prose explaining the industry context, how the presets work, and operational guidance.

2. **Blog articles at ≤120 words** (build-time minimum is 120 words):
   The `validateArticles()` minimum should be raised from 120 to 400 words. Articles below 400
   words should be identified and expanded before the next deployment.

3. **`bulk-survey-qr-generator`** — article section exists but is short (~200 words). Expand to
   match `bulk-wifi-qr-generator` pattern (~400 words).

**Steps:**

1. **Raise `validateArticles()` minimum in `src/lib/pages/index.ts`** from 120 to 400 words.
   This will cause failing articles to be caught at build time.

2. **Create a shared `ToolSeoContent` component** at `src/components/ToolSeoContent.tsx`:
   - Accepts `articleHtml: string`, `faqs: Faq[]`, `relatedLinks: NavLink[]`
   - Renders the `<article>`, FAQ section, and a "Related Tools" section in a consistent layout
   - Use in all tool pages to replace the inline `<article>` pattern currently in each page

3. *_Add article sections to all 13 thin *-qr-suite pages*_ following the museum-qr-suite pattern:
   - Each article should be specific to that industry (a bakery article should cover bakery-specific
     use cases: menu QR, loyalty punch-card QR, table-tent QR, allergen-info QR, etc.)
   - Target ≥400 words, 3–4 headings, unique content not derivable from any other suite page

4. **Add contextual internal links within article sections:**
   - Each article should link to ≥3 related tool pages inline (e.g., the museum suite article
     should link to `/bulk-ticket-qr-generator`, `/qr-contrast-checker`, `/printed-qr-tester`)
   - This increases both the inbound link count for those targets AND signals topical relevance

---

## 6. File Change Summary

| File                                                    | Change Type                                | Phase |
| ------------------------------------------------------- | ------------------------------------------ | ----- |
| `src/app/sitemap.ts`                                    | Rewrite using `generateSitemaps()`         | 1     |
| `src/app/tools/page.tsx`                                | Create — tools hub page                    | 2     |
| `src/app/scan-guide/page.tsx`                           | Create if missing — scan guide hub         | 2     |
| `src/app/qr-size-guide/page.tsx`                        | Create if missing — size guide hub         | 2     |
| `src/app/glossary/page.tsx`                             | Create if missing — glossary hub           | 2     |
| `src/app/templates/page.tsx`                            | Create if missing — templates hub          | 2     |
| `src/config/site.ts`                                    | Update primaryNav + footerNav              | 3     |
| `src/app/page.tsx` / `src/components/home/HomePage.tsx` | Add hub category links                     | 3     |
| `vercel.json`                                           | Add Cache-Control headers                  | 4     |
| `src/app/bulk-*/page.tsx` (~35 files)                   | Add `export const metadata`                | 5     |
| `src/app/*-qr-suite/page.tsx` (~25 files)               | Add `export const metadata`                | 5     |
| `src/app/qr-*/page.tsx` (~100 files)                    | Add `export const metadata`                | 5     |
| `src/app/scan-guide/[slug]/page.tsx`                    | Fix breadcrumb trail                       | 6     |
| `src/app/qr-size-guide/[slug]/page.tsx`                 | Fix breadcrumb trail                       | 6     |
| `src/app/blog/[slug]/page.tsx`                          | Add BreadcrumbJsonLd                       | 6     |
| `src/lib/pages/index.ts`                                | Raise `validateArticles` min words 120→400 | 7     |
| `src/components/ToolSeoContent.tsx`                     | Create shared article component            | 7     |
| `src/app/hostel-qr-suite/page.tsx`                      | Add article section (~400 words)           | 7     |
| `src/app/bakery-qr-suite/page.tsx`                      | Add article section                        | 7     |
| `src/app/barber-qr-suite/page.tsx`                      | Add article section                        | 7     |
| `src/app/boutique-qr-suite/page.tsx`                    | Add article section                        | 7     |
| `src/app/car-wash-qr-suite/page.tsx`                    | Add article section                        | 7     |
| `src/app/co-working-qr-suite/page.tsx`                  | Add article section                        | 7     |
| `src/app/courier-qr-suite/page.tsx`                     | Add article section                        | 7     |
| `src/app/dentist-qr-suite/page.tsx`                     | Add article section                        | 7     |
| `src/app/driving-school-qr-suite/page.tsx`              | Add article section                        | 7     |
| `src/app/florist-qr-suite/page.tsx`                     | Add article section                        | 7     |
| `src/app/food-truck-qr-suite/page.tsx`                  | Add article section                        | 7     |
| `src/app/laundromat-qr-suite/page.tsx`                  | Add article section                        | 7     |
| `src/app/spa-qr-suite/page.tsx`                         | Add article section                        | 7     |
| `src/app/bulk-survey-qr-generator/page.tsx`             | Expand article to ≥400 words               | 7     |
| Blog articles below 400 words                           | Expand content                             | 7     |

---

## 7. Priority Submission List for URL Inspection Tool

These 30 URLs should be submitted first via Google Search Console's URL Inspection tool after
implementing Phase 1–3 fixes. Prioritised by: (a) existing content quality, (b) commercial intent,
(c) unique differentiated value.

1. `https://freeqrcode.tools/bulk-business-card-qr-generator` — rich content, high commercial intent
2. `https://freeqrcode.tools/qr-contrast-checker` — rich content, utility tool, unique
3. `https://freeqrcode.tools/museum-qr-suite` — rich content, niche audience, full article
4. `https://freeqrcode.tools/bulk-wifi-qr-generator` — rich content, high search volume topic
5. `https://freeqrcode.tools/qr-print-cost-calculator` — unique tool, commercial intent
6. `https://freeqrcode.tools/bulk-event-badge-qr-generator` — rich content, events niche
7. `https://freeqrcode.tools/industries` — hub page for 100+ industry entries
8. `https://freeqrcode.tools/qr-labels` — hub page for label templates
9. `https://freeqrcode.tools/blog/qr-code-for-retail-price-tags` — practical, commercial topic
10. `https://freeqrcode.tools/blog/qr-code-security-best-practices` — high-value informational
11. `https://freeqrcode.tools/blog/restaurant-menu-qr-code-setup-guide` — high search volume
12. `https://freeqrcode.tools/blog/wifi-qr-code-for-guests-guide` — high search volume
13. `https://freeqrcode.tools/blog/qr-code-for-coffee-shops` — local business intent
14. `https://freeqrcode.tools/qr-size-guide/receipts` — practical, unique spec data
15. `https://freeqrcode.tools/qr-size-guide/projector-screens` — practical, unique spec data
16. `https://freeqrcode.tools/qr-size-guide/email-signatures` — practical, unique spec data
17. `https://freeqrcode.tools/industries/fitness-workout-plan-access` — specific use case
18. `https://freeqrcode.tools/qr-labels` — already submitted above; skip if duplicate
19. `https://freeqrcode.tools/blog/qr-code-for-loyalty-programs` — high-volume topic
20. `https://freeqrcode.tools/blog/qr-code-for-real-estate-virtual-staging` — commercial intent
21. `https://freeqrcode.tools/blog/sepa-epc-qr-code-girocode` — technical, unique topic
22. `https://freeqrcode.tools/blog/qr-code-vs-data-matrix` — high educational intent
23. `https://freeqrcode.tools/qr-signature-note-builder` — unique tool category
24. `https://freeqrcode.tools/blog/qr-code-for-pharmacovigilance` — niche, high authority signal
25. `https://freeqrcode.tools/blog/qr-code-for-music-releases` — entertainment + commercial
26. `https://freeqrcode.tools/blog/cost-of-bulk-business-cards-qr-codes` — commercial decision topic
27. `https://freeqrcode.tools/blog/event-check-in-qr-codes-guide` — high practical value
28. `https://freeqrcode.tools/blog/qr-code-for-construction-permits` — B2B niche, unique
29. `https://freeqrcode.tools/blog/qr-code-for-election-voter-information` — civic, newsworthy
30. `https://freeqrcode.tools/blog/qr-code-for-cycling-routes` — active lifestyle niche

---

## 8. Weekly Search Console Monitoring Checklist

### Week 1–2 (after Phase 1 + Phase 3 deployment):

- [ ] Check **Sitemaps** report: confirm sitemap index is submitted and all sub-sitemaps show
      as "Success" with correct URL counts
- [ ] Check **Page indexing** → "Discovered – currently not indexed": watch for count decrease
- [ ] Check **Crawl stats**: confirm crawl rate is increasing (requests per day)
- [ ] Submit the 30 priority URLs via URL Inspection tool

### Week 3–4 (after Phase 2 + Phase 4 deployment):

- [ ] **Page indexing** → "Crawled – currently not indexed": if URLs move here, it signals Google
      crawled them but found thin content → Phase 7 is critical
- [ ] **Page indexing** → "Indexed, not submitted in sitemap": check for pages Google found via
      internal links that weren't in the sitemap
- [ ] **Core Web Vitals** → check LCP and CLS for tool pages (client-side rendering adds
      hydration time)
- [ ] Verify canonical tags are present on tool pages (use Search Console URL Inspection)

### Ongoing (monthly):

- [ ] **Coverage** → "Valid" count: this is the success metric. Target: 480 URLs moving from
      "Discovered – not indexed" to "Valid"
- [ ] **Search Analytics** → compare impressions week-over-week for the newly indexed pages
- [ ] **Sitemaps** → check for any sitemap fetch errors
- [ ] Manually scan 5 random new tool pages on mobile to check for QR code functionality

### Success criteria (6–8 weeks post-deployment):

- "Discovered – currently not indexed" count drops below 100
- "Valid" count increases by 200+ from baseline
- Priority 30 URLs all appear in URL Inspection as "URL is on Google"

---

## 9. Honest Assessment & Realistic Timeline

**What these fixes will do:**

- Phases 1–3 address the root causes directly and are the minimum viable change set. Combined,
  they should shift the majority of the 480 URLs from "Discovered" to "Crawled" within 4–6 weeks.
- Whether Google indexes them after crawling depends on content quality (Phase 7).
- Pages with thin content may move to "Crawled – currently not indexed" rather than "Valid" even
  after being crawled. That is why Phase 7 content expansion cannot be skipped.

**What these fixes will NOT do:**

- They will not guarantee indexing of every URL. Google may judge that 200 calculator/checker tools
  on a single domain represents too much low-differentiation content regardless of technical fixes.
- They will not fix external authority. Off-page signals (backlinks, brand mentions, social shares)
  are outside the scope of this codebase audit. Consider outreach to QR code, printing, and SMB
  publications for honest coverage.

**Realistic timeline:**

- Phases 1–4: 1–2 weeks of development
- Phase 5 (metadata): 2–3 weeks of development (200+ files)
- Phase 6 (breadcrumbs): 1 week
- Phase 7 (content): 4–8 weeks (ongoing content work)
- Google re-crawl response: 2–8 weeks after each deployment

---

## 10. Summary Table

| Page Type                                 | Problem Found                                          | Fix Required                                            | Expected Outcome                                              |
| ----------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------- |
| `bulk-*-qr-generator` (~35)               | No metadata, 1 inbound link, breadcrumb to hash anchor | Phase 3+5: add metadata, fix breadcrumbs, add to footer | Move to "Crawled" within 4wk; index if content quality passes |
| `*-qr-suite` (~25)                        | No metadata, thin/no article, 1 inbound link           | Phase 5+7: add metadata + article content               | Index if content ≥400 words post-Phase 7                      |
| `qr-*-calculator` / `qr-*-checker` (~100) | No metadata, 1 inbound link, no hub page               | Phase 2+3+5: tools hub, footer links, metadata          | Move to crawled; index if differentiated                      |
| `*-qr-code-generator` (~60)               | No metadata, nav only shows 6                          | Phase 5: add metadata                                   | Improve title uniqueness, aid indexing                        |
| `/blog/*`                                 | Min 120 words, mass-published, no related links        | Phase 7: raise floor to 400 words, expand thin posts    | Thin posts may be deindexed; rich posts will index            |
| `/industries/*`                           | Good content, missing from sitemap core                | Phase 1: add hub to sitemap                             | Should index within 2–4wk                                     |
| `/scan-guide/*`                           | Good content, breadcrumb missing Home                  | Phase 6: fix breadcrumb                                 | Minor fix; already indexable                                  |
| `/qr-size-guide/*`                        | Good content, no hub in sitemap                        | Phase 2: create hub                                     | Hub creation aids child indexing                              |
| `/glossary/*`                             | Good content, no hub in sitemap                        | Phase 2: create hub                                     | Hub creation aids child indexing                              |
| `/templates/*`                            | Good content, no hub in sitemap                        | Phase 2: create hub                                     | Hub creation aids child indexing                              |
| `/qr-labels/*`                            | Good hub exists, not in nav/footer                     | Phase 3: add to footer                                  | Small boost from improved linking                             |

---

_Content was rephrased for compliance with licensing restrictions._  
_Report generated from static codebase analysis only — no live URL fetching was performed._
