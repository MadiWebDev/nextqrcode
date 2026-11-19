# Resume Builder — Decisions Log (ADR format)

Append-only. Each entry: context, options, decision, consequences.

---

## D-RB-01 — SEO page volume: starter set, not 150–250 pages at launch

- **Context.** Spec §13 targets 150–250 programmatic pages. A standing
  user rule from the freeqrcode.tools indexing-recovery program forbids
  mass templated publication while the indexing freeze holds (an October
  all-at-once dump created an 856-URL not-indexed backlog). Precedent:
  Social Calendar shipped landing + 6 guides under the same deferral
  (its D-SC-02). Recorded in the coordinator brief as binding.
- **Options.** (a) Ship the full 150–250 set; (b) ship no programmatic
  pages; (c) build the full data model + automated quality gate, ship a
  starter set of pages with genuinely unique content (~10–16), defer the
  expansion to a separately approved step after the freeze lifts.
- **Decision.** (c).
- **Consequences.** The quality gate (unique title/meta, minimum
  role-specific content, sibling-similarity threshold, required blocks)
  is built and tested in Phase 8 and runs over the full page dataset;
  only passing starter pages are routed and listed in sitemap section 11.
  The final report lists the deferred expansion as a known limitation
  with the unblock condition (freeze lifted + owner approval).

## D-RB-02 — Template engine: data-driven layout definitions, one renderer

- **Context.** Spec §7 requires 47 structurally unique templates where
  one source drives preview, print, PDF and image export, plus an
  automated uniqueness test on (layout, header, heading) triples.
- **Options.** (a) 47 hand-written React components; (b) one renderer
  over declarative layout definitions + design tokens; (c) HTML/CSS
  templates with string templating.
- **Decision.** (b). Templates are lazy-loaded modules exporting tokens,
  a layout definition composed from a small primitive algebra (header
  variants, body arrangements, heading variants, entry layouts),
  profession default section order, fictional sample data and metadata.
  A pure pagination function produces a page model consumed by the DOM
  renderer and the PDF/DOCX writers alike.
- **Consequences.** Adding a template is a data task (generator script,
  target < 30 min, documented in ADD_A_TEMPLATE.md). Uniqueness is
  mechanically checkable. Expressiveness is bounded by the primitive
  algebra — a design needing a new primitive extends the algebra once
  and benefits all templates.

## D-RB-03 — Local store: Dexie, repository pattern, no sync implementation

- **Context.** Spec §5 requires IndexedDB storage with snapshots,
  photos as Blobs, encrypted backups, and — only if auth/DB already
  exist for this product — opt-in sync. The repo has next-auth/MongoDB
  for the main platform, but no resume account product, consent flow or
  per-user API exists.
- **Decision.** Dexie (already a dependency) behind a repository layer
  with an in-memory fallback + visible warning. `SyncAdapter` interface
  defined and documented; no code transmits resume data anywhere.
- **Consequences.** Zero privacy surface. A future account feature can
  implement the adapter without touching the editor.

## D-RB-04 — Host separation follows the established proxy pattern

- **Context.** Spec §4 asks for registry-style host separation, per-host
  sitemap/robots, and cross-host 301s for other tools' routes.
- **Decision.** Follow the exact existing pattern: a
  `RESUMEBUILDER_SITE_HOST` constant + rewrite block in `src/proxy.ts`,
  `.resumebuilder-site-root` chrome-hiding rule in globals.css, sitemap
  section 11 in both `src/app/sitemap.ts` and `public/sitemap.xml`.
  Cross-host redirects are implemented for the internal site-tree
  prefixes (the only "other host's routes" that can be requested on a
  host, since public tool paths belong to the apex site): a foreign tree
  prefix on any of the five production hosts 301s to the owning host
  with the prefix stripped; dev/unknown hosts are exempt so local e2e
  keeps working. Covered by `src/proxy.test.ts` (16 cases).
- **Consequences.** Behaviour is consistent with the three existing
  subdomain sites; no new infrastructure.

