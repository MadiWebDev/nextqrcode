# DECISIONS.md — SEO program decisions

Format: decision · alternatives considered · who approved · date. "Agent (run
brief)" = decided under the commissioning brief's scope gate (metadata +
structured data only; no indexability changes) and the spec's smallest-safe-change
rule. Anything marked PENDING needs the site owner's explicit approval at a phase
checkpoint.

- **D-001 — AdSlot "Advertisement space reserved": no code change.** 2026-11-17,
  agent (run brief). The string is `sr-only` (screen-reader-only), not a visible
  placeholder (E-025). Alternatives: strip the span (rejected — it is the accessible
  label for the reserved ad region; removing it harms AT users and changes nothing
  visually); hide the whole empty box until ads load (rejected — that is a
  layout/CLS and ads-policy change, Phase 9 scope, and would remove the reserved
  space that prevents layout shift).
- **D-002 — fix-qr-camera-permission: description-only snippet rewrite.** 2026-11-17,
  agent (run brief). Its title has no colon, so title == H1 (E-029); editing the
  title would alter visible content, outside this run's gate. Alternative for a
  later phase: add a `metaTitle` split (as done for blog articles in C-005) to the
  scan-guide adapter — PENDING owner approval in Phase 3.
- **D-003 — Realme scan-guide served title accepted at 61 chars.** 2026-11-17, agent
  (run brief). Shortening further would change the H1; 61 vs the previous 77 is the
  improvement, and truncation is governed by pixel width, not an exact char cliff.
  Logged so the exception is explicit, not silent.
- **D-004 — Blog snippet override via `metaTitle`/`metaDescription` + `title.absolute`,
  not by editing the article title or the shared `art()` helper.** 2026-11-17, agent
  (run brief). The article title is the visible H1 and TechArticle headline; the
  helper constructs ~1,500 articles positionally, so extending it for one article
  was the highest-risk option. The override map in `src/lib/articles.ts` touches
  exactly one article and is trivially reversible (C-005).
- **D-005 — BreadcrumbList single-point fix DEFERRED to Phase 4.** 2026-11-17, agent
  (run brief); owner approval PENDING. 253 main-site pages render `<Breadcrumbs>`;
  only 15 emit BreadcrumbJsonLd (E-030). Emitting from the shared component is the
  right shape but would double-emit on those 15 and needs a dedupe + spot-check
  cycle of its own. Not bundled into a metadata batch.
- **D-006 — Homepage counts fixed from data, not by picking the prettier number.**
  2026-11-17, agent (run brief). Countries chip now derives from
  `getAllCountries().length` (E-020/E-021); en.json hub descriptions corrected to
  the verified scheme/sheet facts. Claims that verified TRUE (glossary, industries,
  size-guide cards) were left byte-identical.
