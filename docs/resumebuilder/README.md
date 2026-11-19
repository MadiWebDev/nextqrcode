# Resume Builder — program documentation

Free, privacy-first resume & CV builder at
**resumebuilder.freeqrcode.tools** (repo `MadiWebDev/nextqrcode`,
app tree `src/app/resumebuilder-site/`, routed by `src/proxy.ts`).

The product in one paragraph: 47 profession templates (23 ATS-safe,
24 designed, 23 photo-capable), a full editor with guided mode,
regional modes and profession packs, a photo studio, an optional QR
code, writing review + ATS checklist + job-description matcher, cover
letters, a job-application tracker, importers (PDF/DOCX/JSON Resume/
LinkedIn ZIP), share links that carry the document inside the URL
fragment, and exports (print-CSS PDF, DOCX, PNG, TXT, Markdown, HTML,
JSON, JSON Resume, all-formats ZIP). **Everything runs in the browser:
no resume, photo or personal data is ever sent to a server.** There
are no accounts; data lives in the browser's IndexedDB with plain and
AES-256-GCM-encrypted backups.

## Documents in this folder

- `AUDIT.md` — the Phase 1 audit of the repo and live host.
- `ARCHITECTURE.md` — how the product is put together.
- `DECISIONS.md` — every non-trivial decision (ADR format, D-RB-01…12).
- `PDF_SPIKE.md` — the PDF pipeline spike and why print-CSS won.
- `DEPLOYMENT.md` — how this ships and what the owner must do.
- `ADD_A_TEMPLATE.md` — how to add template #48.
- `LICENSES.md` — font and library licences.
- `CONTRIBUTING.md` — working rules for this codebase.
- `FINAL_REPORT.md` — the build's closing report (gates, evidence,
  limitations, owner steps).

## Running the gates

```bash
npx tsc --noEmit
npx eslint src/app/resumebuilder-site
npx vitest run                 # full suite (589 tests at Phase 9)
npm run build                  # production build
# Browser QA against a served production build:
npm run start -- --port 3100
PLAYWRIGHT_BASE_URL=http://resumebuilder.freeqrcode.tools:3100 \
  npx playwright test e2e/resumebuilder.spec.ts --project=chromium
PLAYWRIGHT_BASE_URL=http://resumebuilder.freeqrcode.tools:3100 \
  npx playwright test e2e/resumebuilder.spec.ts --project=mobile
```

The e2e suite needs the full Chromium build (`channel: 'chromium'` in
the spec) because the headless shell ignores `--host-resolver-rules`.
