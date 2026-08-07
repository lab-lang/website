import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ClosingNote, SectionBody } from '@/components/section'

export function ClosingSection() {
  return (
    <section className="border-t border-ink/12 bg-sand/40" id="closing">
      <SectionBody className="py-12 sm:py-16">
        <ClosingNote
          className=""
          note="Read the code, file an issue, get involved."
        >
          <div className="flex flex-wrap gap-3">
            <Link
              className="press inline-flex w-fit items-center gap-2 rounded-xl border border-ink/20 px-5 py-2.5 text-[14px] text-ink hover:border-ink/40"
              to="/docs"
            >
              Read the docs
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
            <Link
              className="press inline-flex w-fit items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-[14px] text-paper"
              to="/playground"
            >
              Open the playground
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </ClosingNote>
      </SectionBody>
    </section>
  )
}
