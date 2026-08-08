import { useEffect, useRef, useState } from 'react'

import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'
import { useVisible } from '@/lib/use-visible'

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

/*
 * Frame durations double as the CSS transition durations in `Pipette`, so a
 * move or a dip finishes exactly as its frame ends.
 */
const MOVE_MS = 330
const DIP_MS = 220
const MIX_MS = 190

/*
 * A tip is an object, not a state of the mount, so it is never faded into or
 * out of existence. One stands in the rack before the mount reaches it and one
 * falls into the bin after the ejector fires; the mount only ever takes over
 * or lets go of pixels that are already on screen. Both handovers land at the
 * bottom of the dip that causes them, which is the only instant at which the
 * staged, carried and discarded cones occupy the same place.
 */
const HANDOFF_DELAY_MS = DIP_MS
const FALL_MS = 170
const STAGE_FADE_MS = 260

type FrameKind =
  | 'home'
  | 'to-tips'
  | 'pick-tip'
  | 'to-source'
  | 'aspirate'
  | 'to-well'
  | 'dispense'
  | 'to-mix'
  | 'mix-draw'
  | 'mix-blow'
  | 'to-trash'
  | 'drop-tip'
  | 'cycle'

interface Frame {
  kind: FrameKind
  step: number
  /** Rack position of the tip this frame belongs to. */
  tip: number
  ms: number
  /** Reagents already delivered to the reaction well when this frame starts. */
  filled: number
}

/** The rack position the mix takes, after one tip per reagent. */
const MIX_TIP = TRANSFERS.length
const LAST_STEP = TRANSFERS.length - 1

const TIMELINE: Frame[] = [
  { kind: 'home', step: 0, tip: 0, ms: 520, filled: 0 },
]

/*
 * The protocol transfers with `new_tip="always"`, so every reagent gets its own
 * tip: off the rack before the aspirate, into the trash after the dispense.
 */
TRANSFERS.forEach((_, index) => {
  TIMELINE.push(
    { kind: 'to-tips', step: index, tip: index, ms: MOVE_MS, filled: index },
    { kind: 'pick-tip', step: index, tip: index, ms: DIP_MS, filled: index },
    { kind: 'to-source', step: index, tip: index, ms: MOVE_MS, filled: index },
    { kind: 'aspirate', step: index, tip: index, ms: DIP_MS, filled: index },
    { kind: 'to-well', step: index, tip: index, ms: MOVE_MS, filled: index },
    { kind: 'dispense', step: index, tip: index, ms: DIP_MS, filled: index },
    {
      kind: 'to-trash',
      step: index,
      tip: index,
      ms: MOVE_MS,
      filled: index + 1,
    },
    {
      kind: 'drop-tip',
      step: index,
      tip: index,
      ms: DIP_MS,
      filled: index + 1,
    },
  )
})

/** Every frame past the last dispense holds the same step, tip and fill. */
const afterFill = (kind: FrameKind, ms: number): Frame => ({
  kind,
  step: LAST_STEP,
  tip: MIX_TIP,
  ms,
  filled: TRANSFERS.length,
})

/* One more tip mixes the finished reaction before the lid closes. */
TIMELINE.push(
  afterFill('to-tips', MOVE_MS),
  afterFill('pick-tip', DIP_MS),
  afterFill('to-mix', MOVE_MS),
)
for (let stroke = 0; stroke < 3; stroke += 1) {
  TIMELINE.push(afterFill('mix-draw', MIX_MS), afterFill('mix-blow', MIX_MS))
}
TIMELINE.push(
  afterFill('to-trash', MOVE_MS),
  afterFill('drop-tip', DIP_MS),
  afterFill('cycle', 2200),
)

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
const PARK_X = 320

/*
 * Tip rack grid, drawn in the same plan view as the rest of the deck. Only the
 * front row is reachable in a run: the carriage expresses deck position as x
 * alone, so a tip is chosen by column and taken left to right.
 */
const TIPRACK_X0 = 268
const TIPRACK_Y0 = 229
const TIPRACK_COLS = 8
const TIPRACK_ROWS = 3
const TIPRACK_PITCH_X = 8.6
const TIPRACK_PITCH_Y = 11
const TIP_R = 2.3

