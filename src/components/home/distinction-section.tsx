import { SectionBody, SectionIntro } from '@/components/section'
import { useInView } from '@/lib/use-in-view'

/** The distinction the language exists to make. */
export function DistinctionSection() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="border-y border-ink/12 bg-sand/40" id="distinction">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <div className="reveal" data-shown={inView} ref={ref}>
          <SectionIntro
            className="max-w-3xl"
            kicker="The distinction"
            lede="A protocol is a program that acts on living material, and a single run can span days. Computers restart and instruments drop offline in that time, so when a run is interrupted, Lab resumes it by replaying the program from the beginning against a journal of everything that already happened. That puts one question at the center of the language: Which lines are safe to run again?"
            title="Code can run twice. An experiment happens once."
            titleClassName="max-w-[20ch] text-[clamp(1.65rem,4.2vw,3.4rem)]"
          />
        </div>

        <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <blockquote className="type-quote text-[clamp(1.35rem,2.4vw,1.85rem)] text-ink">
              “Replay may reevaluate{' '}
              <code className="font-mono not-italic text-amber-deep">=</code>,
              but must not repeat a completed physical action.”
            </blockquote>
            <p className="prose-lab mt-6 text-[15px] leading-[1.72] text-umber">
              So every line declares which kind it is.{' '}
              <code className="font-mono text-[0.9em] text-ink">=</code> binds
              the result of a computation: data in, data out, nothing in the
              world has changed, so replay simply evaluates it again.{' '}
              <code className="font-mono text-[0.9em] text-ink">&lt;-</code>{' '}
              performs a physical action, like transforming cells or consuming a
              tube. It is journaled the moment it completes and read back, never
              redone, on every replay after. One glance tells you whether a line
              can happen twice.
            </p>
            <p className="mt-6 font-mono text-[12px] text-umber">
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
              <p className="mt-5 font-mono text-[12px] text-[#f6ece0]/60">
                culture &lt;- transform construct into cells
              </p>
            </div>
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
