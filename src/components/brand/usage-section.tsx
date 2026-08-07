import { SectionBody, SectionIntro } from '@/components/section'

const doList = [
  'Use the icon (the mark on its dark tile) for favicons, app icons, and anywhere it needs to stand alone.',
  'On paper, use the deep amber version of the mark, not the bright amber one.',
  'Leave a small margin around the mark, roughly the height of one bar.',
  'Write "Lab" capitalized, in the serif typeface, everywhere it appears.',
  'Keep the bar quieter than the arrow. That difference in weight is the whole idea.',
]

const dontList = [
  'Don’t put the bright amber mark straight onto paper. It goes muddy against a light background.',
  'Don’t recolor the arrow.',
  'Don’t stretch, skew, or add a shadow to the mark.',
  'Don’t flip the arrow. It points the way it points for a reason.',
  'Don’t shrink the mark so far that the bar and the arrow run together.',
]

export function UsageSection() {
  return (
    <section id="usage">
      <SectionBody className="py-20 lg:py-24">
        <SectionIntro
          className="max-w-2xl"
          kicker="Usage"
          lede="Most of these come down to one thing: the mark is a real ring with real colors, not a piece of clip art, so treat it like one."
          ledeClassName="mt-6 max-w-[58ch] text-[16px] leading-[1.7] sm:text-[17px]"
          title="A few requests."
          titleClassName="text-[clamp(2rem,4.2vw,3.2rem)]"
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/12 sm:grid-cols-2">
          <div className="flex flex-col gap-4 bg-shell/70 p-6 sm:p-8">
            <span className="micro text-amber-deep">Do</span>
            <ul className="flex flex-col gap-3.5">
              {doList.map((item) => (
                <li
                  className="prose-lab flex gap-3 text-[14.5px] leading-[1.6] text-ink/85"
                  key={item}
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-amber"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 bg-shell/70 p-6 sm:p-8">
            <span className="micro text-mcherry">Don&rsquo;t</span>
            <ul className="flex flex-col gap-3.5">
              {dontList.map((item) => (
                <li
                  className="prose-lab flex gap-3 text-[14.5px] leading-[1.6] text-ink/85"
                  key={item}
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-mcherry"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <div className="tick-rule" />
          <p className="prose-lab mt-6 max-w-[58ch] text-[14.5px] leading-[1.65] text-umber">
            Need something that isn&rsquo;t here, like a different background, a
            single-color version, or a bigger export? Open an issue and say
            where it&rsquo;s going.
          </p>
        </div>
      </SectionBody>
    </section>
  )
}
