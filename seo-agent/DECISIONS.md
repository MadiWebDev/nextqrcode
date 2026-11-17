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
