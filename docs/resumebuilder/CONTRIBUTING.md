# Contributing — Resume Builder

## Non-negotiables

1. **Privacy is the product.** No resume, photo or personal data may
   leave the browser — no analytics payloads, no error reports, no
   "temporary" uploads containing user content. The e2e network test
   (`e2e/resumebuilder.spec.ts`) fails the build if resume content
   appears in any request; keep it green.
2. **Zero mock data.** Every visible feature genuinely works or does
   not ship. Samples are original and fictional, and say so.
3. **One page model.** Preview, print/PDF, DOCX and the text exports
   all consume the same ordered block list from
   `_lib/templates/build-blocks.ts`. Never fork a renderer.
4. **Untrusted input.** Anything arriving via import, share link or
   backup restore is untrusted: hrefs only through `isSafeLink`
   (D-RB-12), files only through the validated importers, documents
   only through the Zod schema + migrations.
5. **Decisions get logged.** Non-trivial choices go in `DECISIONS.md`
   (ADR format) in the same change.

## Workflow

- Work phase-sized, verify, then commit (Conventional Commits, one
  commit per phase) — see `PROGRESS.md` in the program workspace for
  the current state.
- Gates before any commit: `npx tsc --noEmit`, eslint on changed
  files, `npx vitest run`, production build, and the Playwright suite
  when runtime behaviour changed.
- The tree is shared with other programs (invoice, image resizer,
  social calendar, the QR platform). Touch shared files (`proxy.ts`,
  `globals.css`, `sitemap.ts`, root layout) as if they were loaded:
  minimal, scoped, and covered by the existing tests for those sites.
- Never re-add a CSP nonce in `proxy.ts` (it once killed all
  hydration on a sibling site), and keep this site's service worker
  scoped to its own script URL (the 2026-11-18 update-prompt loop).

## Style

TypeScript strict, no `any` without a comment saying why; components
in `_components/`, pure logic in `_lib/` with unit tests beside it in
`__tests__/`. User-facing copy is plain language, honest about limits
— if a feature is an estimate or a fallback, the UI says so.
