import { SectionBody, SectionIntro } from '@/components/section'
import { steps } from '@/data/community'

export function GetInvolvedSection() {
  return (
    <section id="get-involved">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <SectionIntro
            kicker="Getting involved"
            lede="The project is small enough that reading before writing goes a long way. These are listed in the order they tend to be useful."
            ledeClassName="mt-6 text-[15px] leading-[1.72]"
            title="Where to start."
          />

          <ol className="divide-y divide-ink/10">
            {steps.map((step, index) => (
              <li className="py-5 first:pt-0 last:pb-0" key={step.title}>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[12px] text-amber-deep/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="type-head text-[15px]">{step.title}</h3>
                </div>
                <p className="prose-lab mt-1.5 text-[14px] leading-[1.65] text-umber">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </SectionBody>
    </section>
  )
}
