# Security — Social Media Calendar

## Model

The app is local-first: there is no account, no server database and no
telemetry for this product. Data exists only in the visitor's browser
(IndexedDB) and in files/links the user explicitly creates. The attack
surface is therefore mostly *input handling* — files and links the user
opens — plus the usual web platform concerns.

## Boundaries and validation

- **Backups**: parsed and schema-validated before restore
  (`validateBackup` in `_lib/db.ts`); duplicate-workspace detection and
  restore-as-copy id remapping prevent silent overwrites.
- **CSV imports**: 1,000-row cap, header mapping is user-confirmed,
  dry-run preview with per-row errors and duplicate detection, and an
  undo that deletes exactly the created ids.
- **Exports**: spreadsheet formula injection is neutralized (leading
  `= + - @` cells are prefixed), ICS output escapes commas/semicolons/
  newlines per RFC 5545, XML output is entity-escaped.
- **Share links**: payloads are data, rendered as text (never HTML);
  size is hard-capped at 180,000 fragment characters with a file-export
  fallback; optional AES-GCM encryption with the password never stored.
- **Encrypted backups**: AES-GCM-256, PBKDF2-SHA256 at 210,000 rounds,
  fresh salt+IV per file. A wrong password fails GCM authentication and
  surfaces a clear error. There is deliberately no recovery path.
- **Media**: local files only, 50 MB per file cap, stored as blobs in
  IndexedDB; nothing is uploaded anywhere by the app.

## Platform security posture

- No CSP nonce was added or changed (a nonce once broke hydration on a
  sibling site; the existing CSP behaviour is preserved exactly).
- The service worker is scoped to this app (`/social-sw.js`, registered
  only on the socialcalendar host) and cannot affect the main site.
- No third-party scripts were added for this product. No AGPL-licensed
  dependencies are used.

## Known limits

- Anyone with a full share link can read the shared posts — links are
  bearer tokens by design and the UI says so.
- Browser storage can be cleared by the user or the browser; backups
  are the mitigation and the UI nags about them honestly.
