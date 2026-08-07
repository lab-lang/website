import {
  AlertCircle,
  ChevronRight,
  FilePlus,
  Folder,
  FolderOpen,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import type { PlaygroundFile } from '@/data/playground-projects'

const FOLDER_ORDER = ['designs', 'workflows', 'programs', 'policies', '']

function folderOf(path: string): string {
  const slash = path.lastIndexOf('/')
  return slash === -1 ? '' : path.slice(0, slash)
}

function nameOf(path: string): string {
  const slash = path.lastIndexOf('/')
  return slash === -1 ? path : path.slice(slash + 1)
}

export function FileTree({
  files,
  activePath,
  errorPaths,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}: {
  files: PlaygroundFile[]
  activePath: string
  errorPaths: Set<string>
  onSelect: (path: string) => void
  onAdd: (folder: string) => void
  onRename: (path: string, newName: string) => void
  onDelete: (path: string) => void
}) {
  const [renaming, setRenaming] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set())

  const grouped = new Map<string, PlaygroundFile[]>()
  for (const file of files) {
    const folder = folderOf(file.path)
    const list = grouped.get(folder) ?? []
    list.push(file)
    grouped.set(folder, list)
  }
  const folders = [...grouped.keys()].sort(
    (a, b) =>
      FOLDER_ORDER.indexOf(a) - FOLDER_ORDER.indexOf(b) || a.localeCompare(b),
  )

  function toggle(folder: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(folder)) next.delete(folder)
      else next.add(folder)
      return next
    })
  }

  return (
    <div className="flex h-full flex-col gap-0.5 overflow-y-auto px-2 py-3">
      {folders.map((folder) => {
        const isRoot = folder === ''
        const isOpen = !collapsed.has(folder)
        return (
          <div key={folder || 'root'}>
            {!isRoot && (
              <div className="group/folder flex items-center gap-1 rounded-md px-1 py-1 hover:bg-white/6">
                <button
                  aria-expanded={isOpen}
                  className="press flex flex-1 items-center gap-1.5 text-left"
                  onClick={() => toggle(folder)}
                  type="button"
                >
                  <ChevronRight
                    aria-hidden="true"
                    className={`shrink-0 text-[#f6ece0]/35 transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`}
                    size={12}
                  />
                  {isOpen ? (
                    <FolderOpen
                      aria-hidden="true"
                      className="shrink-0 text-[#f6ece0]/45"
                      size={13}
                    />
                  ) : (
                    <Folder
                      aria-hidden="true"
                      className="shrink-0 text-[#f6ece0]/45"
                      size={13}
                    />
                  )}
                  <span className="micro truncate text-[#f6ece0]/55">
                    {folder}
                  </span>
                </button>
                <button
                  aria-label={`New file in ${folder}`}
                  className="press grid size-5 shrink-0 place-items-center rounded text-[#f6ece0]/0 hover:bg-white/10 hover:text-[#f6ece0] group-hover/folder:text-[#f6ece0]/40"
                  onClick={() => onAdd(folder)}
                  type="button"
                >
                  <FilePlus aria-hidden="true" size={11} />
                </button>
              </div>
            )}

            {isOpen && (
              <div
                className={`flex flex-col gap-px ${isRoot ? '' : 'ml-2.5 border-l border-white/8 pl-1.5'}`}
              >
                {grouped.get(folder)!.map((file) => {
                  const active = file.path === activePath
                  const hasErrors = errorPaths.has(file.path)
                  return (
                    <div
                      className={`group flex items-center gap-1.5 rounded-md px-1.5 py-1.5 ${
                        active
                          ? 'bg-white/12 text-[#f2e8db]'
                          : 'text-[#f6ece0]/65 hover:bg-white/6 hover:text-[#f2e8db]'
                      }`}
                      key={file.path}
                    >
                      {renaming === file.path ? (
                        <input
                          autoFocus
                          className="w-full rounded border border-white/20 bg-black/30 px-1.5 py-0.5 font-mono text-[12.5px] text-[#f2e8db] outline-none"
                          defaultValue={nameOf(file.path)}
                          onBlur={(event) => {
                            onRename(file.path, event.currentTarget.value)
                            setRenaming(null)
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter')
                              event.currentTarget.blur()
                            if (event.key === 'Escape') setRenaming(null)
                          }}
                        />
                      ) : (
                        <button
                          className="press flex flex-1 items-center gap-1.5 truncate text-left font-mono text-[12.5px]"
                          onClick={() => onSelect(file.path)}
                          onDoubleClick={() => setRenaming(file.path)}
                          type="button"
                        >
                          {hasErrors && (
                            <AlertCircle
                              aria-label="Has diagnostics"
                              className="shrink-0 text-[#e8446c]"
                              size={11}
                            />
                          )}
                          <span className="truncate">{nameOf(file.path)}</span>
                        </button>
                      )}
                      {files.length > 1 && (
                        <button
                          aria-label={`Delete ${file.path}`}
                          className="press hidden size-5 shrink-0 place-items-center rounded text-[#f6ece0]/35 hover:bg-white/10 hover:text-[#e8446c] group-hover:grid"
                          onClick={() => onDelete(file.path)}
                          type="button"
                        >
                          <Trash2 aria-hidden="true" size={11} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
