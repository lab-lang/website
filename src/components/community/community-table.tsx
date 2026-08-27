import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export function CommunityTable({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-ink/14 bg-shell/62 ${className}`}
    >
      {children}
    </div>
  )
}

export function CommunityTableHeader({
  columns,
  className = '',
}: {
  columns: string[]
  className?: string
}) {
  return (
    <div
      className={`hidden border-b border-ink/10 bg-sand/38 px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-umber-soft ${className}`}
    >
      {columns.map((column) => (
        <span key={column}>{column}</span>
      ))}
    </div>
  )
}

export function CommunityTableBody({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-ink/10">{children}</div>
}

export function CommunityTableRow({
  className = '',
  ...props
}: ComponentPropsWithoutRef<'article'>) {
  return (
    <article
      className={`transition-colors hover:bg-sand/28 ${className}`}
      {...props}
    />
  )
}

export function CommunityTableLinkRow({
  className = '',
  ...props
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={`press group transition-colors hover:bg-sand/28 ${className}`}
      {...props}
    />
  )
}
