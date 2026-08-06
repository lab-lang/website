/**
 * The material dataflow of the `build` workflow. Nodes are materials, edges are
 * the durable actions that consume them. Laid out as a snake so the chain stays
 * compact: the first row runs left to right, the second back, the third forward.
 */
export const WORKFLOW_NODES = [
  { id: 'design', label: 'design', kind: 'design', x: 0, y: 0 },
  { id: 'fragments', label: 'fragments', kind: 'material', x: 168, y: 0 },
  { id: 'construct', label: 'construct', kind: 'material', x: 336, y: 0 },
  { id: 'cells', label: 'cells', kind: 'provisioned', x: 336, y: -92 },
  { id: 'culture', label: 'culture', kind: 'material', x: 504, y: 0 },
  { id: 'plate', label: 'plate', kind: 'material', x: 504, y: 112 },
  { id: 'discarded', label: 'disposed', kind: 'disposed', x: 672, y: 112 },
  { id: 'candidates', label: 'candidates', kind: 'material', x: 336, y: 112 },
  { id: 'screening', label: 'screening', kind: 'material', x: 168, y: 112 },
  { id: 'clone', label: 'clone', kind: 'material', x: 0, y: 112 },
  { id: 'purified', label: 'purified', kind: 'material', x: 168, y: 224 },
  { id: 'quantity', label: 'quantity', kind: 'evidence', x: 336, y: 224 },
  { id: 'accepted', label: 'Accepted', kind: 'accepted', x: 512, y: 196 },
  { id: 'rejected', label: 'Rejected', kind: 'rejected', x: 512, y: 264 },
]

export const WORKFLOW_EDGES = [
  { source: 'design', target: 'fragments', label: 'synthesize' },
  { source: 'fragments', target: 'construct', label: 'assemble' },
  { source: 'construct', target: 'culture', label: 'transform' },
  { source: 'cells', target: 'culture', label: '' },
  { source: 'culture', target: 'plate', label: 'plate' },
  { source: 'plate', target: 'discarded', label: 'dispose' },
  { source: 'plate', target: 'candidates', label: 'pick' },
  { source: 'candidates', target: 'screening', label: 'screen' },
  { source: 'screening', target: 'clone', label: 'grow' },
  { source: 'clone', target: 'purified', label: 'purify' },
  { source: 'purified', target: 'quantity', label: 'quantify' },
  { source: 'quantity', target: 'accepted', label: 'accepts' },
  { source: 'quantity', target: 'rejected', label: '' },
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
