# Implementation Plan — Social Media Calendar

Maps spec §33 phases to concrete deliverables. Every phase ends with:
tests → typecheck → lint → production build → four-host serve smoke
(apex, invoice, imageresizer, socialcalendar) → staged files + manifest.

## Phase 1 — Audit & architecture
docs/socialcalendar/{REPOSITORY_AUDIT, ARCHITECTURE, DECISIONS,
IMPLEMENTATION_PLAN, RISK_REGISTER}.md. No code changes.

## Phase 2 — Foundation
- proxy.ts: `SOCIALCALENDAR_SITE_HOST` + rewrite block (additive).
- globals.css: `.socialcalendar-site-root` chrome-hiding rule (additive).
- public/socialcalendar-logo.svg (original mark).
- src/app/socialcalendar-site/: layout.tsx (metadata, canonical, icons,
  manifest), SocialHeader/SocialFooter (Family links), placeholder-free
  shell routes: `/` (landing skeleton is Phase 9; Phase 2 ships the app
  shell + workspace route), `/app` workspace shell.
- _lib/types.ts (all §6 entities), _lib/db.ts (Dexie v1 schema +
  migrations), _lib/repository.ts (+ in-memory fallback), _lib/store.tsx
  (workspace context, autosave, save-state, undo/redo), workspaces CRUD +
  switcher, backup/restore JSON with validation + duplicate detection,
  theme wiring (light/dark/system/high-contrast via next-themes +
  app-scoped tokens), delete-all-data with typed confirmation.

## Phase 3 — Core calendar
_lib/tz.ts (Intl tz engine, DST tests), _lib/recurrence.ts,
_lib/dates.ts (grid math). Views: Month, Week, Day, Agenda, Timeline,
Kanban, Feed preview + Planning/Campaign/Editorial configurations.
dnd-kit drag (mouse/touch/keyboard sensors) + menu/keyboard move
alternatives. Post editor (dialog on desktop, vaul bottom sheet on
mobile), quick-create, density + week-start settings, revision history UI.

## Phase 4 — Content management
_lib/platforms.ts (15-platform registry), _lib/captions.ts (counters,
validation, trim suggestions), platform preview cards (original designs),
media manager (local blobs, canvas thumbnails, alt text, storage meter),
hashtag manager (+ banned words), UTM builder (+ QR generator cross-link),
checklists + checklist templates, campaigns, brand kit editor, approval
workflow (statuses, comments labelled local notes, activity timeline),
templates with {{placeholders}}, idea bank + _data/ideas.ts library.

## Phase 5 — Intelligence & automation
Pillars with % targets vs actual; gap detector with actionable
suggestions; repurposing planner (source-linked child posts); series;
evergreen queue (suggest-only); _lib/nl-schedule.ts (chrono-node +
confirmation preview); auto-schedule proposals with reasoning +
accept/reject; rules engine (create/edit/enable/test/history);
best-times (guidance dataset + manual heatmap + computed-from-logged);
_data/holidays.ts (2026–2028, 17 countries + INTL) + holiday planning
workflow (teaser/reminder/day-of) + solemn-day warning.

## Phase 6 — Analytics & exports
Dashboard widgets from local data; manual performance entry; CSV
import/export; charts (recharts) with data-table alternatives;
exporters: CSV, XLSX (via jszip-built minimal OOXML or CSV-compatible —
see DECISIONS addendum when implemented), JSON, ICS, PDF (jspdf, brand
kit, A4/Letter/A3), PNG/SVG calendar snapshots; import wizard (header
detection, column mapping, validation preview, dry-run, duplicate
detection, undoable import).

## Phase 7 — Privacy & offline
Encrypted backup (Web Crypto AES-GCM); share links (CompressionStream
gzip + base64url fragment, 180k limit, strip-notes/assignees options) +
/view share viewer (noindex, copy-to-my-calendar, print, export);
encrypted share option; PWA manifest + scoped service worker + update
notice; notifications (permission flow, in-app reminders, snooze,
history); BroadcastChannel multi-tab sync; crash recovery (draft
restore).

## Phase 8 — Power UX
Command palette (cmdk) + actions; keyboard shortcuts (suppressed in
editable fields); global search + filters (diacritic-insensitive, saved
views, URL-shareable state); onboarding (5 steps, realistic sample data,
blank/import starts); i18n dictionary module (en full; ur/ar/hi sample
scaffolds, labelled); accessibility pass (axe on key routes, focus
management, ARIA, reduced motion).

## Phase 9 — SEO
Landing page (SSG: hero, live preview, features, platforms, workflow,
privacy, FAQ + SoftwareApplication/WebSite/FAQPage JSON-LD, OG image),
starter guides (≤10, from _data/guides.ts), internal linking, sitemap
id 10 in generateSitemaps + public/sitemap.xml (same change),
scripts/seo-quality-gate (unique title/H1/description, ≥5 FAQs,
similarity, canonical, indexability) run over all published pages.

## Phase 10 — Final QA & delivery
Full vitest + Playwright e2e (CRUD, drag, keyboard drag, recurrence,
import/export, backup/restore, offline, multi-tab, mobile, dark, RTL),
responsive spot checks at the 13 spec viewports, axe, bundle-size
measurement, 10k-post stress check, security review, production build,
README + remaining docs (DESIGN, SECURITY, DEPLOYMENT, CONTRIBUTING,
PLATFORM_SPECS, DATA_MODEL, TESTING), final delivery report (§36),
source zip in ~/workspace/your_files/.
