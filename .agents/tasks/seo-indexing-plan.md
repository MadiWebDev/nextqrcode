# SEO Indexing Plan — freeqrcode.tools

**Status:** Post-implementation (Phases 1–4 deployed and reviewed)  
**Baseline:** ~480 URLs "Discovered – currently not indexed" in Google Search Console  
**Fixes confirmed in review:** Sitemap index (8 child sitemaps), /tools hub page, sitemap-page expansion, 5-column footer, homepage "More QR Tools" section, blog "Featured Tools" section, Cache-Control headers in vercel.json

---

## 1. Top 30 URLs to Submit First in URL Inspection Tool

Submit these in the Google Search Console URL Inspection tool immediately after the sitemap index is live and verified. Submit them one by one — do not bulk-submit. Priority logic: highest authority potential and content depth first, then pages that anchor entire page families, then high-intent blog content and niche tool pages.

| #   | URL                                                                   | Why This Rank                                                                                                                                                                                                                                                                                   |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `https://freeqrcode.tools/tools`                                      | The new /tools hub page. Linked from primary nav and 5th footer column. 169 tool links — highest internal link equity emitter on the site after the homepage. Submitting this first primes Google to crawl all tool categories from one authoritative entry point.                              |
| 2   | `https://freeqrcode.tools/` (homepage)                                | Submit even if already indexed — URL Inspection forces a fresh crawl signal. The homepage now has the "More QR Tools" section with 22 new outbound links; a recrawl distributes that equity immediately.                                                                                        |
| 3   | `https://freeqrcode.tools/sitemap-page`                               | The HTML sitemap links to every tool, every family hub, all blog posts, and all trust pages in a single crawlable page. Submitting this gives Googlebot a complete, structured link graph to follow.                                                                                            |
| 4   | `https://freeqrcode.tools/url-qr-code-generator`                      | Core product page, highest commercial intent of any single tool. Likely already indexed, but re-inspect to confirm canonical and metadata are correct after any recent changes. Signals overall site quality to Google's quality rater algorithms.                                              |
| 5   | `https://freeqrcode.tools/payment-qr`                                 | High commercial intent. Payment/fintech QR pages attract backlinks naturally. Strong content depth; unique in the site's portfolio.                                                                                                                                                             |
| 6   | `https://freeqrcode.tools/industries`                                 | Hub page for 100+ industry entries. The /industries family has the best-structured pages in the codebase — unique content, generateStaticParams, generateMetadata, internalLinks arrays. Getting the hub indexed gives Google the entry point to crawl all children.                            |
| 7   | `https://freeqrcode.tools/bulk-business-card-qr-generator`            | Richest content of all bulk generators: full article (~500 words), 4 FAQs, breadcrumbs now fixed to point to /tools. High commercial intent (teams, HR workflows). Now in the 5th footer column.                                                                                                |
| 8   | `https://freeqrcode.tools/bulk-wifi-qr-generator`                     | Second richest bulk generator (~400 words). "WiFi QR code" is one of the highest-search-volume QR queries. Now in the footer.                                                                                                                                                                   |
| 9   | `https://freeqrcode.tools/bulk-event-badge-qr-generator`              | Full article + 4 FAQs. Events niche has strong seasonal search volume. Good differentiation from general bulk generators. Now in the footer.                                                                                                                                                    |
| 10  | `https://freeqrcode.tools/bulk-url-qr-generator`                      | Covers the most universal use case in bulk generation. High inbound link equity from the new /tools hub (22-link homepage section + footer).                                                                                                                                                    |
| 11  | `https://freeqrcode.tools/bulk-ticket-qr-generator`                   | Now in the 5th footer column. Ticketing QR is a growing vertical post-pandemic. Good article structure.                                                                                                                                                                                         |
| 12  | `https://freeqrcode.tools/restaurant-qr-suite`                        | The restaurant suite targets the single largest QR adoption vertical. Now in the 5th footer column alongside bulk tools. Good differentiation from generic suite pages.                                                                                                                         |
| 13  | `https://freeqrcode.tools/museum-qr-suite`                            | Richest content of all suite pages (~800 words article + 4 FAQs). The model page for content quality in the suite family. Submitting it first demonstrates to Google what the suite template looks like at its best.                                                                            |
| 14  | `https://freeqrcode.tools/clinic-qr-suite`                            | Healthcare QR is a high-authority vertical. Medical/health content attracts editorial links. Now linked from /tools and the footer.                                                                                                                                                             |
| 15  | `https://freeqrcode.tools/gym-qr-suite`                               | Fitness vertical has strong evergreen search volume. Now linked from /tools hub. Good commercial intent.                                                                                                                                                                                        |
| 16  | `https://freeqrcode.tools/retail-qr-suite`                            | Retail QR is a large category. Now in the 5th footer column. Strong commercial intent, links naturally to blog content on retail price tags and loyalty programs.                                                                                                                               |
| 17  | `https://freeqrcode.tools/qr-contrast-checker`                        | Unique utility tool — no direct competitors for "QR contrast checker." Full article, 4 FAQs, now linked from the homepage "More QR Tools" section and from the blog "Featured Tools" section.                                                                                                   |
| 18  | `https://freeqrcode.tools/qr-print-cost-calculator`                   | High commercial intent ("how much does it cost to print QR codes"). Unique calculator. Linked from homepage "More QR Tools" section and blog "Featured Tools" section.                                                                                                                          |
| 19  | `https://freeqrcode.tools/qr-payload-inspector`                       | Technical tool with no direct competitors. Developer and agency audience. Linked from homepage "More QR Tools" section.                                                                                                                                                                         |
| 20  | `https://freeqrcode.tools/qr-a-b-test-planner`                        | Niche analytics tool — unique in the QR tools space. Linked from homepage and blog. Appeals to marketers who write about and link to testing resources.                                                                                                                                         |
| 21  | `https://freeqrcode.tools/qr-redirect-chain-viewer`                   | Useful diagnostic tool for security-conscious users and webmasters. Linked from homepage "More QR Tools" section. No direct competitors.                                                                                                                                                        |
| 22  | `https://freeqrcode.tools/qr-labels`                                  | Hub page for label template sheets. Properly structured server component with metadata. Not yet in footer or primary nav (a gap — add to footer Specialty column). The only discovery path is currently sitemap-page and sitemap XML.                                                           |
| 23  | `https://freeqrcode.tools/blog/qr-code-security-best-practices`       | Highest editorial authority potential of any blog post. Security content attracts natural backlinks from developers, journalists, and organizations. Good word count.                                                                                                                           |
| 24  | `https://freeqrcode.tools/blog/static-vs-dynamic-qr-codes`            | Fundamental QR education topic. High search volume. Can rank for a competitive informational query and pulls readers toward tool pages via CTAs.                                                                                                                                                |
| 25  | `https://freeqrcode.tools/blog/how-qr-codes-work`                     | Top-of-funnel evergreen content. If this ranks, it drives branded searches and direct traffic — both of which improve Google's trust in the domain.                                                                                                                                             |
| 26  | `https://freeqrcode.tools/industries/fitness-workout-plan-access`     | Best-structured industry entry in the confirmed "Discovered" list. generateStaticParams + generateMetadata + internalLinks array + hub linkage from /industries. Good differentiator from generic fitness QR content.                                                                           |
| 27  | `https://freeqrcode.tools/industries/healthcare-appointment-check-in` | Healthcare appointment QR is a high-value, frequently searched use case. Same quality structure as fitness entry.                                                                                                                                                                               |
| 28  | `https://freeqrcode.tools/scan-guide/fix-qr-scan-tiny-codes`          | Practical troubleshooting content. Users who search for "QR code won't scan" have high intent. Scan-guide family has proper SSG, metadata, and internal cross-links.                                                                                                                            |
| 29  | `https://freeqrcode.tools/glossary/vcard`                             | Glossary entries have full SSG, unique metadata, and schema markup. "vCard QR code" has reasonable search volume. The glossary hub cross-links these entries.                                                                                                                                   |
| 30  | `https://freeqrcode.tools/sitemap-page`                               | Already listed at #3 — replace with this entry instead: `https://freeqrcode.tools/templates/corporate-navy-trust`. Template pages have unique content, generateStaticParams, generateMetadata. The corporate trust template targets professional B2B audiences who search for branded QR codes. |

