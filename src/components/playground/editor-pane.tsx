import type { RefObject } from 'react'

import {
  LabEditor,
  type LabEditorHandle,
} from '@/components/playground/lab-editor'
import type { LabEngine } from '@/lib/lab-engine/engine'
import type { Diagnostic, Location, TextEdit } from '@/lib/lab-engine/types'

export function EditorPane({
  activePath,
  activeText,
  diagnostics,
  editorRef,
  engine,
  engineReady,
  filePaths,
  onApplyEdits,
  onChange,
  onNavigate,
  onSelectPath,
}: {
  activePath: string
  activeText: string
  diagnostics: Diagnostic[]
  editorRef: RefObject<LabEditorHandle | null>
  engine: LabEngine
  engineReady: boolean
  filePaths: string[]
  onApplyEdits: (edits: TextEdit[]) => void
  onChange: (text: string) => void
  onNavigate: (location: Location) => void
  onSelectPath: (path: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col border-r border-white/10">
      <div className="hidden items-center justify-between border-b border-white/10 px-5 py-3 lg:flex">
        <span className="micro truncate text-[#f6ece0]/45">{activePath}</span>
        <span className="font-mono text-[11px] text-[#f6ece0]/30">
          {activeText.split('\n').length} lines
        </span>
      </div>

      <div className="rail rail-quiet flex gap-1.5 border-b border-white/10 px-3 py-2 lg:hidden">
        {filePaths.map((path) => (
          <button
            className={`press min-h-9 shrink-0 rounded-lg px-3 py-1.5 font-mono text-[12px] ${
              path === activePath
                ? 'bg-white/15 text-[#f2e8db]'
                : 'text-[#f6ece0]/55 hover:bg-white/8'
            }`}
            key={path}
            onClick={() => onSelectPath(path)}
            type="button"
          >
            {path.split('/').pop()}
          </button>
        ))}
      </div>

      {/* On a phone the editor needs a workable, deliberate height. */}
      <div className="h-[58vh] min-h-[320px] lg:h-auto lg:min-h-0 lg:flex-1">
        <LabEditor
          diagnostics={diagnostics}
          engine={engine}
          engineReady={engineReady}
          key={activePath}
          onApplyEdits={onApplyEdits}
          onChange={onChange}
          onNavigate={onNavigate}
          path={activePath}
          ref={editorRef}
          value={activeText}
        />
      </div>
    </div>
  )
}
