# Resume Builder — Architecture

Companion to AUDIT.md. Decisions referenced here live in DECISIONS.md.

## 1. Placement in the monorepo

- Route tree: `src/app/resumebuilder-site/` (landing, `/app` workspace,
  `/view` share viewer, content pages). Reached only via the proxy rewrite
  for host `resumebuilder.freeqrcode.tools` (RESUMEBUILDER_SITE_HOST).
- Program docs: `docs/resumebuilder/`. Program libraries live under the
  site tree (`_lib/`, `_data/`, `_components/`) following the
  socialcalendar precedent, so the whole product is one deletable unit
  except for three shared-file touch points: `src/proxy.ts`,
  `src/app/sitemap.ts` (+ `public/sitemap.xml`), `src/app/globals.css`.

## 2. One source of truth for a resume

A resume is a single versioned JSON document (`ResumeDoc`, schema in
`_lib/schema.ts`, Zod-validated, JSON Resume-compatible superset).
Everything — editor state, preview, PDF, DOCX, TXT/Markdown/HTML exports,
share links, ATS checks — derives from this document. No view keeps its
own copy of the data.

- Rich text is a constrained AST (`RichTextNode[]`: text runs with
  bold/italic/link marks, and bullet lists), never raw HTML. Renderers
  walk the AST; sanitisation happens on input, import and render.
- Unknown fields survive round-trips: the schema keeps an index signature
  of preserved extras per record (spec §5).

## 3. Template engine (ADR D-RB-02)

**One template definition drives preview, print, PDF and image export.**

A template is a lazy-loaded module exporting a `TemplateDef`:

- `tokens`: palette, font pairing, spacing scale, heading/bullet/divider/
  icon styles.
- `layout`: a structural definition from a small algebra of primitives —
  header variant, body arrangement (single column, sidebar left/right
  with width ratio, two-column flow), section-heading variant, entry
  layout. The uniqueness triple (layout structure, header style,
  section-heading style) is derived from these fields and checked by an
  automated test across the whole registry.
- `sectionOrder`: profession-aware default order; `sample`: original
  fictional sample data; `meta`: id, name, profession, `atsSafe`,
  columns, supportsPhoto, supportsRtl, pageSizes, whyThisTemplate.

Rendering pipeline: `ResumeDoc + TemplateDef + Customisation → paginated
page model` (pure TypeScript, shared). The page model is rendered to
React DOM for preview/print, and walked by the PDF and DOCX writers, so
all outputs share pagination and reading order by construction. ATS-safe
labels are verified by extracting text from generated PDFs and asserting
logical section order (Phase 5 tests), not asserted by hand.

## 4. Storage (Phase 2)

Dexie database `resumebuilder` (versioned stores): `resumes`, `snapshots`,
`photos` (original + cropped Blobs), `coverLetters`, `trackerItems`,
`settings`. Repository layer over Dexie with an in-memory fallback +
persistent warning when IndexedDB is unavailable (Social Calendar
pattern). Autosave is debounced with a visible status; multi-tab safety
via BroadcastChannel + updated-at comparison with a keep-both prompt.
Backups: JSON export/import; optional AES-256-GCM/PBKDF2-SHA-256
(600k iterations) encrypted backup via WebCrypto. Sync is an interface
(`SyncAdapter`) with no implementation that transmits data.

## 5. Exports (Phase 5, spike-gated)

PDF decision is made by the documented spike (print-CSS from the shared
page model vs a pdf-lib/@react-pdf writer over the same model), scored on
parity, RTL shaping, font embedding, bundle, speed, links and tagging.
DOCX uses the `docx` library with named styles per template family.
All export code is dynamically imported from the workspace route only.

## 6. Privacy boundary

There is no server component, API route or analytics event in this
product that can receive resume content. Rendering and export are
client-only. The share link encodes data into the URL fragment (never
sent to a server) and excludes photo and sensitive fields by default.
Phase 9 includes a Playwright network assertion proving exports make no
data-carrying requests.
