/**
 * The stages the toolchain actually moves through, named as they are on the
 * command line, so the hero transition teaches the pipeline rather than
 * decorating the switch.
 */
export const BUILD_STAGES = [
  { name: 'parse', emit: 'source-ast' },
  { name: 'check', emit: 'module-ir' },
  { name: 'lower', emit: 'design-workflow' },
  { name: 'select', emit: 'target-selected-protocol' },
  { name: 'emit', emit: 'opentrons_ot2' },
]

export const BUILD_STEP_MS = 210
