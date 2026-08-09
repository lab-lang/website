import { SectionBody, SectionIntro } from '@/components/section'
import { SourceCode } from '@/components/source-code'

/** Four fragments of real syntax, each stating something a protocol script has nowhere to put. */
const expressible = [
  {
    title: 'What would make this acceptable',
    code: 'accept concentration >= 100 ng/uL',
    detail:
      'The threshold sits in the program, beside the design it judges. A build that misses it is rejected, carrying the measurement that rejected it.',
  },
  {
    title: 'How much evidence that claim needs',
    code: 'across 3 biological replicates',
    detail:
      'Three colonies picked from a plate are independent transformants; one culture measured three times is one organism. The compiler knows which is which, because it knows where each sample came from.',
  },
  {
    title: 'Which tube this actually is',
    code: 'plate <- plate culture on chloramphenicol',
    detail:
      'The arrow marks a step that changes the world. The culture it consumes cannot be used again, and a replay of the workflow never performs it twice.',
  },
  {
    title: 'When the biology is ready',
    code: 'when every 30 min:',
    detail:
      'Colonies appear somewhere between overnight and never. The workflow wakes on a timer, watches the plate, and settles into a tagged result instead of counting steps.',
  },
]

export function ExpressibleSection() {
  return (
    <section id="expressible">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          className="max-w-3xl"
          kicker="What fits in a program"
          lede="Every tool above can say what the machine does. None of them has anywhere to put these four, which say what the science requires and let the compiler hold you to it."
          title="What no alternative can express."
        />

        {/*
         * One row each, code in its own column: a fragment cramped into a
         * card wraps or clips, and a clipped line of source undercuts the
         * point the line is making.
         */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-ink/15">
          {expressible.map((item, index) => (
            <div
              className={`grid gap-5 bg-shell/70 p-6 sm:p-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center lg:gap-10 ${
                index > 0 ? 'border-t border-ink/12' : ''
              }`}
              key={item.title}
            >
              <div>
                <h3 className="type-head text-lg">{item.title}</h3>
                <p className="prose-lab mt-3 text-[14.5px] leading-[1.65] text-umber">
                  {item.detail}
                </p>
              </div>
              <div className="min-w-0 overflow-hidden rounded-xl border border-ink/15 bg-vessel">
                <SourceCode showLineNumbers={false} source={item.code} />
              </div>
            </div>
          ))}
        </div>
      </SectionBody>
    </section>
  )
}
