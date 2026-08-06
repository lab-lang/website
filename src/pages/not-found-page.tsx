import { ArrowLeft, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="lab-grid grid min-h-[70dvh] place-items-center px-5 py-20 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-ink text-lab-lime">
          <FlaskConical aria-hidden="true" size={23} />
        </span>
        <p className="mt-6 font-mono text-xs text-lab-green">404 / NOT FOUND</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
          Nothing is growing here.
        </h1>
        <p className="mt-3 text-ink-muted">
          The page you requested is not part of this experiment.
        </p>
        <Link
          className="pressable mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper"
          to="/"
        >
          <ArrowLeft aria-hidden="true" size={15} />
          Back home
        </Link>
      </div>
    </section>
  )
}
