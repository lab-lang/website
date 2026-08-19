import { Copy, Eye, LogOut } from 'lucide-react'

import { CodeLanguageToggle } from '@/components/code-language-toggle'
import { SectionBody, SectionIntro } from '@/components/section'
import { SourceCode } from '@/components/source-code'
import { diagnostics } from '@/data/artifacts'
import { useCodeLanguage } from '@/lib/code-language'
import { useInView } from '@/lib/use-in-view'

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

/** Material flow, evidenced with real compiler output. */
export function MaterialFlowSection() {
  const { ref, inView } = useInView<HTMLDivElement>()
  const language = useCodeLanguage()
  const python = language === 'python'

  return (
    <section id="material-flow">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <div className="reveal" data-shown={inView} ref={ref}>
          <SectionIntro
            className="max-w-3xl"
            kicker="Material flow"
            lede="Physical materials are affine: they cannot be implicitly copied, and they must end up returned, stored, transferred, or disposed. Every action declares how it treats what you hand it."
            title="The compiler knows you only have one tube and one tip."
          />
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/12 sm:grid-cols-3">
          {ownership.map((mode) => (
            <div className="bg-shell/70 p-5 sm:p-7" key={mode.mode}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber/12 text-amber-deep">
                  <mode.icon aria-hidden="true" size={16} strokeWidth={2} />
                </span>
                <code className="font-mono text-[15px] text-ink">
                  {mode.mode}
                </code>
                {/* Rides the icon row on a phone; its own line above the
                 * detail where the cards sit three abreast. */}
                <h3 className="type-head ml-auto text-lg sm:ml-0 sm:mt-3 sm:basis-full">
                  {mode.subject}
                </h3>
              </div>
              <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
                {mode.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="type-head text-xl">What that catches</h3>
            <p className="prose-lab mt-3 max-w-2xl text-[15px] leading-[1.7] text-umber">
              These are real diagnostics, produced by running the checker on
              programs written to break it. The message is the checker's, so it
              is the same sentence either way in; only the line it is reported
              against changes.
            </p>
          </div>
          <div className="shrink-0">
            <CodeLanguageToggle tone="light" />
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {diagnostics.map((diagnostic) => (
            <div
              className="overflow-hidden rounded-2xl border border-ink/18"
              key={diagnostic.id}
            >
              <div className="border-b border-ink/12 bg-sand/50 px-5 py-3">
                <span className="micro text-ink/65">{diagnostic.title}</span>
              </div>
              <SourceCode
                className="bg-vessel"
                language={language}
                showLineNumbers={false}
                source={python ? diagnostic.pythonSource : diagnostic.source}
              />
              {/*
               * The diagnostic is prose and wraps — it is the evidence this
               * section stakes its claim on, and a message that has to be
               * panned sideways to finish reading is not evidence. The
               * hanging indent keeps continuation lines subordinate.
               */}
              <pre className="-indent-4 whitespace-pre-wrap break-words border-t border-white/8 bg-vessel pb-5 pl-9 pr-5 pt-1 font-mono text-[13px] leading-[1.7] text-mcherry">
                <code>{diagnostic.error}</code>
              </pre>
              <p className="prose-lab bg-shell/70 px-5 py-4 text-[14px] leading-[1.6] text-umber">
                {diagnostic.explanation}
              </p>
            </div>
          ))}
        </div>
      </SectionBody>
    </section>
  )
}
