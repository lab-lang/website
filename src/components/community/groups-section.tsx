import { ArrowUpRight, Milestone, UsersRound } from 'lucide-react'

import {
  CommunityTable,
  CommunityTableBody,
  CommunityTableHeader,
  CommunityTableRow,
} from '@/components/community/community-table'
import { SectionBody } from '@/components/section'
import {
  communityDirectory,
  sigs,
  workingGroups,
  type SpecialInterestGroup,
  type WorkingGroup,
} from '@/data/community'

const peopleById = new Map(
  communityDirectory.map((person) => [person.id, person]),
)

const groupTableColumns = [
  'Group',
  'Scope and contribution area',
  'Chairs',
  'Canonical home',
]

const groupTableGridClassName =
  'gap-5 md:grid md:grid-cols-[minmax(11.5rem,0.95fr)_minmax(0,2.35fr)_minmax(8.5rem,0.72fr)_minmax(9.5rem,0.72fr)]'

const groupTableRowClassName = `scroll-mt-20 px-4 py-4 sm:px-5 ${groupTableGridClassName} md:items-start md:py-4.5`

function CanonicalLinks({
  charterUrl,
  className = '',
  projectUrl,
}: {
  charterUrl: string
  className?: string
  projectUrl: string
}) {
  return (
    <div
      className={`flex items-center gap-4 md:block md:space-y-2 ${className}`}
    >
      {[
        ['Charter', charterUrl],
        ['Project', projectUrl],
      ].map(([label, href]) => (
        <a
          className="rule-link flex w-fit items-center gap-1.5 text-[11.5px] text-umber"
          href={href}
          key={label}
          rel="noreferrer"
          target="_blank"
        >
          {label}
          <ArrowUpRight aria-hidden="true" size={11} />
        </a>
      ))}
    </div>
  )
}

function GroupChairs({
  group,
}: {
  group: Pick<SpecialInterestGroup, 'chairIds'>
}) {
  const chairs = group.chairIds.flatMap((id) => {
    const person = peopleById.get(id)
    return person ? [person] : []
  })

  if (chairs.length === 0) {
    return (
      <div className="flex items-center gap-2 md:block">
        <UsersRound
          aria-hidden="true"
          className="shrink-0 text-umber-soft md:hidden"
          size={13}
        />
        <div>
          <p className="text-[12px] text-ink/68">To be named</p>
          <p className="mt-0.5 font-mono text-[9.5px] text-umber-soft">
            1–2 chair seats
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {chairs.map((chair) => (
        <a
          className="press inline-flex items-center gap-1.5 rounded-full border border-ink/12 py-1 pl-1 pr-2 text-[11px]"
          href={chair.profileUrl}
          key={chair.id}
          rel="noreferrer"
          target="_blank"
        >
          <img
            alt=""
            className="size-5 rounded-full object-cover"
            height={20}
            src={chair.avatarUrl}
            width={20}
          />
          {chair.name}
        </a>
      ))}
    </div>
  )
}

function SigIdentity({ sig }: { sig: SpecialInterestGroup }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-md border border-ink/10 bg-sand/48 text-amber-deep">
        <sig.icon aria-hidden="true" size={15} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <h3 className="type-head text-[14px]">SIG {sig.name}</h3>
        <p className="mt-0.5 font-mono text-[9.5px] text-umber-soft">
          {sig.category}
        </p>
      </div>
    </div>
  )
}

function SigScope({ sig }: { sig: SpecialInterestGroup }) {
  return (
    <div className="mt-3 md:mt-0">
      <p className="text-[12.5px] leading-[1.52] text-ink/76">{sig.summary}</p>
      <p className="mt-1.5 text-[11px] leading-[1.5] text-umber">
        <span className="font-semibold text-ink/68">Owns:</span>{' '}
        {sig.owns.join(' · ')}
      </p>
      <p className="mt-1 text-[11px] leading-[1.5] text-umber-soft">
        <span className="text-umber">Contribute:</span> {sig.contribute}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {sig.repositories.map((repository) => (
          <a
            className="rule-link font-mono text-[9.5px] text-umber"
            href={repository.href}
            key={repository.label}
            rel="noreferrer"
            target="_blank"
          >
            {repository.label}
          </a>
        ))}
      </div>
    </div>
  )
}

