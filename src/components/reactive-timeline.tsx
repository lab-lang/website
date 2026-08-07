import { useEffect, useState } from 'react'

import {
  CHART_MAX,
  COLONY_COUNTS,
  HOLD_MS,
  LAG_END_INDEX,
  RESOLVED_INDEX,
  STEP_HOURS,
  STEP_MS,
  THRESHOLD,
  TOTAL_HOURS,
} from '@/data/reactive-timeline'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'
import { useVisible } from '@/lib/use-visible'

/*
 * Two chart geometries. The regular one is drawn for the wide desktop pane;
 * the compact one fits a phone whole, because the 18 h deadline and the
 * resolution are the section's argument and neither may sit off-canvas.
 */
const GEOMETRIES = {
  regular: {
    VIEW_BOX: '0 0 520 380',
    AXIS_X0: 60,
    AXIS_X1: 470,
    AXIS_Y: 300,
    CHART_TOP: 66,
    MAJOR_HOURS: [0, 3, 6, 9, 12, 15, 18],
    MINOR_STEP: 1,
  },
  compact: {
    VIEW_BOX: '0 0 375 340',
    AXIS_X0: 44,
    AXIS_X1: 345,
    AXIS_Y: 272,
    CHART_TOP: 56,
    MAJOR_HOURS: [0, 6, 12, 18],
    MINOR_STEP: 2,
  },
}