/** Centre of the trash bin in slot 4. */
const TRASH_X = 518
const TRASH_Y = SLOT_Y + 22

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

/*
 * The tip, drawn hanging from the mount's rest position. One shape serves the
 * rack, the nozzle and the bin, so a cone standing in the rack and a cone on
 * the nozzle at the same depth are the same pixels.
 */
const TIP_TOP_Y = RAIL_Y + 86
const TIP_PATH = `M-6 ${TIP_TOP_Y} h12 l-4 40 h-4 Z`
const TIP_LIQUID_PATH = `M-3.2 ${RAIL_Y + 108} h6.4 l-2.2 16 h-2 Z`

/*
 * The rack's front row and the bin's lip both sit on this line, and a tip below
 * it is inside its labware rather than in front of it. Clipping there is what
 * makes a tip stand in the rack instead of on it, and what lets the bin swallow
 * a dropped one; it also means a tip is lifted out of the rack rather than
 * revealed above it.
 */
const LABWARE_SURFACE_Y = TRASH_Y
const LABWARE_CLIP = 'liquid-handler-labware-surface'

/*
 * The tip rests clear of the deck; each dip reaches the tube or the well. A
 * racked tip stands with only its collar proud, so the mount comes down to meet
 * that collar rather than to the rack floor, and a drop clears the bin lip.
 */
const TIP_REST_Y = RAIL_Y + 126
const TIP_PROUD = 14
const DIP_SOURCE = 245 - TIP_REST_Y
const DIP_WELL = WELL_Y - TIP_REST_Y
const DIP_TIPRACK = LABWARE_SURFACE_Y - TIP_PROUD - TIP_TOP_Y
const DIP_TRASH = TRASH_Y - TIP_REST_Y
/* Clear of the bin's lip, which is where a falling tip stops being visible. */
const TRASH_FALL = DIP_TRASH + 52

/* Shared by the mount and by anything that has to travel locked to it. */
const CARRIAGE_MOTION = `transform ${MOVE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`
const DESCEND_MOTION = `transform ${DIP_MS}ms cubic-bezier(0.55, 0, 0.35, 1)`

function frameGeometry(frame: Frame) {
  const sourceX = SOURCE_X0 + frame.step * SOURCE_GAP
  const tipX = TIPRACK_X0 + frame.tip * TIPRACK_PITCH_X

  switch (frame.kind) {
    case 'home':
      return { x: PARK_X, dy: 0, liquid: 0, mounted: false }
    case 'to-tips':
      return { x: tipX, dy: 0, liquid: 0, mounted: false }
    case 'pick-tip':
      return { x: tipX, dy: DIP_TIPRACK, liquid: 0, mounted: true }
    case 'to-source':
      return { x: sourceX, dy: 0, liquid: 0, mounted: true }
    case 'aspirate':
      return { x: sourceX, dy: DIP_SOURCE, liquid: 1, mounted: true }
    case 'to-well':
      return { x: WELL_X, dy: 0, liquid: 1, mounted: true }
    case 'dispense':
      return { x: WELL_X, dy: DIP_WELL, liquid: 0, mounted: true }
    case 'to-mix':
      return { x: WELL_X, dy: 0, liquid: 0, mounted: true }
    case 'mix-draw':
      return { x: WELL_X, dy: DIP_WELL, liquid: 1, mounted: true }
    case 'mix-blow':
      return { x: WELL_X, dy: DIP_WELL, liquid: 0, mounted: true }
    case 'to-trash':
      return { x: TRASH_X, dy: 0, liquid: 0, mounted: true }
    case 'drop-tip':
      return { x: TRASH_X, dy: DIP_TRASH, liquid: 0, mounted: false }
    case 'cycle':
      return { x: PARK_X, dy: 0, liquid: 0, mounted: false }
  }
}

