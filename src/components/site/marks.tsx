import { Link } from 'react-router-dom'

/** `=` above `<-`: what replay may repeat, and what it may not. */
export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      height={size}
      viewBox="0 0 64 64"
      width={size}
    >
      <rect fill="var(--mark-tile)" height="64" rx="15" width="64" />
      <rect
        fill="#f0e3c9"
        fillOpacity=".34"
        height="5.5"
        rx="2.75"
        width="31"
        x="17"
        y="17.5"
      />
      <rect
        fill="var(--color-amber)"
        height="5.5"
        rx="2.75"
        width="26"
        x="22"
        y="36"
      />
      <path
        d="M27 33.25 20 38.75 27 44.25"
        fill="none"
        stroke="var(--color-amber)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.5"
      />
    </svg>
  )
}

/** The GitHub octocat, inlined since lucide-react ships no brand marks. */
export function GithubMark({ size = 14 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.44-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  )
}

/**
 * `full` spells out "The Lab Programming Language" where the row can afford
 * it (lg and up); narrower viewports keep the short "Lab" wordmark.
 */
export function Wordmark({
  full = false,
  size = 30,
}: {
  full?: boolean
  size?: number
}) {
  return (
    <Link
      aria-label="Lab home"
      className="press group inline-flex items-center rounded-md text-ink"
      to="/"
    >
      <span className="nudge inline-flex items-center gap-2.5 group-hover:translate-x-[-3px]">
        <Mark size={size} />
        <span className="type-head text-[20px] tracking-[-0.012em]">
          {full && <span className="hidden lg:inline">The </span>}
          Lab
          {full && (
            <span className="hidden lg:inline"> Programming Language</span>
          )}
        </span>
      </span>
    </Link>
  )
}
