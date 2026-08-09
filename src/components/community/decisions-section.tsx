import { ExternalLink } from 'lucide-react'

import { SectionBody, SectionIntro } from '@/components/section'
import { decisions } from '@/data/community'
import { REPO_URL } from '@/lib/site'

export function DecisionsSection() {
  return (
    <section className="emission-wash bg-vessel" id="decisions">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <SectionIntro
          kicker="Design decisions"
          title="Every tradeoff is a numbered document."
          titleClassName="max-w-[18ch] text-[clamp(2rem,4.2vw,3.4rem)]"
          tone="dark"
        />

        <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <blockquote className="type-quote text-[clamp(1.35rem,2.4vw,1.85rem)] text-[#f6ece0]">
              &ldquo;Decision records preserve the reasoning and status behind
              the language rather than leaving it implicit in parser
              code.&rdquo;
            </blockquote>
            <p className="prose-lab mt-6 text-[15px] leading-[1.72] text-[#f6ece0]/60">
              Twenty-nine of these exist today. Nine are below, and the rest
              live in the repository. Changing how the language works starts
              with reading why it already works that way.
            </p>
            <p className="mt-6 font-mono text-[12px] text-[#f6ece0]/40">
              docs/README.md
            </p>
            <a
              className="press mt-8 inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-[14px] text-[#f6ece0] hover:border-white/40"
              href={`${REPO_URL}/tree/master/docs/language/decisions`}
              rel="noreferrer"
              target="_blank"
            >
              Read the full decision log
              <ExternalLink aria-hidden="true" size={14} />
            </a>
          </div>

          <div>
            <ol className="border-l border-white/15 pl-8 sm:pl-10">
              {decisions.map((decision) => (
                <li className="relative pb-10 last:pb-0" key={decision.id}>
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[38px] top-1 size-3 rounded-full border-2 border-vessel sm:-left-[46px] ${
                      decision.status === 'Accepted, implemented'
                        ? 'bg-gfp'
                        : 'bg-amber'
                    }`}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[13px] text-gfp/70">
                      {decision.id}
                    </span>
                    <h3 className="type-head text-[17px] text-[#f6ece0]">
                      {decision.title}
                    </h3>
                  </div>
                  <span className="mt-1.5 block text-[12px] text-[#f6ece0]/40">
                    {decision.status}
                  </span>
                  <p className="prose-lab mt-3 text-[14.5px] leading-[1.65] text-[#f6ece0]/60">
                    {decision.detail}
                  </p>
                  <a
                    className="rule-link mt-3 inline-flex w-fit items-center gap-1.5 text-[13px] text-[#f6ece0]/80"
                    href={`${REPO_URL}/blob/master/docs/language/decisions/${decision.file}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Read the document
                    <ExternalLink aria-hidden="true" size={12} />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
