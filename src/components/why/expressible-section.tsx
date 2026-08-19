import { CodeLanguageToggle } from '@/components/code-language-toggle'
import { SectionBody, SectionIntro } from '@/components/section'
import { SourceCode } from '@/components/source-code'
import { useCodeLanguage, type CodeLanguage } from '@/lib/code-language'

interface Expressible {
  title: string
  code: Record<CodeLanguage, string>
  detail: string
  /** Supplied only where the sentence names a spelling Lab has and Python does not. */
  pythonDetail?: string
}

/** Four fragments of real syntax, each stating something a protocol script has nowhere to put. */
const expressible: Expressible[] = [
  {
    title: 'What would make this acceptable',
    code: {
      lab: 'accept concentration >= 100 ng/uL',
      python: 'accept=[lambda built: built.concentration >= 100 * ng / uL]',
    },
    detail:
      'The threshold sits in the program, beside the design it judges. A build that misses it is rejected, carrying the measurement that rejected it.',
  },
  {
    title: 'How much evidence that claim needs',
    code: {
      lab: 'across 3 biological replicates',
      python: 'across=3',
    },
    detail:
      'Three colonies picked from a plate are independent transformants; one culture measured three times is one organism. The compiler knows which is which, because it knows where each sample came from.',
  },
  {
    title: 'Which tube this actually is',
    code: {
      lab: 'plate <- plate culture on chloramphenicol',
      python:
        'plate = wf.perform(lab.plate(culture, selection=chloramphenicol))',
    },
    detail:
      'The arrow marks a step that changes the world. The culture it consumes cannot be used again, and a replay of the workflow never performs it twice.',
    pythonDetail:
      'Every step that changes the world goes through wf.perform, and nothing else does. The culture it consumes cannot be used again, and a replay of the workflow never performs it twice.',
  },
  {
    title: 'When the biology is ready',
    code: {
      lab: 'when every 30 min:',
      python: '@wf.every(30 * minutes)',
    },
    detail:
      'Colonies appear somewhere between overnight and never. The workflow wakes on a timer, watches the plate, and settles into a tagged result instead of counting steps.',
  },
]

export function ExpressibleSection() {
  const language = useCodeLanguage()

  return (
    <section id="expressible">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionIntro
            className="max-w-3xl"
            kicker="What fits in a program"
            lede="Every tool above can say what the machine does. None of them has anywhere to put these four, which say what the science requires and let the compiler hold you to it."
            title="What no alternative can express."
          />
          <div className="shrink-0">
            <CodeLanguageToggle tone="light" />
          </div>
        </div>

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
                  {language === 'python' && item.pythonDetail
                    ? item.pythonDetail
                    : item.detail}
                </p>
              </div>
              <div className="min-w-0 overflow-hidden rounded-xl border border-ink/15 bg-vessel">
                <SourceCode
                  language={language}
                  showLineNumbers={false}
                  source={item.code[language]}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionBody>
    </section>
  )
}
