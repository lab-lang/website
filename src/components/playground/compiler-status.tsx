import type { EngineStatus } from '@/lib/lab-engine/use-lab-engine'

const COPY: Record<EngineStatus, { label: string; dot: string }> = {
  loading: { label: 'Compiler loading', dot: 'bg-amber animate-pulse' },
  ready: { label: 'Compiler ready', dot: 'bg-gfp' },
  error: { label: 'Compiler unavailable', dot: 'bg-mcherry' },
}

export function CompilerStatus({
  status,
  title,
}: {
  status: EngineStatus
  title?: string
}) {
  const { label, dot } = COPY[status]
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-2.5 pr-3"
      title={title}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dot}`} />
      <span className="micro text-[#f6ece0]/60">{label}</span>
    </span>
  )
}
