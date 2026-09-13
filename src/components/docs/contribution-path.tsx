import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ContributionPath({
  title,
  tools,
  description,
  to,
}: {
  title: string
  tools: string
  description: string
  to: string
}) {
  return (
    <Link
      className="press group flex min-w-0 flex-col rounded-xl border border-ink/15 bg-shell/40 p-5 transition-colors hover:border-ink/35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-deep"
      to={to}
    >
      <span className="micro text-umber-soft">{tools}</span>
      <span className="type-head mt-3 flex items-start justify-between gap-3 text-[17px] text-ink">
        {title}
        <ArrowRight aria-hidden="true" className="mt-1 shrink-0" size={16} />
      </span>
      <span className="mt-2 text-[14px] leading-relaxed text-umber">
        {description}
      </span>
    </Link>
  )
}
