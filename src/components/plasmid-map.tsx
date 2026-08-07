import { useId } from 'react'

import {
  CENTER,
  features,
  RING_RADIUS,
  RING_WIDTH,
  TOTAL_BP,
  type Feature,
} from '@/data/plasmid-features'

/** How long one feature takes to sweep from its start angle to its end angle. */
const DRAW_MS = 760
/** Each arc waits on the one before it so the map assembles feature by feature. */
const STAGGER_MS = 110

/**
 * Arcs sharing a token are written by the same line of source and so are
 * revealed together. They stagger against each other rather than against the
 * whole map, which lets the first arc of a group draw the moment its
 * identifier appears.
 */
const STAGGER_ORDER = features.map(
  (feature, index) =>
    index - features.findIndex((other) => other.token === feature.token),
)

/** Tangential reach of the arrowhead past the arc's end point. */
const ARROW_LENGTH = 11
/** Radial spread of the arrowhead either side of the ring. */
const ARROW_HALF_HEIGHT = 8
/** The sweep clears the arrowhead's spread, so it never crops the ring. */
const SWEEP_WIDTH = Math.max(RING_WIDTH, ARROW_HALF_HEIGHT * 2) + 6
/** Slack at both ends so the sweep's own edge never shaves the shape it reveals. */
const SWEEP_BLEED = 2

function degreesForArc(px: number) {
  return (Math.atan(px / RING_RADIUS) * 180) / Math.PI
}

function bpToAngle(bp: number) {
  return (bp / TOTAL_BP) * 360 - 90
}

function polar(radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  }
}

function arcPath(radius: number, fromDegrees: number, toDegrees: number) {
  const from = polar(radius, fromDegrees)
  const to = polar(radius, toDegrees)
  const largeArc = toDegrees - fromDegrees > 180 ? 1 : 0
  return `M ${from.x.toFixed(2)} ${from.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${to.x.toFixed(2)} ${to.y.toFixed(2)}`
}

function arcLength(radius: number, fromDegrees: number, toDegrees: number) {
  return (radius * (toDegrees - fromDegrees) * Math.PI) / 180
}

function FeatureArc({
  feature,
  drawn,
  order,
}: {
  feature: Feature
  drawn: boolean
  /** Place in the stagger among the arcs revealed alongside this one. */
  order: number
}) {
  const sweepId = `sweep-${useId().replace(/:/g, '')}`
  const from = bpToAngle(feature.start)
  const to = bpToAngle(feature.end)
  const mid = (from + to) / 2

  const arrowAnchor = polar(RING_RADIUS, to)
  const leaderStart = polar(RING_RADIUS + 12, mid)
  const leaderEnd = polar(feature.labelRadius, mid)
  const pointsRight = Math.cos((mid * Math.PI) / 180) >= 0
  const elbowX = leaderEnd.x + (pointsRight ? 12 : -12)
  const textX = elbowX + (pointsRight ? 7 : -7)
  const startDelay = order * STAGGER_MS

  /*
   * Body and head are one shape revealed by one travelling edge. The sweep runs
   * on past the arc's end to cover the head, so the head is uncovered a slice at
   * a time as the edge passes over it rather than fading in whole.
   */
  const sweepFrom = from - degreesForArc(SWEEP_BLEED)
  const sweepTo =
    to + degreesForArc((feature.directional ? ARROW_LENGTH : 0) + SWEEP_BLEED)

  return (
    <g>
      <mask
        height="418"
        id={sweepId}
        maskUnits="userSpaceOnUse"
        width="508"
        x="-3"
        y="-4"
      >
        <path
          className="arc-draw"
          d={arcPath(RING_RADIUS, sweepFrom, sweepTo)}
          data-drawn={drawn}
          fill="none"
          stroke="#fff"
          strokeLinecap="butt"
          strokeWidth={SWEEP_WIDTH}
          style={
            {
              '--len': arcLength(RING_RADIUS, sweepFrom, sweepTo),
              '--draw': `${DRAW_MS}ms`,
              transitionDelay: `${startDelay}ms`,
            } as React.CSSProperties
          }
        />
      </mask>

      <g mask={`url(#${sweepId})`}>
        <path
          d={arcPath(RING_RADIUS, from, to)}
          fill="none"
          stroke={feature.color}
          strokeLinecap="butt"
          strokeWidth={RING_WIDTH}
        />
        {feature.directional && (
          <polygon
            fill={feature.color}
            points={`0,-${ARROW_HALF_HEIGHT} ${ARROW_LENGTH},0 0,${ARROW_HALF_HEIGHT}`}
            transform={`translate(${arrowAnchor.x.toFixed(2)} ${arrowAnchor.y.toFixed(2)}) rotate(${(to + 90).toFixed(2)})`}
          />
        )}
      </g>

      <g className="arc-label" data-drawn={drawn}>
        <path
          d={`M ${leaderStart.x.toFixed(2)} ${leaderStart.y.toFixed(2)} L ${leaderEnd.x.toFixed(2)} ${leaderEnd.y.toFixed(2)} L ${elbowX.toFixed(2)} ${leaderEnd.y.toFixed(2)}`}
          fill="none"
          stroke={feature.color}
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        <text
          fill="#f6ece0"
          fontFamily="IBM Plex Mono"
          fontSize="12.5"
          textAnchor={pointsRight ? 'start' : 'end'}
          x={textX.toFixed(2)}
          y={leaderEnd.y - 2}
        >
          {feature.label}
        </text>
        <text
          fill="#f6ece0"
          fillOpacity="0.42"
          fontFamily="Archivo Variable"
          fontSize="8.5"
          letterSpacing="1.1"
          textAnchor={pointsRight ? 'start' : 'end'}
          x={textX.toFixed(2)}
          y={leaderEnd.y + 10}
        >
          {feature.kind.toUpperCase()}
        </text>
      </g>
    </g>
  )
}

