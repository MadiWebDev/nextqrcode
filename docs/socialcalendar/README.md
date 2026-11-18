# Social Media Calendar

A free, privacy-first social media content planner at
**socialcalendar.freeqrcode.tools**. Plan posts for 15 platforms in one
calendar, balance content pillars, run approvals, detect gaps, and
export or share the plan — with **no account and no server storage**:
everything lives in the visitor's browser (IndexedDB).

## Highlights

- Month / Week / Day / Agenda / Timeline / Kanban / Feed-preview /
  Planning / Campaign / Editorial views over one data model, with
  drag-and-drop (pointer, touch, keyboard) rescheduling.
- Timezone-correct scheduling (native Intl engine) with DST-tested
  recurrence.
- Content pillars with target-vs-actual balance, gap detection,
  repurposing planner, evergreen queue, natural-language scheduling,
  auto-schedule proposals with reasoning, and a local rules engine.
- Analytics computed from real local data only; performance numbers are
  entered or imported by the user — never invented.
- Exports: CSV (formula-injection safe), XLSX, JSON, ICS, PDF, PNG/SVG
  month sheets. Imports: CSV with mapping, dry-run and undo.
- AES-GCM encrypted backups, fragment-based read-only share links
  (optionally password-encrypted), PWA with an app-scoped service
  worker, multi-tab sync, editor crash recovery.

## Where things live

- App code: `src/app/socialcalendar-site/`
- Program docs: `docs/socialcalendar/` (this folder)
- SEO gate: `scripts/check-socialcalendar-seo.mjs`
- Sitemap: section **10** in `src/app/sitemap.ts` + `public/sitemap.xml`

## Honest limits

- No direct publishing or account sync: platform APIs require
  per-platform review and credentials; a `SyncAdapter` interface is
  documented in ARCHITECTURE.md for a future opt-in implementation.
- "AI" features are deterministic local algorithms (gap rules, pillar
  math, chrono-node parsing). A provider-adapter interface is specified
  for future opt-in AI; no AI UI ships, because no provider is wired.
- Reminders fire only while a workspace tab is open (no server exists
  to push). The ICS export covers closed-app alerting.
- Urdu/Arabic/Hindi dictionaries are scaffolds labelled "(preview)",
  not production translations.

See FINAL_REPORT.md for the implemented / partial / not-implemented
ledger from the build program.
