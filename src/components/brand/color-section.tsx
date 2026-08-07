import { ColorGroup } from '@/components/brand/color-group'
import { SectionBody, SectionIntro } from '@/components/section'
import {
  fluorophoreTokens,
  groundTokens,
  inkTokens,
  structureTokens,
  vesselTokens,
} from '@/data/brand-tokens'

const groups = [
  {
    title: 'Ground',
    note: 'Backgrounds, lightest to darkest.',
    tokens: groundTokens,
  },
  {
    title: 'Ink',
    note: 'Text colors, most to least prominent.',
    tokens: inkTokens,
  },
  {
    title: 'Structure',
    note: 'The only colors safe to use for emphasis on the page ground.',
    tokens: structureTokens,
  },
  {
    title: 'Glow',
    note: 'For dark backgrounds only. Not for the mark, which is amber everywhere.',
    tokens: fluorophoreTokens,
  },
  {
    title: 'Dark',
    note: 'Dark backgrounds: footers, code blocks, the icon tile.',
    tokens: vesselTokens,
  },
]

export function ColorSection() {
  return (
    <section id="color">
      <SectionBody className="py-20 lg:py-24">
        <SectionIntro
          className="max-w-2xl"
          kicker="Color"
          lede={
            <>
              Backgrounds read like paper. Text is a warm brown, not black.
              Amber is for anything that needs emphasis on the page. Green,
              pink, and blue are only for dark backgrounds, where they look like
              they&rsquo;re glowing instead of just sitting flat.
            </>
          }
          ledeClassName="mt-6 max-w-[58ch] text-[16px] leading-[1.7] sm:text-[17px]"
          title="The palette."
          titleClassName="text-[clamp(2rem,4.2vw,3.2rem)]"
        />
        <p className="prose-lab mt-4 max-w-[58ch] text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
          Each name below holds two values, one per theme. Reach for the name
          and the theme picks the value; the fluorophores are the exception,
          since a glow that works on dark needs no second reading.
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {groups.map((group) => (
            <div key={group.title}>
              <ColorGroup
                note={group.note}
                title={group.title}
                tokens={group.tokens}
              />
            </div>
          ))}
        </div>
      </SectionBody>
    </section>
  )
}
