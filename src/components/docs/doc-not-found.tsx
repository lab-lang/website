import { Link } from 'react-router-dom'

import { DEFAULT_DOC_SLUG } from '@/lib/docs-content'

export function DocNotFound({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-[1480px] px-5 py-24 text-center sm:px-8 lg:px-10">
      <span className="micro text-amber-deep">Documentation</span>
      <h1 className="type-title mt-4 text-[2rem]">Not in the docs</h1>
      <p className="prose-lab mt-4 text-[15px] text-umber">
        There is no page at{' '}
        <code className="rounded-md bg-ink/8 px-1.5 py-0.5 font-mono text-[13px] text-ink">
          /docs/{slug}
        </code>
        .
      </p>
      <Link
        className="press mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-[14px] text-paper"
        to={`/docs/${DEFAULT_DOC_SLUG}`}
      >
        Back to the docs
      </Link>
    </div>
  )
}
