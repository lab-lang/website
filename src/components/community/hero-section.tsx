import { ArrowRight } from 'lucide-react'

import { SectionBody } from '@/components/section'
import { REPO_URL } from '@/lib/site'

export function HeroSection() {
  return (
    <section className="agar-wash relative overflow-hidden" id="intro">
      <SectionBody className="pb-14 pt-6 sm:pb-20 sm:pt-10 lg:pb-28">
        <div className="flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-gfp ring-3 ring-gfp/25" />
          <span className="micro text-umber">
            <span className="normal-case">v</span>0.1.0 · early prototype ·
            community forming
          </span>
        </div>

        <div>
          <h1 className="type-display mt-6 text-pretty text-[clamp(2.2rem,5vw,4.5rem)]">
            Help build the future of lab automation.
          </h1>
        </div>

        <div>
          <p className="type-deck mt-7 max-w-[38em] text-pretty text-[clamp(1.05rem,1.6vw,1.4rem)] text-ink/78">
            Lab is a small programming language with big ambitions to help
            change how we do science. If you&rsquo;re interested in making
            laboratory science scalable and fun, consider joining us!
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="press inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)]"
            href={REPO_URL}
            rel="noreferrer"
            target="_blank"
          >
            Read the source
            <ArrowRight aria-hidden="true" size={16} />
          </a>
          <a
            className="press inline-flex items-center gap-2 rounded-xl border border-ink/20 px-5 py-3 text-[14px] text-ink hover:border-ink/40"
            href={`${REPO_URL}/issues`}
            rel="noreferrer"
            target="_blank"
          >
            Open an issue
          </a>
        </div>
      </SectionBody>
    </section>
  )
}
