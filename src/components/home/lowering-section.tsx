import { LoweringRail } from '@/components/lowering-rail'
import { SectionBody, SectionIntro } from '@/components/section'

/** Transilluminator surface: the same program, five ways. */
export function LoweringSection() {
  return (
    <section className="emission-wash bg-vessel" id="lowering">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          className="max-w-3xl"
          kicker="One program, many labs"
          lede="Lab separates what the scientist means from where the work runs. Each artifact below is produced by the toolchain as it stands today, from the program at the top of this page."
          title="Follow one program all the way down."
          tone="dark"
        />

        <div className="mt-14">
          <LoweringRail />
        </div>
      </SectionBody>
    </section>
  )
}
