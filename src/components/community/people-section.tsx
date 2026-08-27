import { ArrowUpRight } from 'lucide-react'

import { SectionBody } from '@/components/section'
import { communityPeople } from '@/data/community'

export function PeopleSection() {
  return (
    <section className="border-b border-ink/12 bg-sand/28" id="people">
      <SectionBody className="py-10 sm:py-12">
        <div className="mx-auto max-w-[1260px]">
          <div>
            <p className="micro text-amber-deep">People</p>
            <h2 className="type-title mt-3 text-[clamp(1.65rem,3vw,2.4rem)]">
              People building Lab
            </h2>
            <p className="prose-lab mt-2 max-w-3xl text-[13px] leading-[1.58] text-umber">
              Project leaders and contributors working across the compiler,
              language, tools, automation, standards, and community.
            </p>
          </div>

          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-ink/14 bg-ink/10 md:grid-cols-2">
            {communityPeople.map((person) => (
              <article
                className="grid grid-cols-[3rem_minmax(0,1fr)_auto] gap-3 bg-shell/82 p-4 sm:p-5"
                key={person.id}
              >
                <a
                  aria-label={`View ${person.name}'s GitHub profile`}
                  className="press rounded-full"
                  href={person.profileUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    alt=""
                    className="size-12 rounded-full border border-ink/14 object-cover grayscale-[12%]"
                    decoding="async"
                    height={48}
                    loading="lazy"
                    src={person.avatarUrl}
                    width={48}
                  />
                </a>
                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <a
                      className="rule-link type-head text-[14px]"
                      href={person.profileUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {person.name}
                    </a>
                    <span className="font-mono text-[9.5px] text-umber-soft">
                      {person.handle} · {person.role}
                    </span>
                  </div>
                  {person.affiliation ? (
                    <p className="mt-0.5 text-[10.5px] text-umber-soft">
                      {person.affiliation}
                    </p>
                  ) : null}
                  <p className="mt-1.5 text-[11.5px] leading-[1.5] text-umber">
                    {person.contribution}
                  </p>
                  <p className="mt-auto pt-2 font-mono text-[9.5px] text-umber-soft">
                    {person.areas.join(' · ')}
                  </p>
                </div>
                <a
                  aria-label={`View ${person.name}'s GitHub profile`}
                  className="press mt-0.5 text-umber-soft hover:text-ink"
                  href={person.profileUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ArrowUpRight aria-hidden="true" size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </SectionBody>
    </section>
  )
}
