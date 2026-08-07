import { ArrowDownToLine } from 'lucide-react'
import { type ReactNode } from 'react'

/** The surface an asset is shown against, so its intended ground is visible. */
export function Plate({
  tone,
  children,
  className = '',
}: {
  tone: 'dark' | 'light'
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border p-8 ${
        tone === 'dark'
          ? 'border-white/10 bg-vessel'
          : 'border-[var(--plate-light-edge)] bg-[var(--plate-light)]'
      } ${className}`}
    >
      {children}
    </div>
  )
}

function AssetLink({
  href,
  label,
  file,
}: {
  href: string
  label: string
  file: string
}) {
  return (
    <a
      className="press lift flex items-center justify-between gap-3 rounded-xl border border-ink/15 bg-shell/70 px-4 py-3 text-[13.5px] text-ink"
      download
      href={href}
    >
      <span className="flex flex-col">
        <span className="prose-lab font-medium">{label}</span>
        <span className="font-mono text-[11.5px] text-umber-soft">{file}</span>
      </span>
      <ArrowDownToLine
        aria-hidden="true"
        className="shrink-0 text-umber"
        size={16}
      />
    </a>
  )
}

/** Both formats of one asset: vector for anything that scales, PNG for the rest. */
export function AssetLinkPair({
  dir = '',
  name,
  note,
}: {
  dir?: string
  name: string
  note: string
}) {
  const path = dir ? `${dir}/${name}` : name
  return (
    <div className="grid grid-cols-2 gap-2">
      <AssetLink
        file={`${name}.svg`}
        href={`/${path}.svg`}
        label={`SVG · ${note}`}
      />
      <AssetLink
        file={`${name}.png`}
        href={`/${path}.png`}
        label={`PNG · ${note}`}
      />
    </div>
  )
}
