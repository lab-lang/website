import { ArrowUpRight, ExternalLink, GitBranch } from 'lucide-react'

import { SectionBody } from '@/components/section'
import { startHere } from '@/data/community'
import { COMMUNITY_REPO_URL } from '@/lib/site'

export function HeroSection() {
  return (
    <section className="agar-wash border-b border-ink/12" id="intro">
      <SectionBody className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[1260px]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] lg:gap-16">
            <div>
              <p className="micro text-amber-deep">lab-lang/community</p>
              <h1 className="type-display mt-4 text-[clamp(2.75rem,6vw,5rem)] leading-[0.96]">
                Lab Community
              </h1>
              <p className="type-deck mt-6 max-w-[42rem] text-[clamp(1.05rem,1.55vw,1.28rem)] leading-[1.52] text-ink/80">
                This is the durable strategy and lightweight community structure
                for Lab. It explains why the project exists, how its Special
                Interest Groups fit together, and how temporary Working Groups
                coordinate work across them.
              </p>
              <p className="prose-lab mt-4 max-w-[44rem] text-[14px] leading-[1.65] text-umber">
                Lab is a compiler for portable biological work. Scientists state
                the result, constraints, and evidence they need in Python or the
                Lab Language. The compiler specializes that intent for a
                laboratory, its policies, and its instruments.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <a
                  className="press inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-[13px] text-paper"
                  href="#groups"
                >
                  Browse community groups
                  <ArrowUpRight aria-hidden="true" size={14} />
                </a>
                <a
                  className="press inline-flex items-center gap-2 rounded-lg border border-ink/18 px-4 py-2.5 text-[13px] text-ink hover:border-ink/38"
                  href={COMMUNITY_REPO_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  <GitBranch aria-hidden="true" size={14} />
                  Open the repository
                </a>
              </div>
            </div>

            <nav
              aria-label="Start with the community repository"
              className="h-fit self-start overflow-hidden rounded-xl border border-ink/16 bg-shell/72"
            >
              <div className="flex items-center justify-between border-b border-ink/12 px-4 py-3 sm:px-5">
                <h2 className="type-head text-[15px]">Start here</h2>
                <span className="font-mono text-[10px] text-umber-soft">
                  {startHere.length} documents
                </span>
              </div>
              <ol>
                {startHere.map((document, index) => (
                  <li
                    className="border-b border-ink/10 last:border-b-0"
                    key={document.label}
                  >
                    <a
                      className="press group grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-start gap-3 px-4 py-3.5 sm:px-5"
                      href={document.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="pt-0.5 font-mono text-[10px] text-amber-deep/65">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span className="type-head block text-[14px]">
                          {document.label}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-[1.45] text-umber">
                          {document.description}
                        </span>
                      </span>
                      <ExternalLink
                        aria-hidden="true"
                        className="mt-1 text-umber-soft"
                        size={12}
                      />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