**Supplementary URLs (submit in week 2 after the first batch is processing):**

- `https://freeqrcode.tools/qr-size-guide/posters` — size guide entries are well-structured, unique, and practical
- `https://freeqrcode.tools/sitemap-page` — submit after first batch to allow Google to discover the full link graph

**What NOT to do:**

- Do not use the Indexing API for these pages. The Indexing API is only for `JobPosting` and `BroadcastEvent` schema markup. Using it on regular pages may trigger a manual review flag.
- Do not submit more than 10–15 URLs per day via URL Inspection. The tool is a signal, not a guarantee, and mass submission does not accelerate crawling.
- Do not resubmit the same URL more than once per week.

---

## 2. Weekly Search Console Monitoring Checklist

Run this checklist every Monday morning. Use Google Search Console's date range filter set to the previous 7 days.

### Page Indexing Report

**Where:** Search Console → Indexing → Pages → "Why pages aren't indexed"

- [ ] **"Discovered – currently not indexed" count.** Baseline: ~480. Target trajectory: drop by 10% per week in weeks 1–4, then stabilise as the remaining pages are either crawled or confirmed thin. If the count is not falling after 3 weeks, it means Google crawled the pages and moved them to "Crawled – currently not indexed" (see below) rather than indexing them — which signals a content quality problem, not a technical one.
- [ ] **"Crawled – currently not indexed" count.** This is the signal that fixes are being noticed. If this count rises while "Discovered – currently not indexed" falls, Google is crawling the pages but judging the content thin. That triggers Phase 7 (content expansion) urgently.
- [ ] **"Excluded by noindex" count.** Should remain stable. Any increase means a noindex tag was accidentally added somewhere — investigate immediately. The `auditVerdict()` function always returns `passed: true` per the audit, so this is unlikely to change, but check anyway.
- [ ] **"Duplicate without user-selected canonical" count.** If this rises, it means tool pages still lack canonical tags. Confirm the Phase 5 metadata additions are deployed.

