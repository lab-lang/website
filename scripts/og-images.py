#!/usr/bin/env python3
"""
Emits the social card served at /og/lab.png, the image a link to the site
unfurls to. The output is committed to git: there is no Python toolchain at
deploy time, so this runs by hand when the card changes and the result is
checked in like any other generated asset.

Setup:

    python3 -m venv .venv
    .venv/bin/pip install -r scripts/requirements.txt
    .venv/bin/python scripts/og-images.py
"""

import pathlib
import shutil
import subprocess
import tempfile

from brandlib import PUBLIC, ROOT, glyph, load_face, require_font, text_outline

WIDTH = 1200
HEIGHT = 630
MARGIN = 80
CONTENT = WIDTH - MARGIN * 2

VESSEL = "#1d1409"
PAPER = "#f0e3c9"
TEXT = "#f9efdd"
AMBER = "#e1901f"

WEIGHT = 600
TRACKING = -0.4

MARK = 76
WORDMARK_SIZE = 44
HEADLINE_SIZE = 64
FOOTER_SIZE = 26

HEADLINE = "A compiler for the robotic laboratory."
SUBHEAD = "Write the experiment once. Compile it for any lab."
FOOTER = "lab-compiler.org"


def fitted(static, shaper, text, size):
    """
    Shrink a line until it clears the margins. The strings here are set once
    and measured, not guessed at, so a longer headline narrows itself instead
    of running off the edge of the card.
    """
    while size > 8:
        paths, advance = text_outline(static, shaper, text, size, TRACKING)
        if advance <= CONTENT:
            return paths, advance
        size -= 1
    return paths, advance


def line(static, shaper, text, size, fill, x, baseline):
    paths, _ = fitted(static, shaper, text, size)
    return (
        f'  <g fill="{fill}" transform="translate({x} {baseline})">\n'
        f"    {paths}\n"
        "  </g>"
    )


def card(static, shaper):
    # The mark is drawn on a 64 unit grid, so the lockup scales as one piece.
    scale = MARK / 64
    wordmark, _ = fitted(static, shaper, "Lab", WORDMARK_SIZE)

    return "\n".join(
        [
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}"'
            f' height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" role="img"'
            ' aria-labelledby="title">',
            '  <title id="title">Lab: a compiler for the robotic laboratory</title>',
            "  <defs>",
            '    <radialGradient id="emission" cx="82%" cy="8%" r="78%">',
            f'      <stop offset="0%" stop-color="{AMBER}" stop-opacity=".20"/>',
            f'      <stop offset="100%" stop-color="{AMBER}" stop-opacity="0"/>',
            "    </radialGradient>",
            "  </defs>",
            f'  <rect width="{WIDTH}" height="{HEIGHT}" fill="{VESSEL}"/>',
            f'  <rect width="{WIDTH}" height="{HEIGHT}" fill="url(#emission)"/>',
            # The lockup, mark and word, sharing one baseline.
            f'  <g transform="translate({MARGIN} 72) scale({scale:.5f})">',
            glyph(PAPER, ".34", AMBER, indent="    "),
            "  </g>",
            line(
                static,
                shaper,
                "Lab",
                WORDMARK_SIZE,
                TEXT,
                MARGIN + MARK + 20,
                72 + MARK * 0.72,
            ),
            line(static, shaper, HEADLINE, HEADLINE_SIZE, TEXT, MARGIN, 350),
            line(static, shaper, SUBHEAD, HEADLINE_SIZE, AMBER, MARGIN, 434),
            # A rule and the domain, the way the site closes a section.
            f'  <rect x="{MARGIN}" y="516" width="{CONTENT}" height="1"'
            f' fill="{PAPER}" fill-opacity=".14"/>',
            line(static, shaper, FOOTER, FOOTER_SIZE, "#a08a74", MARGIN, 566),
            "</svg>",
            "",
        ]
    )


def main():
    require_font()
    if not shutil.which("rsvg-convert"):
        raise SystemExit(
            "error: rsvg-convert not found\n"
            "       install it with: brew install librsvg"
        )

    out = PUBLIC / "og"
    out.mkdir(exist_ok=True)
    png = out / "lab.png"

    # Only the PNG ships. The SVG is scaffolding for rsvg-convert, and nothing
    # links to it, so it stays in the scratch directory.
    with tempfile.TemporaryDirectory() as tmp:
        scratch = pathlib.Path(tmp)
        static, shaper = load_face(scratch, WEIGHT)
        svg = scratch / "lab.svg"
        svg.write_text(card(static, shaper))

        subprocess.run(
            ["rsvg-convert", "-w", str(WIDTH), "-h", str(HEIGHT), "-o", png, svg],
            check=True,
        )

    print(f"==> {png.relative_to(ROOT)}  {WIDTH}x{HEIGHT}")


if __name__ == "__main__":
    main()