function SigRow({ sig }: { sig: SpecialInterestGroup }) {
  return (
    <CommunityTableRow
      className={groupTableRowClassName}
      id={`sig-${sig.slug}`}
    >
      <SigIdentity sig={sig} />
      <SigScope sig={sig} />

      <div className="mt-3 border-t border-ink/8 pt-3 md:mt-0 md:border-0 md:pt-0">
        <GroupChairs group={sig} />
      </div>

      <CanonicalLinks
        charterUrl={sig.charterUrl}
        className="mt-3 md:mt-0"
        projectUrl={sig.projectUrl}
      />
    </CommunityTableRow>
  )
}

function WorkingGroupIdentity({ group }: { group: WorkingGroup }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-md border border-ink/10 bg-sand/48 text-amber-deep">
        <Milestone aria-hidden="true" size={15} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <h3 className="type-head text-[14px]">WG {group.name}</h3>
        <p className="mt-0.5 font-mono text-[9.5px] text-umber-soft">
          {group.status} · Temporary coordination
        </p>
      </div>
    </div>
  )
}

function WorkingGroupScope({ group }: { group: WorkingGroup }) {
  return (
    <div className="mt-3 md:mt-0">
      <p className="text-[12.5px] leading-[1.52] text-ink/76">
        {group.purpose}
      </p>
      <p className="mt-1.5 text-[11px] leading-[1.5] text-umber">
        <span className="font-semibold text-ink/68">Sponsors:</span>{' '}
        {group.sponsors.map((sponsor, index) => (
          <span key={sponsor}>
            <a className="rule-link" href={`#sig-${sponsor.toLowerCase()}`}>
              SIG {sponsor}
            </a>
            {index < group.sponsors.length - 1 ? ' · ' : ''}
          </span>
        ))}
      </p>
      <p className="mt-1 text-[11px] leading-[1.5] text-umber">
        <span className="font-semibold text-ink/68">Deliverables:</span>{' '}
        {group.deliverables.join(' · ')}
      </p>
      <p className="mt-1 text-[11px] leading-[1.5] text-umber-soft">
        <span className="text-umber">Completion:</span> {group.completion}
      </p>
    </div>
  )
}

function WorkingGroupRow({ group }: { group: WorkingGroup }) {
  return (
    <CommunityTableRow
      className={groupTableRowClassName}
      id={`wg-${group.slug}`}
    >
      <WorkingGroupIdentity group={group} />
      <WorkingGroupScope group={group} />

      <div className="mt-3 border-t border-ink/8 pt-3 md:mt-0 md:border-0 md:pt-0">
        <GroupChairs group={group} />
      </div>

      <CanonicalLinks
        charterUrl={group.charterUrl}
        className="mt-3 md:mt-0"
        projectUrl={group.projectUrl}
      />
    </CommunityTableRow>
  )
}

export function GroupsSection() {
  return (
    <section className="border-b border-ink/12" id="groups">
      <SectionBody className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1260px]">
          <div>
            <p className="micro text-amber-deep">Community groups</p>
            <h2 className="type-title mt-3 text-[clamp(1.85rem,3.4vw,3rem)]">
              Special Interest Groups
            </h2>
            <p className="prose-lab mt-3 max-w-3xl text-[13.5px] leading-[1.6] text-umber">
              SIGs are persistent and own technical scope. Each has a public
              charter, one canonical GitHub Project, named repositories, and one
              or two chairs who organize its work and communication.
            </p>
          </div>

          <CommunityTable className="mt-7">
            <CommunityTableHeader
              className={groupTableGridClassName}
              columns={groupTableColumns}
            />
            <CommunityTableBody>
              {sigs.map((sig) => (
                <SigRow key={sig.slug} sig={sig} />
              ))}
            </CommunityTableBody>
          </CommunityTable>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="type-title text-[clamp(1.65rem,3vw,2.4rem)]">
                Working Groups
              </h2>
              <p className="prose-lab mt-2 max-w-3xl text-[13px] leading-[1.58] text-umber">
                WGs are temporary. Sponsoring SIGs retain permanent ownership,
                and the group closes when its stated deliverables are complete.
              </p>
            </div>
            <span className="font-mono text-[10px] text-umber-soft">
              {workingGroups.length} current{' '}
              {workingGroups.length === 1 ? 'charter' : 'charters'}
            </span>
          </div>

          <CommunityTable className="mt-6">
            <CommunityTableHeader
              className={groupTableGridClassName}
              columns={groupTableColumns}
            />
            <CommunityTableBody>
              {workingGroups.map((group) => (
                <WorkingGroupRow group={group} key={group.slug} />
              ))}
            </CommunityTableBody>
          </CommunityTable>
        </div>
      </SectionBody>
    </section>
  )
}
