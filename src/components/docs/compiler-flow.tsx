import { Link } from 'react-router-dom'

const outcomes = [
  {
    title: 'Check the protocol',
    description:
      'Check types, action contracts, and material ownership in Lab or Python, without choosing equipment.',
    link: 'Contribute scientific vocabulary',
    to: '/docs/contributing/scientific-vocabulary',
  },
  {
    title: 'Create beautiful documents',
    description:
      'Make laboratory work clear to the person reading it. Today, facility builds produce typeset operator documents and manual run sheets.',
    link: 'Explore document generation',
    to: '/docs/compiler/architecture#protocol-documents',
  },
]

const facilityStages = [
  {
    title: 'Refine actions into Methods',
    description:
      'Describe possible implementations as physical operations and the capabilities they need.',
    contribution: 'Python Methods',
    to: '/docs/contributing/pipetting-methods',
  },
  {
    title: 'Choose Methods and resources together',
    description:
      'Use the facility inventory, profiles, and adapter feasibility checks to find a complete allocation.',
    contribution: 'Instrument profiles',
    to: '/docs/contributing/instrument-profiles',
  },
  {
    title: 'Generate device files',
    description:
      'Give each adapter its assigned tasks and preserve the exact resource choices.',
    contribution: 'Adapters',
    to: '/docs/contributing/adapters',
  },
  {
    title: 'Review and run',
    description:
      'Freeze the plan and its files, execute supported documents, and record what happened.',
    contribution: 'Execution support',
    to: '/docs/contributing/execution-support',
  },
]

export function CompilerFlow() {
  return (
    <figure className="mt-7" aria-label="One protocol, several uses">
      <div className="grid gap-3 sm:grid-cols-2">
        {outcomes.map((outcome) => (
          <div
            className="rounded-2xl border border-ink/15 bg-shell/50 px-4 py-5 sm:px-6"
            key={outcome.title}
          >
            <p className="type-head text-[17px] text-ink">{outcome.title}</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-umber">
              {outcome.description}
            </p>
            <Link
              className="rule-link mt-2 inline-block text-[13px] text-ink"
              to={outcome.to}
            >
              {outcome.link}
            </Link>
          </div>
        ))}
      </div>
      <p className="type-head mt-6 text-[17px] text-ink">
        Optional: plan work for a facility and automate supported steps
      </p>
      <ol className="mt-3 overflow-hidden rounded-2xl border border-ink/15 bg-shell/50">
        {facilityStages.map((stage, index) => (
          <li
            className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 border-t border-ink/10 px-4 py-5 first:border-t-0 sm:gap-x-4 sm:px-6"
            key={stage.title}
          >
            <span aria-hidden="true" className="micro pt-1 text-amber-deep">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="type-head text-[17px] text-ink">{stage.title}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-umber">
                {stage.description}
              </p>
              <Link
                className="rule-link mt-2 inline-block text-[13px] text-ink"
                to={stage.to}
              >
                Contribute: {stage.contribution}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  )
}
