/**
 * The connected architectural stages the hero teaches.
 */
export const BUILD_STAGES = [
  { name: 'parse', emit: 'source-ast' },
  { name: 'check', emit: 'module-ir' },
  { name: 'refine', emit: 'refined-alternatives' },
  { name: 'allocate', emit: 'allocated-procedure' },
  { name: 'emit', emit: 'asset-bundles' },
]

export const BUILD_STEP_MS = 210
