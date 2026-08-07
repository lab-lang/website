import { ReactiveTimeline } from '@/components/reactive-timeline'
import { SectionBody, SectionIntro } from '@/components/section'
import { SourceCode } from '@/components/source-code'
import { reactiveExample } from '@/data/examples'

/** The workflow waits on the world's schedule, not the program's. */
export function ReactiveSection() {
  return (
    <section className="border-t border-ink/12" id="reactive">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          className="max-w-3xl"
          kicker="Reactive control"
          lede={
            <>
              A workflow is a deterministic state machine, not a script.{' '}
              <code className="font-mono text-[0.88em] text-ink">
                when every
              </code>{' '}
              wakes it on a schedule and{' '}
              <code className="font-mono text-[0.88em] text-ink">
                when after
              </code>{' '}
              sets a deadline. Each wake-up replays from the same durable
              journal that protects{' '}
              <code className="font-mono text-[0.88em] text-ink">&lt;-</code>.
              Below, a workflow checks a plate every 30 minutes and gives up
              after 18 hours if nothing has grown: two reactive clauses, no
              polling loop.
            </>
          }
          title="The workflow knows when to check back, and when to give up."
        />

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-ink/20 bg-vessel">
          <div className="relative grid lg:grid-cols-2">
            <div className="flex h-[360px] min-w-0 flex-col border-b border-white/10 sm:h-[620px] lg:border-b-0 lg:border-r">
              <div className="border-b border-white/10 px-5 py-3">
                <span className="micro text-[#f6ece0]/45">
                  await_colonies.lab
                </span>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <SourceCode source={reactiveExample} />
              </div>
            </div>

            <div className="h-[420px] min-w-0 sm:h-[620px]">
              <ReactiveTimeline />
            </div>
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
