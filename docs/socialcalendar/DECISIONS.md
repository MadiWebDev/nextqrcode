# Decisions — Social Media Calendar

Append-only. Each decision records the choice, the reason, and what it
overrides if anything.

- **D-SC-01 Docs location.** Product docs live in `docs/socialcalendar/`,
  not repo-root `docs/` (occupied by earlier programs' files). Spec §2's
  `/docs/...` paths are satisfied under that folder.
- **D-SC-02 SEO scope vs. the indexing freeze.** The spec asks for 60–120
  programmatic pages (§28) while the user's standing indexing-fix program
  freezes new templated pages (the October bulk dump caused the current
  not-indexed crisis). Resolution: landing page + ≤10 genuinely original
  starter pages, each passing the §28 quality gate (unique title/H1/
  description, ≥5 FAQs, internal links, similarity check — implemented as
  a runnable script). Expansion is deferred until the freeze lifts. This
  decision outranks the spec's page-count target.
- **D-SC-03 Account sync = interface only.** Existing NextAuth+Mongo auth
  was built for QR accounts and has no suitable per-user document store;
  syncing would also contradict the privacy-first promise. A typed
  `SyncAdapter` interface (with a no-op local implementation) is provided
  per spec §6's explicit fallback. No calendar content leaves the browser.
- **D-SC-04 AI = adapter interface only.** No AI provider is configured in
  the repo, and fake AI is prohibited. A documented `AiProvider` adapter
  interface + capability types ship with zero UI. The app is fully
  functional without it (spec §13).
- **D-SC-05 Timezone engine = native Intl + date-fns.** One approach,
  no new dependency: all wall-time ↔ instant conversions go through
  `Intl.DateTimeFormat` (ICU tz database, correct DST incl.
  Australia/Lord_Howe's 30-minute shift). date-fns handles calendar
  arithmetic on civil dates. `date-fns-tz`/`luxon` not added.
- **D-SC-06 Drag-and-drop = dnd-kit.** Accessible (keyboard sensor is a
  first-class citizen), permissive licence, spec-endorsed. Every drag
  interaction also has a non-drag alternative (menus, keyboard move
  commands) per spec §4.
- **D-SC-07 i18n = app-local dictionaries.** The main site's next-intl
  routing is path-locale based and wrong for a subdomain workspace. The
  calendar ships its own typed dictionary module (en complete; ur/ar/hi
  scaffolded with sample strings and explicitly labelled not
  production-ready, per spec §29) + logical CSS properties for RTL.
- **D-SC-08 PWA scoping.** The main site's `/sw.js` + `/manifest.webmanifest`
  are untouched. The calendar serves its own manifest and service worker
  from app route handlers (`/socialcalendar-manifest.webmanifest`,
  `/social-sw.js`) reached via the host rewrite, and registers the SW only
  on its own host. Its cache is versioned and app-prefixed.
- **D-SC-09 No AppHeader change.** Sibling sites were added to the main
  site header in an earlier program, but the header is shared, hot code;
  the calendar's own footer carries the Family links (spec §5), and the
  main-site header link is a one-line follow-up the owner can take later.
  Minimizes merge friction with the unmerged SEO branch.
- **D-SC-10 Shared-file edits are additive only.** proxy.ts gains one host
  constant + one rewrite block; sitemap.ts gains id 10 + one case;
  globals.css gains one `:has()` rule + app-scoped styles in the site's
  own stylesheet module where possible. Nothing existing is modified in
  behaviour.
- **D-SC-11 Data model = one Dexie database, versioned.** `socialcalendar`
  DB, schema v1 with all spec §6 entities as tables; migrations validated
  by tests; an in-memory fallback store implements the same repository
  interface when IndexedDB is unavailable (private browsing), with a
  persistent warning banner (spec §6).
- **D-SC-12 Share links carry data in the URL fragment only.** Compressed
  (native CompressionStream, gzip) + base64url in `#s=`; the fragment is
  never sent to a server. Hard limit 180,000 chars of fragment; beyond it
  the UI offers a file export instead (spec §20).
- **D-SC-13 Platform specs are labelled guidance.** The registry carries
  `PLATFORM_SPECS_REVIEWED = 2026-11-17` and the UI shows "Platform
  specifications last reviewed: 17 Nov 2026 — guidance, not a live
  guarantee" (spec §14). Users can override limits per workspace.
- **D-SC-14 Sample data is realistic and deletable.** Onboarding offers
  sample content written as real example posts (never lorem ipsum),
  created as ordinary posts the user can delete; "start blank" is
  equally prominent (spec §26).
