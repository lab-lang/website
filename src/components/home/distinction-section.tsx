import { SectionBody, SectionIntro } from '@/components/section'

/** The distinction the language exists to make. */
export function DistinctionSection() {
  return (
    <section className="border-y border-ink/12 bg-sand/40" id="distinction">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          kicker="The distinction"
          title="Two kinds of step, and only one can be repeated."
          titleClassName="max-w-[20ch] text-[clamp(2rem,4.2vw,3.4rem)]"
        />

        <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <blockquote className="type-quote text-[clamp(1.35rem,2.4vw,1.85rem)] text-ink">
              “Replay may reevaluate{' '}
              <code className="font-mono not-italic text-amber-deep">=</code>,
              but must not repeat a completed physical action.”
            </blockquote>
            <p className="prose-lab mt-6 text-[15px] leading-[1.72] text-umber">
              Ordinary programs can retry anything. A laboratory cannot. Once
              cells are transformed or a tube is consumed, no runtime can undo
              it, so Lab makes the difference visible in the syntax instead of
              hiding it behind a function call.
            </p>
            <p className="mt-6 font-mono text-[12px] text-umber-soft">
              docs/language/semantics.md
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="lift rounded-2xl border border-ink/15 bg-shell/70 p-6">
              <span className="font-mono text-4xl text-ink">=</span>
              <h3 className="type-head mt-6 text-lg">Evaluation</h3>
              <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
                Deterministic computation and state transition. Safe to run
                again during replay because nothing in the world changed.
              </p>
              <p className="mt-5 font-mono text-[12px] text-umber-soft">
                colonies = detect_colonies(image)
              </p>
            </div>

            <div className="lift rounded-2xl border border-ink/15 bg-vessel p-6">
              <span className="font-mono text-4xl text-gfp">&lt;-</span>
              <h3 className="type-head mt-6 text-lg text-[#f6ece0]">
                Durable effect
              </h3>
              <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-[#f6ece0]/60">
                A physical or external action with a real-world consequence.
                Recorded once in the journal and never repeated.
              </p>
              <p className="mt-5 font-mono text-[12px] text-[#f6ece0]/40">
                culture &lt;- transform construct into cells
              </p>
            </div>
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
