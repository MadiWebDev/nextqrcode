# ASSUMPTIONS.md — SEO program assumptions

Each assumption states what would prove it wrong and where it is used.

- **A-001 — The GSC export represents the domain property (all hosts/protocols).**
  Filters.csv says Search type = Web, Last 3 months, and Pages.csv contains http://
  and subdomain rows, consistent with a domain property. If the owner also has a
  URL-prefix property with materially different data, Phase 1 conclusions must be
  re-based. Used by: all of section A of EVIDENCE.md.
- **A-002 — Export rows are capped at 1,000, so per-page/query tail statistics are
  samples, not censuses.** Directly supported by the file row counts (Pages.csv and
  Queries.csv both stop at 1,000). Percentages computed *within* the export (e.g.
  blog share of page impressions) describe the exported top-1,000, not the whole
  site. Used by: E-005, E-006.
- **A-003 — The internal content-audit gate (`auditVerdict`, E-026) is intentional.**
  It matches the Oct-19 content program in project records. If it is instead an
  accidental leftover, several Phase 1 interpretations change (its per-URL robots
  gating interacts with indexation). Treated as intentional; flagged for owner
  confirmation in QUESTIONS.md.
- **A-004 — Crawl word counts approximate main content.** The crawler strips
  nav/header/footer/script/style but cannot perfectly isolate article bodies
  (sidebars, related-links modules remain). Family *medians* are robust to this;
  individual thin-page calls are not made from this data alone. Used by: E-016,
  H4 in PHASE1-PREP.md.
- **A-005 — The Googlebot-UA spotcheck is a proxy for Googlebot's experience, not a
  replica.** It rules out UA-keyed differences from this network; it cannot rule out
  IP/ASN-keyed bot protection. The decisive test is URL Inspection in GSC (owner).
  Used by: E-019, H1 in PHASE1-PREP.md.
- **A-006 — Project-history items E-011/E-012/E-013 are accurate as briefed.** They
  come from internal project records supplied with the commission; the repo alone
  cannot re-prove deploy timestamps. If Vercel logs (QUESTIONS.md #5) contradict
  them, H1's timeline must be rebuilt.
- **A-007 — "Served title" = metadata title + the root layout template
  (" | QR Studio", 12 chars) for child-segment pages, and the raw string for the
  root page.** Verified empirically against live HTML for the homepage (66 = raw
  string, no template) and scan-guide pages (field + 12) on 2026-11-17 (E-018,
  E-029). Used by: all title-length math in CHANGELOG C-004.
- **A-008 — FAQ visibility heuristic in the crawler** ("Frequently asked questions"
  text or ≥3 `<dt>` elements) has false-positive/negative risk on individual pages.
  Every URL it flagged as visible-without-schema was reconciled against code
  (E-023) before any change was made; the two heuristic-only cases
  (regional-payment-qr, bulk-vcard-generator) resolved to re-export duplicates of
  fixed pages. Used by: E-022.
