import {
  ArrowRight,
  Braces,
  FlaskConical,
  Layers3,
  Play,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroDemo } from '../components/hero-demo'

const principles = [
  {
    icon: Braces,
    number: '01',
    title: 'State the intent',
    description:
      'Describe biological designs, physical materials, constraints, and acceptance evidence in one typed language.',
  },
  {
    icon: Layers3,
    number: '02',
    title: 'Keep lowering visible',
    description:
      'LAIR preserves meaning as the compiler moves from portable intent toward target-specific operations.',
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: 'Check before execution',
    description:
      'Type, action-contract, and affine material-flow checks surface mistakes before they reach a bench or robot.',
  },
]

const pipeline = [
  ['Source', 'Biology + workflow intent'],
  ['Checked IR', 'Types + material ownership'],
  ['LAIR', 'Inspectable specialization'],
  ['Target', 'Human bench or automation'],
]

export function HomePage() {
  return (
    <>
      <section className="lab-grid overflow-hidden border-b border-ink/10">
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12 lg:pb-28 lg:pt-20">
          <div className="hero-enter mb-9 inline-flex items-center gap-2 rounded-full border border-lab-green/25 bg-lab-green-light/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-lab-green">
            <span className="size-1.5 rounded-full bg-lab-green" />
            Early prototype · built in the open
          </div>

          <div className="grid gap-14 xl:grid-cols-[minmax(0,1.04fr)_minmax(500px,0.96fr)] xl:items-center xl:gap-16">
            <div className="hero-enter hero-enter-delay min-w-0">
              <h1
                aria-label="A programming language for biology. A compiler for the lab."
                className="max-w-[18ch] text-balance text-[clamp(2.5rem,4.1vw,4.5rem)] font-[580] leading-[0.98] tracking-[-0.035em] sm:tracking-[-0.045em]"
              >
                <span aria-hidden="true" className="block">
                  A programming language for biology.
                </span>
                <span
                  aria-hidden="true"
                  className="mt-[0.12em] block text-lab-green"
                >
                  A compiler for your lab.
                </span>
              </h1>
              <p className="mt-8 max-w-xl text-balance text-base leading-7 text-ink-muted sm:mt-9 sm:text-lg sm:leading-7">
                Lab is a programming language and compiler toolkit for making
                laboratory work portable, inspectable, and reliable across
                people, instruments, and facilities.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="pressable inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper shadow-[0_10px_24px_rgb(22_39_31_/_0.16)]"
                  to="/docs"
                >
                  Explore the language
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
                <Link
                  className="pressable inline-flex items-center justify-center gap-2 rounded-xl border border-ink/20 bg-paper/70 px-5 py-3 text-sm font-semibold text-ink"
                  to="/playground"
                >
                  <Play aria-hidden="true" fill="currentColor" size={14} />
                  Open playground
                </Link>
              </div>
            </div>

            <div className="hero-enter hero-enter-delay relative min-w-0">
              <div className="absolute -inset-10 -z-10 rounded-full bg-lab-lime/25 blur-3xl" />
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-ink text-paper">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-12 lg:py-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-lab-lime">
              One program, many environments
            </p>
            <h2 className="text-balance mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
              Separate what the scientist means from where the work runs.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-paper/65 sm:text-lg">
              Lab programs describe the desired biological result and the
              evidence needed to accept it. The compiler specializes that intent
              for available capabilities, inventory, policy, and hardware.
            </p>
          </div>

          <div className="grid content-start sm:grid-cols-2">
            {pipeline.map(([name, detail], index) => (
              <div
                className="border-t border-white/15 py-6 sm:min-h-40 sm:p-6 sm:first:border-r sm:nth-[2]:border-t sm:nth-[3]:border-r"
                key={name}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-lab-lime">
                    0{index + 1}
                  </span>
                  {index < pipeline.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="text-white/25"
                      size={16}
                    />
                  )}
                </div>
                <h3 className="mt-7 text-lg font-semibold">{name}</h3>
                <p className="mt-1.5 text-sm leading-6 text-paper/55">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-lab-green">
              Compiler-minded by design
            </p>
            <h2 className="text-balance mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Scientific semantics stay first-class.
            </h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-lab-green hover:text-ink"
            to="/docs"
          >
            Read the design overview
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {principles.map((principle) => (
            <article
              className="soft-rise rounded-2xl border border-ink/15 bg-white/35 p-6 sm:p-8"
              key={principle.title}
            >
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-lab-green-light text-lab-green">
                  <principle.icon aria-hidden="true" size={21} />
                </span>
                <span className="font-mono text-xs text-ink/35">
                  {principle.number}
                </span>
              </div>
              <h3 className="mt-12 text-xl font-semibold tracking-[-0.025em]">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="lab-dots relative mx-auto max-w-[1344px] overflow-hidden rounded-3xl border border-lab-green/25 bg-lab-green-light px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute right-8 top-8 hidden size-24 rotate-6 place-items-center rounded-3xl border border-lab-green/20 bg-paper/65 text-lab-green lg:grid">
            <FlaskConical aria-hidden="true" size={40} strokeWidth={1.5} />
          </div>
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-lab-green/20 bg-paper/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-lab-green">
              <ScanSearch aria-hidden="true" size={13} />
              Playground scaffold
            </div>
            <h2 className="text-balance mt-6 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Touch the language before installing the toolchain.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
              Edit representative programs and inspect their structure now. The
              browser compiler seam is ready for Lab’s WebAssembly IDE core next.
            </p>
            <Link
              className="pressable mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper"
              to="/playground"
            >
              Try the scaffold
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
