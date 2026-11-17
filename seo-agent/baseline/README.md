# Baseline — 2026-11-17 (Phase 0, pre-change)

Everything in this folder describes the site **before** the 2026-11-17
metadata/schema batch is deployed. Later improvements are measured against it.

| File | What it is |
|---|---|
| `freeqrcode.tools-Performance-on-Search-2026-11-17__2.zip` | The owner's GSC Performance export as received (Filters: Web search, last 3 months; Chart/Queries/Pages/Countries/Devices CSVs; Search appearance empty). Source of E-001…E-009. |
| `gsc-export/` | The same export extracted to plain CSVs (Chart, Queries, Pages, Countries, Devices, Filters, Search appearance) so the evidence data lives in the repo as text; the zip above is the untouched original. |
| `crawl-2026-11-17.csv` | Full crawl of all 2,121 sitemap URLs (live fetch, ≤5 req/s, honest UA): status, redirect chain, response time, canonical (+self-referencing?), meta robots, title/description (+lengths), H1 count, approx. word count, JSON-LD types, FAQ schema/visibility flags. Source of E-016, E-022, E-024. |
| `summary-by-family.md` | The crawl aggregated by route family: counts, status distribution, median title/description lengths, % missing/duplicate, % non-self canonicals, % noindex, median words, FAQ coverage, median response time. |
| `googlebot-spotcheck-2026-11-17.csv` | 15 stratified URLs fetched with Googlebot UA vs normal UA: status/title/canonical/robots/byte-size signatures — 15/15 identical (E-019). |
| `../tools/crawl_baseline.py` | The crawler + spotcheck script (rerunnable: `python3 seo-agent/tools/crawl_baseline.py crawl|spotcheck`). |
| `../tools/summarize_crawl.py` | Regenerates `summary-by-family.md` from the crawl CSV. |

Known baseline limitations: response times were measured through this
environment's HTTP proxy (relative, not field data); word counts strip
nav/header/footer but not sidebars (approximation); one crawl row
(a blog URL) failed through the proxy and returned 200 on immediate recheck —
the CSV preserves the original ERROR row for auditability.
