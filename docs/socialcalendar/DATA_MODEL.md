# Data Model — Social Media Calendar

Storage: IndexedDB via Dexie (`_lib/db.ts`, schema v2), accessed only
through the repository abstraction (`_lib/repository.ts`) so an
in-memory fallback can take over (with a persistent warning banner)
when IndexedDB is unavailable. Types: `_lib/types.ts`.

## Entities (per workspace unless noted)

- **Workspace** — name, IANA timezone, week start, enabled platform
  ids, BrandKit, kanban pipeline order.
- **Calendar** — named sub-calendar with a colour.
- **Post** — title, caption, per-platform caption overrides, platform
  ids, `scheduledAt` (UTC instant) + authoring timezone, status
  (idea → draft → in-review → changes-requested → approved → scheduled
  → published → archived), content type, campaign/pillar links,
  priority, tags, assignee label, internal notes, media ids, checklist,
  recurrence rule, series link, source post (repurposing), evergreen
  metadata, UTM params.
- **MediaItem** — blob + generated thumbnail blob, alt text, dimensions.
- **Campaign / Pillar** — campaign window, goal, UTM defaults; pillar
  target percentage.
- **HashtagGroup / Template / Idea / ChecklistTemplate** — library
  content; templates carry `{{placeholder}}` captions; built-ins have
  `workspaceId: null` (templates) or live in `_data` (ideas).
- **ApprovalComment** — local reviewer notes, explicitly labelled as
  local (there are no user accounts).
- **PerformanceEntry** — user-entered or CSV-imported metrics per post
  per platform per date.
- **Reminder / NotificationSettings** — reminder rows per (post,
  offset); one settings row per workspace.
- **PlatformConfig** — per-workspace platform overrides (custom char
  limit, notes), keyed [workspaceId, platformId].
- **SavedFilter / BestTimeSlot / AutomationRule / RuleRun / Series /
  PostRevision / ActivityEntry** — power features and audit trail.
- **kv** — small per-workspace settings (banned words, UTM presets).

## Invariants

- Revisions: every post save stores the previous snapshot
  (PostRevision) and an undo entry; deletes are recoverable the same
  way.
- Backups (`_lib/backup.ts`) export the whole database (or one
  workspace) as a versioned JSON envelope; restores validate, detect
  duplicate workspaces, and can remap all ids (restore-as-copy).
- Nothing leaves the device except through explicit export/share
  actions initiated by the user.
