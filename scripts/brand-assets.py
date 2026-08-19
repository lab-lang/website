#!/usr/bin/env python3
"""
Emits every Lab brand asset under public/ from the geometry in this file. The
output is committed to git: there is no Python toolchain at deploy time, so
this script is run by hand whenever the mark or a wordmark changes, and the
result is checked in like any other generated asset.

The word in a wordmark is emitted as outlines rather than live text. librsvg
synthesizes bold for a variable face instead of selecting its 600 instance,
which sets the same string about a quarter wider than a browser does, so live
text would make the PNG and SVG of one wordmark disagree. Outlines also drop
the embedded typeface, taking the short wordmark from 65 KB to 3 KB.

Setup:

    python3 -m venv .venv
    .venv/bin/pip install -r scripts/requirements.txt
    .venv/bin/python scripts/brand-assets.py
"""

import pathlib
import shutil
import subprocess
import tempfile

from brandlib import (
    FONT,
    PUBLIC,
    ROOT,
    glyph,
    load_face,
    require_font,
    text_outline,
)

BRAND = PUBLIC / "brand"

PAPER = "#f0e3c9"
AMBER = "#e1901f"
AMBER_DEEP = "#99560b"
INK = "#2b1c11"
TEXT_LIGHT = "#f9efdd"

# The word is set at 600 to match .type-head, tracked in slightly the way a
# display serif wants, and sits 82 units right of a mark drawn on a 64 grid.
FONT_WEIGHT = 600
FONT_SIZE = 42
TRACKING = -0.4
TEXT_X = 82
BASELINE = 44  # centers the cap height, 24.08 at this size, against the tile

FULL_NAME = "The Lab Compiler"


def mark_svg(title, body, tile=None):
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img"'
        ' aria-labelledby="title">',
        f'  <title id="title">{title}</title>',
    ]
    if tile:
        parts.append(f'  <rect width="64" height="64" rx="15" fill="{tile}"/>')
    parts.append(body)
    parts.append("</svg>\n")
    return "\n".join(parts)


def wordmark_svg(static, shaper, title, text, text_fill):
    paths, advance = text_outline(static, shaper, text, FONT_SIZE, TRACKING)
    width = round(TEXT_X + advance) + 1
    source = "\n".join(
        [
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 64"'
            ' role="img" aria-labelledby="title">',
            f'  <title id="title">{title}</title>',
            '  <rect width="64" height="64" rx="15" fill="#2b1c11"/>',
            glyph(PAPER, ".34", AMBER),
            f'  <g fill="{text_fill}" transform="translate({TEXT_X} {BASELINE})">',
            f"    {paths}",
            "  </g>",
            "</svg>",
            "",
        ]
    )
    return source, width


# Keyed by path relative to public/.
MARKS = {
    "lab-mark.svg": mark_svg("Lab", glyph(PAPER, ".34", AMBER), tile=INK),
    "brand/mark-dark.svg": mark_svg(
        "Lab mark, for dark surfaces", glyph(PAPER, ".34", AMBER)
    ),
    "brand/mark-light.svg": mark_svg(
        "Lab mark, for light surfaces", glyph(INK, ".28", AMBER_DEEP)
    ),
    "brand/mark-mono.svg": mark_svg("Lab mark, single color", glyph(INK, None, INK)),
}

WORDMARKS = {
    "wordmark-dark": ("Lab wordmark, for dark surfaces", "Lab", TEXT_LIGHT),
    "wordmark-light": ("Lab wordmark, for light surfaces", "Lab", INK),
    "wordmark-full-dark": (
        "Lab full wordmark, for dark surfaces",
        FULL_NAME,
        TEXT_LIGHT,
    ),
    "wordmark-full-light": (
        "Lab full wordmark, for light surfaces",
        FULL_NAME,
        INK,
    ),
}


def main():
    require_font()
    if not shutil.which("rsvg-convert"):
        raise SystemExit(
            "error: rsvg-convert not found\n"
            "       install it with: brew install librsvg"
        )

    raster = []

    for name, source in MARKS.items():
        path = PUBLIC / name
        path.write_text(source)
        raster.append((path, path.with_suffix(".png"), 512, 512))
        print(f"==> {path.relative_to(ROOT)}  64x64")

    with tempfile.TemporaryDirectory() as tmp:
        static, shaper = load_face(pathlib.Path(tmp), FONT_WEIGHT)
        for name, (title, text, fill) in WORDMARKS.items():
            source, width = wordmark_svg(static, shaper, title, text, fill)
            path = BRAND / f"{name}.svg"
            path.write_text(source)
            raster.append((path, path.with_suffix(".png"), width * 8, 512))
            print(f"==> {path.relative_to(ROOT)}  {width}x64")

    for svg, png, width, height in raster:
        subprocess.run(
            ["rsvg-convert", "-w", str(width), "-h", str(height), "-o", png, svg],
            check=True,
        )

    print(f"==> done. {len(raster)} SVGs and {len(raster)} PNGs written")


if __name__ == "__main__":
    main()