### Crawl Stats

**Where:** Search Console → Settings → Crawl stats

- [ ] **Pages crawled per day.** After submitting the sitemap index and the top 30 URLs, expect Googlebot to increase from whatever the baseline is toward 50–100 pages/day within 2–3 weeks on a site this size. If pages/day is below 20, something is slowing Googlebot (server errors, rate limiting, or slow TTFB).
- [ ] **Average response time.** Target: under 500ms. The Cache-Control headers added to vercel.json (`public, max-age=3600, s-maxage=3600` for sitemaps and XML; `public, max-age=31536000, immutable` for static assets) reduce origin load. If response time is above 800ms, investigate API calls during SSR or Vercel edge function cold starts.
- [ ] **Response codes by day.** 5xx errors should be zero. Any 5xx spike during a Googlebot crawl session will cause Googlebot to back off for days. If 5xx appears, check Vercel function logs immediately.

### Sitemaps

**Where:** Search Console → Indexing → Sitemaps

- [ ] **Submit the sitemap index URL** (`https://freeqrcode.tools/sitemap.xml`) in week 1 if not already submitted. Remove any old flat sitemap URL entries that point to the previous single-file sitemap.
- [ ] **Verify all 8 child sitemaps are accepted.** The review confirmed sitemaps 0–7 all have `.xml.body` artifacts in the build output. Each should appear in Search Console as "Success" with a URL count. Expected counts: core (~10–15 URLs), tools (~100 URLs), generators (~60 URLs), bulk (~35 URLs), suites (~25 URLs), blog (~300–400 URLs), families (industries + glossary + scan-guide + size-guide + templates combined), labels (~20 URLs).
- [ ] **Watch for "Couldn't fetch" errors** on any child sitemap. This means Vercel is returning an error for that route — likely a build-time failure in the `generateSitemaps` function for that id. Fix immediately as it blocks all URLs in that group.
- [ ] **Check "Submitted" vs "Indexed" count per sitemap.** The gap is normal, but a submitted count of 0 means the sitemap wasn't fetched. A submitted:indexed ratio below 10% after 4 weeks signals a quality problem in that category.

