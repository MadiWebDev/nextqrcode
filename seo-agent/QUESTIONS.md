# QUESTIONS.md — Consolidated data request for the site owner

Ordered by what blocks progress. Items 1–5 unblock the Phase 1 diagnosis verdicts;
nothing here blocks the metadata/schema batch already staged. Please export from
the **domain property** for **Oct 4 – Nov 15, 2026** (or the widest range GSC
offers) unless noted.

1. **Indexing → Pages report: the "Why pages aren't indexed" table, with 2–3
   example URLs per reason.** (Discovered – currently not indexed; Crawled –
   currently not indexed; Duplicate / Google chose different canonical; Alternate
   page with proper canonical; Soft 404; Blocked by robots.txt; Excluded by
   'noindex'; Page with redirect.) *This is the single most valuable missing input —
   it decides H1/H3/H4.*
2. **Manual Actions and Security Issues reports: explicit confirmation that both
   are empty** (a screenshot or a one-line "both clear" is enough). *Decides H5;
   takes one minute and rules out a cause no external check can see.*
3. **Crawl Stats report** (Settings → Crawl stats): total crawl requests, response
   code breakdown, host status, and average response time for Oct–Nov — especially
   anything anomalous around Oct 27–29. *Decides whether Googlebot could fetch the
   site during the collapse window (H1/H3).*
4. **Sitemaps report detail:** for `sitemap.xml`, the submitted-vs-discovered counts
   and any fetch errors GSC shows, plus the same for any individually submitted
   section sitemaps. *Tests whether the sitemap-index 404 (E-012) registered in GSC
   and when Google last read each section (H1/H3).*
5. **Deploy history Oct 15 – Nov 5** (Vercel deployments list) and, if available,
   Vercel logs for Oct 28: did production builds fail, and from what date was
   `/sitemap.xml` 404ing? *Pins the H1 timeline (E-011/E-012 are currently
   LIKELY, sourced from internal records).*
6. **Core Web Vitals report** (mobile + desktop pass rates, and the failing URL
   groups). *Phase 4 planning; the baseline crawl's response times (E-016) are
   server-side only.*
7. **Links report:** top linking sites and top linked pages. *Phase 6 planning and
   H2 context (was the ramp link-driven?).*
8. **Analytics: does GA4 (or any analytics) exist on the three sites?** The code
   ships a consent-gated GA component driven by env vars. If GA4 exists, tool
   completions (QR generated / invoice downloaded / image resized) are the
   north-star metric for Phase 7; if not, say so and we propose the event schema
   first.
9. **AdSense: account status and any policy messages** — and is Adsterra currently
   the only live ad network? (Context for the empty "Advertisement" boxes, E-025,
   and Phase 9.)
10. **Bing Webmaster Tools:** is the domain added and are sitemaps submitted?
    (Phase 8; also a cheap second opinion on indexation.)
11. **GSC verification method:** the served meta verification value is a *filename*
    (`google77fce3f57266cc5a.html`) and that file 404s (E-015), so the property
    must be verified another way — most likely DNS. Please confirm, so the broken
    meta value can be corrected in the Vercel env (or removed) without risking
    property access. Also confirm the internal content-audit gate (`auditVerdict`,
    E-026) is intentional and still wanted.
12. **Preview deployments:** are Vercel preview/staging URLs noindexed or
    access-protected? (Repo-map gap; a crawlable preview twin would matter for
    H8-style duplicate analysis.)

---

## Progress note — 2026-11-17 (Indexing Fix Steps 1–3)

- **Item 1 is now PARTIALLY ANSWERED by the owner's own drilldown exports:**
  the full URL sets for "Crawled – currently not indexed" (686) and
  "Discovered – currently not indexed" (170) are in hand and fully audited
  (E-034…E-049). Still wanted from item 1: the counts/example URLs for the
  *other* reasons (Duplicate / Google chose different canonical, Soft 404,
  Page with redirect, Blocked by robots.txt, Excluded by noindex) — these
  would complete the twin test (A-011) and close DIAGNOSIS H1/H3 fully.
- **Item 2 (Manual Actions + Security) is now the #1 blocker** — it is the
  only input that can still overturn the diagnosis (H6 UNVERIFIED).
- Items 3 (Crawl Stats), 4 (Sitemaps detail) and 5 (Vercel logs) remain
  open and are re-ordered by blocking power at the end of DIAGNOSIS.md.

## Step 4 addendum (2026-11-17) — approvals now needed

Step 4 is complete (`STEP4-REPORT.md`, `output/url-actions.csv`); nothing
will be applied without approval. In Step 5's order:
1. **The lists as a whole** (KEEP 431 / IMPROVE 144 / REMOVE 87 /
   ASSET 3), or line vetoes — every row is reversible at this stage.
2. **The PROTECT deferred sub-lists, separately:** (a) 11 merge
   candidates, (b) 66 unsourced-YMYL earners (recommend deciding first —
   largest risk concentration), (c) ~103 improve candidates.
3. **The consolidation extension, separately:** 301 /bulk-vcard-qr →
   /bulk-vcard-generator and /regional-payment-qr →
   /pakistan-payment-qr (targets indexed, outside the 856), and whether
   Step 5 may evaluate the same for other ≥0.95 indexed-twin pages.
4. A fresh uncapped Performance > Pages export before any 410 is
   applied would retire the capped-export caveat on REMOVE's demand
   test (STEP4-REPORT red-team #3).
Items 2/3/4/5 from the original list (Manual Actions, Crawl Stats,
Sitemaps, Vercel logs) are unchanged and still open.

## Step 5 addendum (2026-11-17) — built and staged; merge order matters

Step 5 is implemented and staged in ~/workspace/seo-push/step5-{0,A,B}/
for branch `seo/step5-indexing-controls` (base: remote main 532177e7).
Approvals/actions now needed, in order:
1. **Push + merge Commit 0 (evidence) and Commit A (indexing
   controls)** — A is safe to merge first: removals are not active in
   it (removed pages still serve 200; they only leave the sitemap
   and internal links).
2. **After A deploys:** one curl of https://www.freeqrcode.tools/ —
   if it still answers 307, the redirect is platform-owned (R-014)
   and needs the owner's dashboard change to become permanent.
3. **A fresh, uncapped Performance > Pages export** (same ask as
   Step 4 addendum item 4) to re-verify the 87 REMOVE pages' demand
   evidence — **then** merge Commit B (410 activation, 2 files,
   labelled DO-NOT-MERGE until this export is checked).
4. Unchanged and still open: the PROTECT deferred sub-lists and the
   consolidation-extension 301s (Step 4 addendum items 2–3), Manual
   Actions confirmation (H6), Crawl Stats, Sitemaps detail.
