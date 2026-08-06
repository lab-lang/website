"""
Typeface loading and glyph outlining, shared by the scripts that generate
committed image assets.

Text is emitted as outlines rather than live text because librsvg synthesizes
bold for a variable face instead of selecting its named instance, which sets
the same string about a quarter wider than a browser does. Outlines also drop
the embedded typeface from the output.
"""

import pathlib

try:
    import uharfbuzz as hb
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont
except ModuleNotFoundError as missing:  # pragma: no cover - setup guidance
    raise SystemExit(
        f"error: {missing.name} is not installed\n"
        "       python3 -m venv .venv\n"
        "       .venv/bin/pip install -r scripts/requirements.txt"
    ) from missing

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
FONT = (
    ROOT
    / "node_modules/@fontsource-variable/crimson-pro/files"
    / "crimson-pro-latin-wght-normal.woff2"
)


def require_font():
    if not FONT.exists():
        raise SystemExit(
            f"error: {FONT.relative_to(ROOT)} not found\n" "       run: pnpm install"
        )


def load_face(scratch, weight):
    """Pin the variable font to one weight and hand it to HarfBuzz for shaping."""
    static = instantiateVariableFont(TTFont(FONT), {"wght": weight}, inplace=False)
    static.flavor = None
    pinned = scratch / f"crimson-pinned-{weight}.ttf"
    static.save(pinned)
    return static, hb.Font(hb.Face(hb.Blob.from_file_path(str(pinned))))


def text_outline(static, shaper, text, size, tracking):
    """Return (svg_paths, advance) for text with its baseline at the origin."""
    scale = size / static["head"].unitsPerEm
    glyphs = static.getGlyphSet()
    order = static.getGlyphOrder()

    buffer = hb.Buffer()
    buffer.add_str(text)
    buffer.guess_segment_properties()
    hb.shape(shaper, buffer, {"kern": True, "liga": True})

    paths = []
    x = 0.0
    for info, position in zip(buffer.glyph_infos, buffer.glyph_positions):
        pen = SVGPathPen(glyphs, ntos=lambda value: f"{value:.2f}")
        glyphs[order[info.codepoint]].draw(pen)
        commands = pen.getCommands()
        if commands:
            dx = x + position.x_offset * scale
            dy = -position.y_offset * scale
            paths.append(
                f'<path transform="translate({dx:.2f} {dy:.2f})'
                f' scale({scale:.6f} {-scale:.6f})" d="{commands}"/>'
            )
        x += position.x_advance * scale + tracking

    return "".join(paths), x - tracking


def glyph(quiet, quiet_opacity, loud, indent="  "):
    """The Lab mark itself: `=` above `<-`, on a 64 unit grid."""
    opacity = f' fill-opacity="{quiet_opacity}"' if quiet_opacity else ""
    return "\n".join(
        indent + line
        for line in [
            f'<rect x="17" y="17.5" width="31" height="5.5" rx="2.75"'
            f' fill="{quiet}"{opacity}/>',
            f'<rect x="22" y="36" width="26" height="5.5" rx="2.75" fill="{loud}"/>',
            f'<path d="M27 33.25 20 38.75 27 44.25" fill="none" stroke="{loud}"'
            ' stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>',
        ]
    )