- **D-007 — www→apex 307 and the filename verification meta: documented, not fixed
  in this run.** 2026-11-17, agent (run brief). Redirect changes are outside the
  scope gate, and the verification value is a Vercel env var (owner-side). Both are
  logged with evidence (E-014, E-015) and raised in QUESTIONS.md (#11) with the
  conservative recommendation: verify via DNS Domain property, then correct or
  remove the meta value; make www→apex a single permanent redirect in Phase 4.
- **D-008 — FAQPage schema generated only from data each page already renders.**
  2026-11-17, agent (run brief). No FAQ schema was written by hand, mirrored from
  JSX, or added to any page without a visible FAQ; none was removed anywhere.
  Schema-without-visible-FAQ count on the live site is 0 (E-022), so no violation
  list was produced — the audit's negative result is itself recorded.
- **D-009 — Push mechanics.** 2026-11-17, per standing project rule: changes are
  staged as three commits for branch `seo/metadata-faq-schema`; the parent agent
  pushes with the owner's approval taps. Nothing in this run was pushed or deployed
  by the SEO agent.
- **D-010 — Similarity candidate generation: ≥8 shared shingles or top-40.**
  2026-11-17, agent (Indexing Fix brief, Steps 1–3). Exact Jaccard over the
  full family cross-product is quadratic over 1,591 blog posts; candidates
  were generated from a shingle inverted index (≥8 shared shingles, plus each
  drilldown page's top-40 by shared count). Pairs at ≥0.8/≥0.9 share far more
  than 8 shingles by construction, so headline counts are exact; pairs near
  the 0.5 reporting floor are lower bounds and are labelled as such in
  similarity.md. Alternative (all-pairs) rejected on runtime; alternative
  (MinHash estimates) rejected because exact counts were affordable.
- **D-011 — YMYL screening uses word boundaries, not substrings.** 2026-11-17,
  agent. The first pass matched substrings and flagged 560 pages ("tax"
  inside "taxi", "aid" inside unrelated words). Re-run with word-boundary
  regexes + hyphen/space variants gives 213. Only 213 is citable; the 560
  figure was discarded and is recorded in E-041 so it is never quoted.
- **D-012 — Asset files in the drilldowns are classified, not scored.**
  2026-11-17, agent. The 2 .woff2 files and /manifest.webmanifest are not
  pages (E-045); they are marked `ASSET (not a page)` in scores.csv with no
  component scores, so Step 4 cannot accidentally assign them a content
  action.
- **D-013 — Render-sample failure recorded as blocked, not zeroed.**
  2026-11-17, agent. Chromium cannot egress through the sandbox proxy
  (E-047); output/render-sample.csv contains explicit "blocked" annotation
  rows (rendered_words = −1) instead of fabricated or zero values, and the
  diagnosis relies on the raw-HTML substitute evidence, labelled as such.
- **D-014 — Step 4 merge rule requires direct-pair similarity AND slug
  equivalence.** 2026-11-17, agent (within the owner's Step 4 approval).
  A member merges only on a direct ≥0.8 pair with the group survivor
  whose slugs differ solely by filler words; noun-swap pairs (≥0.9
  included) are differentiated, not merged, because the 301 would send
  readers to a different promised topic. Consequence: CONSOLIDATE = 0
  in this pass (E-051); the owner can promote named pairs from the
  report's cluster listing by explicit decision.
- **D-015 — Tool/landing pages are exempt from the thin-content REMOVE
  test (A-009 guard).** 2026-11-17, agent. Pages in tool families with
  intent_fit ≥3 (working tool detected) cannot be 410'd for low word
  count — the count measures tool UI, not content. This moved the 3
  payment-scheme and 4 WhatsApp landing pages from REMOVE to IMPROVE.
  No noindex-follow actions are used in Step 4; the one candidate
  (/sitemap-page) is PROTECT-gated.

- **D-016 — Indexing-policy defaulting rule.** 2026-11-17, agent
  (Step 5, within the owner's approval). The policy
  (src/lib/seo/indexing-policy.ts) is a denylist for data-driven
  families: blog posts and family/label entries are enumerated from
  data, so they are indexable unless classified REMOVE — an allowlist
  would have dropped ~1,020 unclassified indexed posts from the
  sitemap. Route-based pages (tools, generators, suites, static) keep
  the pre-existing structural freeze: they enter the sitemap only via
  the explicit path lists in src/app/sitemap.ts, and every list is now
  filtered through isIndexable() so a removed path can never be
  re-listed by accident. Scope: apex site only; the invoice and
  image-resizer subdomain corpora are not the Step 4 classification's
  subject and are not filtered by it.
- **D-017 — Sitemap section ids kept 0–9.** 2026-11-17, agent. The
  existing scheme maps cleanly onto the brief's family split (0 core/
  static, 1 tools, 2 qr-types, 3 bulk, 4 suites, 5 blog/guides,
  6 industries+glossary+scan-guides+size-guides+templates,
  7 labels+regional/payment, 8/9 the subdomain sites), so no
  re-sectioning was done and public/sitemap.xml + the robots.txt
  sitemap reference needed no change — avoiding a needless index
  migration in GSC.
- **D-018 — www→apex 308 lives in src/proxy.ts.** 2026-11-17, agent.
  The 307's producer is not in the repo (E-053), so the fix is placed
  at the app's single request entry point: host www.freeqrcode.tools
  → 308 to https://freeqrcode.tools with path+query preserved, before
  any subdomain routing; the host derivation also falls back to
  nextUrl.hostname when no Host header is present. If production
  still answers 307 after this deploys, the platform domain setting
  is the producer and only the owner can change it (R-014). The
  proxy's CSP behaviour is untouched (no nonce, as documented in the
  file header).
- **D-019 — "https apex" sitemap guard is host-scoped per section.**
  2026-11-17, agent. The brief's CI rule "every sitemap URL is https
  apex" is implemented as: §0–7 apex-host only, §8 restricted to the
  invoice host, §9 to the imageresizer host, all https. The literal
  reading would delete the two subdomain sites' sitemap sections and
  contradict the shipped subdomain architecture; the scoped reading
  still forbids any cross-host contamination.
- **D-020 — Templates depth fix targets the hub's depth, not the
  hub's links.** 2026-11-17, agent. The /templates hub already linked
  every template page (server-rendered cards); template pages sat at
  depth 3 because the hub itself was at depth 2 — it was the only
  content hub missing from the homepage's CONTENT_HUB_META row
  (E-057 graph accounting). Fix: a /templates card appended at the
  end of CONTENT_HUB_META (existing index-zip with locale copy is
  undisturbed) + the matching en.json hubs.cards entry; the render
  guard skips the card on locales without translated copy (R-013).
  Template pages are now home → hub → page (depth 2).
- **D-021 — 410s are served by the proxy, staged as a separate
  DO-NOT-MERGE commit.** 2026-11-17, agent. Placement: the proxy's
  apex fall-through, after the subdomain rewrites and the www
  redirect, as an exact-path policy lookup — so the subdomain sites
  cannot be affected and no page files need deleting (several REMOVE
  routes are generated/data-driven). Commit B (src/proxy.ts + its
  guard tests) is staged separately and must not merge until the
  fresh uncapped Performance export re-verifies the 87 (QUESTIONS).
