# RISKS.md — SEO program risks

Format: risk · likelihood · impact · mitigation · rollback.

- **R-001 — Snippet changes shuffle rankings on the few earning pages.**
  Likelihood: low–medium (titles of 5 scan guides + 1 blog post changed; positions
  6–11 are volatile). Impact: medium — these pages are a large share of the site's
  remaining winners (E-007). Mitigation: H1s and body content byte-identical; only
  truncation suffixes removed; changes batched on one annotated date so effects are
  isolable; winners /pakistan-payment-qr and /qr-splitter-scanner received *schema
  only*, no title/description edits. Rollback: restore the six `devices.ts` entries
  and delete one override-map entry (CHANGELOG C-004/C-005).
- **R-002 — FAQPage schema yields no visible rich result.** Likelihood: high (Google
  restricts FAQ rich results to authoritative government/health sites). Impact: low —
  the change is semantic completeness, explicitly *not* sold as a CTR trick (spec
  Phase 4B). Mitigation: expectation recorded here and in STATE.md; success is
  measured on validity/coverage, not rich-result appearance.
- **R-003 — JSON-LD inside client components might not render server-side.**
  Likelihood: low. Impact: medium (schema silently absent). Mitigation: the
  post-build local serve check (E-033) fetches the rendered HTML of representative
  changed pages and asserts FAQPage presence in the *served* markup; the components
  are React-rendered during prerendering like the rest of the page.
- **R-004 — Metadata fixes cannot repair an indexing/quality collapse.** Likelihood:
  high that they are insufficient alone. Impact: expectation risk, not site risk.
  Mitigation: STATE.md and the phase report state plainly that this run treats
  snippets/schema only; the Oct-28 cause is still unproven (PHASE1-PREP) and Phase 2
  indexability decisions remain gated on the owner's data and approval.
- **R-005 — Duplicate re-export pages (/regional-payment-qr, /bulk-vcard-generator)
  split signals.** Likelihood: confirmed present (E-024). Impact: low–medium.
  Mitigation: none applied (consolidation/canonical changes are gated); documented
  for the Phase 2 URL list with a recommendation to consolidate into the canonical
  originals.
- **R-006 — The broken verification meta (E-015) could matter if the property's real
  verification method lapses.** Likelihood: unknown. Impact: high (loss of GSC
  access/data continuity). Mitigation: raised as QUESTIONS.md #11 with the
  conservative path (confirm DNS verification first; only then fix/remove the meta
  value in the Vercel env). No change made in this run.
- **R-007 — Non-English locales still carry the uncorrected hub-card claims.**
  Likelihood: confirmed (only en.json was corrected, C-003). Impact: low (the
  locale homepages repeat the payment/label descriptions in translation).
  Mitigation: flagged in STATE.md follow-ups; correct the other locale files from
  the same verified facts in the next batch — do not machine-translate corrections
  at scale (spec rule).
- **R-008 — This run's branch could be deployed together with unrelated work,
  muddying measurement.** Likelihood: medium (the repo's main moves fast). Impact:
  low–medium for attribution. Mitigation: the three commits are self-contained and
  labelled; record the actual deploy date/hash in CHANGELOG.md when deployed and
  annotate GSC for that date.
- **R-009 — Rollback for the whole run.** All changes are unpushed staged commits;
  pre-production rollback = discard the staging. Post-deploy rollback = revert the
  three commits (file lists in the staging manifests) and redeploy; no data,
  redirect, robots or sitemap state is touched by any commit, so rollback restores
  the exact prior metadata/schema surface.
- **R-010 — Step 4 acting on score totals alone would misclassify.**
  Likelihood: medium (totals compress: median 19/25, E-048). Impact: high —
  a protect=YES earner or a sourced YMYL page could be pruned on a
  heuristic total. Mitigation: scores-README.md and DIAGNOSIS.md both state
  totals are a triage aid only; Step 4 must join components + protect +
  risk_class + max_similarity per URL. Rollback: n/a (analysis only).
- **R-011 — The live Phase 0 batch confounds before/after measurement.**
  Likelihood: certain (it is already live, E-036). Impact: medium — GSC
  movements after 2026-11-17 mix metadata effects with any indexing
  recovery. Mitigation: the deploy date is now recorded (E-036); recommend
  a GSC annotation; Step 7's weekly cadence should treat 2026-11-17 as a
  regime boundary. Rollback: n/a.
- **R-012 — YMYL screening false negatives in Step 4.** Likelihood: medium
  (screening matches slug/opening mentions only). Impact: high if a YMYL
  page is classified as ordinary content and refreshed with generated
  text. Mitigation: Step 4 must re-screen candidate KEEP/IMPROVE pages
  against full content, and the 26-page sample (E-041) sets the expected
  base rate (no disclaimers anywhere). Rollback: n/a (analysis only).

- **R-013 — Templates hub card is English-only for now.** The homepage
  hub card added in Step 5 (D-020) renders only where a 9th
  home.hubs.cards entry exists (en.json). The other 13 locales skip
  it via the existing `if (!copy) return null` guard — no breakage,
  but localized homepages don't yet pass the depth benefit. Follow-up:
  translate the one card into the 13 locale files. Likelihood:
  certain; impact: low.
- **R-014 — Production www redirect may be platform-owned.** If the
  307 is produced by the hosting platform's domain settings (E-053),
  the proxy 308 (D-018) will not change production behaviour — the
  platform redirect fires first. Detection: one curl after Commit A
  deploys. Owner action if so: set the www domain's redirect to
  permanent (308) in the platform dashboard. Likelihood: medium;
  impact: low (minor canonical hygiene, E-014).
- **R-015 — Link surfaces outside the audit graph.** The in-body
  remainder is 0 by two methods (E-057), but links rendered only
  client-side, or on pages outside the 2,123-URL graph, would not
  have been counted. If any survive, they will point at real 410s
  after Commit B — the correct crawler signal regardless. Check GSC
  coverage + server logs after B merges. Likelihood: low; impact: low.
- **R-016 — Commit B merged early would 410 on capped-export
  evidence.** REMOVE's demand test rests on the 1,000-row-capped
  Performance export (STEP4-REPORT red-team #3). Mitigation: B is a
  separate 2-file commit, labelled DO-NOT-MERGE in STATE.md, its code
  comment and its commit message; the agreed order is 0 → A → deploy
  + observe → fresh uncapped export → B. Likelihood: process risk
  only; impact: medium (reversible — merging a revert restores 200s).