## D-RB-05 — Shared robots.txt accepted (deviation from §4's per-host robots)

- **Context.** `robots.ts` is a single deployment-wide metadata route
  and the proxy matcher excludes `robots.txt`; per-host robots would
  require restructuring shared infra used by four live sites.
- **Decision.** Accept the shared robots.txt (Social Calendar
  precedent). It allows all crawlers and points to the shared sitemap
  index, which includes section 11 with absolute resumebuilder URLs.
  The resume workspace and share viewer are kept out of the sitemap and
  carry `noindex` metadata instead.
- **Consequences.** One less per-host control; no practical SEO loss
  for this product. Revisit if the platform ever moves robots into the
  proxy.

## D-RB-06 — New dependencies: docx, libphonenumber-js, mammoth

- **Context.** The spec requires a genuine editable DOCX (§10), phone
  formatting by country (§6) and DOCX resume import (§12). None of the
  three libraries existed in the repo.
- **Decision.** Add `docx` (DOCX writer, Phase 5), `libphonenumber-js`
  (lazy-loaded on phone-field blur in the editor, Phase 3) and `mammoth`
  (DOCX text extraction for import, Phase 7). All are dynamically
  imported at the point of use so none of them enters the initial
  editor bundle. package-lock stays ~489 KB, within the push channel's
  per-file comfort zone.
- **Consequences.** Three more dependencies to keep patched; each is
  the standard tool for its job and has no credible in-repo substitute.

## D-RB-07 — Guided-mode step 8 is "Design" until the template gallery lands

- **Context.** Spec §6's wizard step 8 is "template". Templates arrive
  in Phase 4 and the gallery in Phase 6; a template step in Phase 3
  would have exactly one entry.
- **Decision.** The wizard's eighth step is "Design" (regional mode,
  page size, accent) in Phase 3; it becomes the template step when the
  Phase 6 gallery ships, pointing at the same registry the gallery uses.
- **Consequences.** No dead UI; one rename owed in Phase 6 (tracked in
  PROGRESS.md).

## D-RB-08 — PDF pipeline: print-CSS from the shared page model

- **Context.** Spec §10 requires a time-boxed spike: (a) HTML/CSS paged
  layout via a robust client-side print method vs (b) @react-pdf/pdf-lib
  over a shared layout schema, scored on parity, RTL shaping, fonts,
  bundle, speed, links and tagging. Full write-up: PDF_SPIKE.md.
- **Decision.** Option (a). pdf-lib performs no complex-script shaping,
  so Urdu/Arabic resumes — a hard spec requirement — would render with
  unjoined, mis-ordered letters. Print-CSS gives exact preview parity
  from the one template source and browser-grade shaping. The print
  dialog is the PDF route, with on-screen instructions.
- **Consequences.** No direct-download PDF button (the DOCX is the
  direct download); the all-formats ZIP documents this. Browser-print
  PDFs are untagged — the limitation is stated in the spike, the UI
  differences note and the final report. Acceptance is by Playwright
  `page.pdf()` + pdf.js text-extraction order tests.

## D-RB-09 — Font pairs are the single font source; templates declare their pair

- **Context.** Theme.fontPair existed in the schema from Phase 2 but
  templates also carried heading/body stacks in their tokens — two
  sources that could disagree.
- **Decision.** The chosen font pair always wins in the renderer;
  each template declares the pair it was designed with, and switching
  templates adopts that pair (the user can then override it). Token
  font stacks derive from the declared pair in defineTemplate.
- **Consequences.** One predictable rule ("the picker shows what you
  get"), and DOCX/PNG fallbacks inherit the same stacks.

## D-RB-10 — Wizard step 8 is "Template" (Phase 6), closing D-RB-07

- **Context.** D-RB-07 deferred the wizard's final step name until a
  real gallery existed.
- **Decision.** Step 8 is now a template picker (all templates with
  ATS-safe/Designed labelling) followed by the design panel, and the
  step is named "Template".
- **Consequences.** The guided flow ends with the choice beginners
  care about most, backed by the Phase 6 gallery data.
