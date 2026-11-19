# Licences — Resume Builder

## Fonts (all SIL Open Font License 1.1, self-hosted via next/font)

The OFL permits bundling and self-hosting; the licence text for each
family ships with the font packages in `node_modules` and is available
from Google Fonts. Families used by the eight font pairs
(`src/app/resumebuilder-site/_lib/fonts.ts`):

- Inter — © The Inter Project Authors — OFL 1.1
- Source Serif 4 — © Adobe Systems — OFL 1.1
- Playfair Display — © The Playfair Display Project Authors — OFL 1.1
- Work Sans — © The Work Sans Project Authors — OFL 1.1
- Lora — © The Lora Project Authors — OFL 1.1
- IBM Plex Sans — © IBM Corp. — OFL 1.1
- Noto Naskh Arabic — © Google / Noto Project Authors — OFL 1.1
- Noto Nastaliq Urdu — © Google / Noto Project Authors — OFL 1.1

System-stack pairs (Georgia/Arial, Garamond/Helvetica) reference fonts
the visitor's device already licenses; nothing is redistributed.

## Libraries (runtime, resume-specific)

All MIT or Apache-2.0 unless noted; full texts ship in each package.

- `dexie` — Apache-2.0 (IndexedDB store)
- `zod` — MIT (schema validation)
- `docx` — MIT (DOCX writer)
- `jszip` — MIT OR GPL-3.0 dual licence; **used under the MIT option**
- `qrcode` — MIT (QR generation)
- `jsqr` — Apache-2.0 (QR scan self-test)
- `pdfjs-dist` — Apache-2.0 (PDF import + test extraction)
- `mammoth` — BSD-2-Clause (DOCX import)
- `libphonenumber-js` — MIT (phone formatting)
- `@dnd-kit/*` — MIT (section reordering)
- `@axe-core/playwright`, `@playwright/test` — MPL-2.0 / Apache-2.0
  (test-only, never shipped to visitors)

## Content

All sample resumes, SEO page text and guide content in this program
are original writing created for this project. Sample people,
employers, licence numbers and metrics are fictional and marked as
such in the samples themselves.
