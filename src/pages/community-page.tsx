import { ArrowRight, Bug, ExternalLink, MessageSquare, ScrollText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/reveal'
import { REPO_URL } from '../lib/site'

const channels = [
  {
    icon: Bug,
    title: 'Issues',
    detail:
      'Report a bug, or ask for something the checker or compiler does not do yet.',
    cta: 'Open an issue',
    href: `${REPO_URL}/issues`,
  },
  {
    icon: MessageSquare,
    title: 'Discussions',
    detail:
      'Ask a question, share what you built, or float an idea before it becomes a decision document.',
    cta: 'Start a discussion',
    href: `${REPO_URL}/discussions`,
  },
  {
    icon: ScrollText,
    title: 'Design decisions',
    detail:
      'Every accepted tradeoff in the language is a numbered, dated document, not a chat log.',
    cta: 'Read the log',
    href: `${REPO_URL}/tree/master/docs/language/decisions`,
  },
]

const flow = [
  {
    title: 'Open',
    detail: 'A bug, a gap, or a question, filed as a small, concrete issue.',
  },
  {
    title: 'Discuss',
    detail: 'The tradeoff gets argued in the open against decisions already on record.',
  },
  {
    title: 'Decide',
    detail: 'An accepted tradeoff becomes a numbered, dated document.',
  },
  {
    title: 'Land',
    detail: 'The change ships in the checker, the compiler, or the docs.',
  },
]

const steps = [
  {
    title: 'Read the decision log',
    detail:
      'Understand why the language looks the way it does before proposing that it look different. Most open questions already have a document.',
  },
  {
    title: 'Run something in the playground',
    detail:
      'The playground runs the real checker against real source. A diagnostic you did not expect is worth reporting.',
  },
  {
    title: 'Check what is not built yet',
    detail:
      'The homepage and the support matrix name the gaps directly, including the durable workflow runtime, which does not exist.',
  },
  {
    title: 'Open a small, concrete issue',
    detail:
      'A specific program that behaves wrong is more useful right now than a proposal for a large redesign.',
  },
]

const decisions = [
  {
    id: '0001',
    title: 'Minimal language kernel',
    status: 'Accepted, partially implemented',
    detail:
      'Indentation for behavior, braces for data, = for pure evaluation, <- for durable effects.',
    file: '0001-language-kernel.md',
  },
  {
    id: '0004',
    title: 'Portable module compilation boundary',
    status: 'Accepted, implemented',
    detail:
      'Every module compiles first to a verified, backend-neutral IR before any target is chosen.',
    file: '0004-portable-module-ir.md',
  },
  {
    id: '0006',
    title: 'Affine material flow in portable workflows',
    status: 'Accepted, initial implementation',
    detail:
      'Every physical material has one owning place, verified after type checking using copy, borrow, and take.',
    file: '0006-affine-material-flow.md',
  },
  {
    id: '0011',
    title: 'Artifact dependencies from material dataflow',
    status: 'Accepted, initial target lowering implemented',
    detail:
      'What depends on what is derived from typed dataflow, not from naming conventions.',
    file: '0011-dependencies-from-material-dataflow.md',
  },
]

export function CommunityPage() {
  return (
    <>
      <section className="agar-wash relative overflow-hidden" id="intro">
        <div className="mx-auto max-w-[1480px] px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pb-28">
          <Reveal className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-gfp ring-3 ring-gfp/25" />
            <span className="micro text-umber">
              v0.1.0 · early prototype · community forming
            </span>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="type-display mt-6 text-pretty text-[clamp(2.2rem,5vw,4.5rem)]">
              Help build the future of lab automation.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="type-deck mt-7 max-w-[38em] text-pretty text-[clamp(1.05rem,1.6vw,1.4rem)] text-ink/78">
              Lab is a small programming language with big ambitions to help
              change how we do science. If you&rsquo;re interested in making
              laboratory science scalable and fun, consider joining us!
            </p>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap gap-3" delay={200}>
            <a
              className="press inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] text-paper shadow-[0_10px_24px_-8px_rgb(43_28_17_/_0.5)]"
              href={REPO_URL}
              rel="noreferrer"
              target="_blank"
            >
              Read the source
              <ArrowRight aria-hidden="true" size={16} />
            </a>
            <a
              className="press inline-flex items-center gap-2 rounded-xl border border-ink/20 px-5 py-3 text-[14px] text-ink hover:border-ink/40"
              href={`${REPO_URL}/issues`}
              rel="noreferrer"
              target="_blank"
            >
              Open an issue
            </a>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-ink/12 bg-sand/40" id="channels">
        <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <Reveal className="max-w-2xl">
            <span className="micro text-amber-deep">
              Where the conversation happens
            </span>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)]">
              Join the conversation.
            </h2>
            <p className="prose-lab mt-6 text-[16px] leading-[1.7] text-ink/78 sm:text-[17px]">
              Report a bug, ask a question, or read why a decision was made.
              At this size, one good issue can change how the language works.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/12 sm:grid-cols-3">
            {channels.map((channel, index) => (
              <Reveal
                className="lift bg-shell/70 p-6 sm:p-7"
                delay={index * 70}
                key={channel.title}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber/12 text-amber-deep">
                  <channel.icon aria-hidden="true" size={16} strokeWidth={2} />
                </span>
                <h3 className="type-head mt-6 text-lg">{channel.title}</h3>
                <p className="prose-lab mt-2.5 text-[14px] leading-[1.65] text-umber">
                  {channel.detail}
                </p>
                <a
                  className="rule-link mt-4 inline-flex w-fit items-center gap-1.5 text-[13.5px] text-ink"
                  href={channel.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {channel.cta}
                  <ExternalLink aria-hidden="true" size={12} />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="emission-wash bg-vessel" id="flow">
        <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <Reveal className="max-w-2xl">
            <span className="micro text-gfp">How a change lands</span>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)] text-[#f6ece0]">
              From a question to an accepted decision.
            </h2>
            <p className="prose-lab mt-6 text-[15px] leading-[1.72] text-[#f6ece0]/60">
              Nothing here happens behind closed doors. Every stage below is
              visible in the repository, in order, with nothing skipped.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((stage, index) => (
              <Reveal delay={index * 80} key={stage.title}>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[12px] text-gfp/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="type-head text-lg text-[#f6ece0]">
                    {stage.title}
                  </h3>
                </div>
                <p className="prose-lab mt-3 border-t border-white/10 pt-3 text-[13.5px] leading-[1.6] text-[#f6ece0]/55">
                  {stage.detail}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28" id="get-involved">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <span className="micro text-amber-deep">Getting involved</span>
            <h2 className="type-title mt-5 text-balance text-[clamp(2rem,4.2vw,3.4rem)]">
              Where to start.
            </h2>
            <p className="prose-lab mt-6 text-[15px] leading-[1.72] text-ink/78">
              The project is small enough that reading before writing goes a
              long way. These are listed in the order they tend to be useful.
            </p>
          </Reveal>

          <ol className="divide-y divide-ink/10">
            {steps.map((step, index) => (
              <Reveal
                as="li"
                className="py-5 first:pt-0 last:pb-0"
                delay={90 + index * 60}
                key={step.title}
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[12px] text-amber-deep/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="type-head text-[15px]">{step.title}</h3>
                </div>
                <p className="prose-lab mt-1.5 text-[14px] leading-[1.65] text-umber">
                  {step.detail}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="emission-wash bg-vessel" id="decisions">
        <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <Reveal>
            <span className="micro text-gfp">Design decisions</span>
            <h2 className="type-title mt-5 max-w-[18ch] text-balance text-[clamp(2rem,4.2vw,3.4rem)] text-[#f6ece0]">
              Every tradeoff is a numbered document.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal delay={80}>
              <blockquote className="type-quote text-[clamp(1.35rem,2.4vw,1.85rem)] text-[#f6ece0]">
                &ldquo;Decision records preserve the reasoning and status
                behind the language rather than leaving it implicit in parser
                code.&rdquo;
              </blockquote>
              <p className="prose-lab mt-6 text-[15px] leading-[1.72] text-[#f6ece0]/60">
                Twelve of these exist today. Four are below, and the rest
                live in the repository. Changing how the language works
                starts with reading why it already works that way.
              </p>
              <p className="mt-6 font-mono text-[12px] text-[#f6ece0]/40">
                docs/README.md
              </p>
              <a
                className="press mt-8 inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-[14px] text-[#f6ece0] hover:border-white/40"
                href={`${REPO_URL}/tree/master/docs/language/decisions`}
                rel="noreferrer"
                target="_blank"
              >
                Read the full decision log
                <ExternalLink aria-hidden="true" size={14} />
              </a>
            </Reveal>

            <Reveal delay={140}>
              <ol className="border-l border-white/15 pl-8 sm:pl-10">
                {decisions.map((decision) => (
                  <li
                    className="relative pb-10 last:pb-0"
                    key={decision.id}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[38px] top-1 size-3 rounded-full border-2 border-vessel sm:-left-[46px] ${
                        decision.status === 'Accepted, implemented'
                          ? 'bg-gfp'
                          : 'bg-amber'
                      }`}
                    />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-[13px] text-gfp/70">
                        {decision.id}
                      </span>
                      <h3 className="type-head text-[17px] text-[#f6ece0]">
                        {decision.title}
                      </h3>
                    </div>
                    <span className="mt-1.5 block text-[12px] text-[#f6ece0]/40">
                      {decision.status}
                    </span>
                    <p className="prose-lab mt-3 text-[14.5px] leading-[1.65] text-[#f6ece0]/60">
                      {decision.detail}
                    </p>
                    <a
                      className="rule-link mt-3 inline-flex w-fit items-center gap-1.5 text-[13px] text-[#f6ece0]/80"
                      href={`${REPO_URL}/blob/master/docs/language/decisions/${decision.file}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Read the document
                      <ExternalLink aria-hidden="true" size={12} />
                    </a>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/12 bg-sand/40" id="closing">
        <div className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 lg:px-10">
          <Reveal>
            <div className="tick-rule" />
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="prose-lab text-[15px] text-umber">
                Read the code, file an issue, get involved.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="press inline-flex w-fit items-center gap-2 rounded-xl border border-ink/20 px-5 py-2.5 text-[14px] text-ink hover:border-ink/40"
                  to="/docs"
                >
                  Read the docs
                  <ArrowRight aria-hidden="true" size={15} />
                </Link>
                <Link
                  className="press inline-flex w-fit items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-[14px] text-paper"
                  to="/playground"
                >
                  Open the playground
                  <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
