import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionBody, SectionIntro } from '@/components/section'
import { Mark } from '@/components/why/mark'
import {
  CAPABILITY_ROWS,
  CRITERIA,
  LEVEL_LABEL,
  type Level,
} from '@/data/capability-matrix'

export function CapabilitySection() {
  return (
    <section className="border-t border-ink/12 bg-sand/40" id="compare">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          className="max-w-3xl"
          kicker="Where the tools sit"
          lede="Every tool here runs experiments in real laboratories today, which is more than Lab can claim. The question this answers is narrower: what does the artifact you write already carry, before you build anything around it."
          title="What you get without writing it yourself."
        />

        <div className="mt-10 overflow-x-auto rounded-2xl border border-ink/15 sm:mt-14">
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead className="bg-sand/60">
              <tr>
                <th className="micro w-[184px] px-5 py-4 text-ink/50">Tool</th>
                {CRITERIA.map((criterion) => (
                  <th
                    className="micro w-[128px] px-4 py-4 text-center align-bottom leading-[1.5] text-ink/50"
                    key={criterion.key}
                    scope="col"
                  >
                    {criterion.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {CAPABILITY_ROWS.map((row) => {
                const isLab = row.name === 'Lab'
                const external = row.href.startsWith('http')

                return (
                  <tr
                    className={isLab ? 'bg-amber/8' : 'bg-shell/60'}
                    key={row.name}
                  >
                    <th
                      className="type-head px-5 py-4 text-[14.5px] font-normal text-ink"
                      scope="row"
                    >
                      {external ? (
                        <a
                          className="rule-link text-ink"
                          href={row.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {row.name}
                          <ExternalLink
                            aria-hidden="true"
                            className="ml-1.5 inline-block align-[-1px]"
                            size={11}
                          />
                        </a>
                      ) : (
                        <Link className="rule-link text-ink" to={row.href}>
                          {row.name}
                        </Link>
                      )}
                    </th>
                    {CRITERIA.map((criterion) => (
                      <td className="px-4 py-4 text-center" key={criterion.key}>
                        <span className="inline-flex items-center justify-center">
                          <Mark level={row.marks[criterion.key]} />
                        </span>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          {([2, 1, 0] as Level[]).map((level) => (
            <span
              className="flex items-center gap-2 text-[13px] text-umber"
              key={level}
            >
              <Mark level={level} />
              {LEVEL_LABEL[level]}
            </span>
          ))}
        </div>

        <p className="prose-lab mt-5 max-w-2xl text-[13.5px] leading-[1.7] text-umber-soft">
          Graded on the artifact itself, not on what a layer built over it could
          add. Lab&rsquo;s empty mark in the last column is not modesty: there
          is one backend today.
        </p>

        <p className="prose-lab mt-8 max-w-3xl text-[14px] leading-[1.7] text-umber">
          Lab is not the first language aimed at this. Antha, announced by{' '}
          <a
            className="rule-link text-ink"
            href="https://www.synthace.com/"
            rel="noreferrer"
            target="_blank"
          >
            Synthace
          </a>{' '}
          in 2018, composed typed elements into biological workflows and is the
          closest prior attempt; its public repository no longer resolves, and
          Synthace&rsquo;s product today is a visual platform rather than a
          language.
        </p>
      </SectionBody>
    </section>
  )
}
