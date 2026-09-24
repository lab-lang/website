import { ArrowRight } from 'lucide-react'

import { InstallCommand } from '@/components/home/install-command'
import { LiquidHandler } from '@/components/liquid-handler'
import { SectionBody } from '@/components/section'
import { REPO_URL, SHOW_INSTALL_COMMAND } from '@/lib/site'
import { useLatestRelease } from '@/lib/use-latest-release'

export function HeroSection() {
  const version = useLatestRelease()

  return (
    <section className="agar-wash relative overflow-hidden" id="intro">
      <SectionBody className="pb-8 pt-6 sm:pb-10 sm:pt-10 lg:pb-12">
        <p className="micro text-umber">
          <span className="normal-case">v</span>
          {version} · early prototype
        </p>

        <div>
          <h1 className="type-display mt-6 text-[clamp(2.375rem,5.65vw,5.25rem)]">
            <span className="block text-pretty">
              A compiler for biological engineering.
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
              Describe experiments in Python. Check your protocols and produce
              beautiful documents to share and use at the bench. When automation
              helps, prepare supported steps for the equipment in your
              laboratory.
            </p>
          </div>

          <div className="min-w-0 lg:w-[474px] lg:shrink-0">
            <div className="flex">
              <a
                className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-3 py-3 text-[14px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)] sm:px-5"
                href={REPO_URL}
                rel="noreferrer"
                target="_blank"
              >
                View on GitHub
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </div>
            {/* Desktop only: curl-pipe-sh is a workstation action. */}
            {SHOW_INSTALL_COMMAND && (
              <div className="mt-3 hidden sm:block">
                <InstallCommand />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[20px] border border-ink/25 bg-vessel shadow-[0_30px_80px_-20px_rgb(43_28_17_/_0.45)]">
          <LiquidHandler />
        </div>
      </SectionBody>
    </section>
  )
}
