import { Check } from 'lucide-react'

import { BUILD_STAGES } from '@/data/build-stages'

export function BuildTransition({ step }: { step: number }) {
  const progress = Math.min(step / BUILD_STAGES.length, 1)

  return (
    <div className="flex h-full flex-col justify-center px-6 py-6 sm:px-10">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-amber" />
        <span className="micro text-amber">Compiling</span>
      </div>

      <ol className="mt-5 space-y-1.5">
        {BUILD_STAGES.map((stage, index) => {
          const done = index < step
          const active = index === step

          return (
            <li
              className="flex items-baseline gap-3 font-mono text-[12px] transition-opacity duration-200 sm:text-[12.5px]"
              key={stage.name}
              style={{ opacity: done || active ? 1 : 0.32 }}
            >
              <span className="grid w-4 shrink-0 place-items-center">
                {done ? (
                  <Check
                    aria-hidden="true"
                    className="text-gfp"
                    size={11}
                    strokeWidth={3}
                  />
                ) : (
                  <span
                    className={`size-1.5 rounded-full ${
                      active ? 'bg-amber' : 'bg-[#f6ece0]/30'
                    }`}
                  />
                )}
              </span>
              <span
                className={`w-14 shrink-0 ${
                  done
                    ? 'text-gfp'
                    : active
                      ? 'text-amber'
                      : 'text-[#f6ece0]/50'
                }`}
              >
                {stage.name}
              </span>
              <span className="truncate text-[#f6ece0]/35">{stage.emit}</span>
            </li>
          )
        })}
      </ol>

      <div className="mt-6 h-px w-full max-w-[320px] bg-[#f6ece0]/12">
        <div
          className="h-px bg-gfp transition-[width] duration-200 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
