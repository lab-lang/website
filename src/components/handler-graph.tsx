import { ArrowRight, Hourglass, Repeat } from 'lucide-react'

import { HANDLERS } from '@/data/reactive-handlers'

const ICONS = {
  interval: Repeat,
  deadline: Hourglass,
}

/**
 * The shape of `grow_colonies`: two handlers racing, and the two cases they
 * can settle into. The reactive section further down the page plays a run of
 * this workflow out over time; here it is the structure, which is what the
 * file on the left declares.
 */
export function HandlerGraph() {
  return (
    <div className="flex h-full flex-col px-5 pb-3 pt-3 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-amber" />
          <span className="micro text-[#f6ece0]/55">Reactive</span>
        </div>
        <span className="micro text-[#f6ece0]/30">grow_colonies</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 pt-3 sm:gap-3 sm:pt-5">
        {HANDLERS.map((handler) => {
          const Icon = ICONS[handler.kind]
          return (
            <div
              className="rounded-[10px] border bg-vessel-raised px-3 py-2.5"
              key={handler.id}
              style={{ borderColor: `${handler.color}73` }}
            >
              <div className="flex items-center gap-2">
                <Icon
                  aria-hidden="true"
                  size={12}
                  style={{ color: handler.color }}
                />
                <span className="truncate font-mono text-[12px] text-[#f6ece0]">
                  {handler.clause}
                </span>
              </div>

              <ul className="mt-1.5 space-y-0.5">
                {handler.body.map((line) => (
                  <li
                    className="truncate pl-5 font-mono text-[10.5px] text-[#f6ece0]/40"
                    key={line}
                  >
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex items-center gap-1.5 pl-5">
                <span className="truncate font-mono text-[10.5px] text-[#f6ece0]/45">
                  {handler.condition}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="shrink-0 text-[#f6ece0]/30"
                  size={11}
                />
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[10.5px]"
                  style={{
                    color: handler.color,
                    background: `${handler.color}24`,
                  }}
                >
                  {handler.exit}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <p className="truncate pt-2 font-mono text-[11px] text-[#f6ece0]/45">
        two handlers, whichever fires first wins
      </p>
    </div>
  )
}
