import { ArrowDownToLine } from 'lucide-react'
import type { ReactNode } from 'react'
import { Reveal } from '../components/reveal'

interface ColorToken {
  name: string
  token: string
  hex: string
  note: string
}

const groundTokens: ColorToken[] = [
  { name: 'Paper', token: '--color-paper', hex: '#f9efdd', note: 'The page background.' },
  { name: 'Shell', token: '--color-shell', hex: '#fef9ef', note: 'Cards and panels, a shade lighter than the page.' },
  { name: 'Sand', token: '--color-sand', hex: '#eee0c3', note: 'Used to set a section apart from the page around it.' },
  { name: 'Sand deep', token: '--color-sand-deep', hex: '#e4d3b2', note: 'A slightly darker sand, for stacking surfaces.' },
]

const inkTokens: ColorToken[] = [
  { name: 'Ink', token: '--color-ink', hex: '#2b1c11', note: 'The main text color. A warm brown, not black.' },
  { name: 'Umber', token: '--color-umber', hex: '#7c6551', note: 'Secondary text, like captions and body copy.' },
  { name: 'Umber soft', token: '--color-umber-soft', hex: '#a08a74', note: 'The lightest text: fine print, disabled labels.' },
]

const structureTokens: ColorToken[] = [
  { name: 'Amber', token: '--color-amber', hex: '#e1901f', note: 'Links, buttons, anything that needs to stand out on paper.' },
  { name: 'Amber deep', token: '--color-amber-deep', hex: '#99560b', note: 'A darker amber, for small text and focus outlines.' },
]

const fluorophoreTokens: ColorToken[] = [
  { name: 'GFP', token: '--color-gfp', hex: '#93e03f', note: 'Dark backgrounds only. It looks like it’s glowing there.' },
  { name: 'mCherry', token: '--color-mcherry', hex: '#e8446c', note: 'Dark backgrounds only. It looks like it’s glowing there.' },
  { name: 'CFP', token: '--color-cfp', hex: '#4ec3d4', note: 'Dark backgrounds only. It looks like it’s glowing there.' },
]

const vesselTokens: ColorToken[] = [
  { name: 'Vessel', token: '--color-vessel', hex: '#1d1409', note: 'The main dark background color.' },
  { name: 'Vessel raised', token: '--color-vessel-raised', hex: '#2b1e10', note: 'A step lighter than vessel, for cards on a dark background.' },
]

const doList = [
  'Use the icon (the mark on its dark tile) for favicons, app icons, and anywhere it needs to stand alone.',
  'On paper, use the amber-only version of the ring, not the full-color one.',
  'Leave a small margin around the mark, roughly the width of one arc.',
  'Write "Lab" capitalized, in the serif typeface, everywhere it appears.',
  'Keep the little arrows on the arcs. They show which direction each feature reads.',
]

const dontList = [
  'Don’t put the green or blue ring straight onto paper. Those colors are made for dark backgrounds.',
  'Don’t recolor the arcs.',
  'Don’t stretch, skew, rotate, or add a shadow to the ring.',
  'Don’t lowercase "Lab," and don’t set it in the mono or sans typeface.',
  'Don’t shrink the tile so much that the ring stops being readable.',
]

function SectionKicker({ children }: { children: string }) {
  return <span className="micro text-amber-deep">{children}</span>
}

