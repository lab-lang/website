import { ArrowRight, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { SourceCode, type SourceLanguage } from '../components/source-code'
import { Link } from 'react-router-dom'
import { REPO_URL, pageTitle } from '../lib/site'
import { usePageMeta } from '../lib/use-page-meta'
import { implementations } from '../data/comparison'
import { labSource } from '../data/generated-ot2'

/** What a reader gets from the artifact itself, before wrapping anything around it. */
const CRITERIA = [
  { key: 'result', label: 'States the result' },
  { key: 'deck', label: 'No deck geometry' },
  { key: 'material', label: 'Tracks material' },
  { key: 'checked', label: 'Checked before it runs' },
  { key: 'machines', label: 'More than one machine' },
] as const

type Level = 0 | 1 | 2

interface Row {
  name: string
  href: string
  marks: Record<(typeof CRITERIA)[number]['key'], Level>
}

/*
 * Graded on what the artifact carries, not on project health, and not on what
 * a layer built over it could add. Lab's empty mark in the last column is the
 * point of grading honestly: there is one backend today.
 */
const ROWS: Row[] = [
  {
    name: 'Opentrons Python API',
    href: 'https://docs.opentrons.com/',
    marks: { result: 0, deck: 0, material: 0, checked: 1, machines: 0 },
  },
  {
    name: 'PyLabRobot',
    href: 'https://github.com/PyLabRobot/pylabrobot',
    marks: { result: 0, deck: 0, material: 0, checked: 1, machines: 2 },
  },
  {
    name: 'BuildCompiler',
    href: 'https://buildcompiler.readthedocs.io/en/latest/',
    marks: { result: 1, deck: 2, material: 1, checked: 2, machines: 1 },
  },
  {
    name: 'Autoprotocol',
    href: 'https://github.com/autoprotocol/autoprotocol-python',
    marks: { result: 0, deck: 2, material: 0, checked: 1, machines: 2 },
  },
  {
    name: 'LabOP',
    href: 'https://github.com/Bioprotocols/labop',
    marks: { result: 0, deck: 2, material: 0, checked: 1, machines: 2 },
  },
  {
    name: 'Lab',
    href: '/docs/overview',
    marks: { result: 2, deck: 2, material: 2, checked: 2, machines: 0 },
  },
]

const LEVEL_LABEL: Record<Level, string> = {
  0: 'no',
  1: 'partly',
  2: 'yes',
}

/** Three fragments of real syntax, each stating something a protocol script has nowhere to put. */
const expressible = [
  {
    title: 'What would make this acceptable',
    code: 'accept concentration >= 100 ng/uL',
    detail:
      'The threshold sits in the program, beside the design it judges. A build that misses it comes back Rejected, carrying the measurement that rejected it.',
  },
  {
    title: 'Which tube this actually is',
    code: 'plate <- plate culture on kanamycin',
    detail:
      'The arrow marks a step that changes the world. The culture it consumes cannot be used again, and a replay of the workflow never performs it twice.',
  },
  {
    title: 'When the biology is ready',
    code: 'when every 30 min:',
    detail:
      'Colonies appear somewhere between overnight and never. The workflow wakes on a timer, watches the plate, and settles into an outcome instead of counting steps.',
  },
]

const gaps = [
  'The durable workflow runtime does not exist yet, so nothing replays today.',
  'One backend, and generated protocols are a compiler spike a laboratory must verify before running.',
  'The language and its intermediate representations are still changing.',
  'Packages resolve by path only. There is no registry, and no lockfiles.',
]

/*
 * Three silhouettes rather than three fills: solid, half, and outline. A dot
 * inside a ring reads the same at every level from arm's length, which is the
 * distance a matrix is actually scanned from.
 */
function Mark({ level }: { level: Level }) {
  return (
    <>
      <svg
        aria-hidden="true"
        className="text-amber-deep"
        height="18"
        viewBox="0 0 18 18"
        width="18"
      >
        {level === 2 ? (
          <circle cx="9" cy="9" fill="currentColor" r="7" />
        ) : (
          <>
            <circle
              cx="9"
              cy="9"
              fill="none"
              r="6.25"
              stroke="currentColor"
              strokeOpacity={level === 0 ? '0.3' : '0.85'}
              strokeWidth="1.5"
            />
            {level === 1 && (
              <path d="M9 2.75 A6.25 6.25 0 0 1 9 15.25 Z" fill="currentColor" />
            )}
          </>
        )}
      </svg>
      <span className="sr-only">{LEVEL_LABEL[level]}</span>
    </>
  )
}

function Panel({
  role,
  tone = 'written',
  filename,
  language,
  body,
}: {
  role?: string
  tone?: 'written' | 'generated'
  filename: string
  language: SourceLanguage
  body: string
}) {
  const lines = body.split('\n').length
  const roleClass = tone === 'generated' ? 'text-gfp' : 'text-amber'

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/20 bg-vessel">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <span className="micro truncate text-[#f6ece0]/45">{filename}</span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="micro text-[#f6ece0]/30">{lines} lines</span>
          {role && <span className={`micro ${roleClass}`}>{role}</span>}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <SourceCode language={language} source={body} />
      </div>
    </div>
  )
}

export function WhyPage() {
  const [implementationId, setImplementationId] = useState(
    implementations[0].id,
  )
  const implementation =
    implementations.find((entry) => entry.id === implementationId) ??
    implementations[0]

  usePageMeta({
    title: pageTitle('Why Lab'),
    description:
      'A protocol written for a robot is mostly deck geometry. Lab lets you describe the construct, the constraints, and the evidence, and generates the machine-specific part for whatever instrument you end up on.',
    path: '/why',
  })

  return (
    <>
      <section className="agar-wash relative overflow-hidden" id="intro">
        <div className="mx-auto max-w-[1480px] px-5 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-10 lg:px-10 lg:pb-28">
          <p className="micro text-umber">Why Lab</p>

          <h1 className="type-display mt-6 text-[clamp(2rem,5.65vw,5.25rem)]">
            <span className="block text-pretty">Say what you want to make.</span>
            <span className="mt-[0.06em] block text-pretty text-[0.85em] font-light text-amber-deep">
              Not which slot the tips are in.
            </span>
          </h1>

          <p className="type-deck mt-9 max-w-[33em] text-pretty text-[clamp(1.05rem,1.6vw,1.5rem)] text-ink/78">
            A protocol written for a robot is mostly deck geometry: labware
            names, pipette mounts, well addresses, volumes in microlitres. None
            of that is your experiment. In Lab you describe the construct, what
            must be true of it, and the evidence that would accept it. The
            machine-specific part is generated, for whichever instrument you
            end up in front of.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="press inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)]"
              to="/docs/guide/first-program"
            >
              Walk through a real build
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link
              className="press inline-flex items-center gap-2 rounded-xl border border-ink/20 px-5 py-3 text-[14px] text-ink hover:border-ink/40"
              to="/playground"
            >
              Open the playground
            </Link>
          </div>
        </div>
      </section>

      {/* The argument, made by showing both files rather than describing them. */}
      <section className="border-y border-ink/12 bg-sand/40" id="written">
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <span className="micro text-amber-deep">The same build</span>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)]">
              Lab versus alternatives.
            </h2>
            <p className="prose-lab mt-6 text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
              On the left is a whole Lab module: the parts, the backbone, the
              enzyme, what must be true of the construct, and the workflow that
              realizes it. On the right is the same build as each of these
              systems asks you to express it. Length is not the interesting
              part. What each file can and cannot say is.
            </p>
          </div>

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
              <div className="mb-3 flex h-9 shrink-0 items-center">
                <span className="micro text-ink/40">What you write</span>
              </div>
              <Panel
                body={labSource}
                filename="build.lab"
                language="lab"
                role="written"
                tone="written"
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
                  <Panel
                    body={implementation.body}
                    filename={implementation.filename}
                    language={implementation.language}
                    role={implementation.generated ? 'generated' : undefined}
                    tone="generated"
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
            Only the Opentrons file is generated:{' '}
            <code className="font-mono text-[0.95em]">
              labc build.lab --emit opentrons-assembly
            </code>{' '}
            produces it byte for byte from the module on the left. The rest are
            written by hand, from each project&rsquo;s own documented usage, and
            scoped to the work that module covers.{' '}
            <Link className="rule-link text-ink" to="/docs/compiler/pipeline">
              Every stage in between has a name you can ask for
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="expressible">
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <span className="micro text-amber-deep">What fits in a program</span>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)]">
              What no alternative can express.
            </h2>
            <p className="prose-lab mt-6 text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
              Every tool above can say what the machine does. None of them has
              anywhere to put these three, which say what the science requires
              and let the compiler hold you to it.
            </p>
          </div>

          {/*
            * One row each, code in its own column: a fragment cramped into a
            * card wraps or clips, and a clipped line of source undercuts the
            * point the line is making.
            */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-ink/15">
            {expressible.map((item, index) => (
              <div
                className={`grid gap-5 bg-shell/70 p-6 sm:p-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center lg:gap-10 ${
                  index > 0 ? 'border-t border-ink/12' : ''
                }`}
                key={item.title}
              >
                <div>
                  <h3 className="type-head text-lg">{item.title}</h3>
                  <p className="prose-lab mt-3 text-[14.5px] leading-[1.65] text-umber">
                    {item.detail}
                  </p>
                </div>
                <div className="min-w-0 overflow-hidden rounded-xl border border-ink/15 bg-vessel">
                  <SourceCode showLineNumbers={false} source={item.code} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/12 bg-sand/40" id="compare">
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <span className="micro text-amber-deep">Where the tools sit</span>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)]">
              What you get without writing it yourself.
            </h2>
            <p className="prose-lab mt-6 text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
              Every tool here runs experiments in real laboratories today, which
              is more than Lab can claim. The question this answers is narrower:
              what does the artifact you write already carry, before you build
              anything around it.
            </p>
          </div>

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
                {ROWS.map((row) => {
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
            Graded on the artifact itself, not on what a layer built over it
            could add. Lab&rsquo;s empty mark in the last column is not modesty:
            there is one backend today.
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
            in 2018, composed typed elements into biological workflows and is
            the closest prior attempt; its public repository no longer resolves,
            and Synthace&rsquo;s product today is a visual platform rather than
            a language.
          </p>
        </div>
      </section>

      <section className="emission-wash bg-vessel" id="instruments">
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <span className="micro text-gfp">
              For whoever wires the instruments
            </span>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)] text-[#f6ece0]">
              A new machine is a compiler target.
            </h2>
            <p className="prose-lab mt-6 text-[16px] leading-[1.7] text-[#f6ece0]/60 sm:text-[17px]">
              Backends never see source. They consume verified protocol
              operations across a typed boundary, which means adding an
              instrument is implementing that boundary rather than reimplementing
              the language. Everything above it arrives intact: the type
              checking, the affine material-flow verifier, the acceptance
              coverage. The OT-2 backend is the one that exists, and what it
              emits is checked against the official Opentrons simulator.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 sm:mt-12">
            <Link
              className="rule-link inline-flex items-center gap-1.5 text-[14px] text-[#f6ece0]"
              to="/docs/compiler/pipeline"
            >
              The compiler pipeline
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
            <Link
              className="rule-link inline-flex items-center gap-1.5 text-[14px] text-[#f6ece0]"
              to="/docs/compiler/lair-dialects"
            >
              LAIR dialects and the protocol boundary
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
            <Link
              className="rule-link inline-flex items-center gap-1.5 text-[14px] text-[#f6ece0]"
              to="/docs/backends/opentrons-ot2"
            >
              How the OT-2 backend is built
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/12 bg-sand/40" id="honest">
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <span className="micro text-amber-deep">The other side</span>
              <h2 className="type-title mt-5 text-balance text-[clamp(1.9rem,3.6vw,2.9rem)]">
                Reasons not to use Lab yet.
              </h2>
              <p className="prose-lab mt-6 text-[15px] leading-[1.72] text-ink/78">
                If you need to move liquid this week, use one of the tools
                above. Lab is a v0.1.0 prototype: it checks more and runs less.
                It is worth your time if the checking is the part you have been
                missing.
              </p>
              <Link
                className="press mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)]"
                to="/docs/status"
              >
                See the full support matrix
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-umber-soft" />
                <span className="micro text-ink/55">Known gaps</span>
              </div>
              <ul className="mt-5 space-y-3">
                {gaps.map((gap) => (
                  <li
                    className="prose-lab border-t border-ink/10 pt-3 text-[14px] leading-[1.6] text-umber"
                    key={gap}
                  >
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <div className="tick-rule" />
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="prose-lab text-[15px] text-umber">
                Disagree with any of this? The comparison is a file in the
                repository.
              </p>
              <a
                className="press inline-flex w-fit items-center gap-2 rounded-xl border border-ink/20 px-5 py-2.5 text-[14px] text-ink hover:border-ink/40"
                href={`${REPO_URL}/issues`}
                rel="noreferrer"
                target="_blank"
              >
                Tell us where it is wrong
                <ArrowRight aria-hidden="true" size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
