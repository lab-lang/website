/**
 * The shape of `main`: one design handed to one workflow, settling into one of
 * two outcomes. Positions are laid out left to right in React Flow units.
 */
export const PROGRAM_NODES = [
  {
    id: 'reporter',
    label: 'reporter',
    kind: 'plasmid',
    color: '#e1901f',
    x: 0,
    y: 84,
  },
  {
    id: 'build',
    label: 'build',
    kind: 'workflow',
    color: '#4ec3d4',
    x: 196,
    y: 84,
  },
  {
    id: 'accepted',
    label: 'Accepted<Plasmid>',
    kind: 'outcome',
    color: '#93e03f',
    x: 400,
    y: 0,
  },
  {
    id: 'rejected',
    label: 'Rejected<Plasmid>',
    kind: 'outcome',
    color: '#e8446c',
    x: 400,
    y: 168,
  },
]

export const PROGRAM_EDGES = [
  { source: 'reporter', target: 'build', label: 'design' },
  { source: 'build', target: 'accepted', label: 'evidence passes' },
  { source: 'build', target: 'rejected', label: '' },
]
