import {
  Check,
  ChevronDown,
  Clipboard,
  FlaskConical,
  Info,
  Play,
  RotateCcw,
  TerminalSquare,
} from 'lucide-react'
import { useState } from 'react'
import { examples } from '../data/examples'
import { inspectSource, type SourceInspection } from '../lib/inspect-source'

const metrics: Array<[keyof SourceInspection, string]> = [
  ['lines', 'Lines'],
  ['declarations', 'Declarations'],
  ['durableEffects', 'Durable effects'],
  ['acceptanceChecks', 'Acceptance checks'],
]

export function PlaygroundPage() {
  const [activeExample, setActiveExample] = useState<string>(examples[0].id)
  const [source, setSource] = useState<string>(examples[0].source)
  const [inspection, setInspection] = useState<SourceInspection | null>(null)
  const [copied, setCopied] = useState(false)

  const selectedExample =
    examples.find((example) => example.id === activeExample) ?? examples[0]

  function chooseExample(id: string) {
    const next = examples.find((example) => example.id === id)
    if (!next) return
    setActiveExample(next.id)
    setSource(next.source)
    setInspection(null)
  }

  function resetSource() {
    setSource(selectedExample.source)
    setInspection(null)
  }

  async function copySource() {
    try {
      await navigator.clipboard.writeText(source)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#e9e5da] px-3 py-3 sm:px-5 sm:py-5 lg:px-7">
      <section className="mx-auto flex min-h-[calc(100dvh-7rem)] max-w-[1500px] flex-col overflow-hidden rounded-2xl border border-ink/20 bg-paper shadow-[0_18px_60px_rgb(22_39_31_/_0.12)]">
        <header className="flex flex-col gap-4 border-b border-ink/10 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-ink text-lab-lime">
              <FlaskConical aria-hidden="true" size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold tracking-[-0.02em]">Lab playground</h1>
                <span className="rounded-full bg-lab-green-light px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-lab-green">
                  scaffold
                </span>
              </div>
              <p className="text-xs text-ink-muted">
                Edit representative Lab source in the browser.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                aria-label="Example program"
                className="h-9 appearance-none rounded-lg border border-ink/15 bg-white/40 pl-3 pr-8 text-xs font-medium text-ink"
                onChange={(event) => chooseExample(event.target.value)}
                value={activeExample}
              >
                {examples.map((example) => (
                  <option key={example.id} value={example.id}>
                    {example.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-2.5 text-ink/45"
                size={14}
              />
            </div>
            <button
              aria-label="Reset source"
              className="pressable grid size-9 place-items-center rounded-lg border border-ink/15 bg-white/35 text-ink-muted hover:text-ink"
              onClick={resetSource}
              title="Reset source"
              type="button"
            >
              <RotateCcw aria-hidden="true" size={15} />
            </button>
            <button
              className="pressable inline-flex h-9 items-center gap-2 rounded-lg border border-ink/15 bg-white/35 px-3 text-xs font-semibold text-ink-muted hover:text-ink"
              onClick={copySource}
              type="button"
            >
              {copied ? (
                <Check aria-hidden="true" size={14} />
              ) : (
                <Clipboard aria-hidden="true" size={14} />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              className="pressable inline-flex h-9 items-center gap-2 rounded-lg bg-ink px-3.5 text-xs font-semibold text-paper"
              onClick={() => setInspection(inspectSource(source))}
              type="button"
            >
              <Play aria-hidden="true" fill="currentColor" size={12} />
              Inspect source
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <div className="flex min-h-[560px] min-w-0 flex-col border-b border-ink/10 bg-terminal lg:border-b-0 lg:border-r">
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 px-4 font-mono text-[10px] uppercase tracking-[0.09em] text-white/45">
              <span>main.lab</span>
              <span>{source.split('\n').length} lines</span>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-[42px_1fr] overflow-hidden">
              <div
                aria-hidden="true"
                className="select-none overflow-hidden border-r border-white/7 bg-black/10 px-2 py-5 text-right font-mono text-[13px] leading-6 text-[#53675b]"
              >
                {source.split('\n').map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>
              <textarea
                aria-label="Lab source editor"
                className="min-h-full w-full resize-none overflow-auto bg-transparent px-4 py-5 font-mono text-[13px] leading-6 text-[#f1efe7] caret-lab-lime outline-none sm:px-5 sm:text-sm"
                onChange={(event) => {
                  setSource(event.target.value)
                  setInspection(null)
                }}
                spellCheck={false}
                value={source}
              />
            </div>
          </div>

          <aside className="flex min-h-[560px] flex-col bg-paper">
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-ink/10 px-4 font-mono text-[10px] uppercase tracking-[0.09em] text-ink/45">
              <TerminalSquare aria-hidden="true" size={13} />
              Inspection
            </div>

            <div className="flex-1 p-5 sm:p-6">
              {inspection ? (
                <div aria-live="polite">
                  <div className="flex items-center gap-2 text-sm font-semibold text-lab-green">
                    <Check aria-hidden="true" size={16} strokeWidth={2.5} />
                    Source structure inspected
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {metrics.map(([key, label]) => (
                      <div
                        className="rounded-xl border border-ink/10 bg-white/35 p-4"
                        key={key}
                      >
                        <div className="font-mono text-2xl font-medium text-ink">
                          {inspection[key]}
                        </div>
                        <div className="mt-1 text-xs text-ink-muted">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-ink/20 bg-white/20 p-6 text-center">
                  <div>
                    <TerminalSquare
                      aria-hidden="true"
                      className="mx-auto text-ink/30"
                      size={28}
                      strokeWidth={1.5}
                    />
                    <p className="mt-4 text-sm font-medium">No inspection yet</p>
                    <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-ink-muted">
                      Choose an example, edit the source, then inspect its visible
                      language structure.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl border border-lab-green/15 bg-lab-green-light/55 p-4">
                <div className="flex items-start gap-3">
                  <Info
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-lab-green"
                    size={16}
                  />
                  <div>
                    <p className="text-xs font-semibold text-ink">
                      Compiler integration boundary
                    </p>
                    <p className="mt-1.5 text-xs leading-5 text-ink-muted">
                      This scaffold counts source constructs only; it does not
                      validate syntax or semantics. The next step is loading
                      <code className="mx-1 font-mono text-[11px] text-ink">
                        lab-ide-wasm
                      </code>
                      and surfacing real diagnostics, symbols, hover, and semantic
                      tokens here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-ink/10 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between text-[11px] text-ink/45">
                <span className="font-mono">lab-ide-wasm</span>
                <span>not connected</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
