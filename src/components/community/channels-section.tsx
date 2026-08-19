import { ExternalLink } from 'lucide-react'

import { SectionBody, SectionIntro } from '@/components/section'
import { channels } from '@/data/community'

export function ChannelsSection() {
  return (
    <section className="border-y border-ink/12 bg-sand/40" id="channels">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          className="max-w-2xl"
          kicker="Where the conversation happens"
          lede="Report a bug, ask a question, or read why a decision was made. At this size, one good issue can change how the compiler works."
          title="Join the conversation."
        />

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/12 sm:mt-14 sm:grid-cols-3">
          {channels.map((channel) => (
            <div className="lift bg-shell/70 p-6 sm:p-7" key={channel.title}>
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber/12 text-amber-deep">
                <channel.icon aria-hidden="true" size={16} strokeWidth={2} />
              </span>
              <h3 className="type-head mt-6 text-lg">{channel.title}</h3>
              <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
                {channel.detail}
              </p>
              <a
                className="rule-link mt-4 inline-flex w-fit items-center gap-1.5 text-[13.5px] text-ink"
                href={channel.href}
                rel="noreferrer"
                target="_blank"
              >
                {channel.cta}
                <ExternalLink aria-hidden="true" size={12} />
              </a>
            </div>
          ))}
        </div>
      </SectionBody>
    </section>
  )
}
