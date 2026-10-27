"""Build docs/ADSLOT-REPORT.md from the per-batch report JSONs."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BATCH_DIR = ROOT / "docs" / "adslot-batches"

entries = []
for i in range(5):
    entries.extend(json.loads((BATCH_DIR / f"report-0{i}.json").read_text()))
entries.sort(key=lambda e: e["path"])

done = [e for e in entries if e["status"] == "done"]
skipped = [e for e in entries if e["status"] == "skipped"]
flagged = [e for e in entries if e["status"] == "flagged-short"]
total_before = sum(e["adsBefore"] for e in entries)
total_after = sum(e["adsAfter"] for e in entries)

lines = []
lines.append("# AdSlot Rollout Report")
lines.append("")
lines.append("Branch: `ads/adslot-4-5-per-page` — 4–5 `<AdSlot>` components on every")
lines.append("eligible page. Existing slots kept and counted toward the total.")
lines.append("")
lines.append("## Summary")
lines.append("")
lines.append(f"- Pages scanned: {len(entries)} (`page.tsx` files under `src/app/`)")
lines.append(f"- Done (4–5 slots): {len(done)}")
lines.append(f"- Skipped (ineligible): {len(skipped)}")
lines.append(f"- Flagged short (<4 slots, with reason): {len(flagged)}")
lines.append(f"- Total slots in `page.tsx` files: {total_before} → {total_after} (+{total_after - total_before})")
lines.append("")
lines.append("## Placement rules applied")
lines.append("")
lines.append("- Positions, in order: `top` (below breadcrumbs), `after-tool` (directly")
lines.append("  after the main tool/generator), `in-content` (between long prose blocks),")
lines.append("  `pre-related` (before the related-items / explore-more grid), `bottom`")
lines.append("  (after the last section). Never two ads back-to-back: at least one")
lines.append("  meaningful content section sits between any two ads. Never inside")
lines.append("  tool/generator UI, forms, or between a heading and its content.")
lines.append("- Tool pages skip `top` to keep the primary tool above the fold on mobile;")
lines.append("  their first slot is `after-tool`.")
lines.append("- Formats: `horizontal-banner` for top / after-tool / pre-related / bottom,")
lines.append("  `in-article` for in-content slots.")
lines.append("- `AdSlot` components were NOT modified: CLS is already handled by the")
lines.append("  canonical component (fixed min-height per format: leaderboard 90px,")
lines.append("  rectangle 250px, in-article 280px, plus reserved space when consent")
lines.append("  is unknown).")
lines.append("")
lines.append("## Coordinator decisions (fix-ups after the worker batches)")
lines.append("")
lines.append("- **Canonical-import pages** (blog, glossary, industries, q, qr-size-guide,")
lines.append("  scan-guide, templates): workers reused the shared")
lines.append("  `slot={siteConfig.adsense.slotInContent}` value for every new slot. The")
lines.append("  task requires IDs unique per page, so the coordinator gave each NEW")
lines.append("  leaderboard slot a unique value following the ID format (e.g.")
lines.append("  `` `blog-${slug}-top` ``). Pre-existing in-article slots keep their env")
lines.append("  slot value untouched, and all canonical slots keep their existing")
lines.append("  `eligible={...}` expression.")
lines.append("- **[locale] wrappers / double ads**: `[locale]/url`, `/vcard`, `/wifi`")
lines.append("  embed pages that already carry slots. `[locale]/wifi` had its 2 wrapper")
lines.append("  slots REMOVED — the embedded wifi page already carries 4, so the")
lines.append("  rendered page has 4; wrapper slots would have doubled ads. The other")
lines.append("  wrappers keep their slots; their rendered totals are shown below.")
lines.append("- **Re-exports**: `bulk-vcard-generator` re-exports `bulk-vcard-qr/page`")
lines.append("  (4 slots) and `regional-payment-qr` re-exports `pakistan-payment-qr/page`")
lines.append("  (4 slots) — the rendered pages have 4 slots each even though their own")
lines.append("  `page.tsx` files contain none.")
lines.append("- **Homepage**: the shared `HomePageContent` component already carries 3")
lines.append("  pre-existing slots (`home-top`, `home-mid`, `home-bottom`). Root")
lines.append("  `src/app/page.tsx` gained one bottom slot with ID `home-bottom-2`")
lines.append("  (not `home-bottom`, to stay unique against the component's slot), so")
lines.append("  the rendered homepage has 4. `[locale]` home renders 5 (2 wrapper +")
lines.append("  3 in the shared component).")
lines.append("- **Pre-existing slots in shared components** are counted in the")
lines.append("  “Rendered” column where they apply; the Before/After columns count")
lines.append("  slots in the `page.tsx` file itself.")
lines.append("")
lines.append("## Skipped — ineligible per docs/ADSENSE.md (no slots added)")
lines.append("")
lines.append("| Page | Reason |")
lines.append("| --- | --- |")
for e in skipped:
    lines.append(f"| `{e['path']}` | {e.get('reason', '')} |")
lines.append("")
lines.append("## Flagged short — fewer than 4 slots, with reason")
lines.append("")
lines.append("| Page | Slots (file / rendered) | Reason |")
lines.append("| --- | --- | --- |")
for e in flagged:
    rendered = e.get("rendered", e["adsAfter"])
    lines.append(
        f"| `{e['path']}` | {e['adsAfter']} / {rendered} | {e.get('reason', '')} |"
    )
lines.append("")
lines.append("## Full table — all pages")
lines.append("")
lines.append("| Page | Before | After | Rendered | Positions | Status |")
lines.append("| --- | ---: | ---: | ---: | --- | --- |")
for e in entries:
    rendered = e.get("rendered", e["adsAfter"])
    positions = ", ".join(e["positions"]) if e["positions"] else "—"
    lines.append(
        f"| `{e['path']}` | {e['adsBefore']} | {e['adsAfter']} | {rendered} | {positions} | {e['status']} |"
    )
lines.append("")
lines.append("## Verification")
lines.append("")
lines.append("- `docs/adslot-batches/verify-adslots.py`: 264 pages checked, 0 violations")
lines.append("  (counts match reports, IDs unique per page, no adjacent slots,")
lines.append("  prop-style consistent per import, ineligible pages at 0).")
lines.append("- `npm run typecheck`: exit 0")
lines.append("- `npm run build`: exit 0")
lines.append("- `npm run content:audit`: all pages pass")
lines.append("")

(BATCH_DIR / ".." / "ADSLOT-REPORT.md").write_text("\n".join(lines))
print(f"wrote docs/ADSLOT-REPORT.md: {len(entries)} rows")
