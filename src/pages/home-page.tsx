import { ArrowRight, Check, Copy, Eye, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeroSpecimen } from '../components/hero'
import { LoweringRail } from '../components/lowering-rail'
import { ReactiveTimeline } from '../components/reactive-timeline'
import { SourceCode } from '../components/source-code'
import { REPO_URL } from '../lib/site'
import { diagnostics } from '../data/artifacts'
import { reactiveExample } from '../data/examples'

const INSTALL =
  'cargo install --git https://github.com/lab-lang/lab lab-cli --locked'

const ownership = [
  {
    mode: 'copy',
    icon: Copy,
    subject: 'Information',
    detail:
      'Designs, sequences, and measurements are freely reusable. Reading a design does not use it up.',
  },
  {
    mode: 'borrow',
    icon: Eye,
    subject: 'Observation',
    detail:
      'Imaging a plate or quantifying a sample inspects the material and hands it back intact.',
  },
  {
    mode: 'take',
    icon: LogOut,
    subject: 'Consumption',
    detail:
      'Assembling, transforming, or disposing consumes the material. Afterwards the name refers to nothing you still hold.',
  },
]

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

function InstallCommand() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-ink/15 bg-shell/70 py-2 pl-4 pr-2">
      {/* Scrolls rather than truncating: on a phone the tail is the interesting part. */}
      <code
        className="rail rail-quiet min-w-0 flex-1 whitespace-nowrap font-mono text-[12.5px] text-ink"
        title={INSTALL}
      >
        <span className="text-amber-deep">$</span> {INSTALL}
      </code>
      <button
        className="press grid size-10 shrink-0 place-items-center rounded-lg text-umber hover:bg-ink/8 hover:text-ink sm:size-8"
        onClick={copy}
        type="button"
      >
        {copied ? (
          <Check aria-hidden="true" size={14} strokeWidth={2.6} />
        ) : (
          <Copy aria-hidden="true" size={14} />
        )}
        <span className="sr-only">
          {copied ? 'Command copied' : 'Copy install command'}
        </span>
      </button>
    </div>
  )
}

