import { Link } from 'react-router-dom'

import { Wordmark } from '@/components/site/marks'
import { REPO_URL } from '@/lib/site'
import { useLatestRelease } from '@/lib/use-latest-release'

export function SiteFooter() {
  const version = useLatestRelease()

  return (
    <footer className="border-t border-ink/12 bg-sand/45">
      <div className="mx-auto max-w-[1480px] px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark size={28} />
            <p className="prose-lab mt-4 text-[14px] leading-[1.7] text-umber">
              Lab is a programming language and compiler toolchain for
              describing biology and orchestrating work in the laboratory.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[14px] sm:gap-x-20">
            <div className="flex flex-col gap-3">
              <span className="micro text-ink/40">Learn</span>
              <Link
                className="rule-link w-fit text-umber hover:text-ink"
                to="/why"
              >
                Why Lab
              </Link>
              <Link
                className="rule-link w-fit text-umber hover:text-ink"
                to="/docs"
              >
                Documentation
              </Link>
              <Link
                className="rule-link w-fit text-umber hover:text-ink"
                to="/playground"
              >
                Playground
              </Link>
              <Link
                className="rule-link w-fit text-umber hover:text-ink"
                to="/community"
              >
                Community
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="micro text-ink/40">Build</span>
              <a
                className="rule-link w-fit text-umber hover:text-ink"
                href={REPO_URL}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                className="rule-link w-fit text-umber hover:text-ink"
                href={`${REPO_URL}/issues`}
                rel="noreferrer"
                target="_blank"
              >
                Issues
              </a>
              <a
                className="rule-link w-fit text-umber hover:text-ink"
                href={`${REPO_URL}/tree/master/docs`}
                rel="noreferrer"
                target="_blank"
              >
                Design documents
              </a>
              <Link
                className="rule-link w-fit text-umber hover:text-ink"
                to="/brand"
              >
                Brand
              </Link>
            </div>
          </div>
        </div>

        <div className="tick-rule mt-12" />
        <div className="mt-5 text-[13px] text-umber-soft">
          <span>Apache-2.0 · v{version}</span>
        </div>
      </div>
    </footer>
  )
}
