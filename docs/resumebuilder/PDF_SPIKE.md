# PDF Pipeline Spike (spec §10) — print-CSS vs pdf-lib

Time-boxed spike run 2026-11-19, before the Phase 5 build. Both options
were assessed against the actual constraints of this product: one
template source, Urdu/Arabic shaping as a hard requirement, zero server
rendering, and the repo's existing assets.

## Option A — Single HTML/CSS paged layout, browser print-to-PDF

The shared block model renders once (TemplateView). A print stylesheet
isolates the page boxes; the user saves via the browser print dialog
("Save as PDF", headers/footers off — the UI instructs this).

## Option B — pdf-lib writer over the shared block model

A programmatic writer walks the blocks and draws text with embedded
fonts via pdf-lib + fontkit, producing a downloadable file directly.

## Scoring (1 = poor, 5 = excellent)

| Criterion | A: print-CSS | B: pdf-lib | Notes |
| --- | --- | --- | --- |
| Preview/PDF parity | 5 | 3 | A is the same DOM by construction. B re-lays out text with different metrics; pagination drift is unavoidable. |
| RTL / complex-script shaping | 5 | 1 | Browsers shape Arabic-script text correctly (joining, bidi). **pdf-lib does not shape complex scripts at all** — Urdu/Arabic letters would render unjoined and mis-ordered. This alone disqualifies B for this product, whose spec (§6) requires verified Urdu/Arabic rendering. @react-pdf/renderer has the same class of limitation. |
| Font embedding | 4 | 5 | Print engines embed the loaded fonts. B embeds subsets explicitly. |
| Bundle size | 5 | 2 | A adds zero bytes. B adds pdf-lib + fontkit (~several hundred KB) to an export-only path. |
| Speed on a mid-range phone | 5 | 3 | A is the browser's own pipeline. B measures and draws every glyph in JS. |
| Link support | 5 | 4 | Chromium print-to-PDF preserves links from the DOM. B needs manual link annotations per run. |
| Accessibility tagging | 1 | 1 | **Neither produces a tagged PDF.** Browser print output is untagged; pdf-lib has no tagging API. Stated plainly in the UI and docs (below). |
| Programmatic download | 2 | 5 | A requires the print dialog (one extra user step, with instructions). B downloads directly. |
| Metadata (title/author/language) | 3 | 5 | A takes the title from the document at print time (the editor sets it to the resume filename before printing). B sets full core properties. |

## Decision (D-RB-08)

**Option A — print-CSS from the shared page model — is the PDF
pipeline.** The deciding factor is not convenience: it is the only
option that renders Urdu, Arabic and Devanagari resumes correctly,
which the spec treats as a correctness requirement, and it gives true
preview/PDF parity from the single template source the spec mandates.
The browser print dialog is therefore the PDF route *and* the fallback,
presented honestly with instructions. DOCX (fully programmatic, via
the `docx` library) covers the "direct download" need.

**Accessibility limitation, stated plainly:** PDFs produced this way
are **not tagged PDFs**. They contain real, selectable, correctly
ordered text (verified by extraction tests), a document title, and the
correct reading order, but they do not carry the structural tag tree a
screen reader uses for navigation. The DOCX export, which has real
heading styles and paragraph structure, is the more accessible
editable format, and the UI's "DOCX vs PDF differences" note says so.
