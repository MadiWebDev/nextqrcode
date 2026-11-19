# Final Report — Resume Builder (spec §16)

Build: spec §15 phases 1–10, branch `resumebuilder/build` off main
`6328231f`, one verified commit per phase (commit messages and staging
manifests in the program PROGRESS.md). Everything below is measured,
not asserted; where a number comes from a constrained environment it
says so.

## 1. What was built

A complete, free, privacy-first resume & CV builder at
resumebuilder.freeqrcode.tools: editor (split view + mobile
Edit/Preview tabs, guided 8-step mode, undo/redo, multi-tab conflict
detection), 47 profession templates with a live gallery, photo studio
(crop/rotate/filters/camera, EXIF-aware), QR codes with a scan
self-test, writing review + ATS checklist + job-description matcher,
cover-letter generator, job-application tracker, importers (PDF,
DOCX, JSON Resume, LinkedIn ZIP, native JSON), share links carried in
the URL fragment, encrypted backups, offline PWA, and a gated SEO
starter set. **No resume, photo or personal data ever leaves the
browser** — enforced by architecture (there is no server endpoint to
send it to) and by an e2e test that fails if resume content appears in
any network request.

## 2. Architecture and key decisions

Data-driven template engine: templates are tokens + layout primitives;
one block model feeds preview, print/PDF, DOCX and text exports, so
reading order is shared by construction (D-RB-02). Versioned Zod
schema (JSON Resume superset) in a Dexie store with an in-memory
fallback, snapshot history (20), AES-256-GCM backups (PBKDF2-SHA-256,
600k rounds), and a `SyncAdapter` interface that transmits nothing
(D-RB-03). Full log: `DECISIONS.md` (D-RB-01…D-RB-12).

## 3. Templates shipped — 47 (23 ATS-safe, 24 designed, 23 photo-capable)

| Template | Profession | Type | Photo | Id |
|---|---|---|---|---|
| Classroom Classic | Teacher | ATS-safe | Yes | `teacher-classroom-classic` |
| Software Engineer Clean ATS | Software Engineer | ATS-safe | No | `software-engineer-clean` |
| Mechanical Engineer — Technical Sidebar | Mechanical Engineer | Designed | Yes | `mechanical-engineer-sidebar` |
| Physician CV | Physician | ATS-safe | No | `physician-cv` |
| Auto Mechanic — Tools & Certifications | Auto Mechanic | ATS-safe | Yes | `auto-mechanic` |
| Executive Serif | Executive | ATS-safe | No | `executive-serif` |
| Timeline | General | Designed | Yes | `timeline-general` |
| Fresher / Graduate — Education First | Fresher / Graduate | ATS-safe | Yes | `fresher-graduate` |
| Europass-Style (Original Design) | General — EU | Designed | Yes | `europass-style` |
| Designer / UX — Portfolio Grid | Designer / UX | Designed | Yes | `designer-portfolio` |
| One-Page Compact | General | ATS-safe | No | `one-page-compact` |
| Overseas / Gulf Job Seeker | Gulf Job Seeker | Designed | Yes | `gulf-job-seeker` |
| Clinical Care | Nurse | ATS-safe | No | `nurse-clinical` |
| Pharmacy Care | Pharmacist | ATS-safe | No | `pharmacist-care` |
| Site & Structures | Civil Engineer | Designed | Yes | `civil-engineer` |
| Power & Controls | Electrical Engineer | ATS-safe | No | `electrical-engineer` |
| Dental Practice | Dentist | Designed | Yes | `dentist-clinical` |
| Academic CV | Academic / Researcher | Designed | No | `academic-cv` |
| Ledger & Close | Accountant | ATS-safe | No | `accountant-ledger` |
| Banking Officer | Bank Officer | ATS-safe | No | `bank-officer` |
| Pipeline Pro | Sales Executive | Designed | Yes | `sales-executive` |
| Support Star | Customer Support Specialist | ATS-safe | No | `customer-support` |
| People Partner | HR Professional | Designed | Yes | `hr-professional` |
| Property Closer | Real Estate Agent | Designed | Yes | `real-estate-agent` |
| Staff Engineer | Senior Software Engineer | ATS-safe | No | `staff-engineer` |
| Product Story | Product Manager | Designed | No | `product-manager` |
| Insight Report | Data Analyst | ATS-safe | No | `data-analyst` |
| UX Case Grid | UX Designer | Designed | Yes | `ux-designer` |
| Growth Marketer | Digital Marketer | Designed | Yes | `digital-marketer` |
| Writer's Page | Content Writer | ATS-safe | No | `content-writer` |
| Licensed Electrician | Electrician | ATS-safe | No | `electrician-trades` |
| Site Supervisor | Construction Supervisor | Designed | Yes | `construction-supervisor` |
| Chef's Whites | Chef | Designed | Yes | `chef-culinary` |
| On the Road | Driver / Logistics | ATS-safe | No | `driver-logistics` |
| Warehouse Lead | Warehouse Supervisor | Designed | Yes | `warehouse-supervisor` |
| Security Professional | Security Officer | ATS-safe | No | `security-officer` |
| Guest Experience | Hospitality Manager | Designed | Yes | `hospitality-manager` |
| Store Leader | Retail Manager | Designed | Yes | `retail-manager` |
| Public Service | Government Applicant | ATS-safe | No | `government-applicant` |
| Programme Officer | NGO Programme Officer | Designed | No | `ngo-officer` |
| Legal Counsel | Lawyer | ATS-safe | No | `lawyer-legal` |
| Multilingual | Translator | Designed | No | `translator-multilingual` |
| Student & Intern | Student / Intern | ATS-safe | No | `student-intern` |
| Independent Consultant | Consultant | Designed | Yes | `consultant-advisor` |
| Architect Portfolio | Architect | Designed | Yes | `architect-design` |
| Universal Minimal | Any Profession | ATS-safe | No | `universal-minimal` |
| Creative Direction | Creative Director | Designed | Yes | `creative-director` |

