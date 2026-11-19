# Adding a template

Templates are data, not components (ADR D-RB-02). One renderer
(`TemplateView`) paints every template from design tokens + a layout
definition composed of primitives, so a new template is one file plus
one registry line.

## Fast path

```bash
npm run new:template -- <kebab-id>
```

The generator (`scripts/new-resume-template.mjs`) scaffolds
`src/app/resumebuilder-site/_lib/templates/defs/<kebab-id>.ts` with the
required shape and reminds you of the remaining steps:

1. **Register it** — add the lazy loader and a `TEMPLATE_META` entry in
   `src/app/resumebuilder-site/_lib/templates/registry.ts`.
2. **Pick a unique triple** — (layout, header, heading) must differ
   from all 47 existing templates; `registry.test.ts` enforces this
   and fails the suite if you collide. Check the enums in
   `_lib/templates/types.ts` before choosing.
3. **Write the sample** — an original, clearly fictional sample resume
   (invented person, invented employers, example.com-style details).
   Never model a sample on a real person or a real company's staff.
4. **Write an honest `why`** — one or two sentences on what this design
   does for its profession. The gallery and SEO pages quote it.
5. **Set the flags truthfully** — `atsSafe` only for single-column,
   standard-heading, real-text layouts; `supportsPhoto` only if the
   layout actually renders the photo; declare the `fontPair` the
   design was made with (D-RB-09).
6. **Run the gates** — `npx vitest run src/app/resumebuilder-site`
   (registry uniqueness + the sample→blocks→paginate layout matrix run
   automatically for every registered template), then the production
   build.

## Rules that are not optional

- No template may require new renderer code for a cosmetic difference;
  if you truly need a new layout primitive, add it to `types.ts` +
  `build-blocks.ts` + `TemplateView` with tests, and log a decision in
  `DECISIONS.md`.
- Samples must read as finished, professional resumes — they are the
  gallery's previews and the SEO pages' examples.
- Palettes: offer the curated `tokens.palettes` set; every accent must
  keep body text at WCAG AA contrast on the template surface.
