import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionBody, SectionIntro } from '@/components/section'

const references = [
  { to: '/docs/compiler/pipeline', label: 'The compiler pipeline' },
  {
    to: '/docs/compiler/lair-dialects',
    label: 'LAIR dialects and the protocol boundary',
  },
  {
    to: '/docs/backends/opentrons-ot2',
    label: 'How the OT-2 backend is built',
  },
  {
    to: '/docs/backends/opentrons-flex',
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
          lede="Backends never see source. They consume verified protocol operations across a typed boundary, which means adding an instrument is implementing that boundary rather than reimplementing the language. Everything above it arrives intact: the type checking, the affine material-flow verifier, the acceptance coverage. Two benches consume that boundary today. The OT-2 emits Python and the Flex emits JSON protocols, from one program and one plan, each checked against Opentrons' own analyzer. Hamilton STAR is next, and it is the one that leaves the Opentrons family."
          title="A new machine is a compiler target."
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
