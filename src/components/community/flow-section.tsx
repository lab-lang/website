import { SectionBody, SectionIntro } from '@/components/section'
import { flow } from '@/data/community'

export function FlowSection() {
  return (
    <section className="emission-wash bg-vessel" id="flow">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          className="max-w-2xl"
          kicker="How a change lands"
          lede="Nothing here happens behind closed doors. Every stage below is visible in the repository, in order, with nothing skipped."
          ledeClassName="mt-6 text-[15px] leading-[1.72]"
          title="From a question to an accepted decision."
          tone="dark"
        />

        <div className="mt-10 grid gap-x-8 gap-y-10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {flow.map((stage, index) => (
            <div key={stage.title}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-[12px] text-gfp/60">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="type-head text-lg text-[#f6ece0]">
                  {stage.title}
                </h3>
              </div>
              <p className="prose-lab mt-3 border-t border-white/10 pt-3 text-[13.5px] leading-[1.6] text-[#f6ece0]/55">
                {stage.detail}
              </p>
            </div>
          ))}
        </div>
      </SectionBody>
    </section>
  )
}
