import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { CodeLanguageToggle } from '@/components/code-language-toggle'
import { SectionBody, SectionIntro } from '@/components/section'
import { SourcePanel } from '@/components/why/source-panel'
import { implementations, labSource, labSourcePython } from '@/data/comparison'
import { useCodeLanguage } from '@/lib/code-language'

/** The argument, made by showing both files rather than describing them. */
export function ComparisonSection() {
  const language = useCodeLanguage()
  const python = language === 'python'
  const [implementationId, setImplementationId] = useState(
    implementations[0].id,
  )
  const implementation =
    implementations.find((entry) => entry.id === implementationId) ??
    implementations[0]

  return (
    <section className="border-y border-ink/12 bg-sand/40" id="written">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          className="max-w-3xl"
          kicker="The same build"
          lede="On the left is one whole module for the Lab compiler: the parts, the backbone, the enzyme, what must be true of the construct, and the workflow that realizes it. On the right is the same build as each of these systems asks you to express it. Length is not the interesting part. What each file can and cannot say is."
          title="Lab versus alternatives."
        />

        {/*
         * The Lab module sets the height of the row: it is short enough to
         * read whole, and a program you have to scroll to see undercuts the
         * point of showing it. The implementation beside it is absolutely
         * positioned so its own length never feeds back into that height,
         * and scrolls within whatever the module leaves.
         *
         * min-w-0 on both cells: a grid track sizes to its content by
         * default, and the generated Python has lines long enough to push
         * the whole section past the edge of a phone.
         */}
        <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col">
            {/* shrink-0, or the row's height comes out of this label instead
                of the panel, and the two panels start three pixels apart. */}
            <div className="mb-3 flex h-9 shrink-0 items-center justify-between gap-3">
              <span className="micro text-ink/40">What you write</span>
              <CodeLanguageToggle compact tone="light" />
            </div>
            <SourcePanel
              body={python ? labSourcePython : labSource}
              filename={python ? 'build.py' : 'build.lab'}
              language={language}
            />
          </div>

          <div className="flex min-w-0 flex-col">
            <div
              aria-label="Implementation"
              className="mb-3 flex h-9 shrink-0 items-center gap-1 overflow-x-auto"
              role="tablist"
            >
              {implementations.map((option) => {
                const isActive = option.id === implementation.id
                return (
                  <button
                    aria-selected={isActive}
                    className={`press shrink-0 rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                      isActive
                        ? 'bg-ink text-paper'
                        : 'text-umber hover:bg-ink/8 hover:text-ink'
                    }`}
                    key={option.id}
                    onClick={() => setImplementationId(option.id)}
                    role="tab"
                    type="button"
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
            {/*
             * Stacked, there is no module beside it to take a height from,
             * so the fixed one applies until the two sit side by side.
             */}
            <div className="relative h-[420px] lg:h-auto lg:min-h-0 lg:flex-1">
              <div className="absolute inset-0">
                <SourcePanel
                  body={implementation.body}
                  filename={implementation.filename}
                  language={implementation.language}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="prose-lab mt-6 max-w-3xl text-[14.5px] leading-[1.7] text-umber">
          {implementation.note}{' '}
          <a
            className="rule-link whitespace-nowrap text-ink"
            href={implementation.href}
            rel="noreferrer"
            target="_blank"
          >
            {implementation.label}
            <ExternalLink
              aria-hidden="true"
              className="ml-1.5 inline-block align-[-1px]"
              size={11}
            />
          </a>
        </p>

        <p className="prose-lab mt-5 max-w-3xl text-[13.5px] leading-[1.7] text-umber-soft">
          Every file here is written by hand, from each project&rsquo;s own
          documented usage, and scoped to the work that module covers. The
          Opentrons protocol is the one you never have to write:{' '}
          <code className="font-mono text-[0.95em]">
            labc build.lab --emit opentrons-assembly
          </code>{' '}
          produces a runnable OT-2 protocol for this same build.{' '}
          <Link className="rule-link text-ink" to="/docs/compiler/pipeline">
            Every stage in between has a name you can ask for
          </Link>
          .
        </p>
      </SectionBody>
    </section>
  )
}
