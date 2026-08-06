/**
 * Simulated firings of `when every 30 min:` from the `await_colonies`
 * specimen. Each entry is the isolated-colony count `detect_colonies` would
 * report at that half-hour mark: a lag phase, then colonies crossing
 * "isolated" in irregular clusters rather than one on a metronome, the way a
 * real plate behaves. Staged, not random, so the replay is identical every
 * time the section loops.
 */
export const STEP_HOURS = 0.5
export const TOTAL_HOURS = 18
export const THRESHOLD = 8
export const CHART_MAX = 10

export const COLONY_COUNTS = [
  0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 3, 3, 3, 3, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8,
]

export const RESOLVED_INDEX = COLONY_COUNTS.findIndex(
  (count) => count >= THRESHOLD,
)

export const STEP_MS = 220
export const HOLD_MS = 1800
