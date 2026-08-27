import { ArrowUpRight } from 'lucide-react'

import {
  CommunityTable,
  CommunityTableBody,
  CommunityTableHeader,
  CommunityTableLinkRow,
} from '@/components/community/community-table'
import { SectionBody } from '@/components/section'
import { repositoryHomes, type RepositoryKind } from '@/data/community'

const repositoryKindStyles: Record<RepositoryKind, string> = {
  Protocol: 'bg-amber/14 text-amber-deep',
  Driver: 'bg-amber/14 text-amber-deep',
  Compiler: 'bg-ink/8 text-ink',
  Simulation: 'bg-ink/8 text-ink',
  Community: 'bg-sand-deep/80 text-umber',
  Website: 'bg-sand-deep/80 text-umber',
}

export function ParticipationSection() {
  return (
    <section id="participate">
      <SectionBody className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1260px]">
          <div>
            <p className="micro text-amber-deep">Repository map</p>
            <h2 className="type-title mt-3 text-[clamp(1.85rem,3.4vw,3rem)]">
              Where work happens
            </h2>
            <p className="prose-lab mt-3 max-w-4xl text-[13.5px] leading-[1.6] text-umber">
              Strategy, group charters, and governance live in the community
              repository. Source code, implementation issues, and technical
              decisions stay with the repositories that own them.
            </p>
          </div>

          <CommunityTable className="mt-7">
            <CommunityTableHeader
              className="gap-4 sm:grid sm:grid-cols-[8rem_minmax(10rem,0.8fr)_minmax(0,1.6fr)]"
              columns={['Kind', 'Repository', 'Owns']}
            />
            <CommunityTableBody>
              {repositoryHomes.map((repository) => (
                <CommunityTableLinkRow
                  className="grid gap-1.5 px-4 py-3.5 sm:grid-cols-[8rem_minmax(10rem,0.8fr)_minmax(0,1.6fr)_auto] sm:items-center sm:gap-4 sm:px-5"
                  href={repository.href}
                  key={repository.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span
                    className={`w-fit rounded px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.08em] ${repositoryKindStyles[repository.kind]}`}
                  >
                    {repository.kind}
                  </span>
                  <span className="font-mono text-[11px] text-ink">
                    {repository.label}
                  </span>
                  <span className="text-[11.5px] leading-[1.48] text-umber">
                    {repository.description}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden text-umber-soft sm:block"
                    size={12}
                  />
                </CommunityTableLinkRow>
              ))}
            </CommunityTableBody>
          </CommunityTable>
        </div>
      </SectionBody>
    </section>
  )
}
