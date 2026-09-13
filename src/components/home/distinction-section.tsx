import { CodeLanguageToggle } from '@/components/code-language-toggle'
import { SectionBody, SectionIntro } from '@/components/section'
import { useCodeLanguage, type CodeLanguage } from '@/lib/code-language'
import { useInView } from '@/lib/use-in-view'

interface Markers {
  /** How this frontend spells a durable effect, and how big that spelling sets. */
  durable: string
  durableClass: string
  durableExample: string
}

const MARKERS: Record<CodeLanguage, Markers> = {
  lab: {
    durable: '<-',
    durableClass: 'text-4xl',
    durableExample: 'strain, culture <- transform host from dna into cells',
  },
  python: {
    durable: 'wf.perform',
    durableClass: 'text-2xl',
    durableExample: 'strain, culture = wf.perform(lab.transform(...))',
  },
}

/** The distinction the compiler exists to make, in whichever frontend you read. */
export function DistinctionSection() {
  const { ref, inView } = useInView<HTMLDivElement>()
  const language = useCodeLanguage()
  const markers = MARKERS[language]
  const python = language === 'python'

  return (
    <section className="border-y border-ink/12 bg-sand/40" id="distinction">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <div className="reveal" data-shown={inView} ref={ref}>
          <SectionIntro
            className="max-w-3xl"
            kicker="The distinction"
            lede="A protocol describes work on physical material. Recalculating a dilution is different from pipetting it again. Lab makes that distinction explicit so the compiler can check how material is used and a reader can see which steps change the experiment. The same distinction guides the design of resumable execution."
            title="Code can run twice. An experiment happens once."
            titleClassName="max-w-[20ch] text-[clamp(1.65rem,4.2vw,3.4rem)]"
          />
        </div>

        <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <blockquote className="type-quote text-[clamp(1.35rem,2.4vw,1.85rem)] text-ink">
              “Workflow replay must not repeat completed physical actions.”
            </blockquote>
            <p className="prose-lab mt-6 text-[15px] leading-[1.72] text-umber">
              The rule belongs to the compiler, not to any one syntax, so every
              frontend has to make it visible.{' '}
              <code className="font-mono text-[0.9em] text-ink">=</code> binds
              the result of a computation: data in, data out, nothing in the
              world has changed, so replay simply evaluates it again.{' '}
              {python ? (
                <>
                  A physical action, like transforming cells or consuming a
                  tube, goes through{' '}
                  <code className="font-mono text-[0.9em] text-ink">
                    wf.perform
                  </code>{' '}
                  and declares its effects to the checker. In Lab the same
                  distinction is punctuation; here it is an explicit call.
                </>
              ) : (
                <>
                  <code className="font-mono text-[0.9em] text-ink">&lt;-</code>{' '}
                  marks a physical action, like transforming cells or consuming
                  a tube, and declares its effects to the checker. One glance
                  distinguishes a calculation from laboratory work.
                </>
              )}
            </p>
            <p className="mt-6 font-mono text-[12px] text-umber">
              docs/language/semantics.md
            </p>
          </div>

          <div>
            <div className="flex justify-end">
              <CodeLanguageToggle tone="light" />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="lift rounded-2xl border border-ink/15 bg-shell/70 p-6">
                {/* Both markers sit in the same fixed box, so the headings
                 * below them stay aligned whether the marker is a glyph or a
                 * word. */}
                <span className="flex h-10 items-center font-mono text-4xl text-ink">
                  =
                </span>
                <h3 className="type-head mt-6 text-lg">Evaluation</h3>
                <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
                  Deterministic computation and state transition. Safe to run
                  again during replay because nothing in the world changed.
                </p>
                <p className="mt-5 break-words font-mono text-[12px] text-umber-soft">
                  colonies = detect_colonies(image)
                </p>
              </div>

              <div className="lift rounded-2xl border border-ink/15 bg-vessel p-6">
                <span
                  className={`flex h-10 items-center font-mono text-gfp ${markers.durableClass}`}
                >
                  {markers.durable}
                </span>
                <h3 className="type-head mt-6 text-lg text-[#f6ece0]">
                  Durable effect
                </h3>
                <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-[#f6ece0]/60">
                  A physical or external action with a real-world consequence.
                  Resuming execution must preserve its recorded outcome without
                  repeating completed physical work.
                </p>
                <p className="mt-5 break-words font-mono text-[12px] text-[#f6ece0]/60">
                  {markers.durableExample}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
