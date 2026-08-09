/**
 * The material dataflow of `build_reporter` and the `main` that watches its
 * plate. Nodes are materials, edges are the durable actions that consume them.
 * Laid out as a snake so the chain stays compact: the first row runs left to
 * right, the second back.
 */
export const WORKFLOW_NODES = [
  { id: 'reporter', label: 'reporter', kind: 'design', x: 0, y: 0 },
  { id: 'product', label: 'product', kind: 'material', x: 168, y: 0 },
  { id: 'cells', label: 'cells', kind: 'provisioned', x: 168, y: -92 },
  { id: 'strain', label: 'strain', kind: 'accepted', x: 336, y: -92 },
  { id: 'culture', label: 'culture', kind: 'material', x: 336, y: 0 },
  { id: 'plate', label: 'plate', kind: 'material', x: 504, y: 0 },
  { id: 'growth', label: 'growth', kind: 'evidence', x: 504, y: 112 },
  { id: 'ready', label: 'Ready', kind: 'accepted', x: 336, y: 84 },
  { id: 'timedout', label: 'TimedOut', kind: 'rejected', x: 336, y: 176 },
  { id: 'discarded', label: 'disposed', kind: 'disposed', x: 168, y: 130 },
]

export const WORKFLOW_EDGES = [
  { source: 'reporter', target: 'product', label: 'realize' },
  { source: 'product', target: 'strain', label: 'transform' },
  { source: 'product', target: 'culture', label: '' },
  { source: 'cells', target: 'culture', label: '' },
  { source: 'culture', target: 'plate', label: 'recover · dilute · plate' },
  { source: 'plate', target: 'growth', label: 'grow_colonies' },
  { source: 'growth', target: 'ready', label: '' },
  { source: 'growth', target: 'timedout', label: '' },
  { source: 'ready', target: 'discarded', label: 'dispose' },
  { source: 'timedout', target: 'discarded', label: '' },
]

export const WORKFLOW_KIND_COLOR: Record<string, string> = {
  design: '#e1901f',
  material: '#a08a74',
  provisioned: '#4ec3d4',
  evidence: '#4ec3d4',
  disposed: '#e8446c',
  accepted: '#93e03f',
  rejected: '#e8446c',
}
