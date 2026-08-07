import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionBody } from '@/components/section'

export function HeroSection() {
  return (
    <section className="agar-wash relative overflow-hidden" id="intro">
      <SectionBody className="pb-14 pt-6 sm:pb-20 sm:pt-10 lg:pb-28">
        <p className="micro text-umber">Why Lab</p>

        <h1 className="type-display mt-6 text-[clamp(2rem,5.65vw,5.25rem)]">
          <span className="block text-pretty">Say what you want to make.</span>
          <span className="mt-[0.06em] block text-pretty text-[0.85em] font-light text-amber-deep">
            Not which slot the tips are in.
          </span>
        </h1>

        <p className="type-deck mt-9 max-w-[33em] text-pretty text-[clamp(1.05rem,1.6vw,1.5rem)] text-ink/78">
          A protocol written for a robot is mostly deck geometry: labware names,
          pipette mounts, well addresses, volumes in microlitres. None of that
          is your experiment. In Lab you describe the construct, what must be
          true of it, and the evidence that would accept it. The
          machine-specific part is generated, for whichever instrument you end
          up in front of.
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
      </SectionBody>
    </section>
  )
}
