/**
 * The two `when` clauses of `grow_colonies`, in the order they are written.
 * One wakes on an interval and one is a single deadline; either can end the
 * workflow, which is what makes them a race rather than a sequence.
 */
export interface Handler {
  id: string
  /** The clause as it appears in source. */
  clause: string
  kind: 'interval' | 'deadline'
  /** What the body does each time the clause fires. */
  body: string[]
  /** The case this handler returns, and the condition that gets it there. */
  exit: string
  condition: string
  /** Hex, so the panel can suffix an alpha channel the way its siblings do. */
  color: string
}

export const HANDLERS: Handler[] = [
  {
    id: 'every',
    clause: 'when every 30 min',
    kind: 'interval',
    body: ['capture image of plate', 'detect_colonies(image)'],
    exit: 'Ready',
    condition: 'colonies.isolated.count >= 8',
    color: '#93e03f',
  },
  {
    id: 'after',
    clause: 'when after 18 h',
    kind: 'deadline',
    body: ['nothing more will grow'],
    exit: 'TimedOut',
    condition: '18 h elapsed',
    color: '#e8446c',
  },
]