### Coverage (Page Indexing status changes)

- [ ] Watch the **"Valid" count** each week. This is the primary success metric. Every URL that moves into "Valid" is a win. Target: +50 valid pages per week in weeks 2–6.
- [ ] If a URL is in **"Valid – submitted and indexed"** it means it was in the sitemap and got indexed — good.
- [ ] If a URL is in **"Valid – indexed, not submitted in sitemap"** it means Google found it via internal links without the sitemap — this confirms the internal linking improvements (homepage "More QR Tools" section, /tools hub, 5-column footer) are working.

### Core Web Vitals

**Where:** Search Console → Experience → Core Web Vitals

- [ ] **LCP (Largest Contentful Paint).** Target: under 2.5s on mobile. The main risk on tool pages is hydration time for `'use client'` components — the QR generator interactive UI loads client-side. The article content is in the initial HTML (SSG), so the LCP element should be the article heading or hero image, not the QR canvas.
- [ ] **CLS (Cumulative Layout Shift).** Target: under 0.1. Watch for layout shift caused by the QR canvas mounting after hydration. If the canvas reserves space in CSS before mounting, CLS stays clean.
- [ ] **INP (Interaction to Next Paint).** Target: under 200ms. This measures responsiveness during interaction. The QR generation logic (canvas rendering) is the most likely source of high INP on tool pages.
- [ ] **If Core Web Vitals show "Poor" for any page group,** prioritise fixing that group before submitting those URLs — a poor CWV score actively suppresses ranking and may prevent indexing on mobile-first index.

### Success Milestones

| Milestone     | Target                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| End of week 2 | Sitemap index accepted; all 8 child sitemaps show "Success" in Search Console. Top 30 URLs submitted via URL Inspection.                                                                    |
| End of week 4 | "Discovered – currently not indexed" drops from ~480 to below 350. At least 20 of the top 30 submitted URLs show "URL is on Google" in URL Inspection.                                      |
| End of week 6 | "Discovered – currently not indexed" drops below 200. "Valid" count increases by 150+. Crawl stats show 50+ pages/day.                                                                      |
| End of week 8 | "Discovered – currently not indexed" drops below 100. At least 25 of the top 30 URLs are indexed. Second wave of URL submissions (size guides, glossary, templates) showing crawl activity. |
| Full success  | "Discovered – currently not indexed" drops below 50. This would mean ~430 of 480 unindexed URLs are now either indexed or confirmed crawled and awaiting quality judgment.                  |

---

## 3. Off-Page Authority Building Suggestions

The technical fixes address internal signals. External authority is what ultimately determines whether Google treats freeqrcode.tools as a trusted, indexable domain rather than a low-authority programmatic site. These suggestions are legitimate, slow-build tactics only.

### Free Tool Directories

Submit the site to these directories. Write a unique description for each — do not copy-paste the same blurb everywhere.