export function HomePage() {
  return (
    <>
      <section className="agar-wash relative overflow-hidden" id="intro">
        <div className="mx-auto max-w-[1480px] px-5 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-10 lg:px-10 lg:pb-28">
          <p className="micro text-umber">
            <span className="normal-case">v</span>0.1.0 · early prototype
          </p>

          <div>
            <h1 className="type-display mt-6 text-[clamp(2rem,5.65vw,5.25rem)]">
              <span className="block text-pretty">
                A programming language for biology.
              </span>
              <span className="mt-[0.06em] block text-pretty text-[0.85em] font-light text-amber-deep">
                A compiler for the self-driving laboratory.
              </span>
            </h1>
          </div>

          {/*
           * min-w-0 on both cells: the install command sets its own line, and
           * without it that line's intrinsic width sizes the whole column and
           * pushes the hero past the edge of a phone.
           */}
          <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0">
              <p className="type-deck max-w-[33em] text-pretty text-[clamp(1.05rem,1.6vw,1.5rem)] text-ink/78">
                Lab is a programming language and compiler toolchain for making
                laboratory work portable, inspectable, and reliable across
                people, instruments, and facilities.
              </p>
            </div>

            <div className="min-w-0 lg:w-[474px] lg:shrink-0">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-[15px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)] sm:text-[14px]"
                  to="/docs"
                >
                  Read the docs
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link
                  className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/20 px-5 py-3 text-[15px] text-ink hover:border-ink/40 sm:text-[14px]"
                  to="/playground"
                >
                  Open the playground
                </Link>
              </div>
              <div className="mt-3">
                <InstallCommand />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <HeroSpecimen />
          </div>
        </div>
      </section>

      {/* The distinction the language exists to make. */}
      <section className="border-y border-ink/12 bg-sand/40" id="distinction">
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div>
            <span className="micro text-amber-deep">The distinction</span>
            <h2 className="type-title mt-5 max-w-[20ch] text-balance text-[clamp(2rem,4.2vw,3.4rem)]">
              Two kinds of step, and only one can be repeated.
            </h2>
          </div>

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
        </div>
      </section>

      {/* Reactive control: the workflow waits on the world's schedule, not the program's. */}
      <section className="border-t border-ink/12" id="reactive">
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <span className="micro text-amber-deep">Reactive control</span>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)]">
              The workflow knows when to check back, and when to give up.
            </h2>
            <p className="prose-lab mt-6 text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
              A workflow is a deterministic state machine, not a script.{' '}
              <code className="font-mono text-[0.88em] text-ink">when every</code>{' '}
              wakes it on a schedule and{' '}
              <code className="font-mono text-[0.88em] text-ink">when after</code>{' '}
              sets a deadline. Each wake-up replays from the same durable
              journal that protects{' '}
              <code className="font-mono text-[0.88em] text-ink">&lt;-</code>.
              Below, a workflow checks a plate every 30 minutes and gives up
              after 18 hours if nothing has grown: two reactive clauses, no
              polling loop.
            </p>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-2xl border border-ink/20 bg-vessel">
            <div className="emission-wash pointer-events-none absolute inset-0" />

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
        </div>
      </section>

      {/* Transilluminator surface: the same program, five ways. */}
      <section className="emission-wash bg-vessel" id="lowering">
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <span className="micro text-gfp">One program, many labs</span>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)] text-[#f6ece0]">
              Follow one program all the way down.
            </h2>
            <p className="prose-lab mt-6 text-[16px] leading-[1.7] text-[#f6ece0]/60 sm:text-[17px]">
              Lab separates what the scientist means from where the work runs.
              Each artifact below is produced by the toolchain as it stands
              today, from the program at the top of this page.
            </p>
          </div>

          <div className="mt-14">
            <LoweringRail />
          </div>
        </div>
      </section>

      {/* Material flow, evidenced with real compiler output. */}
      <section className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28" id="material-flow">
        <div className="max-w-3xl">
          <span className="micro text-amber-deep">Material flow</span>
          <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)]">
            The compiler knows you only have one tube and one tip.
          </h2>
          <p className="prose-lab mt-6 text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
            Physical materials are affine: they cannot be implicitly copied, and
            they must end up returned, stored, transferred, or disposed. Every
            action declares how it treats what you hand it.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/12 sm:grid-cols-3">
          {ownership.map((mode, index) => (
            <div className="bg-shell/70 p-6 sm:p-7" key={mode.mode}>
              <div className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber/12 text-amber-deep">
                  <mode.icon aria-hidden="true" size={16} strokeWidth={2} />
                </span>
                <code className="font-mono text-[15px] text-ink">
                  {mode.mode}
                </code>
              </div>
              <h3 className="type-head mt-6 text-lg">{mode.subject}</h3>
              <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
                {mode.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h3 className="type-head text-xl">What that catches</h3>
          <p className="prose-lab mt-3 max-w-2xl text-[15px] leading-[1.7] text-umber">
            These are real diagnostics, produced by running the checker on
            programs written to break it.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {diagnostics.map((diagnostic, index) => (
            <div
              className="overflow-hidden rounded-2xl border border-ink/18"
              key={diagnostic.id}
            >
              <div className="border-b border-ink/12 bg-sand/50 px-5 py-3">
                <span className="micro text-ink/50">{diagnostic.title}</span>
              </div>
              <SourceCode
                className="bg-vessel"
                language="lab"
                showLineNumbers={false}
                source={diagnostic.source}
              />
              <pre className="overflow-x-auto border-t border-white/8 bg-vessel px-5 pb-5 pt-1 font-mono text-[12.5px] leading-[1.7] text-mcherry">
                <code>{diagnostic.error}</code>
              </pre>
              <p className="prose-lab bg-shell/70 px-5 py-4 text-[14px] leading-[1.6] text-umber">
                {diagnostic.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Honesty about maturity, in the project's own terms. */}
      <section className="border-t border-ink/12 bg-sand/40" id="status">
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <span className="micro text-amber-deep">Where this stands</span>
              <h2 className="type-title mt-5 text-balance text-[clamp(1.9rem,3.6vw,2.9rem)]">
                Current state of the Lab.
              </h2>
              <p className="prose-lab mt-6 text-[15px] leading-[1.72] text-ink/78">
                The language and its intermediate representations are still
                changing, and the durable workflow runtime has not been built.
                Generated protocols are a compiler concept spike: a laboratory
                must verify and qualify them before anything is executed.
              </p>
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

          <div className="mt-16">
            <div className="tick-rule" />
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="prose-lab text-[15px] text-umber">
                Lab is developed in the open under Apache-2.0.
              </p>
              <a
                className="press inline-flex w-fit items-center gap-2 rounded-xl border border-ink/20 px-5 py-2.5 text-[14px] text-ink hover:border-ink/40"
                href={REPO_URL}
                rel="noreferrer"
                target="_blank"
              >
                Read the source
                <ArrowRight aria-hidden="true" size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
