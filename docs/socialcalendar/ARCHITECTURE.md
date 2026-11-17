# Architecture — Social Media Calendar

## Shape of the product
A new subdomain site inside the existing Next.js app, following the proven
invoice/imageresizer pattern:

```
socialcalendar.freeqrcode.tools
  └─ proxy.ts host rewrite → src/app/socialcalendar-site/*
       ├─ page.tsx            Landing page (SSG, indexable, AdSlot allowed)
       ├─ layout.tsx          Own chrome (SocialHeader/SocialFooter), metadata,
       │                      canonical, icons, manifest link
       ├─ app/page.tsx        The workspace (client app, noindex)
       ├─ view/page.tsx       Read-only share viewer (client, noindex)
       ├─ guides/[slug]/      Starter SEO pages (SSG, quality-gated)
       ├─ socialcalendar-manifest.webmanifest/route.ts   PWA manifest
       ├─ social-sw.js/route.ts                          Service worker script
       ├─ _components/        Header, footer, workspace UI, views, editor…
       ├─ _lib/               types, db (Dexie), repository, tz engine,
       │                      platforms registry, captions, recurrence,
       │                      scheduling, rules, analytics, exporters,
       │                      backup/crypto, share codec, i18n, sync + AI
       │                      adapter interfaces
       └─ _data/              holidays 2026–2028, idea library, templates,
                              best-time guidance, SEO guide content
```

## Data layer
- **Dexie** database `socialcalendar`, schema v1, one table per spec §6
  entity (see DATA_MODEL.md). All access goes through a repository module;
  UI never touches Dexie directly.
- **Fallback:** if IndexedDB is unavailable, an in-memory repository with
  the same interface is used and a persistent warning is shown; nothing
  pretends to be saved.
- **State:** a React context store per workspace with debounced autosave,
  an honest save-state indicator (`saving → saved` only after the Dexie
  transaction resolves), undo/redo stacks for post mutations, per-post
  revision snapshots, and BroadcastChannel multi-tab sync with
  last-write-wins per post + a visible "updated in another tab" refresh.
- **Time:** posts store a UTC instant + the authoring IANA zone. The tz
  engine converts via Intl; calendar grids are computed in the workspace
  display zone. Recurrence expands civil dates in the post's zone, then
  converts — never the reverse — so DST transitions cannot silently move
  a posting time.

## Views (one data model)
Month, Week, Day, Agenda, Timeline (platform lanes), Kanban (pipeline),
Feed preview (Instagram-style 3-col grid), plus Planning board (agenda
grouped by campaign), Campaign calendar (month filtered to campaigns) and
Editorial overview (pillar/status summary grid) as configurations of the
same query + filter state. View, filters and density persist per workspace.

## Modules with hard honesty boundaries
- **Analytics** computes only from local posts + user-entered/imported
  performance entries. Empty states say so. Nothing is simulated.
- **Best times** = three labelled sources: general guidance dataset,
  user-defined slots, and values computed from the user's own logged
  performance. The UI labels which is which.
- **AI** and **account sync** are adapter interfaces only (D-SC-03/04).
- **Automation rules** are local, inspectable, and split into suggestion
  rules (never mutate) vs. action rules (one labelled mutation), each run
  logged.

## Sharing & PWA
Share payloads are compressed JSON in the URL fragment (D-SC-12); the
viewer is a separate route that never writes to the owner's database —
"copy to my calendar" imports into the viewer's own local workspace.
The service worker caches only the app shell + static assets under a
versioned, app-prefixed cache name; user data stays in IndexedDB.

## Security posture
Zod validation at every import boundary (backup, CSV/XLSX/ICS import,
share payload), formula-injection neutralization on spreadsheet exports,
ICS escaping, import size limits, MIME/size validation on media, no
remote fetching of user URLs, no user content in analytics, no secrets
anywhere (there are no API keys in this product).
