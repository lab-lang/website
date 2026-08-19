import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { HeroSpecimen } from '@/components/hero'
import { InstallCommand } from '@/components/home/install-command'
import { SectionBody } from '@/components/section'
import { SHOW_INSTALL_COMMAND } from '@/lib/site'
import { useLatestRelease } from '@/lib/use-latest-release'

export function HeroSection() {
  const version = useLatestRelease()

  return (
    <section className="agar-wash relative overflow-hidden" id="intro">
      <SectionBody className="pb-14 pt-6 sm:pb-20 sm:pt-10 lg:pb-28">
        <p className="micro text-umber">
          <span className="normal-case">v</span>
          {version} · early prototype
        </p>

        <div>
          <h1 className="type-display mt-6 text-[clamp(2.375rem,5.65vw,5.25rem)]">
            <span className="block text-pretty">
              A compiler for the robotic laboratory.
            </span>
            <span className="mt-[0.06em] block text-balance text-[0.82em] font-light text-amber-deep">
              Write the experiment once. Compile it for any lab.
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
            {/* The serif deck never sets below 18px: Crimson Pro's small
             * x-height needs it to hold optical parity with 16px Archivo. */}
            <p className="type-deck max-w-[33em] text-pretty text-[clamp(1.125rem,1.6vw,1.5rem)] text-ink/78">
              The Lab compiler takes an experiment described in Python or the
              Lab programming language, checks it, and lowers it through one
              intermediate representation, LAIR, into work a person at a bench
              or the instruments of a self-driving laboratory can carry out.
            </p>
          </div>

          <div className="min-w-0 lg:w-[474px] lg:shrink-0">
            {/* One row on a phone: stacked full-width buttons push the
             * specimen most of a screen further down. */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
              <Link
                className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-3 py-3 text-[14px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)] sm:px-5"
                to="/docs"
              >
                Read the docs
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link
                className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/20 px-3 py-3 text-[14px] text-ink hover:border-ink/40 sm:px-5"
                to="/playground"
              >
                Open the playground
              </Link>
            </div>
            {/*
             * Desktop only: curl-pipe-sh is a workstation action. The phone
             * visitor meets the same command in the closing note instead,
             * once the page has made its case.
             */}
            {SHOW_INSTALL_COMMAND && (
              <div className="mt-3 hidden sm:block">
                <InstallCommand />
              </div>
            )}
          </div>
        </div>

        {/*
         * Desktop only: the specimen is an illustration sized for a wide
         * viewport, and on a phone it costs several screens of scrolling
         * without room to breathe. The phone visitor goes straight to the
         * prose sections instead.
         */}
        <div className="mt-8 hidden sm:block">
          <HeroSpecimen />
        </div>
      </SectionBody>
    </section>
  )
}
