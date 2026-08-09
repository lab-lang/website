/**
 * The shape of `main`: one design handed to one workflow, whose plate is
 * watched until it settles into one of `ColonyGrowth`'s two cases. Positions
 * are laid out left to right in React Flow units.
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
    label: 'build_reporter',
    kind: 'workflow',
    color: '#4ec3d4',
    x: 196,
    y: 84,
  },
  {
    id: 'ready',
    label: 'Ready',
    kind: 'case',
    color: '#93e03f',
    x: 400,
    y: 0,
  },
  {
    id: 'timedout',
    label: 'TimedOut',
    kind: 'case',
    color: '#e8446c',
    x: 400,
    y: 168,
  },
]

export const PROGRAM_EDGES = [
  { source: 'reporter', target: 'build', label: 'design' },
  { source: 'build', target: 'ready', label: 'enough colonies' },
  { source: 'build', target: 'timedout', label: '' },
]