Every template has an original fictional sample, a unique
(layout, header, heading) triple enforced by test, and renders through
the layout matrix tests (A4 + Letter, empty and long documents).

## 4. Routes added

`/`, `/app` (workspace+editor, noindex), `/templates`, `/tracker`
(noindex), `/view` (share viewer, noindex), and the gated SEO routes
`/resume-templates/[slug]` (10 roles), `/cv-templates/[slug]`
(4 countries), `/guides/[slug]` (2 guides) — 16 pages, all passing the
automated quality gate in `_lib/seo-pages.ts`, listed in sitemap
section 11 (18 URLs total with `/` and `/templates`).

## 5. Exports and the PDF decision

DOCX (real styles, numbering, tables, hyperlinks, RTL bidi), PNG/JPEG
(~300 dpi), TXT, Markdown, standalone HTML, JSON, JSON Resume and an
all-formats ZIP — all generated on-device from the one block model.
**PDF spike decision (D-RB-08, `PDF_SPIKE.md`): print-CSS from the
shared page model.** pdf-lib cannot shape complex scripts, so
Urdu/Arabic resumes would have rendered unjoined and mis-ordered;
the browser print pipeline gives exact preview parity and correct
shaping. Stated limitation: browser-print PDFs are untagged, and the
UI says so. Phase 9 found and fixed a real defect in this pipeline
(blank PDFs at paper width — D-RB-11); the acceptance test
(Playwright `page.pdf()` + pdf.js extraction: selectable text, the
candidate's name as the first extracted line) now passes.

## 6. Privacy and security

Local-first storage; share links strip the photo always and sensitive
fields unless explicitly opted in per link; importers always create a
new resume after a review dialog (never overwrite); photo ingest
validates magic bytes with size/pixel caps; encrypted backups have no
recovery path and say so. Phase 9 security review found unsafe link
schemes (`javascript:`) from untrusted imports reaching hrefs —
all render sinks now enforce an http/https/mailto/tel allowlist with a
regression test (D-RB-12). No `dangerouslySetInnerHTML` carries user
content anywhere in the site (JSON-LD blocks are static/own data).

## 7. Testing and QA evidence

Per-phase gates are recorded in PROGRESS.md; the closing numbers:
full repo unit suite **589/589** (50 files; resumebuilder subset 61),
tsc and eslint clean, production build exit 0. Playwright
`e2e/resumebuilder.spec.ts`: **16/16 on Chromium and 16/16 on mobile**
(create/edit/preview/persistence, gallery, DOCX download, PDF
acceptance, photo crop, tracker, offline, network-privacy, axe).
Axe: zero critical/serious violations on /, /templates, an SEO role
page, a guide and /app. Lighthouse (mobile, simulated throttling, run
locally on this shared 1.5-CPU VM against the production build —
pessimistic versus Vercel): landing **Perf 53 / A11y 100 / BP 79 /
SEO 92** (LCP 6.2 s, CLS 0, TBT 1.3 s; both BP failures are
is-on-https artefacts of the local HTTP origin), nurse page
**67 / 100 / 79 / 92**, /app **24 / 100 / 79 / 61** (SEO not
meaningful for a noindex app page; CLS 0.765 from async editor load).
The performance ceiling is the shared platform shell every subdomain
inherits — the same known constraint recorded for Social Calendar —
not resume-specific payload.

## 8. Known limitations and cuts

- **SEO volume**: 16 gated pages, not the spec's 150–250 — a standing
  owner rule freezes mass templated publication (D-RB-01). The gate
  machinery is built; expansion is a separately approved step.
- **PDFs are untagged** (no screen-reader structure tree) — inherent
  to browser print; the HTML export is the accessible alternative and
  the UI discloses this.
- **PNG/JPEG export** cannot embed webfonts (SVG foreignObject path);
  it falls back to system fonts and the UI discloses this.
- **DOCX** has no section-level RTL `bidi` in docx v9; paragraph-level
  bidi is applied. Designed templates simplify to one column in DOCX,
  disclosed in the UI.
- **Performance** on the shared shell (above); no pixel-diff visual
  regression exists anywhere in this repo — layout is covered by the
  paginator/renderer unit tests and the PDF-order assertion.
- **PWA icons**: the manifest references the SVG logo; PNG 192/512
  icons are an optional owner upload (binaries cannot travel the
  text-only push channel).
- **Unverified live legs**: production behaviour after the owner's
  deploy (real devices, real print dialogs on Windows/Android) can
  only be confirmed post-deploy; the Phase 9 suite covers Chromium
  desktop + Pixel 7 emulation locally.
- The shared robots.txt is deployment-wide (D-RB-05), and the global
  print stylesheet hides non-resume content in print on sibling
  sites' pages too — both pre-existing platform patterns, unchanged.

## 9. What the owner needs to do

1. **Push/merge**: approve the ten phase pushes in order (parent agent
   runs them with your taps), then merge `resumebuilder/build` into
   `main`.
2. **Deploy** the main project as usual (the subdomain is already
   attached; no DNS/Vercel changes needed).
3. **Smoke-check** the live site: create a resume, download the DOCX,
   print-to-PDF once on desktop and once on a real phone.
4. **Search Console**: confirm sitemap section 11 is picked up from
   the index (18 URLs) — no separate submission is required, but a
   manual request for the landing page speeds discovery.
5. **Optional**: upload PNG PWA icons (192/512) generated from
   `public/resumebuilder-logo.svg` via the GitHub web UI.

Nothing else is outstanding: no keys, no env vars, no server setup —
the product has no backend.
