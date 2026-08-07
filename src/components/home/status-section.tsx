import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { InstallCommand } from '@/components/home/install-command'
import { ClosingNote, SectionBody, SectionIntro } from '@/components/section'
import { REPO_URL } from '@/lib/site'
import { useInView } from '@/lib/use-in-view'

const shipped = [
  'Parsing, resolution, and type checking',
  'Typed portable module IR',
  'Action contracts and affine material flow',
  'LAIR dialects with a verified protocol boundary',
  'Editor support over LSP and WebAssembly',
  'Experimental Opentrons OT-2 backend',
]

const pending = [
  'The durable workflow runtime',
  'Resource-aware workflow lowering',
  'Scheduling and hardware specialization',
  'External package resolution and lockfiles',
  'Live inventory, lots, and provenance',
  'Cloud labs and other robot families',
]

/** Honesty about maturity, in the project's own terms. */
export function StatusSection() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="border-t border-ink/12 bg-sand/40" id="status">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        {/*
         * Only the intro settles in. The shipped/pending lists are the
         * section's information payload — candor does not fade in, and a
         * reveal spanning a grid taller than a phone viewport would hold
         * visible content blank.
         */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <div className="reveal" data-shown={inView} ref={ref}>
            <SectionIntro
              kicker="Where this stands"
              lede="The language and its intermediate representations are still changing, and the durable workflow runtime has not been built. Generated protocols are a compiler concept spike: a laboratory must verify and qualify them before anything is executed."
              ledeClassName="mt-6 text-[15px] leading-[1.72]"
              title="Current state of the Lab."
              titleClassName="text-[clamp(1.65rem,3.6vw,2.9rem)]"
            />
            <Link
              className="press mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)]"
              to="/docs"
            >
              See what the language covers
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-gfp" />
                <span className="micro text-ink/55">Works today</span>
              </div>
              <ul className="mt-5 space-y-3">
                {shipped.map((item) => (
                  <li
                    className="prose-lab border-t border-ink/10 pt-3 text-[14px] leading-[1.55] text-ink"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-umber-soft" />
                <span className="micro text-ink/55">Not yet</span>
              </div>
              <ul className="mt-5 space-y-3">
                {pending.map((item) => (
                  <li
                    className="prose-lab border-t border-ink/10 pt-3 text-[14px] leading-[1.55] text-umber-soft"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/*
         * The phone visitor's exit ramp: they will not curl-pipe-sh from a
         * phone, so the install command waits here as the thing to remember
         * for the bench, and the repo link wears primary weight — the one
         * conversion a phone reader completes in the moment.
         */}
        <div className="mt-16 sm:hidden">
          <p className="micro text-ink/55">Back at your bench</p>
          <div className="mt-3">
            <InstallCommand />
          </div>
        </div>

        <ClosingNote
          className="mt-10 sm:mt-16"
          note="Lab is developed in the open under Apache-2.0."
        >
          <a
            className="press inline-flex w-fit items-center gap-2 rounded-xl border border-transparent bg-ink px-5 py-2.5 text-[14px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)] sm:border-ink/20 sm:bg-transparent sm:text-ink sm:shadow-none sm:hover:border-ink/40"
            href={REPO_URL}
            rel="noreferrer"
            target="_blank"
          >
            Read the source
            <ArrowRight aria-hidden="true" size={15} />
          </a>
        </ClosingNote>
      </SectionBody>
    </section>
  )
}
