import { useEffect, useState } from 'react'

import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

/**
 * The reagents, volumes, and thermocycler profile below are the ones the
 * Opentrons OT-2 backend emits for a Golden Gate assembly, in the order the
 * generated protocol adds them.
 */
const TRANSFERS = [
  { reagent: 'nuclease-free water', volume: 8, color: '#7fd4e2' },
  { reagent: 'T4 DNA ligase buffer', volume: 2, color: '#f2b95c' },
  { reagent: 'T4 DNA ligase', volume: 4, color: '#e2cf9c' },
  { reagent: 'BsmBI', volume: 2, color: '#e8446c' },
  { reagent: 'part_receiver backbone', volume: 2, color: '#cbb59c' },
  { reagent: 'J23101', volume: 2, color: '#93e03f' },
]

type FrameKind =
  'home' | 'to-source' | 'aspirate' | 'to-well' | 'dispense' | 'cycle'

interface Frame {
  kind: FrameKind
  step: number
  ms: number
  /** Reagents already delivered to the reaction well when this frame starts. */
  filled: number
}

const TIMELINE: Frame[] = [{ kind: 'home', step: 0, ms: 700, filled: 0 }]
TRANSFERS.forEach((_, index) => {
  TIMELINE.push(
    { kind: 'to-source', step: index, ms: 430, filled: index },
    { kind: 'aspirate', step: index, ms: 300, filled: index },
    { kind: 'to-well', step: index, ms: 470, filled: index },
    { kind: 'dispense', step: index, ms: 300, filled: index },
  )
})
TIMELINE.push({
  kind: 'cycle',
  step: TRANSFERS.length - 1,
  ms: 2800,
  filled: TRANSFERS.length,
})

/*
 * Deck geometry. Every station derives from these constants so labware stays
 * inside its slot and the carriage stays over the rail.
 */
const DECK_X0 = 56
const DECK_W = 528
const DECK_Y = 190
const DECK_H = 96
const SLOT_Y = 206
const SLOT_H = 74

/*
 * Gantry frame. Two uprights flank the deck and carry the rail beam. The frame
 * is a single path, so the beam meets each upright on a continuous edge rather
 * than as two shapes stacked on one another, and the uprights run behind the
 * deck plate so the deck seats into the frame.
 */
const RAIL_Y = 44
const RAIL_TOP = RAIL_Y - 8
const RAIL_BOTTOM = RAIL_Y + 6
const GANTRY_X0 = 44
const GANTRY_X1 = 596
const POST_W = 16
const FRAME_BOTTOM = DECK_Y + DECK_H
/* Outer corners are lightly broken; the inside of each shoulder is filleted so
 * the beam flows into the upright instead of butting against it. */
const FRAME_R = 5
const FRAME_FOOT_R = 4
const SHOULDER_R = 8

const GANTRY_PATH = [
  `M${GANTRY_X0 + FRAME_R} ${RAIL_TOP}`,
  `H${GANTRY_X1 - FRAME_R}`,
  `a${FRAME_R} ${FRAME_R} 0 0 1 ${FRAME_R} ${FRAME_R}`,
  `V${FRAME_BOTTOM - FRAME_FOOT_R}`,
  `a${FRAME_FOOT_R} ${FRAME_FOOT_R} 0 0 1 -${FRAME_FOOT_R} ${FRAME_FOOT_R}`,
  `H${GANTRY_X1 - POST_W}`,
  `V${RAIL_BOTTOM + SHOULDER_R}`,
  `a${SHOULDER_R} ${SHOULDER_R} 0 0 0 -${SHOULDER_R} -${SHOULDER_R}`,
  `H${GANTRY_X0 + POST_W + SHOULDER_R}`,
  `a${SHOULDER_R} ${SHOULDER_R} 0 0 0 -${SHOULDER_R} ${SHOULDER_R}`,
  `V${FRAME_BOTTOM}`,
  `H${GANTRY_X0 + FRAME_FOOT_R}`,
  `a${FRAME_FOOT_R} ${FRAME_FOOT_R} 0 0 1 -${FRAME_FOOT_R} -${FRAME_FOOT_R}`,
  `V${RAIL_TOP + FRAME_R}`,
  `a${FRAME_R} ${FRAME_R} 0 0 1 ${FRAME_R} -${FRAME_R}`,
  'Z',
].join(' ')

