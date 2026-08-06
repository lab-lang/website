import type { DocumentSymbol, SymbolKind } from '../../lib/lab-engine/types'

const KIND_LABEL: Record<SymbolKind, string> = {
  module: 'module',
  circuit: 'circuit',
  plasmid: 'plasmid',
  data: 'data',
  workflow: 'workflow',
  variable: 'value',
  field: 'field',
  case: 'case',
}

function SymbolRow({
  symbol,
  depth,
  onJump,
}: {
  symbol: DocumentSymbol
  depth: number
  onJump: (offset: number) => void
}) {
  return (
    <>
      <button
        className="press flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left hover:bg-white/8"
        onClick={() => onJump(symbol.selection_span.start)}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        type="button"
      >
        <span className="truncate font-mono text-[12px] text-[#f2e8db]/85">{symbol.name}</span>
        <span className="micro shrink-0 text-[#f6ece0]/30">{KIND_LABEL[symbol.kind]}</span>
      </button>
      {symbol.children?.map((child, index) => (
        <SymbolRow depth={depth + 1} key={index} onJump={onJump} symbol={child} />
      ))}
    </>
  )
}

export function OutlinePanel({
  symbols,
  onJump,
}: {
  symbols: DocumentSymbol[]
  onJump: (offset: number) => void
}) {
  if (symbols.length === 0) {
    return (
      <p className="px-2.5 py-3 text-[12.5px] leading-[1.6] text-[#f6ece0]/40">
        No declarations yet.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-px py-1.5">
      {symbols.map((symbol, index) => (
        <SymbolRow depth={0} key={index} onJump={onJump} symbol={symbol} />
      ))}
    </div>
  )
}
