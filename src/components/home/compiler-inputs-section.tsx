import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionBody, SectionIntro } from '@/components/section'
import { useInView } from '@/lib/use-in-view'

interface CompilerInput {
  name: string
  file: string
  note: string
  body: string
}

/** Python leads: it is where most work starts, and Lab is underneath it. */
const inputs: CompilerInput[] = [
  {
    name: 'Python',
    file: 'reporter.py',
    note: 'Start here',
    body: 'The language your lab already writes, with typed SBOL designs that keep build and buy explicit, validate through pySBOL3 during compilation, and compose with LOICA circuit networks. Workflows and claims are Python, and everything enters the same checker, so an existing codebase reaches the pipeline without a rewrite.',
  },
  {
    name: 'Lab',
    file: 'reporter.lab',
    note: 'The native language',
    body: 'Designs, the constraints they must satisfy, the evidence that would accept them, and reactive workflows, written directly in the language the checker is built around and checked as you type.',
  },
]

/** Where the two frontends converge, and what is shared below them. */
export function CompilerInputsSection() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="border-t border-ink/12" id="compiler">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <div className="reveal" data-shown={inView} ref={ref}>
          <SectionIntro
            className="max-w-3xl"
            kicker="The compiler"
            lede="Python and Lab describe the same scientific model. Both reach the same checker and intermediate representation, so protocol checking, document generation, and optional automation share one foundation. Choose the language that fits your work."
            title="Two languages. One shared model."
          />
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-2">
          {inputs.map((input) => (
            <div
              className="lift rounded-2xl border border-ink/15 bg-shell/70 p-6"
              key={input.name}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="type-head text-lg">{input.name}</h3>
                <span className="micro text-ink/55">{input.note}</span>
              </div>
              <p className="prose-lab mt-4 text-[14px] leading-[1.65] text-umber">
                {input.body}
              </p>
              <p className="mt-5 font-mono text-[12px] text-umber-soft">
                {input.file}
              </p>
            </div>
          ))}
        </div>

        {/* SBOL is deliberately not a third card: it is the interchange, not a way in. */}
        <div className="mt-4 rounded-2xl border border-ink/15 bg-sand/40 p-6">
          <span className="micro text-ink/55">SBOL 3</span>
          <p className="prose-lab mt-3 max-w-[62em] text-[14px] leading-[1.65] text-umber">
            Not a third way in, but the design interchange both frontends speak.
            Lab grounds parts and roles in the ontologies SBOL names, the Python
            flavor provides typed builders over pySBOL3 and reads LOICA, and a
            design can arrive from a registry and leave for one.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-vessel p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[52em]">
              <span className="micro text-gfp">LAIR</span>
              <p className="prose-lab mt-3 text-[15px] leading-[1.72] text-[#f6ece0]/70">
                Every input arrives at LAIR, the Lab Automation Intermediate
                Representation. The compiler verifies material flow and
                preserves scientific meaning through its transformations. When
                you request facility planning, it refines Methods and selects
                compatible resources. The resulting build can include typeset
                operator documents and files for supported instruments.
              </p>
            </div>
            <Link
              className="press inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#f6ece0]/20 px-5 py-2.5 text-[14px] text-[#f6ece0] hover:border-[#f6ece0]/40"
              to="/docs/compiler/architecture"
            >
              See the pipeline
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
