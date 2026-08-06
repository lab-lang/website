import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { CIRCUIT_PARTS } from '../data/circuit-parts'

/**
 * SBOL Visual glyph geometry (SynBioDex/SBOL-visual, CC0) on the standard 45×45
 * viewBox, stroked so each part takes its own colour.
 */
function Glyph({ kind, color }: { kind: string; color: string }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="34"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      viewBox="0 0 45 45"
      width="34"
    >
      {kind === 'promoter' && (
        <>
          <path d="M7.5 39.75 v-27 h29" />
          <path d="M29 5.25 l8.5 7.5 l-8.5 7.33" />
        </>
      )}
      {kind === 'rbs' && <path d="M6.5 33 a16 16 0 0 1 32 0" />}
      {kind === 'cds' && (
        <path
          d="M5.26 33.9 H28.87 L39.75 22.5 L28.87 11.1 H5.26 Z"
          fill={color}
          fillOpacity="0.16"
        />
      )}
      {kind === 'terminator' && <path d="M22.5 34 V14 M8 14 H37" />}
    </svg>
  )
}

type PartData = {
  slot: string
  name: string
  role: string
  glyph: string
  color: string
  generic: boolean
  first: boolean
  last: boolean
}

function PartNode({ data }: NodeProps<Node<PartData>>) {
  return (
    <div
      className="flex w-[118px] flex-col items-center gap-1 rounded-[10px] border bg-vessel-raised px-2 pb-2 pt-2.5"
      style={{ borderColor: `${data.color}73` }}
    >
      {!data.first && (
        <Handle
          className="!size-[7px] !border !border-[#f6ece0]/35 !bg-vessel"
          position={Position.Left}
          type="target"
        />
      )}

      <Glyph color={data.color} kind={data.glyph} />

      <span className="font-mono text-[12px] leading-tight text-[#f6ece0]">
        {data.name}
      </span>
      <span className="micro text-[9px] tracking-[0.11em] text-[#f6ece0]/40">
        {data.role}
      </span>
      {/* Generic slots are named by the circuit; concrete parts name themselves. */}
      <span className="font-mono text-[9px] leading-3 text-[#f6ece0]/25">
        {data.generic ? data.slot : ''}
      </span>

      {!data.last && (
        <Handle
          className="!size-[7px] !border !border-[#f6ece0]/35 !bg-vessel"
          position={Position.Right}
          type="source"
        />
      )}
    </div>
  )
}

const NODE_TYPES = { part: PartNode }

const nodes: Node<PartData>[] = CIRCUIT_PARTS.map((part, index) => ({
  id: part.slot,
  type: 'part',
  position: { x: index * 172, y: 0 },
  data: {
    ...part,
    first: index === 0,
    last: index === CIRCUIT_PARTS.length - 1,
  },
}))

const edges: Edge[] = CIRCUIT_PARTS.slice(0, -1).map((part, index) => ({
  id: `${part.slot}-${CIRCUIT_PARTS[index + 1].slot}`,
  source: part.slot,
  target: CIRCUIT_PARTS[index + 1].slot,
  style: { stroke: 'rgba(246,236,224,0.3)', strokeWidth: 1.5 },
}))

export function CircuitGraph() {
  return (
    <div className="flex h-full flex-col px-5 pb-3 pt-3 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-gfp" />
          <span className="micro text-[#f6ece0]/55">Circuit</span>
        </div>
        <span className="micro truncate text-[#f6ece0]/30">
          regulated_expression
        </span>
      </div>

      {/* The chain is drawn wider than a phone, so it pans instead of shrinking. */}
      <div className="rail mt-4 min-h-0 flex-1">
        <div className="h-full min-w-[560px] sm:min-w-0">
          <ReactFlow
            colorMode="dark"
            edges={edges}
            elementsSelectable={false}
            fitView
            fitViewOptions={{ padding: 0.16, maxZoom: 1 }}
            nodes={nodes}
            nodeTypes={NODE_TYPES}
            nodesConnectable={false}
            nodesDraggable={false}
            panOnDrag={false}
            panOnScroll={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            zoomOnScroll={false}
          >
            <Background
              color="rgba(246,236,224,0.16)"
              gap={16}
              size={1}
              variant={BackgroundVariant.Dots}
            />
          </ReactFlow>
        </div>
      </div>

      <p className="truncate pt-2 font-mono text-[11px] text-[#f6ece0]/45">
        layout: promoter · B0034 · coding · B0015
      </p>
    </div>
  )
}
