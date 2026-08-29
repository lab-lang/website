/**
 * The architectural stages the hero teaches. The current compiler exposes the
 * earlier Design, Workflow, and Protocol vertical slice while the refined and
 * allocated LAIR stages are implemented.
 */
export const BUILD_STAGES = [
  { name: 'parse', emit: 'source-ast' },
  { name: 'check', emit: 'module-ir' },
  { name: 'lower', emit: 'protocol-vertical-slice' },
  { name: 'allocate', emit: 'allocated-procedure' },
  { name: 'emit', emit: 'asset-bundles' },
]

export const BUILD_STEP_MS = 210
