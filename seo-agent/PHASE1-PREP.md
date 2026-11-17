# PHASE1-PREP.md — Diagnosis preparation: the Oct 28 collapse + non-indexing

Prepared 2026-11-17 from Phase 0 evidence. Each hypothesis: prediction if true ·
test · result so far · verdict. Verdicts use the ledger's confidence labels.
Nothing here is a Phase 1 conclusion — the Indexing report, Crawl Stats and
Manual Actions/Security confirmations (QUESTIONS.md #1–3) are still missing, and
several verdicts cannot harden without them.

**The fact to explain** (E-002): impressions ramped Oct 6–27 (peak ~470/day),
then fell off a one-day cliff — Oct 27: 464 → Oct 28: 101 → Oct 29: 10 → ~0 for
19 days, with zero clicks after Oct 27 — while ~2,121 sitemap URLs exist and the
user reports a large "Discovered – currently not indexed" backlog dating from the
Oct-19 bulk publish (E-013).

## H1 — Technical break around Oct 27–28
- **Prediction if true:** GSC Crawl Stats show fetch failures/timeouts or a host
  problem starting ~Oct 28; the Indexing report shows a spike in fetch-related
  exclusions; deploy records show a broken or stale production build in the window.
- **Tests run:** full live crawl of all 2,121 sitemap URLs (E-016); Googlebot-UA
  spotcheck ×15 (E-019); protocol checks (E-014); project deploy history (E-011,
  E-012).
- **Result so far:** *Today* the site is technically clean — 100% 200s (one proxy
  error on my side, 200 on recheck), self-canonicals everywhere, no noindex, fast
  responses, no UA-keyed differences. But two historical facts fit the window
  precisely: **deployments were failing Oct 28 – Nov 12** (E-011), so production
  ran a stale build for ~2 weeks; and **the sitemap index 404'd until Nov 13**
  (E-012) — if that began with the failed-deploy window, Google lost its sitemap
  index at exactly the cliff. A sitemap-index 404 alone usually does not zero
  impressions for already-discovered pages, so H1 likely needs a partner cause.
- **Verdict: LIKELY contributor; UNPROVEN as sole cause.** Decisive tests pending:
  Crawl Stats + deploy log dates (QUESTIONS #3, #5).

## H2 — Quality re-evaluation of templated / near-duplicate content
- **Prediction if true:** losses concentrate in the templated families (blog,
  scan-guides, glossary); near-duplicate similarity within families is high;
  "Crawled/Discovered – not indexed" dominates the Indexing report.
- **Tests run:** export composition (E-006: blog = 863/1,000 page rows, 340 blog
  pages ≤2 impressions); crawl word counts (E-016).
- **Result so far:** the *scale* precondition is confirmed — 1,591 templated blog
  posts published in bulk (E-013) dominate the site's footprint. But the naive
  mechanism — thin pages — is **falsified**: blog median is 996 words and only
  1.7% of all pages fall under 300 words (E-016). What remains untested is the
  real mechanism: near-duplicate *similarity* (a 1,000-word page can still be a
  variable-swapped clone). The Phase 1 shingling/SimHash analysis is the decisive
  test and has not been run yet.
- **Verdict: LIKELY as a background condition (scaled templated content);
  mechanism UNVERIFIED until the similarity analysis runs.**

## H3 — Crawl budget / discovery problem
- **Prediction if true:** "Discovered – currently not indexed" is the dominant
  exclusion; crawl stats show low crawl demand or wasted budget; orphan/thin
  internal linking on the affected families.
- **Tests run:** sitemap structure + counts (E-017); response-time distribution
  (E-016: median 0.79 s, p90 1.09 s — no server-side crawl deterrent today);
  user-reported backlog (E-013).
- **Result so far:** consistent with the user's report but nothing in the export
  or crawl can confirm Google's discovery decisions. A brand-new domain with a
  2,121-URL sitemap submitted in one bulk publish is a textbook setup for
  discovery throttling.
- **Verdict: UNVERIFIED, plausible.** Pending: Indexing report reasons (QUESTIONS #1)
  and Crawl Stats (QUESTIONS #3).

## H4 — Soft-404s / "Crawled – not indexed" from little main content
- **Prediction if true:** affected pages have sparse initial-HTML main content;
  word counts cluster near zero on the templated families.
- **Tests run:** crawl word-count distribution by family (E-016).
- **Result so far:** contradicted as a site-wide mechanism — medians are 345–996
  words across families; the only genuinely sparse group is imageresizer category
  listing pages (105–163 words), which are tool indexes, not content pages, and
  that subdomain has no GSC presence to lose (E-006).
- **Verdict: UNLIKELY as a site-wide cause.** May still apply to individual
  templates; the Indexing report's per-reason examples (QUESTIONS #1) would show it.

## H5 — Manual action, security issue, or hacked content
- **Prediction if true:** a notice exists in GSC Manual Actions / Security Issues.
- **Tests run:** none possible externally — these reports are only visible to the
  property owner. No public signal (site serves normally, no hacked-content
  markers in 2,121 crawled pages' titles/metadata).
- **Verdict: UNVERIFIED.** One-minute owner check requested (QUESTIONS #2). Do not
  assume either way.

## H6 — Normal new-site ranking volatility ("honeymoon" re-ranking)
- **Prediction if true:** a gradual settling after an initial testing period, with
  partial retention — some pages/queries keep impressions.
- **Tests run:** Chart.csv shape analysis (E-002).
- **Result so far:** the shape argues against it — a **one-day** cliff to ~zero,
  sustained 19 days with **zero clicks**, is not how honeymoon re-ranking usually
  presents. A brand-new domain makes it impossible to rule out entirely.
- **Verdict: UNLIKELY as the sole explanation** (weakened per the export's cliff
  shape).

## H7 — Algorithm / spam update correlation
- **Prediction if true:** a confirmed ranking update on the Search Status
  Dashboard overlaps Oct 27–28.
- **Tests run:** dashboard incidents feed fetched directly (E-010); corroborating
  trade-press search.
- **Result so far:** **no confirmed update aligns.** The September 2026 spam
  update ended Oct 8 — twenty days before the cliff, while impressions were still
  ramping; the feed lists no incident Oct 8 – Nov 10; the November core update
  began Nov 10, after the collapse, and impressions did not recover during it
  either (E-002). Third parties reported *unconfirmed* volatility from Oct 27 —
  noted as correlation only.
- **Verdict: UNLIKELY** (no confirmed update at the cliff; unconfirmed-volatility
  correlation recorded but not explanatory for a sustained zero).

## H8 — Canonical / duplicate confusion (protocols, hosts, variants)
- **Prediction if true:** index contains protocol/host variants of the same page;
  canonicals conflict; duplicate URLs split signals.
- **Tests run:** Pages.csv inspection (E-003, E-006); live protocol checks (E-014);
  full-crawl canonical audit (E-016); code inspection of re-export routes (E-024).
- **Result so far:** **partially confirmed, with direct evidence.** The http://
  homepage is indexed and earning at position 1.33 while http→https is handled by
  a 308 *today* (E-003 + E-014) — a real protocol split for the homepage. www→apex
  uses a temporary 307. Two duplicate page pairs serve identical content under
  self-canonical URLs (E-024), and the invoice host's only export appearance is a
  `#templates` fragment URL (E-006). Against a site-wide version of H8: the crawl
  found **0 non-self canonicals** across 2,120 URLs — canonical tags themselves are
  consistent.
- **Verdict: CONFIRMED for the homepage protocol split and the duplicate pairs;
  UNLIKELY as the cliff's sole cause** (the affected URLs are a handful, and the
  collapse hit every family at once).

## Leading pair, stated honestly

**H1 (a technical break in the Oct 28 – Nov 12 window, incl. the sitemap-index
404 and stale production build) + H2/H3 (a scaled templated footprint that gave
Google little reason to (re)index aggressively)** currently explain the most
evidence with the fewest assumptions: the cliff's *timing* fits H1; the *failure
to recover* after the Nov 12–13 fixes fits H2/H3. The export alone cannot
separate them, and neither is proven. The three owner inputs in QUESTIONS.md
(#1 Indexing reasons, #2 Manual Actions/Security, #3 Crawl Stats) are designed to
do exactly that.

## Red team — five ways this leading theory could be wrong

1. **The cliff is a reporting/property artifact.** If the owner views a different
   GSC property (URL-prefix vs domain), the "collapse" could partly be data
   consolidation. *Checked:* the export's Filters.csv and its http/subdomain rows
   are consistent with a domain property (A-001); cannot be fully excluded
   without the owner's other property views.
2. **The deploy-failure timeline is wrong.** E-011/E-012 come from internal
   project records (A-006), not Vercel logs I can inspect. If deploys actually
   succeeded, H1 loses its anchor and the timing coincidence evaporates.
   *Checked:* the sitemap fix commit and its live verification are in the project
   record; Vercel logs requested (QUESTIONS #5) precisely to test this.
3. **Today's healthy crawl proves nothing about Oct 28.** Headers, robots,
   canonicals or WAF rules could have been broken for exactly the collapse window
   and since repaired — invisible to every test in this document. *Checked:*
   acknowledged as the core limitation; H1 is labelled LIKELY, never CONFIRMED,
   for this reason.
4. **Word counts could be hiding duplication.** E-016 weakens "thin" but says
   nothing about *similarity*; 1,591 long-but-cloned posts would leave H2 fully
   intact. *Checked:* the prep explicitly refuses to downgrade H2 below LIKELY
   until the Phase 1 similarity analysis runs.
5. **The Googlebot test used a datacenter proxy, not Google's infrastructure.**
   IP/ASN-keyed bot protection would pass my spotcheck and still block Googlebot
   (A-005). *Checked:* flagged; URL Inspection (owner-side) is the decisive test
   and is requested implicitly via QUESTIONS #1/#3 follow-ups.
