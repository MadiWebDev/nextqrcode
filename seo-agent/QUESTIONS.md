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
