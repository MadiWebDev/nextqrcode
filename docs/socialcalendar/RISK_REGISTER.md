# Risk Register — Social Media Calendar

- **R-SC-01 Shared-tree drift.** The tree is shared with other programs and
  the unmerged SEO branch. Mitigation: re-read shared files before editing;
  additive-only edits to proxy.ts / sitemap.ts / globals.css; per-phase
  staging snapshots so any overwrite is recoverable.
- **R-SC-02 Merge friction on proxy/sitemap.** The SEO branch (c5065267)
  touches the same two files. Mitigation: single host-map entry + single
  sitemap id; either merge order applies cleanly because the edits are in
  disjoint regions.
- **R-SC-03 IndexedDB data loss.** Browser storage can be evicted;
  private browsing has none. Mitigation: storage-quota meter, backup
  reminders, one-click JSON/encrypted backup, crash recovery, honest
  in-memory fallback warning. Residual risk stays with the user — stated
  in the product UI and privacy doc, never hidden.
- **R-SC-04 Bundle size.** A full workspace can blow the 250KB gz budget.
  Mitigation: workspace is a lazy client island; charts/exports/PDF load
  on demand via dynamic imports; sizes measured and reported in Phase 10,
  not assumed.
- **R-SC-05 Platform spec drift.** Platform limits change without notice.
  Mitigation: specs are labelled guidance with a reviewed date; users can
  override limits locally (spec §14).
- **R-SC-06 Holiday date accuracy.** Islamic dates depend on moon
  sighting; some national holidays shift by proclamation. Mitigation:
  lunar flag + disclaimer in UI; dataset limited to well-known holidays;
  custom holidays supported.
- **R-SC-07 Share-link leakage by user action.** Fragment links are
  visible to anyone the user sends them to. Mitigation: strip
  notes/assignees options default ON for internal fields, passphrase
  option, clear UI copy about what a link contains.
- **R-SC-08 Main-site service worker interplay.** The root layout
  registers the main `/sw.js` on every host. On the calendar host the
  app's own SW registration supersedes it for that origin scope; the
  main site's SW files are not modified. Verified by serve smoke +
  e2e offline test scoped to the calendar host paths.
- **R-SC-09 Scope.** The spec is very large; the risk is shallow
  coverage. Mitigation: phase gates with tests per phase; the final
  report separates implemented / partial / not implemented honestly
  instead of inflating claims.
- **R-SC-10 CSP.** Any inline `<style>`/`<script>` added by the app
  would be refused under the site CSP pattern. Mitigation: all styles
  in stylesheets/Tailwind classes; no inline style elements; JSON-LD
  via the existing JsonLd component pattern used by the root layout.
