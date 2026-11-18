# Testing — Social Media Calendar

## Layers

1. **Unit/component tests (Vitest)** — `src/app/socialcalendar-site/_lib/__tests__/`
   - tz.test: DST transitions incl. Australia/Lord_Howe (30-minute
     shift), Asia/Karachi, America/New_York gap/fold, Europe/London;
     recurrence expansion.
   - repository.test: repository + backup/restore round-trips.
   - platforms/captions.test: registry completeness; weighted counting
     (X URL/emoji rules), validation, trim suggestions.
   - library.test: idea/template datasets, placeholder engine.
   - holidays.test: dataset integrity, anchor dates, lunar flags.
   - utm.test: URL building and encoding.
   - intelligence.test: pillar balance, gap detection, evergreen
     eligibility, computed best times, auto-schedule proposals, rule
     evaluation, chrono-node NL parsing in-zone.
   - exports.test: formula-injection neutralization, CSV/ICS escaping,
     SVG month sheet, CSV parse/mapping/import builders.
   - privacy.test: AES-GCM round-trip + wrong password, share payload
     strip/filter/round-trip (node environment for WebCrypto/streams).
   - search.test: diacritic-insensitive matching, filter composition,
     URL param round-trip.
   - stress.test: 10,000-post placement + search timing budget.
2. **End-to-end (Playwright)** — `e2e/socialcalendar.spec.ts`: landing,
   guide rendering, workspace boot + onboarding, editor create flow,
   command palette, share viewer, axe-core on key routes, responsive
   screenshots at representative viewports.
3. **Gates per phase**: typecheck, lint, full repo Vitest suite,
   production build + four-host serve smoke at phase-group boundaries,
   and `scripts/check-socialcalendar-seo.mjs` for published pages.

## Running

```bash
npx vitest run src/app/socialcalendar-site
npx playwright test e2e/socialcalendar.spec.ts   # needs a served build
node scripts/check-socialcalendar-seo.mjs
```

Dexie itself is not exercised under jsdom (no fake-indexeddb); the
repository's in-memory implementation and pure logic carry the tests,
and real-browser behaviour is covered by the Playwright suite.
