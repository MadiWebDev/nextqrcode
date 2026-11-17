# DIAGNOSIS.md — Why 856 pages of freeqrcode.tools are not indexed

**Date:** 2026-11-17 · **Steps 1–3 of the Indexing Fix program.**
**Inputs:** two GSC Coverage drilldowns (686 "Crawled – currently not indexed" +
170 "Discovered – currently not indexed", zero overlap), the Phase 0 baseline
(E-001…E-033), a fresh audit of all 856 URLs (`output/audit.csv`), a link-graph
pass over all 2,123 sitemap+drilldown URLs, a Googlebot-UA pass, near-duplicate
similarity over the whole sitemap corpus, and rubric scores for all 856
(`output/scores.csv`, method in `output/scores-README.md`).

**Executive summary.** The 856 pages are, today, technically flawless as a
group: every one returns 200, is self-canonical, indexable, in the sitemap
(853/856; the 3 exceptions are files, not pages), reachable within 2 clicks,
and carries its full content in the initial HTML. Nothing a crawler meets
explains their exclusion. What distinguishes them is what they *are*: a blog
corpus in which 115 of the 856 have a ≥0.8 near-identical twin and 37
near-duplicate clusters cover 406 pages, published in bulk around Oct 19–20,
saturated with YMYL-adjacent templated topics (213/856 screening-flagged;
0/26 sampled pages carry a disclaimer), and carrying almost no measured
demand (only 38 of 856 have ever earned a click). Google crawled most of them
in two waves (Oct 19–20 and Oct 28–29), declined to index them, and has not
crawled 170 of them at all. The verdict pattern is a site-level quality/triage
decision by Google, taken against a bulk-published templated corpus — with a
historical technical break (Phase 0) explaining the *timing* of the traffic
cliff, not the continued refusal to index these specific pages.

---

## H1 — Mass publication of similar templated pages (Oct 17–20) triggered a quality filter

- **Prediction if true:** the not-indexed set is dominated by the templated
  families created in that window; near-duplicate similarity inside those
  families is extreme; the drilldown timelines show the set exploding right
  after the publish window; YMYL-adjacent templated topics are over-represented.
- **Tests:** drilldown Chart.csv timelines (E-034); 5-shingle Jaccard
  similarity within families over the full corpus (E-040); YMYL screening +
  26-page manual sample (E-041); the twin test — for each ≥0.8 pair, is the
  twin inside or outside the not-indexed set, and is the outside twin earning?
  (E-043).
- **Results:** "Discovered" spiked to **283 on Oct 20**, the day after the
  Oct-19 publish (E-013/E-034); **310 of the 686 crawled pages were last
  crawled Oct 19–20** — Google came, read them, and declined. Similarity:
  **88 pairs ≥0.9 and 1,279 pairs ≥0.8**; the worst pairs are textually
  identical with the topic noun swapped (clinics ↔ veterinary clinics at
  **1.00**). Blog clusters at 0.8: **37 clusters covering 406 pages**.
  115 of the 856 have a ≥0.8 twin; blog median max-similarity is 0.60 while
  every other family's median is ≤0.05 — duplication is a blog-corpus
  phenomenon, not a site-wide one. YMYL: 213/856 flagged; sampled pages carry
  no disclaimers and mostly no verifiable sourcing (E-041).
- **The twin test cuts against the simple version of H1:** of the ≥0.8 pairs,
  481 have their twin *outside* the 856 and earning impressions, and within
  the 856, pages with a ≥0.8 twin earn impressions at 53% vs 47% for pages
  without one (E-043). Google is **not** mainly doing per-pair duplicate
  triage (keep one, drop one). The supported mechanism is coarser: a
  site/family-level quality assessment formed when the bulk corpus was
  crawled, depressing indexing and crawl priority for the whole cohort —
  including pages that are individually unobjectionable.
- **Verdict: LIKELY — the leading cause, in its site-level form.** (The
  per-pair form is REJECTED by E-043.)
