# Build Progress

Running log: what was done per phase, assumptions, known gaps. Updated at each phase commit.

---

## Phase 0 — Audit & cleanup ✅

**Done:**

- Full `src/` inventory → `docs/AUDIT.md`: architecture map, 40 QR types with payload-builder
  correctness table (SEPA `\\n` bug = P0, vCard→MECARD, event→GCal URL, ETH wei unit = P1),
  data-layer/security/SEO/ads/accessibility findings, build+bundle baseline.
- Deleted committed junk: `build-output.txt`, `tsc_err.txt`, `tsc_out.txt`, `tsc_output.txt`;
  `.gitignore` extended (log dumps, lighthouse artifacts, playwright reports, content drafts).
- Rewrote README (features, setup, env vars, scripts, architecture, contributing, content quality).
- Fixed all 53 ESLint errors (3 parallel agents: `set-state-in-effect` restructures,
  `<a>`→`<Link>`, entity escaping, `any`→precise types, impure-render moves).
- `tsc --noEmit`: clean (was already clean at baseline).
- `npm run build`: PASS (exit 0; 40 static routes, 581 SSG blog paths; `.next/static` 2.5 MB,
  largest chunk 224 KB).
- Tooling added: Prettier (+check/write scripts), Vitest 5 + Testing Library + jsdom
  (5/5 smoke tests pass), Playwright (Chromium installed; smoke suite), Husky v9 + lint-staged,
  GitHub Actions CI (prettier → eslint → tsc → vitest → build → playwright smoke on Chromium),
  `.env.example` (all Phase 10 variables documented).
- `docs/DECISIONS.md` started (D0.1–D0.5).

**Assumptions:**

- Bumped `@types/node` 20→24 to satisfy Vitest 5 peer deps (runtime is Node 24).
- Playwright e2e in CI installs Chromium via `npx playwright install --with-deps chromium`.

**Known gaps / UNVERIFIED:**

- Lighthouse baseline: no headless Chrome available in sandbox → UNVERIFIED, deferred to Phase 9
  (Lighthouse CI in GitHub Actions).
- Warnings: 86 ESLint warnings remain (mostly `react-hooks/exhaustive-deps`); triaged, not blocking.
