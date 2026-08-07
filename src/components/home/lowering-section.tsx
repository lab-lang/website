import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LoweringRail } from '@/components/lowering-rail'
import { SectionBody, SectionIntro } from '@/components/section'
import { useInView } from '@/lib/use-in-view'

/** Transilluminator surface: the same program, five ways. */
export function LoweringSection() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="emission-wash bg-vessel" id="lowering">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <div className="reveal" data-shown={inView} ref={ref}>
          <SectionIntro
            className="max-w-3xl"
            kicker="One program, many labs"
            lede="Lab separates what the scientist means from where the work runs. Each artifact below is produced by the toolchain as it stands today, from the program at the top of this page."
            title="Follow one program all the way down."
            tone="dark"
          />
        </div>

        <div className="mt-14">
          <LoweringRail />
        </div>

        {/* The one action point in the long middle of the page, at the moment
         * the toolchain has just shown its work. */}
        <div className="mt-16">
          <div className="tick-rule [--tick-color:rgb(246_236_224_/_0.22)]" />
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="prose-lab text-[15px] text-[#f6ece0]/60">
              Every artifact above is documented.
            </p>
            <Link
              className="press inline-flex w-fit items-center gap-2 rounded-xl border border-[#f6ece0]/20 px-5 py-2.5 text-[14px] text-[#f6ece0] hover:border-[#f6ece0]/40"
              to="/docs"
            >
              Read the docs
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