- **What would change my mind:** Crawl Stats showing Googlebot fetched these
  URLs at normal rates all along and the Indexing report attributing the
  exclusions to a different reason class (e.g. "Duplicate without
  user-selected canonical" dominating would revive per-pair triage); or a
  controlled test — substantially rewriting a sample of near-duplicate pages
  and seeing no indexing change over 4+ weeks while untouched controls also
  recover (which would point back to a purely temporal/site-trust cause).

## H2 — Crawl scheduling limits: Google is rationing crawls

- **Prediction if true:** a large "Discovered – never crawled" set despite
  the URLs being in the sitemap and internally linked; slow TTFB or server
  errors that justify rationing; crawl demand skewed to a small URL subset.
- **Tests:** discovered-set audit (in-sitemap? depth? inlinks?) (E-038);
  TTFB distribution over 2,123 fetches (E-039); error observation across
  ~3,000 audit fetches.
- **Results:** all **170 discovered URLs are in the sitemap**, 162 sit at
  click depth 2 (8 at depth 1), median 2 inlinks — Google knows exactly
  where they are and has chosen not to spend a single crawl in ~4 weeks
  (E-038). Server side gives it no excuse *today*: median TTFB 0.66 s
  through an inflating proxy, p90 0.94 s, **zero 5xx/429 observed**. The
  "slow server" sub-hypothesis is therefore rejected on current data
  (historical TTFB is unknowable without Crawl Stats). What remains is
  rationing by perceived value — which is H1's shadow: crawl priority is a
  quality output, not an independent fault.
- **Verdict: LIKELY as a mechanism, not as a root cause.** The discovered
  set is what H1 looks like from the crawl scheduler's side.
- **What would change my mind:** Crawl Stats showing a hard host-load
  problem in Oct–Nov (fetch failures, high response times) would promote
  the server sub-hypothesis; Crawl Stats showing *high* crawl volume on
  these URLs would refute rationing entirely.

## H3 — Technical blockers (canonical, noindex, soft-404, JS-only, bot challenges)

- **Prediction if true:** a material share of the 856 shows non-200 status,
  redirect chains, non-self canonicals, noindex (meta or header), robots
  blocks, empty/JS-only main content, or different content for a
  Googlebot UA.
- **Tests:** full audit of the 856 (E-035); Googlebot-UA pass over all 856
  (E-036); sitemap audit (E-037); robots.txt content + git history (E-044);
  raw-HTML content extraction (initial HTML, no JS executed).
- **Results:** **every check passes, on essentially every URL.** 856/856
  return 200 with no redirect; 852/856 are self-canonical and every
  canonical target returns 200; **zero** noindex by meta or X-Robots-Tag
  (absent on all 2,123 fetched URLs); robots.txt blocks none of them and
  its source file has **no commits between Oct 19 and Nov 17** (E-044);
  median main content 800 words **in the initial HTML** — nothing is
  JS-dependent (the site is statically prerendered; the rendered-DOM
  cross-check could not run in this sandbox — E-047 — but is not needed to
  establish that the content is server-rendered). Googlebot-UA responses
  are identical to normal-UA on all 856 (E-036). The only defects found are
  single-page or cosmetic: `/qr-image-metadata-auditor` serves **no
  canonical at all** (E-046), and the sitemap lists `/bulk-vcard-qr` twice
  (E-037).
- **Historical caveat (not double-counted):** Phase 0 established a real
  technical break in the collapse window — deployments failing Oct 28 –
  Nov 12 and a sitemap index returning 404 until Nov 13 (E-011/E-012,
  LIKELY). That break explains the *impressions cliff* (E-002) far better
  than it explains the *present* state: the site has been healthy and
  recrawlable since Nov 13, yet these 856 remain refused. A transient
  break does not produce a durable, content-selective refusal; and note
  `src/app/sitemap.ts` itself changed on Oct 27 (two commits, E-044) —
  the day before the cliff — which keeps a sitemap-side contribution to
  the timing plausible but unproven.
- **Verdict: REJECTED as the current cause; the historical Oct 28 break
  remains a LIKELY contributor to the collapse timing (from Phase 0).**
- **What would change my mind:** URL Inspection on a sample showing
  "crawled as" content materially different from what we fetch (would
  indicate network-keyed bot handling invisible to UA tests, E-019's
  caveat); Crawl Stats showing fetch failures in the window; the Indexing
  report showing these URLs under a technical reason class instead of
  "Crawled/Discovered – currently not indexed".

## H4 — Internal linking: orphans, depth, sitemap-only discovery

- **Prediction if true:** not-indexed pages are orphaned or ≥4 clicks deep,
  or discoverable only via the sitemap.
- **Tests:** full link graph over 2,123 URLs — inlinks and BFS click depth
  for all 856 (E-038); sitemap membership cross-check (E-037).
- **Results:** **no orphans among pages** (the only zero-inlink URLs are
  the 2 font files and the web app manifest, which are referenced as
  resources, not linked as pages — E-045). Depth: 845 of 853 pages at
  depth ≤2; the 8 template pages sit at depth 3. Every discovered-set URL
  is in the sitemap *and* linked. The strong form of H4 is dead. A weak
  form survives: **median inlinks = 2** — most of these pages are endorsed
  by exactly one hub listing plus a sibling link or two, which gives
  Google little priority signal and plausibly feeds the H2 rationing of
  the discovered set.
- **Verdict: REJECTED as a primary cause; weak form (thin endorsement)
  retained as a HYPOTHESIS-level minor contributor.**
- **What would change my mind:** an internal-link experiment in Step 6 —
  adding curated in-content links to a sample of discovered pages and
  observing crawl/index movement against controls.

## H5 — Sitemap quality

- **Prediction if true:** the sitemap contains non-200, redirected,
  noindex, non-canonical, duplicate or asset URLs; lastmod values are
  fake (all "today" or all identical); the index/robots references
  disagree.
- **Tests:** full sitemap fetch and per-entry audit (E-037); robots.txt
  sitemap reference check (E-044).
- **Results:** mechanically the sitemap is **clean**: 2,121 entries, every
  one 200, canonical and indexable today; no assets; the index lists
  exactly the 10 generated sections; robots.txt references the index.
  Three blemishes: **`/bulk-vcard-qr` is listed twice** (2,121 entries,
  2,120 unique); **1,571 blog entries share a single lastmod
  (2026-10-05)** — a batch date, not per-article change dates, so the
  lastmod signal is uninformative where it matters most; 530 non-blog
  entries have no lastmod. The substantive problem is not mechanical but
  editorial: the sitemap faithfully submits the entire templated corpus,
  near-duplicates included — it amplifies H1 rather than causing an
  independent failure.
- **Verdict: PARTIALLY CONFIRMED — mechanical defects minor (duplicate
  entry, batch lastmod); the sitemap's role as H1's amplifier is LIKELY.**
- **What would change my mind:** the GSC Sitemaps report showing fetch
  errors or discovered-count anomalies for specific sections would
  promote a mechanical cause; it is on the still-missing list.

## H6 — Manual action or security issue

- **Tests available to me:** none that are decisive — both reports are
  owner-only in Search Console. Indirect signals: the site serves clean
  content to both UAs (E-036), winners kept earning until the cliff
  (E-001/E-002), and a manual action severe enough to zero impressions
  usually arrives with a message and a partial-match pattern.
- **Verdict: UNVERIFIED.** Per the program rules this is **not** assumed
  empty. It stays the #1 blocking unknown: a one-minute owner check
  (QUESTIONS.md #2) closes it.
- **What would change my mind:** the owner's confirmation, either way.

## H7 — Normal new-site delay

- **Prediction if true:** exclusions concentrate in "Discovered" (never
  got to them yet), resolve steadily with time, and the crawled set is
  small or shrinking.
- **Results:** the opposite pattern. 686 pages were **crawled and
  refused** — an active decision, not a queue position; the crawled count
  *grew* to its maximum (686) on Nov 10, three weeks after the main crawl
  wave; impressions fell off a one-day cliff and stayed at ~zero for 19
  days (E-002). New sites are not normally punished for existing; they
  are simply slow to be trusted — and slowness does not produce a cliff.
- **Verdict: REJECTED as a full explanation.** (A residual "low priority
  in the queue" reading of the discovered set is H2, already counted.)

---

## What I could not check

1. **Manual Actions / Security Issues** (H6) — owner-only. UNVERIFIED.
2. **Crawl Stats** — Googlebot's actual fetch success, response codes and
   timing in Oct–Nov; would settle H2's server sub-hypothesis and the
   historical half of H3.
3. **Rendered-DOM comparison** — headless Chromium cannot egress through
   this sandbox's proxy (ERR_TUNNEL_CONNECTION_FAILED, E-047). Substituted
   by proof that full main content is in the initial HTML; a true rendered
   check needs URL Inspection's "crawled page" view or a browser outside
   this sandbox.
4. **Preview/staging deployment indexability** — no `vercel.app`
   references or preview-specific noindex logic exist in the code
   (E-049); whether live preview deployments are indexable could not be
   tested from here. UNVERIFIED.
5. **Which coverage bucket the "absent" twins sit in** — the twin test
   (E-043) can see earners and the two drilldown sets; a twin absent from
   both may be indexed-without-impressions or in another exclusion
   bucket. The full Indexing report would close this.
6. **Historical server behaviour** (TTFB/5xx in October) — today's
   measurements cannot speak for October; only Crawl Stats / Vercel logs
   can.

## Still-missing inputs, ordered by blocking power

1. **Manual Actions + Security Issues confirmation** (QUESTIONS #2) —
   blocks H6, the only hypothesis that would rewrite the whole plan.
2. **Indexing → Pages: full "why pages aren't indexed" table** (QUESTIONS
   #1) — now partially substituted by the two drilldowns the owner did
   provide (686 + 170 with example URLs = the full sets for these two
   reasons); the remaining reasons (duplicates, soft 404, redirects)
   would complete the picture and directly test H1's per-pair form.
3. **Crawl Stats for Oct–Nov** (QUESTIONS #3) — settles H2/H3-historical.
4. **Sitemaps report detail** (QUESTIONS #4) — settles H5's mechanical
   half and dates Google's sitemap reads against the 404 window.
5. **Vercel deploy history / logs for Oct 15 – Nov 5** (QUESTIONS #5) —
   converts E-011/E-012 from LIKELY to CONFIRMED or refutes them.

## Bottom line for Step 4 (not part of this step's approvals)

The classification in Step 4 should be built on: duplication clusters
(E-040), protect status (E-042 — 280 pages must not be touched without
explicit approval), YMYL risk (E-041 — 213 flagged; sampled pages are
REMOVE-or-rewrite-with-sources candidates, never generated-text
refreshes), and the demand vacuum (607 of 856 score demand ≤1). The fix
is editorial surgery on the blog corpus plus sitemap/indexing controls
built from the same source of truth — not a technical repair, because
technically there is almost nothing left to repair.
