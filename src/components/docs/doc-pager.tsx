import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { type DocPage } from '@/lib/docs-content'

export function DocPager({ prev, next }: { prev?: DocPage; next?: DocPage }) {
  return (
    <nav
      aria-label="Page"
      className="mt-16 flex flex-col gap-3 border-t border-ink/12 pt-8 sm:flex-row sm:justify-between"
    >
      {prev ? (
        <Link
          className="press flex flex-col rounded-xl border border-ink/15 px-4 py-3 hover:border-ink/35 sm:max-w-xs"
          to={`/docs/${prev.slug}`}
        >
          <span className="micro flex items-center gap-1.5 text-ink/40">
            <ArrowLeft aria-hidden="true" size={12} />
            Previous
          </span>
          <span className="type-head mt-1 text-[14.5px] text-ink">
            {prev.frontmatter.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          className="press flex flex-col items-end rounded-xl border border-ink/15 px-4 py-3 text-right hover:border-ink/35 sm:ml-auto sm:max-w-xs"
          to={`/docs/${next.slug}`}
        >
          <span className="micro flex items-center gap-1.5 text-ink/40">
            Next
            <ArrowRight aria-hidden="true" size={12} />
          </span>
          <span className="type-head mt-1 text-[14.5px] text-ink">
            {next.frontmatter.title}
          </span>
        </Link>
      )}
    </nav>
  )
}
