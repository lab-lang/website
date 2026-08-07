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
import { PROGRAM_EDGES, PROGRAM_NODES } from '@/data/program-nodes'

type ProgramData = {
  label: string
  kind: string
  color: string
  hasTarget: boolean
  hasSource: boolean
}

function ProgramNode({ data }: NodeProps<Node<ProgramData>>) {
  return (
    <div
      className="flex w-[164px] flex-col gap-1 rounded-[10px] border bg-vessel-raised px-3 py-2.5"
      style={{ borderColor: `${data.color}73` }}
    >
      {data.hasTarget && (
        <Handle
          className="!size-[7px] !border !border-[#f6ece0]/35 !bg-vessel"
          position={Position.Left}
          type="target"
        />
      )}

      <span className="flex items-center gap-2">
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ background: data.color }}
        />
        <span className="micro text-[9px] tracking-[0.11em] text-[#f6ece0]/40">
          {data.kind}
        </span>
      </span>
      <span className="truncate font-mono text-[12px] text-[#f6ece0]">
        {data.label}
      </span>

      {data.hasSource && (
        <Handle
          className="!size-[7px] !border !border-[#f6ece0]/35 !bg-vessel"
          position={Position.Right}
          type="source"
        />
      )}
    </div>
  )
}

const NODE_TYPES = { program: ProgramNode }

const sources = new Set(PROGRAM_EDGES.map((edge) => edge.source))
const targets = new Set(PROGRAM_EDGES.map((edge) => edge.target))

const nodes: Node<ProgramData>[] = PROGRAM_NODES.map((node) => ({
  id: node.id,
  type: 'program',
  position: { x: node.x, y: node.y },
  data: {
    label: node.label,
    kind: node.kind,
    color: node.color,
    hasTarget: targets.has(node.id),
    hasSource: sources.has(node.id),
  },
}))

const edges: Edge[] = PROGRAM_EDGES.map((edge) => ({
  id: `${edge.source}-${edge.target}`,
  source: edge.source,
  target: edge.target,
  label: edge.label || undefined,
  labelStyle: { fill: 'rgba(246,236,224,0.45)', fontSize: 10 },
  labelBgStyle: { fill: '#1d1409' },
  style: { stroke: 'rgba(246,236,224,0.3)', strokeWidth: 1.5 },
}))

export function ProgramGraph() {
  return (
    <div className="flex h-full flex-col px-5 pb-3 pt-3 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-gfp" />
          <span className="micro text-[#f6ece0]/55">Program</span>
        </div>
        <span className="micro text-[#f6ece0]/30">entry point</span>
      </div>

      {/* The graph is drawn wider than a phone, so it pans instead of shrinking. */}
      <div className="rail mt-4 min-h-0 flex-1">
        <div className="h-full min-w-[540px] sm:min-w-0">
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
        one design, one workflow, two outcomes
      </p>
    </div>
  )
}