function useCompact() {
  const [compact, setCompact] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(max-width: 40rem)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(max-width: 40rem)')
    const update = () => setCompact(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return compact
}

export function ReactiveTimeline() {
  const reducedMotion = usePrefersReducedMotion()
  const { ref, visible } = useVisible<HTMLDivElement>()
  const compact = useCompact()
  const [index, setIndex] = useState(
    reducedMotion ? RESOLVED_INDEX : LAG_END_INDEX,
  )
  /* The replay swap hides behind a deliberate blink rather than a snap. */
  const [resetting, setResetting] = useState(false)

  /*
   * The loop plays only while watched, and replays from the end of the lag
   * phase on every entry, so the viewer always gets the full arc without
   * sitting through the flat zero line.
   */
  useEffect(() => {
    if (reducedMotion || !visible) return

    let cancelled = false
    let timer = 0
    let blink = 0

    function schedule(current: number) {
      const delay = current >= RESOLVED_INDEX ? HOLD_MS : STEP_MS
      timer = window.setTimeout(() => {
        if (cancelled) return
        if (current >= RESOLVED_INDEX) {
          setResetting(true)
          setIndex(LAG_END_INDEX)
          blink = window.setTimeout(() => {
            if (!cancelled) setResetting(false)
          }, 150)
          schedule(LAG_END_INDEX)
        } else {
          setIndex(current + 1)
          schedule(current + 1)
        }
      }, delay)
    }

    /* The rewind is the playback's first frame, not a render side effect. */
    const begin = window.setTimeout(() => {
      if (cancelled) return
      setIndex(LAG_END_INDEX)
      setResetting(false)
      schedule(LAG_END_INDEX)
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(begin)
      window.clearTimeout(timer)
      window.clearTimeout(blink)
    }
  }, [reducedMotion, visible])

  const {
    VIEW_BOX,
    AXIS_X0,
    AXIS_X1,
    AXIS_Y,
    CHART_TOP,
    MAJOR_HOURS,
    MINOR_STEP,
  } = compact ? GEOMETRIES.compact : GEOMETRIES.regular

  const minorHours = Array.from(
    { length: TOTAL_HOURS / MINOR_STEP + 1 },
    (_, i) => i * MINOR_STEP,
  )

  const hourToX = (hours: number) =>
    AXIS_X0 + (hours / TOTAL_HOURS) * (AXIS_X1 - AXIS_X0)

  const countToY = (count: number) =>
    AXIS_Y - (count / CHART_MAX) * (AXIS_Y - CHART_TOP)

  /** A staircase: the count only moves at a firing of `when every 30 min`. */
  function stepPath(uptoIndex: number) {
    let d = `M ${hourToX(0)} ${countToY(COLONY_COUNTS[0])} `
    for (let i = 0; i < uptoIndex; i++) {
      d += `H ${hourToX((i + 1) * STEP_HOURS)} `
      d += `V ${countToY(COLONY_COUNTS[i + 1])} `
    }
    return d
  }

  const resolved = index >= RESOLVED_INDEX
  const count = COLONY_COUNTS[index]
  const hour = index * STEP_HOURS
  const readyX = hourToX(RESOLVED_INDEX * STEP_HOURS)
  const readyY = countToY(THRESHOLD)

  return (
    <div className="flex h-full flex-col" ref={ref}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span
            className="size-1.5 rounded-full"
            style={{
              background: resolved ? 'var(--color-gfp)' : 'var(--color-amber)',
            }}
          />
          <span className="micro text-[#f6ece0]/55">
            {resolved ? 'Resolved' : 'Watching the plate'}
          </span>
        </div>
        <span className="micro text-[#f6ece0]/45">await_colonies</span>
      </div>

      <div className="min-h-0 flex-1">
        <svg
          aria-label="A timeline of the await_colonies workflow checking a plate every 30 minutes. Isolated colonies climb toward a threshold of 8, and the workflow resolves to Ready at 11.5 hours, well before its 18-hour deadline."
          className="h-full w-full"
          role="img"
          viewBox={VIEW_BOX}
        >
          {minorHours.map((h) => {
            const major = MAJOR_HOURS.includes(h)
            const x = hourToX(h)
            return (
              <g key={h}>
                <line
                  stroke="#f6ece0"
                  strokeOpacity={major ? 0.28 : 0.12}
                  strokeWidth="1"
                  x1={x}
                  x2={x}
                  y1={AXIS_Y}
                  y2={AXIS_Y + (major ? 8 : 4)}
                />
                {major && (
                  <text
                    fill="#f6ece0"
                    fillOpacity="0.32"
                    fontFamily="IBM Plex Mono"
                    fontSize="11.5"
                    textAnchor="middle"
                    x={x}
                    y={AXIS_Y + 24}
                  >
                    {h}h
                  </text>
                )}
              </g>
            )
          })}

          <line
            stroke="#f6ece0"
            strokeOpacity="0.2"
            strokeWidth="1"
            x1={AXIS_X0}
            x2={AXIS_X1}
            y1={AXIS_Y}
            y2={AXIS_Y}
          />

          {/* when after 18 h gives up, if nothing crossed the threshold first. */}
          <line
            stroke="var(--color-mcherry)"
            strokeDasharray="2 3"
            strokeOpacity="0.45"
            strokeWidth="1"
            x1={AXIS_X1}
            x2={AXIS_X1}
            y1={CHART_TOP}
            y2={AXIS_Y}
          />
          <text
            fill="var(--color-mcherry)"
            fillOpacity="0.55"
            fontFamily="IBM Plex Mono"
            fontSize="11.5"
            textAnchor="end"
            x={AXIS_X1 - 4}
            y={CHART_TOP - 8}
          >
            18h · give up
          </text>

          {/* when colonies.isolated.count >= 8 resolves early. */}
          <line
            stroke="var(--color-gfp)"
            strokeDasharray="2 3"
            strokeOpacity="0.4"
            strokeWidth="1"
            x1={AXIS_X0}
            x2={AXIS_X1}
            y1={countToY(THRESHOLD)}
            y2={countToY(THRESHOLD)}
          />
          <text
            fill="var(--color-gfp)"
            fillOpacity="0.55"
            fontFamily="IBM Plex Mono"
            fontSize="11.5"
            x={AXIS_X0 + 4}
            y={countToY(THRESHOLD) - 7}
          >
            8 isolated
          </text>

          <g
            style={{
              opacity: resetting ? 0 : 1,
              transition: 'opacity 150ms ease',
            }}
          >
            <path
              d={stepPath(index)}
              fill="none"
              stroke="var(--color-gfp)"
              strokeLinejoin="round"
              strokeWidth="1.75"
            />

            {Array.from({ length: index + 1 }, (_, i) => i).map((i) => (
              <circle
                cx={hourToX(i * STEP_HOURS)}
                cy={countToY(COLONY_COUNTS[i])}
                fill="var(--color-gfp)"
                key={i}
                opacity={i === index ? 1 : 0.55}
                r={i === index ? 3.4 : 2}
              />
            ))}

            {/* The playhead: each firing is a capture, a durable effect. */}
            {!resolved && (
              <line
                stroke="var(--color-amber)"
                strokeOpacity="0.55"
                strokeWidth="1"
                x1={hourToX(hour)}
                x2={hourToX(hour)}
                y1={CHART_TOP}
                y2={AXIS_Y}
              />
            )}

            <g
              opacity={resolved ? 1 : 0}
              style={{ transition: 'opacity 500ms ease 200ms' }}
            >
              <rect
                fill="var(--color-gfp)"
                fillOpacity="0.14"
                height="24"
                rx="12"
                stroke="var(--color-gfp)"
                strokeOpacity="0.5"
                width="164"
                x={readyX - 82}
                y={readyY - 40}
              />
              <text
                fill="var(--color-gfp)"
                fontFamily="IBM Plex Mono"
                fontSize="12"
                textAnchor="middle"
                x={readyX}
                y={readyY - 23}
              >
                Ready · 8 isolated
              </text>
            </g>
          </g>
        </svg>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pb-4 sm:px-6">
        <span className="font-mono text-[11px] text-[#f6ece0]/55">
          {hour}h elapsed
        </span>
        <span className="font-mono text-[11px] text-[#f6ece0]/45">
          {count}/{THRESHOLD} isolated colonies
        </span>
      </div>
    </div>
  )
}
