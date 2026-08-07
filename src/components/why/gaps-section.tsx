import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ClosingNote, SectionBody, SectionIntro } from '@/components/section'
import { REPO_URL } from '@/lib/site'

const gaps = [
  'The durable workflow runtime does not exist yet, so nothing replays today.',
  'One backend, and generated protocols are a compiler spike a laboratory must verify before running.',
  'The language and its intermediate representations are still changing.',
  'Packages resolve by path only. There is no registry, and no lockfiles.',
]

export function GapsSection() {
  return (
    <section className="border-t border-ink/12 bg-sand/40" id="honest">
      <SectionBody className="py-14 sm:py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionIntro
              kicker="The other side"
              lede="If you need to move liquid this week, use one of the tools above. Lab is a v0.1.0 prototype: it checks more and runs less. It is worth your time if the checking is the part you have been missing."
              ledeClassName="mt-6 text-[15px] leading-[1.72]"
              title="Reasons not to use Lab yet."
              titleClassName="text-[clamp(1.9rem,3.6vw,2.9rem)]"
            />
            <Link
              className="press mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)]"
              to="/docs/status"
            >
              See the full support matrix
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-umber-soft" />
              <span className="micro text-ink/55">Known gaps</span>
            </div>
            <ul className="mt-5 space-y-3">
              {gaps.map((gap) => (
                <li
                  className="prose-lab border-t border-ink/10 pt-3 text-[14px] leading-[1.6] text-umber"
                  key={gap}
                >
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ClosingNote note="Disagree with any of this? The comparison is a file in the repository.">
          <a
            className="press inline-flex w-fit items-center gap-2 rounded-xl border border-ink/20 px-5 py-2.5 text-[14px] text-ink hover:border-ink/40"
            href={`${REPO_URL}/issues`}
            rel="noreferrer"
            target="_blank"
          >
            Tell us where it is wrong
            <ArrowRight aria-hidden="true" size={15} />
          </a>
        </ClosingNote>
      </SectionBody>
    </section>
  )
}