function frameCaption(frame: Frame): string {
  switch (frame.kind) {
    case 'home':
      return 'p20 single channel · a fresh tip per reagent'
    case 'to-tips':
    case 'pick-tip':
      return 'pick up tip · 20 µL rack'
    case 'to-trash':
    case 'drop-tip':
      return 'drop tip · trash'
    case 'to-mix':
    case 'mix-draw':
    case 'mix-blow':
      return 'mix 3 × 15 µL · A1'
    case 'cycle':
      return '75 cycles · 37 °C 2 min → 16 °C 5 min'
    default: {
      const transfer = TRANSFERS[frame.step]
      return `${transfer.reagent} · ${transfer.volume} µL`
    }
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

function Deck({ cycling, tipsTaken }: { cycling: boolean; tipsTaken: number }) {
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
      {Array.from({ length: TIPRACK_COLS * TIPRACK_ROWS }, (_, index) => {
        const column = index % TIPRACK_COLS
        const row = Math.floor(index / TIPRACK_COLS)
        /* A run works along the front row, emptying a position per tip. */
        const taken = row === 0 && column < tipsTaken
        return (
          <circle
            cx={TIPRACK_X0 + column * TIPRACK_PITCH_X}
            cy={TIPRACK_Y0 + row * TIPRACK_PITCH_Y}
            fill="#f6ece0"
            fillOpacity={taken ? 0.05 : 0.16}
            key={index}
            r={TIP_R}
            style={{ transition: 'fill-opacity 260ms ease' }}
          />
        )
      })}
      <SlotLabel text="TIPS 20 µL" x={264} />

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
 * The tip waiting in the rack. It stands with its collar proud of the front row
 * and the rest of it below the surface clip, which is what a tip in a rack looks
 * like; the mount comes down to meet that collar. It never moves, so the pickup
 * is a hand-over of the pixels it already occupies rather than an appearance.
 */
function StagedTip({ x, visible }: { x: number; visible: boolean }) {
  return (
    <g clipPath={`url(#${LABWARE_CLIP})`}>
      <g
        style={{
          transform: `translate(${x}px, ${DIP_TIPRACK}px)`,
          opacity: visible ? 1 : 0,
          /* Settling in is worth easing; being taken is not, because the
           * carried cone is already covering it by then. */
          transition: visible
            ? `opacity ${STAGE_FADE_MS}ms ease`
            : 'opacity 0s',
        }}
      >
        <path d={TIP_PATH} fill="#eef1ec" fillOpacity=".95" />
      </g>
    </g>
  )
}

/**
 * The tip on the nozzle. It travels locked to the mount rather than parented to
 * it, because it has to be clipped in deck coordinates: that is what draws it
 * up out of the rack on a pickup instead of popping it into view whole.
 */
function CarriedTip({
  x,
  dy,
  liquid,
  mounted,
  color,
}: {
  x: number
  dy: number
  liquid: number
  mounted: boolean
  color: string
}) {
  return (
    <g clipPath={`url(#${LABWARE_CLIP})`}>
      <g
        style={{ transform: `translateX(${x}px)`, transition: CARRIAGE_MOTION }}
      >
        <g
          style={{
            transform: `translateY(${dy}px)`,
            transition: DESCEND_MOTION,
          }}
        >
          <path
            d={TIP_PATH}
            fill="#eef1ec"
            fillOpacity=".95"
            style={{
              /* Instant, and held until the bottom of the dip, where the staged
               * or discarded cone is standing in exactly this place. */
              opacity: mounted ? 1 : 0,
              transition: `opacity 0s linear ${HANDOFF_DELAY_MS}ms`,
            }}
          />
          <path
            d={TIP_LIQUID_PATH}
            fill={color}
            style={{
              opacity: mounted ? liquid : 0,
              transition: 'opacity 200ms ease',
            }}
          />
        </g>
      </g>
    </g>
  )
}

/**
 * The tip the ejector has just let go of. It waits out the run parked below the
 * bin's lip, where the clip hides it, and is placed at the nozzle only for the
 * instant the mount releases it — so the one thing ever seen of it is the fall.
 */
function DiscardedTip({ dropping }: { dropping: boolean }) {
  return (
    <g clipPath={`url(#${LABWARE_CLIP})`}>
      <g
        style={{
          transform: `translate(${TRASH_X}px, ${dropping ? DIP_TRASH : TRASH_FALL}px)`,
          /* Arming is instant and happens while parked out of sight; only the
           * fall is animated. It never decelerates, because nothing catches a
           * dropped tip: it clears the lip already gaining speed. */
          transition: dropping
            ? `transform 0s linear ${HANDOFF_DELAY_MS}ms`
            : `transform ${FALL_MS}ms cubic-bezier(0.5, 0, 1, 1)`,
        }}
      >
        <path d={TIP_PATH} fill="#eef1ec" fillOpacity=".95" />
      </g>
    </g>
  )
}

/**
 * The carriage rides the rail and never leaves it. Only the pipette head
 * descends, with the mount shaft telescoping to follow it. Each segment is
 * drawn before the one that caps it — shaft under carriage, neck under head —
 * so no rounded end is ever left showing at a joint.
 *
 * The machine ends at the nozzle. Tips are consumables and are drawn outside it.
 */
function Pipette({ x, dy }: { x: number; dy: number }) {
  return (
    <g style={{ transform: `translateX(${x}px)`, transition: CARRIAGE_MOTION }}>
      <rect
        fill="#8f9c94"
        height={18 + dy}
        rx="2"
        style={{
          transition: `height ${DIP_MS}ms cubic-bezier(0.55, 0, 0.35, 1)`,
        }}
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

      <g
        style={{ transform: `translateY(${dy}px)`, transition: DESCEND_MOTION }}
      >
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
      </g>
    </g>
  )
}

export function LiquidHandler() {
  const reducedMotion = usePrefersReducedMotion()
  const { ref, visible } = useVisible<HTMLDivElement>()
  const [index, setIndex] = useState(0)
  /* Where the run stands, surviving the effect teardown while off screen. */
  const indexRef = useRef(0)

  /* The deck runs only while watched: freeze on leave, resume on re-entry. */
  useEffect(() => {
    if (reducedMotion || !visible) return

    let cancelled = false
    let timer = 0

    const advance = (current: number) => {
      timer = window.setTimeout(() => {
        if (cancelled) return
        const next = (current + 1) % TIMELINE.length
        indexRef.current = next
        setIndex(next)
        advance(next)
      }, TIMELINE[current].ms)
    }

    advance(indexRef.current)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [reducedMotion, visible])

  const frame = reducedMotion ? TIMELINE[TIMELINE.length - 1] : TIMELINE[index]
  const geometry = frameGeometry(frame)
  const transfer = TRANSFERS[frame.step]
  const cycling = frame.kind === 'cycle'
  const caption = frameCaption(frame)

  /* The frames before a pickup still name the tip they are on their way to. */
  const staging =
    frame.kind === 'home' ||
    frame.kind === 'to-tips' ||
    frame.kind === 'pick-tip'
  const tipsTaken =
    frame.kind === 'home' || frame.kind === 'to-tips'
      ? frame.tip
      : frame.tip + 1

  return (
    <div className="flex h-full flex-col" ref={ref}>
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
          aria-label="An Opentrons OT-2 liquid handler adds each reagent of a Golden Gate assembly to reaction well A1, taking a fresh tip from the rack for every one and dropping it in the trash afterwards, mixes the finished reaction, then runs the thermocycler profile."
          className="h-full w-full min-w-[600px] sm:min-w-0"
          role="img"
          viewBox="0 0 640 300"
        >
          <defs>
            {/*
             * Everything above the labware surface, plus everything to either
             * side of the rack and the bin, where there is no labware for a tip
             * to be inside of. What is left out is a tip below the rack's front
             * row or below the bin's lip.
             */}
            <clipPath id={LABWARE_CLIP}>
              <rect height={LABWARE_SURFACE_Y} width="640" x="0" y="0" />
              <rect height="300" width="256" x="0" y={LABWARE_SURFACE_Y} />
              <rect height="300" width="120" x="344" y={LABWARE_SURFACE_Y} />
              <rect height="300" width="68" x="572" y={LABWARE_SURFACE_Y} />
            </clipPath>
          </defs>

          <Deck cycling={cycling} tipsTaken={tipsTaken} />

          <StagedTip
            visible={staging}
            x={TIPRACK_X0 + frame.tip * TIPRACK_PITCH_X}
          />
          <DiscardedTip dropping={frame.kind === 'drop-tip'} />

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

          <CarriedTip
            color={transfer.color}
            dy={geometry.dy}
            liquid={geometry.liquid}
            mounted={geometry.mounted}
            x={geometry.x}
          />
          <Pipette dy={geometry.dy} x={geometry.x} />
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
