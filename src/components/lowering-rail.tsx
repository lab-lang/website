import { useState } from 'react'

import { SourceCode } from '@/components/source-code'
import { stages } from '@/data/artifacts'

export function LoweringRail() {
  const [activeId, setActiveId] = useState(stages[0].id)
  const active = stages.find((stage) => stage.id === activeId) ?? stages[0]
  const activeIndex = stages.indexOf(active)

  return (
    <div>
      {/*
       * The rail is ordered because lowering is ordered: each artifact is
       * derived from the one before it.
       */}
      <div
        aria-label="Compilation stages"
        className="rail rail-quiet rail-fade -mx-5 px-5 sm:mx-0 sm:px-0"
        role="tablist"
      >
        <div className="flex min-w-max items-stretch gap-1">
          {stages.map((stage, index) => {
            const selected = stage.id === active.id
            const passed = index < activeIndex

            return (
              <div className="flex items-stretch" key={stage.id}>
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className={`mx-1 w-6 self-center border-t transition-colors duration-300 sm:w-10 ${
                      passed || selected
                        ? 'border-gfp/60'
                        : 'border-[#f6ece0]/15'
                    }`}
                  />
                )}
                <button
                  aria-controls="stage-panel"
                  aria-selected={selected}
                  className={`press rounded-lg border px-3.5 py-2.5 text-left sm:px-4 ${
                    selected
                      ? 'border-gfp/45 bg-gfp/12'
                      : 'border-[#f6ece0]/12 hover:border-[#f6ece0]/30'
                  }`}
                  id={`stage-tab-${stage.id}`}
                  onClick={() => setActiveId(stage.id)}
                  role="tab"
                  type="button"
                >
                  <span
                    className={`micro block ${
                      selected ? 'text-gfp' : 'text-[#f6ece0]/40'
                    }`}
                  >
                    {stage.label}
                  </span>
                  {/*
                   * The micro label alone identifies a stage; the emit string
                   * is a flag-length mouthful that clips mid-word at phone
                   * width, so it only rides along where it fits whole.
                   */}
                  <span
                    className={`mt-1.5 hidden font-mono text-[11px] sm:block ${
                      selected ? 'text-[#f6ece0]/60' : 'text-[#f6ece0]/45'
                    }`}
                  >
                    {stage.emit}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div
        aria-labelledby={`stage-tab-${active.id}`}
        className="mt-8 grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-12"
        id="stage-panel"
        role="tabpanel"
      >
        <div className="stage-panel" key={`${active.id}-copy`}>
          <h3 className="type-title text-2xl text-[#f6ece0] sm:text-3xl">
            {active.headline}
          </h3>
          <p className="prose-lab mt-5 text-[15px] leading-[1.72] text-[#f6ece0]/60">
            {active.description}
          </p>
          <p className="mt-7 border-t border-[#f6ece0]/12 pt-4 font-mono text-[11px] text-[#f6ece0]/50">
            {active.filename}
          </p>
        </div>

        <div
          className="stage-panel overflow-hidden rounded-xl border border-[#f6ece0]/12 bg-black/25"
          key={`${active.id}-code`}
        >
          {/*
           * Below sm the artifact is a capped excerpt behind the bottom fade
           * rather than an inner scroller — a fixed-height vertical scroller
           * stacked in the page captures the swipe, and the emitted tail
           * lines carry no argument.
           */}
          <div className="scroll-fade-y max-h-[340px] overflow-hidden sm:max-h-[440px] sm:overflow-auto">
            <SourceCode
              language={active.language}
              showLineNumbers={active.language !== 'shell'}
              source={active.body}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
