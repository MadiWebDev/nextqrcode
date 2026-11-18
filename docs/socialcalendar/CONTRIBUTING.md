# Contributing — Social Media Calendar

## Ground rules (from the program's standing orders)

1. **No fake functionality.** Every visible control must work or not
   exist. No mock data in production paths; demo/sample content is
   always labelled and user-invoked.
2. **Local-first stays local-first.** Do not add network calls for user
   content. Sync, if it ever ships, goes through the documented
   `SyncAdapter` interface behind explicit user opt-in.
3. **Never add a CSP nonce** in `src/proxy.ts` (it previously killed
   hydration on a sibling site).
4. **Additive-only edits** to shared files (`src/proxy.ts`,
   `src/app/sitemap.ts`, `src/app/globals.css`): one host block, one
   sitemap section, scoped rules.
5. **No AGPL dependencies.** Permissive licences only.

## Working on the app

- Code: `src/app/socialcalendar-site/` — `_lib` (data/logic, heavily
  unit-tested), `_components`, `_data` (static datasets), route folders.
- Every `_lib` change needs unit tests in `_lib/__tests__/`.
- Gates before commit: `npx tsc --noEmit`, `npx eslint
  src/app/socialcalendar-site`, `npx vitest run`, and the SEO gate when
  touching published pages.
- Platform limits live in `_lib/platforms.ts`; when you verify a change
  against a platform's current documentation, update
  `PLATFORM_SPECS_REVIEWED` and PLATFORM_SPECS.md in the same commit.
- Content additions to `_data/guides.ts` must keep the SEO gate green:
  unique title/H1/description, ≥5 FAQs, ≥450 words, low similarity.
