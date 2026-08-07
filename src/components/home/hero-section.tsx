import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { HeroSpecimen } from '@/components/hero'
import { InstallCommand } from '@/components/home/install-command'
import { SectionBody } from '@/components/section'

export function HeroSection() {
  return (
    <section className="agar-wash relative overflow-hidden" id="intro">
      <SectionBody className="pb-14 pt-6 sm:pb-20 sm:pt-10 lg:pb-28">
        <p className="micro text-umber">
          <span className="normal-case">v</span>0.1.0 · early prototype
        </p>

        <div>
          <h1 className="type-display mt-6 text-[clamp(2rem,5.65vw,5.25rem)]">
            <span className="block text-pretty">
              A programming language for biology.
            </span>
            <span className="mt-[0.06em] block text-pretty text-[0.85em] font-light text-amber-deep">
              A compiler for the self-driving laboratory.
            </span>
          </h1>
        </div>

        {/*
         * min-w-0 on both cells: the install command sets its own line, and
         * without it that line's intrinsic width sizes the whole column and
         * pushes the hero past the edge of a phone.
         */}
        <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <p className="type-deck max-w-[33em] text-pretty text-[clamp(1.05rem,1.6vw,1.5rem)] text-ink/78">
              Lab is a programming language and compiler toolchain for making
              laboratory work portable, inspectable, and reliable across people,
              instruments, and facilities.
            </p>
          </div>

          <div className="min-w-0 lg:w-[474px] lg:shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-[15px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)] sm:text-[14px]"
                to="/docs"
              >
                Read the docs
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link
                className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/20 px-5 py-3 text-[15px] text-ink hover:border-ink/40 sm:text-[14px]"
                to="/playground"
              >
                Open the playground
              </Link>
            </div>
            <div className="mt-3">
              <InstallCommand />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <HeroSpecimen />
        </div>
      </SectionBody>
    </section>
  )
}
