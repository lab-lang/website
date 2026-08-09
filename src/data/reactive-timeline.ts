/**
 * Simulated firings of `when every 30 min:` from the `grow_colonies`
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

/**
 * The last firing of the lag phase. Playback starts here so the first count
 * change lands within a second of the chart being watched, instead of
 * crawling along the flat zero line.
 */
export const LAG_END_INDEX = COLONY_COUNTS.findIndex((count) => count > 0) - 1

export const STEP_MS = 220
/* The resolved state is the point of the chart, so it is the dominant dwell. */
export const HOLD_MS = 3600