const SOURCE_X0 = 96
const SOURCE_GAP = 26
const TUBE_Y = 230
const TIPRACK_X = 300
const PARK_X = 320

/*
 * Reaction plate footprint. Square well pitch, as on real 96-well labware, and
 * seated below the slot label so the label stays readable.
 */
const PLATE_X = 364
const PLATE_Y = 215
const PLATE_W = 80
const PLATE_H = 56
const COLUMNS = 12
const ROWS = 8
const WELL_R = 1.9
/* Outer wells are inset from the plate edge, as on real labware. */
const PLATE_MARGIN = 7
const PITCH_X = (PLATE_W - PLATE_MARGIN * 2) / (COLUMNS - 1)
const PITCH_Y = (PLATE_H - PLATE_MARGIN * 2) / (ROWS - 1)
/* Centre of well A1. */
const WELL_X = PLATE_X + PLATE_MARGIN
const WELL_Y = PLATE_Y + PLATE_MARGIN

/* The tip rests clear of the deck; each dip reaches the tube or the well. */
const TIP_REST_Y = RAIL_Y + 126
const DIP_SOURCE = 245 - TIP_REST_Y
const DIP_WELL = WELL_Y - TIP_REST_Y

function frameGeometry(frame: Frame) {
  const sourceX = SOURCE_X0 + frame.step * SOURCE_GAP

  switch (frame.kind) {
    case 'home':
      return { x: TIPRACK_X, dy: 0, liquid: 0 }
    case 'to-source':
      return { x: sourceX, dy: 0, liquid: 0 }
    case 'aspirate':
      return { x: sourceX, dy: DIP_SOURCE, liquid: 1 }
    case 'to-well':
      return { x: WELL_X, dy: 0, liquid: 1 }
    case 'dispense':
      return { x: WELL_X, dy: DIP_WELL, liquid: 0 }
    case 'cycle':
      return { x: PARK_X, dy: 0, liquid: 0 }
  }
}

function SlotLabel({ x, text }: { x: number; text: string }) {
  return (
    <text
      fill="#f6ece0"
      fillOpacity=".36"
      fontFamily="IBM Plex Mono"
      fontSize="7"
      letterSpacing="0.9"
      x={x}
      y={SLOT_Y - 5}
    >
      {text}
    </text>
  )
}

/**
 * The frame renders before the deck plate so the deck occludes the feet of
 * both uprights: the metal reads as continuous behind the plate instead of
 * ending in two rounded stubs on top of it. It carries the same flat fill and
 * hairline stroke as the deck and its slots, so it sits in the illustration
 * rather than looking rendered on top of it.
 */
function Gantry() {
  return (
    <path d={GANTRY_PATH} fill="#6f7d74" stroke="#f6ece0" strokeOpacity=".14" />
  )
}

