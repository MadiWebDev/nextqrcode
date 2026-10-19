"""Coordinator verification for the AdSlot rollout.

Checks every page.tsx under src/app:
 1. AdSlot count per page + cross-check against worker report JSONs.
 2. ID uniqueness per page (id= / slot= values, template skeletons included).
 3. No two AdSlot blocks adjacent (meaningful content between consecutive slots).
 4. Prop-style consistency: legacy pages use id=/format=, canonical pages use
    slot=/format=/eligible= (canonical = import from @/components/ads/AdSlot).
 5. Ineligible pages have zero slots.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / "src" / "app"

INELIGIBLE = {
    "src/app/dashboard/page.tsx",
    "src/app/dashboard/[id]/page.tsx",
    "src/app/dashboard/settings/page.tsx",
    "src/app/login/page.tsx",
    "src/app/unlock/[publicId]/page.tsx",
}

BLOCK_RE = re.compile(r"<AdSlot\b.*?(?:/>|</AdSlot>)", re.DOTALL)
ID_RE = re.compile(r'\bid=\{?["`\'`]([^"`\'`]+)["`\'`]\}?')
SLOT_RE = re.compile(r'\bslot=\{?["`\'`]([^"`\'`]+)["`\'`]\}?')
# Template-literal IDs: id={`...`} / slot={`...`}
ID_TPL_RE = re.compile(r"\bid=\{`([^`]+)`\}")
SLOT_TPL_RE = re.compile(r"\bslot=\{`([^`]+)`\}")

# Lines that do NOT count as "meaningful content" between two ads.
NON_CONTENT = re.compile(
    r"^(\s*(</?\w+[^>]*>|/\*.*|//.*|\{|\}|\)|\(|;|,|['\"`]+|)$)"
)


def meaningful_content_between(text: str) -> bool:
    found = 0
    for line in text.splitlines():
        s = line.strip()
        # A lone component invocation (e.g. <HomePageContent />) IS the page
        # content between wrapper slots — it renders the whole tool/page.
        if re.match(r"^<[A-Z]\w+", s):
            return True
        if not s or NON_CONTENT.match(s):
            continue
        # A line with real text/content (JSX text, headings, paragraphs, etc.)
        if len(re.sub(r"[^A-Za-z0-9]", "", s)) >= 10:
            found += 1
    return found >= 1


# Rendered slot counts for pages whose rendered output includes slots from a
# shared component / re-exported page / embedded page (not just page.tsx).
# Keys are page paths; values are the RENDERED total. For these pages the
# 4–5 check applies to the rendered total, not the file count.
RENDERED = {
    # Root: 1 slot in page.tsx + 3 pre-existing in HomePageContent.
    "src/app/page.tsx": 4,
    # [locale] home: 2 wrapper slots + 3 in HomePageContent.
    "src/app/[locale]/page.tsx": 5,
    # [locale] wrappers: 2 wrapper slots + embedded page's slots (1 each).
    "src/app/[locale]/url/page.tsx": 3,
    "src/app/[locale]/vcard/page.tsx": 3,
    # [locale] wifi: 0 wrapper slots + 4 in the embedded wifi page.
    "src/app/[locale]/wifi/page.tsx": 4,
    # [locale] text: 2 wrapper slots; LandingGenerator carries none.
    "src/app/[locale]/text/page.tsx": 2,
    # Re-exports: the target page carries the slots.
    "src/app/bulk-vcard-generator/page.tsx": 4,
    "src/app/regional-payment-qr/page.tsx": 4,
}


def main() -> int:
    pages = sorted(str(p.relative_to(ROOT)) for p in APP.rglob("page.tsx"))
    reports = {}
    for i in range(5):
        for e in json.loads((ROOT / f"docs/adslot-batches/report-0{i}.json").read_text()):
            assert e["path"] not in reports, f"duplicate report entry: {e['path']}"
            reports[e["path"]] = e

    violations = []
    total_before = total_after = 0
    done = skipped = flagged = 0
    for path in pages:
        text = (ROOT / path).read_text()
        blocks = [b.group(0) for b in BLOCK_RE.finditer(text)]
        count = len(blocks)
        entry = reports.get(path)
        if entry is None:
            violations.append(f"{path}: NO REPORT ENTRY")
            continue
        if entry["adsAfter"] != count:
            violations.append(
                f"{path}: report adsAfter={entry['adsAfter']} != actual {count}"
            )
        total_before += entry["adsBefore"]
        total_after += count
        status = entry["status"]
        if status == "done":
            done += 1
            rendered = RENDERED.get(path, count)
            if not 4 <= rendered <= 5:
                violations.append(
                    f"{path}: status done but rendered={rendered} (file {count}) not in 4..5"
                )
        elif status == "skipped":
            skipped += 1
            if count != 0:
                violations.append(f"{path}: status skipped but count={count}")
        elif status == "flagged-short":
            flagged += 1
        else:
            violations.append(f"{path}: unknown status {status!r}")

        if path in INELIGIBLE and count != 0:
            violations.append(f"{path}: ineligible page has {count} slots!")

        # ID uniqueness per page (literal + template skeletons + raw expressions
        # like slot={siteConfig.adsense.slotInContent} on pre-existing slots).
        ids = []
        for b in blocks:
            m = ID_TPL_RE.search(b) or ID_RE.search(b)
            if m:
                ids.append(("id", m.group(1)))
            else:
                m = re.search(r"\bid=\{([^{}]+)\}", b)
                if m:
                    ids.append(("id", "expr:" + m.group(1)))
            m = SLOT_TPL_RE.search(b) or SLOT_RE.search(b)
            if m:
                ids.append(("slot", m.group(1)))
            else:
                m = re.search(r"\bslot=\{([^{}]+)\}", b)
                if m:
                    ids.append(("slot", "expr:" + m.group(1)))
        seen = {}
        for kind, val in ids:
            if val in seen:
                violations.append(f"{path}: duplicate {kind} value {val!r}")
            seen[val] = True
        if blocks and len(ids) != len(blocks):
            violations.append(
                f"{path}: {len(blocks)} AdSlot blocks but {len(ids)} id/slot values"
            )

        # Prop-style consistency.
        is_canonical = "@/components/ads/AdSlot" in text
        for b in blocks:
            if is_canonical and re.search(r"\bid=", b):
                violations.append(f"{path}: canonical page uses id= prop")
            if not is_canonical and re.search(r"\bslot=", b):
                violations.append(f"{path}: legacy page uses slot= prop")
            if is_canonical and "eligible=" not in b:
                violations.append(f"{path}: canonical slot missing eligible=")

        # Adjacency: meaningful content between consecutive slots.
        spans = list(BLOCK_RE.finditer(text))
        for a, b in zip(spans, spans[1:]):
            between = text[a.end() : b.start()]
            if not meaningful_content_between(between):
                violations.append(f"{path}: slots possibly adjacent (no content between)")

    # Every report entry must correspond to a real page.
    for path in reports:
        if path not in pages:
            violations.append(f"{path}: report entry has no such page")

    print(f"pages checked: {len(pages)}")
    print(f"done={done} skipped={skipped} flagged-short={flagged}")
    print(f"total slots: before={total_before} after={total_after} (+{total_after - total_before})")
    print(f"violations: {len(violations)}")
    for v in violations:
        print("  VIOLATION:", v)
    return 1 if violations else 0


if __name__ == "__main__":
    sys.exit(main())
