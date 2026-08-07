import { LEVEL_LABEL, type Level } from '@/data/capability-matrix'

/*
 * Three silhouettes rather than three fills: solid, half, and outline. A dot
 * inside a ring reads the same at every level from arm's length, which is the
 * distance a matrix is actually scanned from.
 */
export function Mark({ level }: { level: Level }) {
  return (
    <>
      <svg
        aria-hidden="true"
        className="text-amber-deep"
        height="18"
        viewBox="0 0 18 18"
        width="18"
      >
        {level === 2 ? (
          <circle cx="9" cy="9" fill="currentColor" r="7" />
        ) : (
          <>
            <circle
              cx="9"
              cy="9"
              fill="none"
              r="6.25"
              stroke="currentColor"
              strokeOpacity={level === 0 ? '0.3' : '0.85'}
              strokeWidth="1.5"
            />
            {level === 1 && (
              <path
                d="M9 2.75 A6.25 6.25 0 0 1 9 15.25 Z"
                fill="currentColor"
              />
            )}
          </>
        )}
      </svg>
      <span className="sr-only">{LEVEL_LABEL[level]}</span>
    </>
  )
}
