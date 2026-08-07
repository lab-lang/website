import { AssetLinkPair, Plate } from '@/components/brand/asset-plate'
import { SectionBody, SectionIntro } from '@/components/section'

export function MarkSection() {
  return (
    <section className="border-y border-ink/12 bg-sand/40" id="mark">
      <SectionBody className="py-20 lg:py-24">
        <SectionIntro
          className="max-w-2xl"
          kicker="Mark and wordmark"
          lede={
            <>
              The quiet bar on top is <code className="font-mono">=</code>,
              deterministic evaluation, which replay may repeat as often as it
              likes. The amber arrow under it is{' '}
              <code className="font-mono">&lt;-</code>, a durable action on real
              material, which replay must never repeat. The arrow carries the
              color because it is the half that costs something.
            </>
          }
          ledeClassName="mt-6 max-w-[58ch] text-[16px] leading-[1.7] sm:text-[17px]"
          title="The logo mark."
          titleClassName="text-[clamp(2rem,4.2vw,3.2rem)]"
        />

        <div className="mt-14">
          <span className="micro text-ink/40">Icon</span>
          <div className="mt-4 grid gap-4 sm:grid-cols-[240px_minmax(0,1fr)]">
            <Plate tone="dark">
              <img
                alt="Lab icon on its dark tile"
                height={112}
                src="/lab-mark.svg"
                width={112}
              />
            </Plate>
            <div className="flex flex-col gap-3">
              <p className="prose-lab text-[14px] leading-[1.65] text-umber">
                This is the default version: the mark on its own dark square.
                Because it brings its own background, it looks right anywhere.
                Use it for favicons, app icons, and profile pictures.
              </p>
              <AssetLinkPair name="lab-mark" note="dark tile" />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <span className="micro text-ink/40">Mark, without a tile</span>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <Plate tone="dark">
                <img
                  alt="Lab mark on a dark surface"
                  height={96}
                  src="/brand/mark-dark.svg"
                  width={96}
                />
              </Plate>
              <AssetLinkPair
                dir="brand"
                name="mark-dark"
                note="dark surfaces"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Plate tone="light">
                <img
                  alt="Lab mark on a light surface"
                  height={96}
                  src="/brand/mark-light.svg"
                  width={96}
                />
              </Plate>
              <AssetLinkPair
                dir="brand"
                name="mark-light"
                note="light surfaces"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Plate tone="light">
                <img
                  alt="Lab mark in a single color"
                  height={96}
                  src="/brand/mark-mono.svg"
                  width={96}
                />
              </Plate>
              <AssetLinkPair dir="brand" name="mark-mono" note="one color" />
            </div>
          </div>
          <p className="prose-lab mt-4 max-w-[62ch] text-[14px] leading-[1.65] text-umber">
            Sometimes you need the mark on its own, with no tile behind it. On a
            dark background use the bright amber; on paper use the deep amber,
            which holds up against a light surface. The single-color version is
            for anywhere you only get one ink: etching, embroidery, a one-color
            print. It gives up the contrast between the two lines, so reach for
            it only when you have to.
          </p>
        </div>

        <div className="mt-10">
          <span className="micro text-ink/40">Wordmark</span>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Plate tone="dark">
                <img
                  alt="Lab wordmark on a dark surface"
                  height={64}
                  src="/brand/wordmark-dark.svg"
                  width={147}
                />
              </Plate>
              <AssetLinkPair
                dir="brand"
                name="wordmark-dark"
                note="dark surfaces"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Plate tone="light">
                <img
                  alt="Lab wordmark on a light surface"
                  height={64}
                  src="/brand/wordmark-light.svg"
                  width={147}
                />
              </Plate>
              <AssetLinkPair
                dir="brand"
                name="wordmark-light"
                note="light surfaces"
              />
            </div>
          </div>
          <p className="prose-lab mt-4 max-w-[62ch] text-[14px] leading-[1.65] text-umber">
            This is the mark and the word &ldquo;Lab&rdquo; side by side, ready
            to drop into a header or footer. The word is drawn as outlines
            rather than live text, so it renders the same everywhere and needs
            no typeface installed. Every asset on this page is also available as
            a transparent PNG, for tools that don&rsquo;t take vector art.
          </p>
        </div>

        <div className="mt-10">
          <span className="micro text-ink/40">Full wordmark</span>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Plate tone="dark">
                <img
                  alt="Lab full wordmark on a dark surface"
                  className="h-auto w-full max-w-[520px]"
                  height={64}
                  src="/brand/wordmark-full-dark.svg"
                  width={638}
                />
              </Plate>
              <AssetLinkPair
                dir="brand"
                name="wordmark-full-dark"
                note="dark surfaces"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Plate tone="light">
                <img
                  alt="Lab full wordmark on a light surface"
                  className="h-auto w-full max-w-[520px]"
                  height={64}
                  src="/brand/wordmark-full-light.svg"
                  width={638}
                />
              </Plate>
              <AssetLinkPair
                dir="brand"
                name="wordmark-full-light"
                note="light surfaces"
              />
            </div>
          </div>
          <p className="prose-lab mt-4 max-w-[62ch] text-[14px] leading-[1.65] text-umber">
            Where &ldquo;Lab&rdquo; on its own would read as an ordinary word
            rather than a name, spell the language out: the top of a README, the
            first slide, a conference banner, a paper. Same mark, same typeface,
            just the full name. It runs more than four times the width of the
            short wordmark, so give it a line to itself rather than tucking it
            into a header.
          </p>
        </div>

        <div className="mt-14 grid gap-8 border-t border-ink/12 pt-10 sm:grid-cols-2">
          <div>
            <h3 className="type-head text-[15px]">Spacing and size</h3>
            <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
              Give the mark a little breathing room, about the height of one bar
              on every side. Below 16 pixels the arrowhead loses its point,
              which is fine for a favicon but too small for anything else.
            </p>
          </div>
          <div>
            <h3 className="type-head text-[15px]">Motion</h3>
            <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
              On the site, the mark tilts slightly on hover. That is the only
              motion it gets, and it isn&rsquo;t needed anywhere else. The still
              version is the real logo.
            </p>
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