function Deck({ cycling }: { cycling: boolean }) {
  return (
    <g>
      <Gantry />

      <rect
        fill="#2a1d10"
        height={DECK_H}
        rx="12"
        stroke="#f6ece0"
        strokeOpacity=".12"
        width={DECK_W}
        x={DECK_X0}
        y={DECK_Y}
      />

      {/* Slot 1 — temperature module holding the source tubes at 4 °C. */}
      <rect
        fill="#20160c"
        height={SLOT_H}
        rx="7"
        stroke="#f6ece0"
        strokeOpacity=".14"
        width="176"
        x="68"
        y={SLOT_Y}
      />
      <SlotLabel text="TEMP MODULE · 4 °C" x={76} />
      {TRANSFERS.map((transfer, index) => {
        const cx = SOURCE_X0 + index * SOURCE_GAP
        return (
          <g key={transfer.reagent}>
            <rect
              fill="#0f0a05"
              height="26"
              rx="3"
              stroke="#f6ece0"
              strokeOpacity=".18"
              width="15"
              x={cx - 7.5}
              y={TUBE_Y}
            />
            <rect
              fill={transfer.color}
              fillOpacity=".85"
              height="14"
              rx="2"
              width="11"
              x={cx - 5.5}
              y={TUBE_Y + 10}
            />
          </g>
        )
      })}

      {/* Slot 2 — 20 µL tip rack. */}
      <rect
        fill="#20160c"
        height={SLOT_H}
        rx="7"
        stroke="#f6ece0"
        strokeOpacity=".14"
        width="88"
        x="256"
        y={SLOT_Y}
      />
      <SlotLabel text="TIPS 20 µL" x={264} />
      {Array.from({ length: 24 }, (_, index) => (
        <circle
          cx={268 + (index % 8) * 8.6}
          cy={229 + Math.floor(index / 8) * 11}
          fill="#f6ece0"
          fillOpacity=".16"
          key={index}
          r="2.3"
        />
      ))}

      {/* Slot 3 — thermocycler holding the 96-well reaction plate. */}
      <rect
        fill="#20160c"
        height={SLOT_H}
        rx="7"
        stroke="#f6ece0"
        strokeOpacity=".14"
        width="96"
        x="356"
        y={SLOT_Y}
      />
      <SlotLabel text="THERMOCYCLER" x={362} />
      <rect
        fill="#170f07"
        height={PLATE_H}
        rx="3"
        stroke="#f6ece0"
        strokeOpacity=".12"
        width={PLATE_W}
        x={PLATE_X}
        y={PLATE_Y}
      />
      {Array.from({ length: COLUMNS * ROWS }, (_, index) => (
        <circle
          cx={WELL_X + (index % COLUMNS) * PITCH_X}
          cy={WELL_Y + Math.floor(index / COLUMNS) * PITCH_Y}
          fill="#f6ece0"
          fillOpacity=".1"
          key={index}
          r={WELL_R}
        />
      ))}

      {/* Thermocycling warms the whole plate rather than ringing one well. */}
      <rect
        fill="var(--color-amber)"
        height={PLATE_H}
        opacity={cycling ? 0.24 : 0}
        rx="3"
        stroke="var(--color-amber)"
        strokeOpacity={cycling ? 0.8 : 0}
        style={{ transition: 'opacity 420ms ease' }}
        width={PLATE_W}
        x={PLATE_X}
        y={PLATE_Y}
      />
      {/* Slot 4 — the fixed trash bin every OT-2 deck carries. */}
      <rect
        fill="#20160c"
        height={SLOT_H}
        rx="7"
        stroke="#f6ece0"
        strokeOpacity=".14"
        width="108"
        x="464"
        y={SLOT_Y}
      />
      <SlotLabel text="TRASH" x={472} />
      <rect
        fill="#0f0a05"
        rx="4"
        stroke="#f6ece0"
        strokeOpacity=".12"
        height="30"
        width="84"
        x="476"
        y={SLOT_Y + 22}
      />
    </g>
  )
}

/**
 * The carriage rides the rail and never leaves it. Only the pipette head
 * descends, with the mount shaft telescoping to follow it. Each segment is
 * drawn before the one that caps it — shaft under carriage, neck under head —
 * so no rounded end is ever left showing at a joint.
 */
