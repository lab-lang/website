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
import {
  WORKFLOW_EDGES,
  WORKFLOW_KIND_COLOR,
  WORKFLOW_NODES,
} from '@/data/workflow-graph'

type MaterialData = {
  label: string
  kind: string
  hasTarget: boolean
  hasSource: boolean
}

function MaterialNode({ data }: NodeProps<Node<MaterialData>>) {
  const color = WORKFLOW_KIND_COLOR[data.kind]
  const outcome = data.kind === 'accepted' || data.kind === 'rejected'
  const disposed = data.kind === 'disposed'

  return (
    <div
      className="flex h-[30px] w-[112px] items-center gap-2 rounded-md border px-2.5"
      style={{
        borderColor: `${color}${outcome ? 'b3' : '66'}`,
        background: outcome ? `${color}1a` : '#2b1e10',
        borderStyle: disposed ? 'dashed' : 'solid',
      }}
    >
      {data.hasTarget && (
        <Handle
          className="!size-[6px] !border !border-[#f6ece0]/30 !bg-vessel"
          position={Position.Left}
          type="target"
        />
      )}

      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{
          background: disposed ? 'transparent' : color,
          border: disposed ? `1.5px solid ${color}` : 'none',
        }}
      />
      <span
        className="truncate font-mono text-[10.5px]"
        style={{ color: outcome ? color : 'rgba(246,236,224,0.85)' }}
      >
        {data.label}
      </span>

      {data.hasSource && (
        <Handle
          className="!size-[6px] !border !border-[#f6ece0]/30 !bg-vessel"
          position={Position.Right}
          type="source"
        />
      )}
    </div>
  )
}

const NODE_TYPES = { material: MaterialNode }

const sources = new Set(WORKFLOW_EDGES.map((e) => e.source))
const targets = new Set(WORKFLOW_EDGES.map((e) => e.target))

const nodes: Node<MaterialData>[] = WORKFLOW_NODES.map((node) => ({
  id: node.id,
  type: 'material',
  position: { x: node.x, y: node.y },
  data: {
    label: node.label,
    kind: node.kind,
    hasTarget: targets.has(node.id),
    hasSource: sources.has(node.id),
  },
}))

const edges: Edge[] = WORKFLOW_EDGES.map((edge) => ({
  id: `${edge.source}-${edge.target}`,
  source: edge.source,
  target: edge.target,
  type: 'smoothstep',
  label: edge.label || undefined,
  labelStyle: { fill: 'rgba(246,236,224,0.55)', fontSize: 9.5 },
  labelBgStyle: { fill: '#1d1409' },
  labelBgPadding: [3, 1] as [number, number],
  style: {
    stroke:
      edge.target === 'discarded'
        ? 'rgba(232,68,108,0.45)'
        : 'rgba(246,236,224,0.26)',
    strokeWidth: 1.4,
    strokeDasharray: edge.target === 'discarded' ? '3 3' : undefined,
  },
}))

export function WorkflowGraph() {
  return (
    <div className="flex h-full flex-col px-5 pb-3 pt-3 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-amber" />
          <span className="micro text-[#f6ece0]/55">Material flow</span>
        </div>
        <span className="micro text-[#f6ece0]/30">
          {WORKFLOW_EDGES.length} durable effects
        </span>
      </div>

      {/* The snake is drawn wider than a phone, so it pans instead of shrinking. */}
      <div className="rail mt-4 min-h-0 flex-1">
        <div className="h-full min-w-[700px] sm:min-w-0">
          <ReactFlow
            colorMode="dark"
            edges={edges}
            elementsSelectable={false}
            fitView
            fitViewOptions={{ padding: 0.1, maxZoom: 1 }}
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
        every material is consumed exactly once
      </p>
    </div>
  )
}