function Plate({
  tone,
  children,
  className = '',
}: {
  tone: 'dark' | 'light'
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border p-8 ${tone === 'dark'
        ? 'border-white/10 bg-vessel'
        : 'border-ink/12 bg-sand/60'
        } ${className}`}
    >
      {children}
    </div>
  )
}

function AssetLink({ href, label, file }: { href: string; label: string; file: string }) {
  return (
    <a
      className="press lift flex items-center justify-between gap-3 rounded-xl border border-ink/15 bg-shell/70 px-4 py-3 text-[13.5px] text-ink"
      download
      href={href}
    >
      <span className="flex flex-col">
        <span className="prose-lab font-medium">{label}</span>
        <span className="font-mono text-[11.5px] text-umber-soft">{file}</span>
      </span>
      <ArrowDownToLine aria-hidden="true" className="shrink-0 text-umber" size={16} />
    </a>
  )
}

function AssetLinkPair({ dir = '', name, note }: { dir?: string; name: string; note: string }) {
  const path = dir ? `${dir}/${name}` : name
  return (
    <div className="grid grid-cols-2 gap-2">
      <AssetLink file={`${name}.svg`} href={`/${path}.svg`} label={`SVG · ${note}`} />
      <AssetLink file={`${name}.png`} href={`/${path}.png`} label={`PNG · ${note}`} />
    </div>
  )
}

function ColorGroup({
  title,
  note,
  tokens,
}: {
  title: string
  note: string
  tokens: ColorToken[]
}) {
  return (
    <div>
      <h3 className="type-head text-[15px]">{title}</h3>
      <p className="prose-lab mt-1.5 max-w-[52ch] text-[13.5px] leading-[1.6] text-umber">{note}</p>
      <div className="mt-4 divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/12">
        {tokens.map((color) => (
          <div
            className="flex flex-col gap-3 bg-shell/60 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-5"
            key={color.token}
          >
            <div className="flex items-center gap-3 sm:w-[168px] sm:shrink-0">
              <span
                aria-hidden="true"
                className="size-8 shrink-0 rounded-lg border border-ink/12"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex flex-col">
                <span className="text-[13.5px] font-medium text-ink">{color.name}</span>
                <span className="font-mono text-[11.5px] text-umber-soft">{color.hex}</span>
              </div>
            </div>
            <p className="prose-lab text-[13px] leading-[1.55] text-umber sm:flex-1">
              {color.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TypeSample({
  name,
  role,
  sampleClassName,
  sample,
  note,
}: {
  name: string
  role: string
  sampleClassName: string
  sample: string
  note: string
}) {
  return (
    <div className="grid gap-4 border-t border-ink/10 py-7 first:border-t-0 first:pt-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8">
      <div>
        <h3 className="type-head text-[15px]">{name}</h3>
        <span className="mt-1 block font-mono text-[11.5px] text-umber-soft">{role}</span>
      </div>
      <div>
        <p className={`${sampleClassName} text-ink`}>{sample}</p>
        <p className="prose-lab mt-3 max-w-[56ch] text-[13.5px] leading-[1.6] text-umber">{note}</p>
      </div>
    </div>
  )
}

export function BrandPage() {
  return (
    <>
      <section className="agar-wash relative overflow-hidden" id="intro">
        <div className="mx-auto max-w-[1480px] px-5 pb-16 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20">
          <Reveal className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-amber ring-3 ring-amber/25" />
            <SectionKicker>Brand</SectionKicker>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="type-display mt-6 max-w-[38ch] text-pretty text-[clamp(2.2rem,5vw,4rem)]">
              Brand Guidelines for Lab.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="type-deck mt-7 max-w-[42em] text-pretty text-[clamp(1.05rem,1.6vw,1.4rem)] text-ink/78">
              Lab is a programming language and compiler toolchain for
              describing biology and orchestrating work in the laboratory.
              Its mark is a plasmid ring, the loop of DNA scientists use to
              carry new instructions into a cell, with one colored arc per
              feature: the same picture the homepage draws while a program
              compiles. This page covers the mark, the colors, and the type,
              for anyone writing or building about Lab.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-ink/12 bg-sand/40" id="mark">
        <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <Reveal className="max-w-2xl">
            <SectionKicker>Mark and wordmark</SectionKicker>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.2rem)]">
              The logo mark.
            </h2>
            <p className="prose-lab mt-6 max-w-[58ch] text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
              The circle is the plasmid&rsquo;s backbone. Each colored arc on
              it is a feature: amber, green, and blue. The small triangle at
              the end of each arc shows which direction that feature reads.
            </p>
          </Reveal>

          <Reveal className="mt-14" delay={80}>
            <span className="micro text-ink/40">Icon</span>
            <div className="mt-4 grid gap-4 sm:grid-cols-[240px_minmax(0,1fr)]">
              <Plate tone="dark">
                <img alt="Lab icon on its dark tile" height={112} src="/lab-mark.svg" width={112} />
              </Plate>
              <div className="flex flex-col gap-3">
                <p className="prose-lab text-[14px] leading-[1.65] text-umber">
                  This is the default version: the ring on its own dark
                  square. Because it brings its own background, it looks
                  right anywhere. Use it for favicons, app icons, and
                  profile pictures.
                </p>
                <AssetLinkPair name="lab-mark" note="dark tile" />
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-10" delay={120}>
            <span className="micro text-ink/40">Ring, without a tile</span>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <Plate tone="dark">
                  <img alt="Lab ring on a dark surface" height={96} src="/brand/mark-ring-dark.svg" width={96} />
                </Plate>
                <AssetLinkPair dir="brand" name="mark-ring-dark" note="dark surfaces" />
              </div>
              <div className="flex flex-col gap-3">
                <Plate tone="light">
                  <img alt="Lab ring on a light surface" height={96} src="/brand/mark-ring-light.svg" width={96} />
                </Plate>
                <AssetLinkPair dir="brand" name="mark-ring-light" note="light surfaces" />
              </div>
            </div>
            <p className="prose-lab mt-4 max-w-[62ch] text-[14px] leading-[1.65] text-umber">
              Sometimes you need the ring on its own, with no tile behind it.
              On a dark background, use the full-color version. On paper, use
              the amber-only version instead. The bright green and blue are
              made to look like they&rsquo;re glowing, which only works on a
              dark background.
            </p>
          </Reveal>

          <Reveal className="mt-10" delay={160}>
            <span className="micro text-ink/40">Wordmark</span>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <Plate tone="dark">
                  <img alt="Lab wordmark on a dark surface" height={64} src="/brand/wordmark-dark.svg" width={172} />
                </Plate>
                <AssetLinkPair dir="brand" name="wordmark-dark" note="dark surfaces" />
              </div>
              <div className="flex flex-col gap-3">
                <Plate tone="light">
                  <img alt="Lab wordmark on a light surface" height={64} src="/brand/wordmark-light.svg" width={172} />
                </Plate>
                <AssetLinkPair dir="brand" name="wordmark-light" note="light surfaces" />
              </div>
            </div>
            <p className="prose-lab mt-4 max-w-[62ch] text-[14px] leading-[1.65] text-umber">
              This is the mark and the word &ldquo;Lab&rdquo; side by side,
              ready to drop into a header or footer. The SVG embeds its own
              typeface, so it looks right even if the person opening it
              doesn&rsquo;t have it installed. Every asset on this page is
              also available as a transparent PNG, for tools that
              don&rsquo;t take vector art.
            </p>
          </Reveal>

          <Reveal className="mt-14 grid gap-8 border-t border-ink/12 pt-10 sm:grid-cols-2" delay={200}>
            <div>
              <h3 className="type-head text-[15px]">Spacing and size</h3>
              <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
                Give the mark a little breathing room, about the width of
                one arc on every side. Below 16 pixels the three arcs blur
                into a single ring of color, which is fine for a favicon
                but too small for anything else.
              </p>
            </div>
            <div>
              <h3 className="type-head text-[15px]">Motion</h3>
              <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
                On the site, the mark tilts slightly on hover, and the
                homepage draws each arc in one at a time. Neither is needed
                anywhere else. The still version is the real logo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24" id="color">
        <Reveal className="max-w-2xl">
          <SectionKicker>Color</SectionKicker>
          <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.2rem)]">
            The palette.
          </h2>
          <p className="prose-lab mt-6 max-w-[58ch] text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
            Backgrounds read like paper. Text is a warm brown, not black.
            Amber is for anything that needs emphasis on a light background.
            Green, pink, and blue are only for dark backgrounds, where they
            look like they&rsquo;re glowing instead of just sitting flat.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          <Reveal delay={60}>
            <ColorGroup note="Backgrounds, lightest to darkest." title="Ground" tokens={groundTokens} />
          </Reveal>
          <Reveal delay={100}>
            <ColorGroup note="Text colors, most to least prominent." title="Ink" tokens={inkTokens} />
          </Reveal>
          <Reveal delay={140}>
            <ColorGroup note="The only colors safe to use for emphasis on a light background." title="Structure" tokens={structureTokens} />
          </Reveal>
          <Reveal delay={180}>
            <ColorGroup note="For dark backgrounds only. The light-surface mark uses amber instead." title="Glow" tokens={fluorophoreTokens} />
          </Reveal>
          <Reveal delay={220}>
            <ColorGroup note="Dark backgrounds: footers, code blocks, the icon tile." title="Dark" tokens={vesselTokens} />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-ink/12 bg-sand/40" id="type">
        <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <Reveal className="max-w-2xl">
            <SectionKicker>Typography</SectionKicker>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.2rem)]">
              Three typefaces, three jobs.
            </h2>
            <p className="prose-lab mt-6 max-w-[58ch] text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
              A serif for headlines, a sans-serif for body text and small
              labels, and a monospace for anything that reads like code.
            </p>
          </Reveal>

          <Reveal className="mt-12 rounded-2xl border border-ink/12 bg-shell/60 px-6 sm:px-8" delay={80}>
            <TypeSample
              name="Crimson Pro"
              note="Used for headlines and the wordmark."
              role="Headlines"
              sample="Brand Guidelines for Lab."
              sampleClassName="type-title text-[clamp(1.6rem,3vw,2.1rem)]"
            />
            <TypeSample
              name="Archivo"
              note="Used for paragraphs, and for small uppercase labels like the ones on this page."
              role="Body text"
              sample="A plasmid is a small loop of DNA that carries new instructions into a cell."
              sampleClassName="prose-lab text-[16px] leading-[1.6]"
            />
            <TypeSample
              name="IBM Plex Mono"
              note="Used for code, and anything that reads like a measurement or a filename."
              role="Code"
              sample="4,214 bp · circular · 0 BsaI sites"
              sampleClassName="font-mono text-[15px]"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24" id="usage">
        <Reveal className="max-w-2xl">
          <SectionKicker>Usage</SectionKicker>
          <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.2rem)]">
            A few requests.
          </h2>
          <p className="prose-lab mt-6 max-w-[58ch] text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
            Most of these come down to one thing: the mark is a real ring
            with real colors, not a piece of clip art, so treat it like one.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/12 sm:grid-cols-2">
          <div className="flex flex-col gap-4 bg-shell/70 p-6 sm:p-8">
            <span className="micro text-amber-deep">Do</span>
            <ul className="flex flex-col gap-3.5">
              {doList.map((item) => (
                <li className="prose-lab flex gap-3 text-[14.5px] leading-[1.6] text-ink/85" key={item}>
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-amber" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 bg-shell/70 p-6 sm:p-8">
            <span className="micro text-mcherry">Don&rsquo;t</span>
            <ul className="flex flex-col gap-3.5">
              {dontList.map((item) => (
                <li className="prose-lab flex gap-3 text-[14.5px] leading-[1.6] text-ink/85" key={item}>
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-mcherry" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal className="mt-10" delay={80}>
          <div className="tick-rule" />
          <p className="prose-lab mt-6 max-w-[58ch] text-[14.5px] leading-[1.65] text-umber">
            Need something that isn&rsquo;t here, like a different
            background, a single-color version, or a bigger export? Open an
            issue and say where it&rsquo;s going.
          </p>
        </Reveal>
      </section>
    </>
  )
}
