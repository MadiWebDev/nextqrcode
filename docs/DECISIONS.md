# Decisions

Every non-obvious choice made during the autonomous build: decision, alternatives considered, reason.
The user asked for zero questions — the best default is chosen and recorded here.

---

## Phase 0

### D0.1 — Test framework: Vitest over Jest

- **Decision:** Vitest 5 + jsdom + Testing Library; Playwright for e2e.
- **Alternatives:** Jest (slower, more config), Cypress (heavier).
- **Reason:** Vitest is the fastest TS-native runner, shares the Vite transform pipeline, and
  Playwright is the standard for cross-browser e2e including mobile viewports.

### D0.2 — @types/node upgraded 20 → 24

- **Decision:** Bumped `@types/node` to `^24`.
- **Alternatives:** Pin Vitest 3, or `--legacy-peer-deps`.
- **Reason:** Vitest 5 requires `@types/node ^22 || >=24`; runtime is Node 24.20.0, so aligning
  types with the runtime is the correct, non-hacky fix. No code impact.

### D0.3 — Husky v9 hook format

- **Decision:** `.husky/pre-commit` contains only `npx lint-staged` (no `_/husky.sh` sourcing).
- **Reason:** Husky 9 removed the `_/husky.sh` shim; the old line would break the hook.

### D0.4 — CI runs e2e only on Chromium

- **Decision:** GitHub Actions: quality job (prettier, eslint, tsc, vitest, build) then Playwright
  smoke on Chromium only.
- **Alternatives:** Full browser matrix on every push.
- **Reason:** Speed and cost; the mobile project runs locally and in the nightly extended suite
  (Phase 9). Chromium catches the vast majority of regressions.

### D0.5 — Brand/domain: keep `config/site.ts` as single source of truth (Phase 1)

- **Decision:** Resolve the "QR Code Tools" vs `nextqrcode` / `freeqrcode.tools` inconsistency via
  a central `config/site.ts` in Phase 1, not by renaming the repo.
- **Reason:** Renaming the GitHub repo mid-program would break the user's existing Vercel
  deployment links; a config-driven brand is reversible.

### D0.6 — Byline `codexengr` kept as site-team identity

- **Decision:** Keep `codexengr` ("QR Studio by codexengr") as the author/operator byline.
- **Alternatives:** Invent a staff-writer persona; strip bylines.
- **Reason:** `.agents/tasks/phase0-plan.md` (prior repo convention) establishes `codexengr` as the
  operator handle across footer, contact pages and content. It is not a fabricated third-party
  persona; replacing it would break repo continuity. The master spec allows "real or site-team name".

### D0.7 — Adopt prior plan's style rules as code conventions

- **Decision:** Adopt the page style rules from `.agents/tasks/phase0-plan.md` (wrapper classes,
  h2/h3/body styles, `<time dateTime>`, link styles, per-page metadata + BreadcrumbList JSON-LD).
- **Reason:** Master spec rule 1: repo files win for code conventions. These rules are already
  applied across existing pages; Phase 1 codifies them into the design system.
