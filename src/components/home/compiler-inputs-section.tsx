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
    body: 'The language your lab already writes, over the tools it already uses: designs are pySBOL3 components and circuits are LOICA networks. Workflows and claims are Python, and everything enters the same checker, so an existing codebase reaches the pipeline without a rewrite.',
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
            lede="Python and Lab are two ways of writing the same thing. The compiler checks both into one form, and everything after that point is shared: the same checks, the same intermediate representation, the same generated protocols and robot programs. Which one you wrote in stops mattering as soon as it compiles."
            title="Two ways in. One way down."
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
            flavor builds on the tools already written against it, pySBOL3 and
            LOICA, and a design can arrive from a registry and leave for one.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-vessel p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[52em]">
              <span className="micro text-gfp">LAIR</span>
              <p className="prose-lab mt-3 text-[15px] leading-[1.72] text-[#f6ece0]/70">
                Every input arrives at LAIR, the Lab Automation Intermediate
                Representation. From there one pipeline verifies material flow,
                selects a target, and emits what the laboratory needs: a program
                for a robot, a typeset protocol for a person, or both from the
                same compilation.
              </p>
            </div>
            <Link
              className="press inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#f6ece0]/20 px-5 py-2.5 text-[14px] text-[#f6ece0] hover:border-[#f6ece0]/40"
              to="/docs/compiler/pipeline"
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
