import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'

import type { Diagnostic, DiagnosticSeverity } from '@/lib/lab-engine/types'

const SEVERITY_ICON: Record<DiagnosticSeverity, typeof XCircle> = {
  error: XCircle,
  warning: AlertTriangle,
  information: Info,
  hint: Info,
}

const SEVERITY_COLOR: Record<DiagnosticSeverity, string> = {
  error: 'text-mcherry',
  warning: 'text-amber',
  information: 'text-[#f6ece0]/50',
  hint: 'text-[#f6ece0]/50',
}

const CODE_LABEL: Record<Diagnostic['code'], string> = {
  syntax: 'syntax',
  semantic: 'semantic',
  material_flow: 'material flow',
}

export function DiagnosticsPanel({
  diagnosticsByFile,
  onJump,
}: {
  diagnosticsByFile: Array<{ path: string; diagnostics: Diagnostic[] }>
  onJump: (path: string, offset: number) => void
}) {
  const total = diagnosticsByFile.reduce(
    (sum, entry) => sum + entry.diagnostics.length,
    0,
  )

  if (total === 0) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-5">
        <CheckCircle2
          aria-hidden="true"
          className="shrink-0 text-gfp"
          size={15}
        />
        <p className="text-[13px] leading-[1.5] text-[#f6ece0]/55">
          No diagnostics. Every open file checks clean.
        </p>
      </div>
    )
  }

  return (
    <div aria-live="polite" className="flex flex-col gap-4 px-4 py-4">
      {diagnosticsByFile
        .filter((entry) => entry.diagnostics.length > 0)
        .map((entry) => (
          <div key={entry.path}>
            <span className="micro text-[#f6ece0]/35">{entry.path}</span>
            <div className="mt-1.5 space-y-1">
              {entry.diagnostics.map((diagnostic, index) => {
                const Icon = SEVERITY_ICON[diagnostic.severity]
                return (
                  <button
                    className="press flex w-full items-start gap-2.5 rounded-lg border border-white/0 px-2.5 py-2 text-left hover:border-white/10 hover:bg-white/5"
                    key={index}
                    onClick={() => onJump(entry.path, diagnostic.span.start)}
                    type="button"
                  >
                    <Icon
                      aria-hidden="true"
                      className={`mt-0.5 shrink-0 ${SEVERITY_COLOR[diagnostic.severity]}`}
                      size={13}
                    />
                    <span className="flex-1">
                      <span className="block text-[12.5px] leading-[1.5] text-[#f2e8db]/90">
                        {diagnostic.message}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-wide text-[#f6ece0]/35">
                        {CODE_LABEL[diagnostic.code]}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
    </div>
  )
}