- **[Product Hunt](https://www.producthunt.com)** — Launch the site as a product. A strong Product Hunt launch (upvotes, genuine reviews) generates both a backlink and real traffic, which Google treats as a trust signal. Focus the launch on the most distinctive tool (the QR contrast checker or A/B test planner — both are genuinely unique in the market).
- **[AlternativeTo](https://alternativeto.net)** — List freeqrcode.tools as an alternative to QR Tiger, QR Code Generator Pro, and Canva QR. AlternativeTo pages rank well and pass link equity.
- **[SaaSHub](https://www.saashub.com)** — Free SaaS directory. Good domain authority. Description should focus on the free-to-use angle and the technical tooling (contrast checker, payload inspector) that paid tools don't offer.
- **[Slant](https://www.slant.co)** — Recommendation platform. Add freeqrcode.tools to the "best QR code generators" and "best bulk QR code tools" lists. Write genuine answers to existing questions.
- **[ToolFinder](https://toolfinder.co)** — Curated SaaS/tool directory. Smaller but focused audience of people actively looking for tools.
- **[Capterra](https://www.capterra.com)** / **[G2](https://www.g2.com)** — If the tool has any business-facing features (bulk generation, the QR suite for restaurants/clinics), listing on Capterra and G2 provides high-DA backlinks and review signals.

### QR-Specific Directories and Mentions

- **QR Code forums and communities:** Post genuinely helpful answers on [Reddit r/QRcodes](https://www.reddit.com/r/QRcodes/) and [Reddit r/smallbusiness](https://www.reddit.com/r/smallbusiness/). Do not spam. Answer real questions about QR code sizing, WiFi QR setup, and vCard QR formats — these are topics freeqrcode.tools has dedicated content for. Link only when the link genuinely answers the question.
- **Wikipedia:** If any blog articles contain original technical data or spec tables (e.g., the SEPA/EPC QR code article or the Frame QR article), these may be appropriate citations on Wikipedia QR code–related articles. Wikipedia links are nofollow but drive real reference traffic and signal authority.
- **Specification bodies:** If the site covers QR code ISO/IEC 18004 standards accurately, reaching out to QR code standards organizations or libraries for a resource link is a slow but high-quality signal.

### Guest Posting and Editorial Outreach

Target publications whose audiences use QR codes operationally — not just SEO blogs.

- **Printing and signage blogs:** Companies like VistaPrint, Moo, GotPrint, and Sticker Mule have blogs or resource pages about print design. A tutorial like "how to size a QR code for a business card" (backed by freeqrcode.tools' print cost calculator) could earn a mention or link.
- **Small business and retail blogs:** Publications like [Shopify Blog](https://www.shopify.com/blog), [Square Blog](https://squareup.com/us/en/the-bottom-line), and retail industry newsletters cover QR code adoption for point-of-sale, menus, and loyalty programs. Pitch practical how-to content tied to the site's industry suite pages.
- **Marketing and event management blogs:** The event badge and ticket QR generators are unique tools. Pitch content about "how to manage bulk QR codes for event check-in" to event planning publications like [EventManager Blog](https://www.eventmanagerblog.com/).
- **Healthcare and clinic operations:** The clinic-qr-suite and healthcare appointment check-in content could earn citations from healthcare administration blogs or practice management software companies.

Do not pay for guest posts. Any publication that requires payment for a "sponsored post with a do-follow link" is a link scheme and risks a manual penalty.

### Social Profiles

Build these profiles as genuine presences, not just link drops.

- **Twitter/X:** Create `@freeqrtools` or similar handle. Post weekly practical QR tips (linking to the size guides and blog). Engage with QR code and printing conversations. Twitter/X links are nofollow but Twitter has strong brand signal value with Google.
- **LinkedIn Company Page:** Create a company page. Post use-case content (a museum using QR codes for exhibits, a restaurant implementing digital menus). The LinkedIn page itself earns a do-follow link from a high-DA domain.
- **Reddit:** As noted above — engage genuinely in r/QRcodes, r/smallbusiness, r/webdev (for the technical tools).
- **GitHub:** If any part of the QR generation logic is open-source or if spec documents are shared, a GitHub repository earns a backlink and signals developer credibility.

### Schema Markup for SoftwareApplication

Add `SoftwareApplication` JSON-LD schema to each tool page. This is an on-page signal, not an off-page tactic, but it feeds into authority perception:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Bulk Business Card QR Generator",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "url": "https://freeqrcode.tools/bulk-business-card-qr-generator",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Generate vCard QR codes for teams from a CSV roster. Download a ZIP of PNG files instantly."
}
```

This can appear in Google's rich results for software tool searches and improves click-through rate, which is a secondary trust signal.

### What NOT To Do

These tactics are explicitly prohibited. Any of them can trigger a manual penalty that takes months to recover from.

- **No link schemes.** Do not join private blog networks (PBNs), link exchange rings, or any service that promises "X links for $Y."
- **No paid links.** Links that are paid for must carry `rel="sponsored"` per Google's guidelines. If a directory charges for a "featured listing with a do-follow link," decline or add `nofollow`.
- **No spam submissions.** Do not use bulk directory submission tools. The low-quality links from hundreds of irrelevant directories hurt more than they help.
- **No "get indexed fast" services.** Services that promise to submit your URL to hundreds of search engines or use "indexing APIs" for regular pages are ineffective at best and harmful at worst.
- **No keyword-stuffed anchor text** in any outreach. If you earn a link, let the linking site choose the anchor text naturally.
- **No press release spam.** Submitting a press release to 50 wire services generates 50 near-duplicate pages with the same content — a classic thin-content signal that Google devalues.

---

## 4. Summary Table

| Page Type                                                                  | Root Problem Found                                                                                                                                                   | Fix Applied                                                                                                                                                                              | Expected Outcome                                                                                                                         |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Core tool pages (`/url-qr-code-generator`, `/payment-qr`, etc.)            | No `metadata` export; breadcrumbs pointed to hash anchor `/#tools` instead of real hub                                                                               | Phase 5: `metadata` with canonical to be added per-page; breadcrumbs updated to `/tools` once hub deployed                                                                               | Unique title/description in SERP; correct canonical; re-crawl confirms content quality                                                   |
| Bulk generator pages (`/bulk-*-qr-generator`, ~35 pages)                   | No `metadata` export; 1 inbound HTML link (sitemap-page only); no footer/nav presence                                                                                | Phase 3: 5th footer column added (`bulk-business-card`, `bulk-event-badge`, `bulk-wifi`, `bulk-url`, `bulk-ticket`); Phase 5: `metadata` additions pending                               | Move from "Discovered" to "Crawled" within 4 weeks; indexing dependent on content quality review                                         |
| QR suite pages (`/*-qr-suite`, ~25 pages)                                  | No `metadata` export; 13 new suites had no article prose section (thin content); 1 inbound link                                                                      | Phase 7 (content): article sections to be added to 13 thin suites; Phase 5: `metadata` additions; Phase 3: footer links added for core suites                                            | Thin suites may land in "Crawled – not indexed" until Phase 7 content is deployed                                                        |
| Calculator/checker pages (`/qr-*-calculator`, `/qr-*-checker`, ~100 pages) | No `metadata` export; no hub page; appeared only in sitemap-page and sitemap XML                                                                                     | Phase 2: `/tools` hub created with 169 links; Phase 3: homepage "More QR Tools" section with 22 tools; blog "Featured Tools" section; Phase 5: `metadata` additions pending              | Hub linkage increases inbound links from 1 to 5+; improved crawl priority; indexing expected within 6 weeks                              |
| Blog articles (`/blog/*`, ~300–400 articles)                               | Minimum word count was 120 words (far below Google's quality threshold); mass-published in 3 waves; no cross-linking to related articles; CTA links only to homepage | Phase 7: raise `validateArticles()` minimum to 400 words; thin articles to be identified and expanded; blog page "Featured Tools" section added for cross-linking                        | Rich articles (800+ words) will index within 4–6 weeks; thin articles may move to "Crawled – not indexed" and need expansion             |
| Industries pages (`/industries/*`, ~100+ pages)                            | Good content (SSG, unique metadata, internalLinks); `/industries` hub missing from sitemap core entries                                                              | Phase 1: sitemap index deployed; Phase 2: hub confirmed present and correctly structured; Phase 3: sitemap-page links to `/industries`                                                   | Should index within 2–4 weeks post-sitemap-index submission; hub submission (rank #6) accelerates child crawling                         |
| Scan guide pages (`/scan-guide/*`)                                         | Good SSG and metadata; breadcrumb missing Home node in visible nav (JSON-LD was correct); hub page existence not confirmed in audit                                  | Phase 6: breadcrumb fix pending; Phase 2: hub page creation/verification pending                                                                                                         | Minor breadcrumb fix; content quality is good; should index once hub provides proper entry point                                         |
| QR size guide pages (`/qr-size-guide/*`)                                   | Good content; no hub URL in sitemap; hub page existence not confirmed                                                                                                | Phase 2: hub page creation/verification pending; Phase 1: sitemap index deployed with size-guide entries                                                                                 | Hub creation is the key unblock; child pages have good quality and should index once hub is in sitemap                                   |
| Glossary pages (`/glossary/*`)                                             | Good content; no hub URL in sitemap core                                                                                                                             | Phase 2: hub page creation/verification pending; child entries in sitemap via `familyEntries()`                                                                                          | Same pattern as size guide; hub deployment expected to unlock child indexing                                                             |
| Template pages (`/templates/*`)                                            | Good SSG and metadata; no hub URL in sitemap                                                                                                                         | Phase 2: hub creation/verification pending                                                                                                                                               | Same pattern; `corporate-navy-trust` submitted as #30 in URL Inspection list to signal template quality                                  |
| Sitemap (technical)                                                        | Single flat sitemap with 1,500+ URLs; no semantic sectioning; Google could not differentiate high-value from thin pages                                              | Phase 1 (deployed): `generateSitemaps()` with 8 child sitemaps (core, tools, generators, bulk, suites, blog, families, labels); build artifacts confirmed in `.next/server/app/sitemap/` | Googlebot can now allocate crawl budget by content type; expected improvement in crawl rate within 2–3 weeks of sitemap index submission |
| Internal linking                                                           | Most tool pages had exactly 1 inbound HTML link (sitemap-page only); header linked only to hash anchors `/#tools`; footer had 0 links to bulk/suite/calculator pages | Phase 3 (deployed): `/tools` in primary nav; 5th footer column (Bulk Tools); homepage "More QR Tools" with 22 links; blog "Featured Tools" section; HTML sitemap expanded                | Every listed tool now has 3–6 inbound HTML links from pages with real PageRank; crawl priority will increase proportionally              |
| Cache headers                                                              | No Cache-Control headers for HTML pages; Vercel default (`max-age=0, must-revalidate`) caused every Googlebot visit to hit origin                                    | Phase 4 (deployed): `vercel.json` headers added (`s-maxage=3600` for sitemaps/XML; `max-age=31536000, immutable` for static assets)                                                      | Reduced TTFB on repeated Googlebot visits; improved crawl capacity; not a direct indexing fix but removes a contributing bottleneck      |

---

## 5. Realistic Timeline

The timeline below assumes Phase 1–4 fixes are already deployed (confirmed by the code review). Phase 5–7 work (metadata additions and content expansion) is the remaining critical path.

### Week 1–2: Sitemap Index Live, Top 30 URLs Submitted

**Actions:**

- Verify the sitemap index (`/sitemap.xml`) is accepted in Search Console and all 8 child sitemaps show "Success"
- Submit the top 30 URLs from Section 1 via URL Inspection (10–15 per day, not all at once)
- Begin Phase 5 metadata additions for bulk generator pages (highest priority, ~35 files)
- Submit the site to Product Hunt, AlternativeTo, and SaaSHub (Section 3)

**What to expect:**

- Google will begin crawling the submitted URLs within days. The URL Inspection tool will show "URL is on Google" or "URL is not on Google — Requested indexing" for each submitted URL.
- The sitemap index change may cause a temporary dip in Search Console's "Valid" count — this is normal while Google re-processes the new sitemap structure.
- No significant change in "Discovered – currently not indexed" count yet.

### Week 2–4: First Indexing Improvements Visible

**Actions:**

- Complete Phase 5 metadata additions for all bulk generators and core suite pages
- Fix breadcrumbs on tool pages from `/#tools` to `/tools`
- Monitor Crawl Stats for increasing pages-per-day
- Begin Phase 7 article additions for the 13 thin suite pages

**What to expect:**

- Some of the top 30 submitted URLs will appear in Search Console as "Indexed, not submitted in sitemap" or "Valid" — this is the first visible proof of progress
- The "Discovered – currently not indexed" count should start declining: target below 400 by end of week 4 (from baseline of ~480)
- If URLs are moving to "Crawled – currently not indexed" instead of "Valid," it means the crawl is happening but content quality is failing the threshold — accelerate Phase 7 content work
- Crawl rate should increase from whatever the baseline is toward 50+ pages/day

### Week 4–6: Second Batch Improving, Metadata Fully Deployed

**Actions:**

- Complete Phase 5 metadata additions for all calculator/checker/planner pages (~100 files)
- Complete Phase 7 article additions for all 13 thin suite pages
- Submit a second batch of 30 URLs via URL Inspection: size guide pages, glossary entries, remaining blog articles
- Raise `validateArticles()` minimum from 120 to 400 words and redeploy

**What to expect:**

- "Discovered – currently not indexed" should be below 300 and trending down
- The second batch of URL Inspection submissions begins receiving crawl attention
- Phase 7 content deployments trigger re-crawl signals for the previously thin suite pages
- Core Web Vitals data in Search Console becomes more statistically significant (more crawled pages = more field data)

### Week 6–8: Full Crawl of Improved Internal Link Graph Reaches Orphaned Pages

**Actions:**

- Monitor for "Indexed, not submitted in sitemap" pages — these are pages Google found via internal links from the new /tools hub and footer links
- Identify any remaining "Discovered – currently not indexed" pages and determine if they are genuinely thin (noindex/remove) or indexable but overlooked (fix and resubmit)
- Evaluate whether hub pages for scan-guide, qr-size-guide, glossary, and templates are deployed and in the sitemap (Phase 2 work)

**What to expect:**

- By week 8, the improved internal link graph (169 links from /tools hub, 22 from homepage, 5-column footer, blog Featured Tools section) will have been crawled multiple times. Pages previously reachable only via sitemap-page should now appear in Googlebot's crawl path naturally.
- "Discovered – currently not indexed" should be below 150
- Some pages previously in "Discovered" may now be in "Excluded by noindex" if Phase 7 identifies them as genuinely thin and marks them noindex — this is correct behavior, not a regression

### What Success Looks Like: Specific Numbers

| Metric                               | Baseline | 4-week target            | 8-week target                      | Full success                        |
| ------------------------------------ | -------- | ------------------------ | ---------------------------------- | ----------------------------------- |
| "Discovered – currently not indexed" | ~480     | ≤350                     | ≤150                               | ≤50                                 |
| "Valid" pages (indexed)              | Unknown  | +50 from baseline        | +200 from baseline                 | +400 from baseline                  |
| "Crawled – currently not indexed"    | Unknown  | May temporarily increase | Should decrease as content expands | Near zero for pages with ≥400 words |
| Sitemap: Submitted vs Indexed ratio  | Unknown  | 10–20%                   | 30–50%                             | 50–70%                              |
| Pages crawled per day                | Unknown  | 20–50/day                | 50–100/day                         | 100+/day                            |

The "Discovered – currently not indexed" target of below 50 is the headline success metric. It represents a drop from ~480 to fewer than 50 — roughly 90% of the affected URLs either indexed or confirmed as thin and appropriately handled.

### Honest Caveat

Indexing is Google's decision. These fixes improve the signals Google uses to judge whether a page is worth crawling and indexing — they do not guarantee a specific outcome. The most common failure mode after good technical fixes is content quality: Google crawls the page and decides the content is not differentiated enough from thousands of similar pages on other domains.

The pages most at risk of remaining unindexed even after all fixes are deployed:

1. **Blog articles under 400 words** — 120-word articles will likely land in "Crawled – currently not indexed" until expanded
2. **New suite pages without article sections** — the 13 thin suites from the November 2026 batch need article content before they will index
3. **Highly similar calculator/checker pages** — if 10 different "QR code checker" tools exist on the same domain with minor variations, Google may index only 2–3 of them and treat the rest as near-duplicates

Realistic timelines for indexing changes are **2–8 weeks per wave of fixes**, not days. Google's crawler is not on-demand — it prioritises pages based on its own authority and freshness signals. The URL Inspection tool submissions accelerate this for the top 30 pages, but the remaining 450 pages will follow Google's organic crawl schedule.

Expect the full picture to take **3–4 months** from first deployment to reach the "below 50 unindexed" target, assuming consistent weekly content and technical work.

---

_Document generated from: audit report at `.agents/tasks/seo-indexing-plan/audit-report.md` and code review at `.agents/tasks/seo-indexing-plan/review.md`._  
_Fixes confirmed deployed: sitemap index (8 child sitemaps), /tools hub page, 5-column footer, homepage "More QR Tools" section, blog "Featured Tools" section, Cache-Control headers in vercel.json._
