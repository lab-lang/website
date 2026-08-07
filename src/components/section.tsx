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

/**
 * A kicker, a heading, and the paragraph under them. `tone` picks the palette:
 * `light` for the paper ground, `dark` for the sections set on vessel, where
 * amber goes muddy and the fluorophore green is what carries.
 */
export function SectionIntro({
  kicker,
  title,
  lede,
  tone = 'light',
  className = '',
  titleClassName = 'text-[clamp(1.65rem,4.2vw,3.4rem)]',
  ledeClassName = 'mt-6 text-[16px] leading-[1.7] sm:text-[17px]',
}: {
  kicker: string
  title: ReactNode
  lede?: ReactNode
  tone?: 'light' | 'dark'
  className?: string
  titleClassName?: string
  ledeClassName?: string
}) {
  const dark = tone === 'dark'

  return (
    <div className={className}>
      <span className={`micro ${dark ? 'text-gfp' : 'text-amber-deep'}`}>
        {kicker}
      </span>
      <h2
        className={`type-title mt-5 text-balance ${titleClassName} ${dark ? 'text-[#f6ece0]' : ''}`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`prose-lab ${ledeClassName} ${dark ? 'text-[#f6ece0]/60' : 'text-ink/78'}`}
        >
          {lede}
        </p>
      )}
    </div>
  )
}

/**
 * The rule and the line of text that close a page, with whatever action the
 * page wants beside them.
 */
export function ClosingNote({
  note,
  className = 'mt-16',
  children,
}: {
  note: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={className}>
      <div className="tick-rule" />
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="prose-lab text-[15px] text-umber">{note}</p>
        {children}
      </div>
    </div>
  )
}
