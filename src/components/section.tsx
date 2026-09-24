import { type ReactNode } from 'react'

/**
 * The measure every section on the site is set to. Sections vary their own
 * vertical rhythm through `className`; the width and the responsive gutters
 * are fixed, and are the reason this exists rather than being repeated.
 */
export function SectionBody({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-10 ${className}`}
    >
      {children}
    </div>
  )
}
