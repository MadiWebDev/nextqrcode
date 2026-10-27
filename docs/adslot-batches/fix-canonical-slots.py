"""Fix-up: give NEW canonical AdSlot blocks unique per-position slot values.

Workers reused the shared `slot={siteConfig.adsense.slotInContent}` value for
every new canonical slot. The task requires IDs unique per page, so new
leaderboard slots get `slot={`{page}-{slug}-{position}`}` (same ID format as
the legacy wrapper's `id` prop). Pre-existing in-article slots keep their env
slot value untouched.
"""
import re
import sys

# file -> (pageName, slug variable, leaderboard positions in file order)
PLAN = {
    "src/app/blog/[slug]/page.tsx": ("blog", "slug", ["top", "pre-related", "bottom"]),
    "src/app/glossary/[slug]/page.tsx": ("glossary", "slug", ["top", "pre-related", "bottom"]),
    "src/app/industries/[slug]/page.tsx": ("industries", "slug", ["top", "pre-related", "bottom"]),
    "src/app/q/[publicId]/page.tsx": ("q", "publicId", ["bottom"]),
    "src/app/qr-size-guide/[slug]/page.tsx": ("qr-size-guide", "slug", ["top", "after-tool", "pre-related", "bottom"]),
    "src/app/scan-guide/[slug]/page.tsx": ("scan-guide", "slug", ["top", "pre-related", "bottom"]),
    "src/app/templates/[slug]/page.tsx": ("templates", "slug", ["top", "after-tool", "bottom"]),
}

SLOT_RE = re.compile(r"slot=\{siteConfig\.adsense\.slotInContent(?: \|\| 'test-slot')?\}")
BLOCK_RE = re.compile(r"<AdSlot\b.*?(?:/>|</AdSlot>)", re.DOTALL)


def fix(path, page, var, positions):
    text = open(path).read()
    blocks = list(BLOCK_RE.finditer(text))
    leaderboard = [b for b in blocks if 'format="leaderboard"' in b.group(0)]
    in_article = [b for b in blocks if 'format="in-article"' in b.group(0)]
    assert len(leaderboard) == len(positions), (
        f"{path}: found {len(leaderboard)} leaderboard blocks, expected {len(positions)}"
    )
    # Pre-existing in-article slots must all keep the env slot value.
    assert all("siteConfig.adsense.slotInContent" in b.group(0) for b in in_article), (
        f"{path}: an in-article slot lacks the env slot value"
    )

    out = []
    last = 0
    pos_iter = iter(positions)
    for b in leaderboard:
        block = b.group(0)
        new_block, n = SLOT_RE.subn(
            lambda m: "slot={`%s-${%s}-%s`}" % (page, var, next(pos_iter)), block, count=1
        )
        assert n == 1, f"{path}: leaderboard block without env slot value"
        out.append(text[last:b.start()])
        out.append(new_block)
        last = b.end()
    out.append(text[last:])
    new_text = "".join(out)
    # Post-conditions: no leaderboard block keeps the env value; in-article untouched.
    for b in BLOCK_RE.finditer(new_text):
        if 'format="leaderboard"' in b.group(0):
            assert "siteConfig.adsense.slotInContent" not in b.group(0), f"{path}: leaderboard still has env slot"
        if 'format="in-article"' in b.group(0):
            assert "siteConfig.adsense.slotInContent" in b.group(0), f"{path}: in-article slot changed!"
    open(path, "w").write(new_text)
    print(f"fixed {path}: {len(positions)} leaderboard slots -> unique IDs")


def main():
    for path, (page, var, positions) in PLAN.items():
        fix(path, page, var, list(positions))
    print("OK")


if __name__ == "__main__":
    main()