function CoordinateTicks() {
  const ticks = Array.from({ length: 8 }, (_, index) => index * 500)

  return (
    <g>
      {ticks.map((bp) => {
        const angle = bpToAngle(bp)
        const inner = polar(RING_RADIUS - 21, angle)
        const outer = polar(RING_RADIUS - 12, angle)
        const labelled = bp % 1000 === 0
        const labelPoint = polar(RING_RADIUS - 33, angle)

        return (
          <g key={bp}>
            <line
              stroke="#f6ece0"
              strokeOpacity={labelled ? 0.34 : 0.16}
              strokeWidth="1"
              x1={inner.x}
              x2={outer.x}
              y1={inner.y}
              y2={outer.y}
            />
            {labelled && (
              <text
                dominantBaseline="middle"
                fill="#f6ece0"
                fillOpacity="0.3"
                fontFamily="IBM Plex Mono"
                fontSize="8"
                textAnchor="middle"
                x={labelPoint.x}
                y={labelPoint.y}
              >
                {bp / 1000}k
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

export function PlasmidMap({
  revealed,
  accepted,
}: {
  /** Identifiers already present in the typed source. */
  revealed: string[]
  /** True once every acceptance claim has been written. */
  accepted: boolean
}) {
  return (
    <svg
      aria-label="Annotated map of the reporter plasmid, showing the pTet promoter, B0034 ribosome binding site, sfGFP coding sequence, B0015 terminator, chloramphenicol resistance marker, and pMB1 origin of replication."
      className="h-full w-full"
      role="img"
      viewBox="-3 -4 508 418"
    >
      <defs>
        <filter height="300%" id="emission" width="300%" x="-100%" y="-100%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* Emission halo: the map is lit as if on a transilluminator. */}
      <circle
        cx={CENTER}
        cy={CENTER}
        fill="none"
        opacity={revealed.includes('sfGFP') ? 0.5 : 0}
        r={RING_RADIUS}
        stroke="var(--color-gfp)"
        strokeWidth="18"
        style={{ filter: 'url(#emission)', transition: 'opacity 900ms ease' }}
      />

      <circle
        cx={CENTER}
        cy={CENTER}
        fill="none"
        r={RING_RADIUS}
        stroke="#f6ece0"
        strokeOpacity="0.13"
        strokeWidth={RING_WIDTH}
      />

      <CoordinateTicks />

      {features.map((feature, index) => (
        <FeatureArc
          drawn={revealed.includes(feature.token)}
          feature={feature}
          key={feature.label}
          order={STAGGER_ORDER[index]}
        />
      ))}

      <text
        fill="#f6ece0"
        fontFamily="Crimson Pro Variable"
        fontSize="27"
        fontWeight="500"
        textAnchor="middle"
        x={CENTER}
        y={CENTER - 2}
      >
        reporter
      </text>
      <text
        fill="#f6ece0"
        fillOpacity="0.45"
        fontFamily="IBM Plex Mono"
        fontSize="11"
        textAnchor="middle"
        x={CENTER}
        y={CENTER + 18}
      >
        4,214 bp · circular
      </text>

      <g
        opacity={accepted ? 1 : 0}
        style={{ transition: 'opacity 500ms ease 200ms' }}
      >
        <rect
          fill="var(--color-gfp)"
          fillOpacity="0.13"
          height="21"
          rx="10.5"
          stroke="var(--color-gfp)"
          strokeOpacity="0.4"
          width="118"
          x={CENTER - 59}
          y={CENTER + 32}
        />
        <text
          fill="var(--color-gfp)"
          fontFamily="IBM Plex Mono"
          fontSize="10"
          textAnchor="middle"
          x={CENTER}
          y={CENTER + 46}
        >
          0 BsaI sites
        </text>
      </g>
    </svg>
  )
}
