# Content Rollout Log

Waves of ~100 pages published, per the Phase 5 rollout plan. Only pages that pass
the content audit (`scripts/content-audit.ts`) are indexed and in the sitemap;
failing pages are noindex until remediated (see `docs/CONTENT_AUDIT.md`).

## Wave 1 — 2026-10-19: Typed content families (166 pages, all passing)

| Family      | Route prefix    | Pages | Status        |
| ----------- | --------------- | ----- | ------------- |
| Industries  | /industries/    | 40    | ✅ 40/40 pass |
| Glossary    | /glossary/      | 40    | ✅ 40/40 pass |
| Scan guides | /scan-guide/    | 30    | ✅ 30/30 pass |
| Size guides | /qr-size-guide/ | 26    | ✅ 26/26 pass |
| Templates   | /templates/     | 30    | ✅ 30/30 pass |

All 166 pages: ≥400 words, 3–6 unique FAQs, ≥5 working internal links, byline,
Last reviewed 2026-10-19, sources where factual claims are made. Hub pages
(/industries, /glossary, /scan-guide, /qr-size-guide, /templates) indexed.

## Legacy blog: remediation backlog (581 pages, 0 passing)

The audit enforces the same bar on the legacy blog: 0/581 pass. Top failures:
<5 internal links (606 instances), <400 words (562), <3 FAQs (527), 25 duplicate slugs.
All are noindex + sitemap-excluded until remediated.

### Remediation plan (future waves)

- **Wave 2**: fix the 25 duplicate slugs (merge/dedupe), expand the 26 articles
  closest to passing (300+ words) to full bar. (~50 pages)
- **Wave 3+**: remediate in batches of ~100 by category (Fundamentals → Printing &
  Sizing → Security & Scanning → Business & Regional): expand to 400+ words,
  add FAQs to 3–6, interlink ≥5, re-run audit.
- Each wave: `npm run content:audit` must show the batch passing before the wave
  is marked complete here.

## Page counts (2026-10-19)

| Segment                           | Pages built      | Indexed (sitemap) |
| --------------------------------- | ---------------- | ----------------- |
| Typed families (5)                | 166              | 166               |
| Blog                              | 606 (581 unique) | 0                 |
| Tools / generators / legal / misc | ~50              | ~50               |
| **Total**                         | **~816**         | **~216**          |
