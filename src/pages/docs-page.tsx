import { ArrowRight, ExternalLink, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SourceCode } from '../components/source-code'

const firstProgram = `plasmid p_sensor:
  sequence: dna("ATGCGTACGTTAGCTA")
  require topology == circular

  accept sequence == design.sequence
  accept concentration >= 100 ng/uL
  accept volume >= 20 uL`

const phases = [
  ['Parse', 'Accepted surface syntax and source-aware diagnostics'],
  ['Check', 'Types, action contracts, and affine material ownership'],
  ['Lower', 'Portable module IR and durable workflow templates'],
  ['Specialize', 'Initial experimental Opentrons OT-2 target'],
]

const docsNavigation = [
  ['Overview', '#overview'],
  ['Your first program', '#first-program'],
  ['Compiler model', '#compiler-model'],
  ['Current support', '#current-support'],
]

export function DocsPage() {
  return (
    <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="hidden border-r border-ink/10 px-8 py-12 lg:block lg:min-h-[calc(100dvh-4rem)]">
        <div className="sticky top-28">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-ink/45">
            Get started
          </p>
          <nav aria-label="Documentation sections" className="mt-4 space-y-1">
            {docsNavigation.map(([label, href], index) => (
              <a
                className={`block rounded-lg px-3 py-2 text-sm ${
                  index === 0
                    ? 'bg-lab-green-light font-medium text-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
                href={href}
                key={href}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-8 border-t border-ink/10 pt-6">
            <a
              className="inline-flex items-center gap-2 text-xs font-medium text-ink-muted hover:text-ink"
              href="https://github.com/lab-lang/lab/tree/master/docs"
              rel="noreferrer"
              target="_blank"
            >
              Full design documents
              <ExternalLink aria-hidden="true" size={13} />
            </a>
          </div>
        </div>
      </aside>

      <article className="min-w-0 px-5 py-12 sm:px-8 lg:px-14 lg:py-16 xl:px-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-2 font-mono text-xs text-ink/45">
            <span>Docs</span>
            <span>/</span>
            <span className="text-ink">Overview</span>
          </div>

          <section className="scroll-mt-28" id="overview">
            <div className="mt-7 flex size-12 items-center justify-center rounded-2xl bg-ink text-lab-lime">
              <FlaskConical aria-hidden="true" size={23} />
            </div>
            <h1 className="text-balance mt-6 text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">
              Language overview
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-muted sm:text-xl">
              Lab is a language for expressing biological intent, physical
              material flow, durable laboratory effects, and the evidence needed
              to accept a result.
            </p>
            <div className="mt-8 rounded-xl border border-signal/20 bg-signal/8 px-5 py-4 text-sm leading-6 text-ink-muted">
              <strong className="font-semibold text-ink">Project status:</strong>{' '}
              Lab is an early prototype. Parsing, checking, portable IR,
              workflow templates, and an experimental OT-2 backend exist; the
              journaled durable runtime does not yet.
            </div>
          </section>

          <section
            className="scroll-mt-28 border-t border-ink/10 pt-14 mt-16"
            id="first-program"
          >
            <p className="font-mono text-xs text-lab-green">01 / SOURCE</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Your first program
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-ink-muted">
              A design says what should exist and which claims must be supported
              by evidence. It does not choose a pipette, facility, or
              manufacturing procedure.
            </p>
            <div className="mt-7 overflow-hidden rounded-2xl border border-ink/20 bg-terminal">
              <div className="border-b border-white/10 px-5 py-3 font-mono text-[11px] text-white/45">
                p_sensor.lab
              </div>
              <SourceCode source={firstProgram} />
            </div>
            <p className="mt-5 text-sm leading-6 text-ink-muted">
              <code className="rounded bg-ink/6 px-1.5 py-0.5 font-mono text-[13px] text-ink">
                require
              </code>{' '}
              is checked before construction.{' '}
              <code className="rounded bg-ink/6 px-1.5 py-0.5 font-mono text-[13px] text-ink">
                accept
              </code>{' '}
              defines runtime obligations that need evidence.
            </p>
          </section>

          <section
            className="scroll-mt-28 border-t border-ink/10 pt-14 mt-16"
            id="compiler-model"
          >
            <p className="font-mono text-xs text-lab-green">02 / COMPILER</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Progressive, inspectable lowering
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-ink-muted">
              The compiler keeps specialization decisions visible as a program
              moves from portable intent toward a concrete execution target.
            </p>
            <div className="mt-8 divide-y divide-ink/10 rounded-2xl border border-ink/15 bg-white/30">
              {phases.map(([phase, detail], index) => (
                <div
                  className="grid gap-2 px-5 py-5 sm:grid-cols-[48px_120px_1fr] sm:items-center sm:px-6"
                  key={phase}
                >
                  <span className="font-mono text-xs text-ink/35">
                    0{index + 1}
                  </span>
                  <span className="font-semibold">{phase}</span>
                  <span className="text-sm leading-6 text-ink-muted">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            className="scroll-mt-28 border-t border-ink/10 pt-14 mt-16"
            id="current-support"
          >
            <p className="font-mono text-xs text-lab-green">03 / SUPPORT</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              What works today
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-ink-muted">
              The compiler currently covers a meaningful vertical slice, but
              support varies by phase. The repository support matrix remains the
              authoritative reference.
            </p>
            <div className="mt-7 overflow-x-auto rounded-2xl border border-ink/15">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead className="bg-paper-deep/70 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/50">
                  <tr>
                    <th className="px-5 py-4 font-medium">Capability</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 bg-white/20">
                  <tr>
                    <td className="px-5 py-4 font-medium">Language frontend</td>
                    <td className="px-5 py-4 text-ink-muted">
                      Parse, resolve, type-check, and portable IR
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-medium">Workflow semantics</td>
                    <td className="px-5 py-4 text-ink-muted">
                      Templates and material-flow checks; runtime pending
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-medium">Target execution</td>
                    <td className="px-5 py-4 text-ink-muted">
                      Experimental generated OT-2 protocols
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-medium">Editor support</td>
                    <td className="px-5 py-4 text-ink-muted">
                      Native LSP plus a WebAssembly host API
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a
              className="pressable mt-7 inline-flex items-center gap-2 rounded-xl border border-ink/20 px-4 py-2.5 text-sm font-semibold"
              href="https://github.com/lab-lang/lab/blob/master/docs/language/support.md"
              rel="noreferrer"
              target="_blank"
            >
              Read the complete support matrix
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          </section>

          <div className="mt-16 flex flex-col gap-5 rounded-2xl bg-ink p-6 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-mono text-xs text-lab-lime">NEXT</p>
              <h2 className="mt-2 text-xl font-semibold">Explore a Lab program</h2>
            </div>
            <Link
              className="pressable inline-flex items-center justify-center gap-2 rounded-xl bg-lab-lime px-4 py-2.5 text-sm font-semibold text-ink"
              to="/playground"
            >
              Open playground
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
