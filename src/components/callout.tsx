import type { ReactNode } from 'react'

const KIND_STYLES = {
  note: { box: 'border-amber/35 bg-amber/10', dot: 'bg-amber-deep' },
  aside: { box: 'border-ink/15 bg-shell/70', dot: 'bg-umber-soft' },
} as const

export function Callout({
  kind = 'note',
  children,
}: {
  kind?: keyof typeof KIND_STYLES
  children: ReactNode
}) {
  const styles = KIND_STYLES[kind]

  return (
    <div
      className={`mt-8 flex gap-4 rounded-2xl border px-5 py-4 ${styles.box}`}
    >
      <span
        aria-hidden="true"
        className={`mt-1.5 size-1.5 shrink-0 rounded-full ${styles.dot}`}
      />
      <div className="prose-lab text-[14px] leading-[1.65] text-ink [&_p]:mt-0 [&_p]:max-w-none [&_p]:text-[14px] [&_p]:leading-[1.65] [&_p]:text-ink [&_strong]:font-medium [&_p+p]:mt-3">
        {children}
      </div>
    </div>
  )
}