function Pipette({
  x,
  dy,
  liquid,
  color,
}: {
  x: number
  dy: number
  liquid: number
  color: string
}) {
  const descend = 'transform 290ms cubic-bezier(0.55, 0, 0.35, 1)'

  return (
    <g
      style={{
        transform: `translateX(${x}px)`,
        transition: 'transform 430ms cubic-bezier(0.65, 0, 0.35, 1)',
      }}
    >
      <rect
        fill="#8f9c94"
        height={18 + dy}
        rx="2"
        style={{ transition: 'height 290ms cubic-bezier(0.55, 0, 0.35, 1)' }}
        width="10"
        x="-5"
        y={RAIL_Y + 12}
      />

      <rect
        fill="#e6eae4"
        height="32"
        rx="6"
        stroke="#7d8c82"
        width="60"
        x="-30"
        y={RAIL_Y - 13}
      />
      <circle cx="-19" cy={RAIL_Y + 3} fill="var(--color-gfp)" r="3" />

      <g style={{ transform: `translateY(${dy}px)`, transition: descend }}>
        <rect
          fill="#7d8c82"
          height="22"
          rx="2"
          width="6"
          x="-3"
          y={RAIL_Y + 64}
        />
        <rect
          fill="#c3ccc5"
          height="38"
          rx="4"
          width="22"
          x="-11"
          y={RAIL_Y + 30}
        />
        <path
          d={`M-6 ${RAIL_Y + 86} h12 l-4 40 h-4 Z`}
          fill="#eef1ec"
          fillOpacity=".95"
        />
        <path
          d={`M-3.2 ${RAIL_Y + 108} h6.4 l-2.2 16 h-2 Z`}
          fill={color}
          style={{ opacity: liquid, transition: 'opacity 220ms ease' }}
        />
      </g>
    </g>
  )
}

export function LiquidHandler() {
  const reducedMotion = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion) return

    let cancelled = false
    let timer = 0

    const advance = (current: number) => {
      timer = window.setTimeout(() => {
        if (cancelled) return
        const next = (current + 1) % TIMELINE.length
        setIndex(next)
        advance(next)
      }, TIMELINE[current].ms)
    }

    advance(0)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [reducedMotion])

  const frame = reducedMotion ? TIMELINE[TIMELINE.length - 1] : TIMELINE[index]
  const geometry = frameGeometry(frame)
  const transfer = TRANSFERS[frame.step]
  const cycling = frame.kind === 'cycle'

  const caption = cycling
    ? '75 cycles · 37 °C 2 min → 16 °C 5 min'
    : frame.kind === 'home'
      ? 'pick up tip · p20 single channel'
      : `${transfer.reagent} · ${transfer.volume} µL`

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-3">
        <div className="flex items-center gap-2">
          <span
            className="size-1.5 rounded-full"
            style={{
              background: cycling ? 'var(--color-amber)' : 'var(--color-gfp)',
            }}
          />
          <span className="micro text-[#f6ece0]/55">
            {cycling ? 'Thermocycling' : 'Golden Gate assembly'}
          </span>
        </div>
        <span className="micro text-[#f6ece0]/30">opentrons ot-2</span>
      </div>

      {/* A deck is wider than a phone, so it pans instead of shrinking. */}
      <div className="rail min-h-0 flex-1">
        <svg
          aria-label="An Opentrons OT-2 liquid handler adds each reagent of a Golden Gate assembly to reaction well A1, then runs the thermocycler profile."
          className="h-full w-full min-w-[600px] sm:min-w-0"
          role="img"
          viewBox="0 0 640 300"
        >
          <Deck cycling={cycling} />

          {/* Well A1, taking on the colour of the last reagent delivered. */}
          <circle
            cx={WELL_X}
            cy={WELL_Y}
            fill={
              frame.filled === 0
                ? '#f6ece0'
                : TRANSFERS[Math.min(frame.filled, TRANSFERS.length) - 1].color
            }
            fillOpacity={frame.filled === 0 ? 0.1 : 1}
            r={frame.filled === 0 ? WELL_R : WELL_R + 0.6}
            style={{ transition: 'r 260ms ease, fill 260ms ease' }}
          />

          <Pipette
            color={transfer.color}
            dy={geometry.dy}
            liquid={geometry.liquid}
            x={geometry.x}
          />
        </svg>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pb-3">
        <span className="min-w-0 truncate font-mono text-[11px] text-[#f6ece0]/55">
          {caption}
        </span>
        <span className="shrink-0 font-mono text-[11px] text-[#f6ece0]/30">
          {frame.filled}/{TRANSFERS.length} · A1
        </span>
      </div>
    </div>
  )
}
