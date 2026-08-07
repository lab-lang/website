import { FileTree } from '@/components/playground/file-tree'
import { OutlinePanel } from '@/components/playground/outline-panel'
import type { DocumentSymbol } from '@/lib/lab-engine/types'

export function WorkspaceSidebar({
  activePath,
  errorPaths,
  files,
  onAdd,
  onDelete,
  onJump,
  onRename,
  onSelect,
  symbols,
}: {
  activePath: string
  errorPaths: Set<string>
  files: Array<{ path: string; contents: string }>
  onAdd: (folder: string) => void
  onDelete: (path: string) => void
  onJump: (offset: number) => void
  onRename: (oldPath: string, newName: string) => void
  onSelect: (path: string) => void
  symbols: DocumentSymbol[]
}) {
  return (
    <div className="hidden w-60 shrink-0 flex-col border-r border-white/10 lg:flex">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <FileTree
          activePath={activePath}
          errorPaths={errorPaths}
          files={files}
          onAdd={onAdd}
          onDelete={onDelete}
          onRename={onRename}
          onSelect={onSelect}
        />
      </div>
      <div className="max-h-56 shrink-0 overflow-y-auto border-t border-white/10 px-1 pb-3">
        <div className="px-2.5 pt-3">
          <span className="micro text-[#f6ece0]/35">
            Outline · {activePath.split('/').pop()}
          </span>
        </div>
        <OutlinePanel onJump={onJump} symbols={symbols} />
      </div>
    </div>
  )
}
