import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="agar-wash grid min-h-[72dvh] place-items-center px-5 py-24">
      <div className="max-w-md text-center">
        <span className="micro text-amber-deep">404</span>
        <h1 className="type-display mt-5 text-[clamp(2.2rem,5vw,3.4rem)]">
          Nothing is growing here.
        </h1>
        <p className="prose-lab mt-5 text-[16px] leading-[1.65] text-umber">
          That page is not part of this experiment. Check the address, or start
          again from the documentation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            className="press inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] text-paper"
            to="/"
          >
            <ArrowLeft aria-hidden="true" size={15} />
            Back home
          </Link>
          <Link
            className="press inline-flex items-center gap-2 rounded-xl border border-ink/20 px-5 py-3 text-[14px] hover:border-ink/40"
            to="/docs"
          >
            Read the docs
          </Link>
        </div>
      </div>
    </section>
  )
}
