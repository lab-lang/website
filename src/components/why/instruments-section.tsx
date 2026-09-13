import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionBody, SectionIntro } from '@/components/section'

const references = [
  { to: '/docs/compiler/architecture', label: 'Compiler architecture' },
  {
    to: '/docs/compiler/facility-planning',
    label: 'Facility planning and asset bindings',
  },
  {
    to: '/docs/instruments/opentrons-ot2',
    label: 'How the OT-2 adapter is built',
  },
  {
    to: '/docs/instruments/opentrons-flex',
    label: 'The same operations, emitted for a Flex',
  },
]

export function InstrumentsSection() {
  return (
    <section className="emission-wash bg-vessel" id="instruments">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          className="max-w-3xl"
          kicker="For whoever wires the instruments"
          lede="The facility graph says which Assets exist and which qualified capabilities they offer. The compiler allocates semantic requirements to exact offerings, then invokes only adapters explicitly bound to those Assets. Adding an instrument extends that boundary without reimplementing the language or inventing another target model."
          title="The facility is the target. Adapters implement its Assets."
          tone="dark"
        />

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 sm:mt-12">
          {references.map((reference) => (
            <Link
              className="rule-link inline-flex items-center gap-1.5 text-[14px] text-[#f6ece0]"
              key={reference.to}
              to={reference.to}
            >
              {reference.label}
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
          ))}
        </div>
      </SectionBody>
    </section>
  )
}
