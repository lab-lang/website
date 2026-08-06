import { closeBrackets, closeBracketsKeymap, completionKeymap, autocompletion, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { bracketMatching, indentOnInput, indentUnit } from '@codemirror/language'
import { forceLinting, lintKeymap, linter, type Diagnostic as CmDiagnostic } from '@codemirror/lint'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  hoverTooltip,
  keymap,
  lineNumbers,
  rectangularSelection,
  type KeyBinding,
} from '@codemirror/view'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { LabEngine } from '../../lib/lab-engine/engine'
import type { CompletionKind, Diagnostic, Location, TextEdit } from '../../lib/lab-engine/types'
import { labLanguage } from '../../lib/playground/language'
import {
  applySemanticTokens,
  semanticTokenTheme,
  semanticTokensField,
} from '../../lib/playground/semantic-tokens'
import { labTheme } from '../../lib/playground/theme'

const COMPLETION_TYPE: Record<CompletionKind, string> = {
  keyword: 'keyword',
  type: 'type',
  value: 'variable',
  function: 'function',
  module: 'namespace',
}

function renderHover(markdown: string): HTMLElement {
  const container = document.createElement('div')
  container.className = 'max-w-xs px-1 py-0.5 font-sans text-[13px] leading-[1.55] text-[#f2e8db]'

  const fenceMatch = markdown.match(/```lab\n([\s\S]*?)\n```/)
  const rest = fenceMatch ? markdown.slice(fenceMatch.index! + fenceMatch[0].length).trim() : markdown

  if (fenceMatch) {
    const pre = document.createElement('pre')
    pre.className = 'mb-1.5 rounded-md bg-black/25 px-2 py-1.5 font-mono text-[12px] text-[#93e03f]'
    pre.textContent = fenceMatch[1]
    container.appendChild(pre)
  }

  if (rest) {
    const paragraph = document.createElement('p')
    paragraph.className = 'text-[#c9bda9]'
    paragraph.innerHTML = rest.replace(/`([^`]+)`/g, '<code class="text-[#f2e8db]">$1</code>')
    container.appendChild(paragraph)
  }

  return container
}

function wordAt(doc: string, pos: number): { from: number; to: number; text: string } | null {
  const isWordChar = (char: string) => /[A-Za-z0-9_]/.test(char)
  if (pos < 0 || pos > doc.length) return null
  let from = pos
  let to = pos
  while (from > 0 && isWordChar(doc[from - 1])) from -= 1
  while (to < doc.length && isWordChar(doc[to])) to += 1
  if (from === to) return null
  return { from, to, text: doc.slice(from, to) }
}

export interface LabEditorHandle {
  /** Applies edits in original-document coordinates without remounting (keeps undo/scroll/selection). */
  applyChanges: (changes: Array<{ from: number; to: number; insert: string }>) => void
  select: (from: number, to?: number) => void
}

export interface LabEditorProps {
  path: string
  value: string
  diagnostics: Diagnostic[]
  engine: LabEngine
  engineReady: boolean
  onChange: (text: string) => void
  onApplyEdits: (edits: TextEdit[]) => void
  onNavigate: (location: Location) => void
}

export const LabEditor = forwardRef<LabEditorHandle, LabEditorProps>(function LabEditor(
  { path, value, diagnostics, engine, engineReady, onChange, onApplyEdits, onNavigate }: LabEditorProps,
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const diagnosticsRef = useRef(diagnostics)
  const onChangeRef = useRef(onChange)
  const onApplyEditsRef = useRef(onApplyEdits)
  const onNavigateRef = useRef(onNavigate)
  const engineReadyRef = useRef(engineReady)
  const [rename, setRename] = useState<{ from: number; to: number; original: string; top: number; left: number } | null>(null)

  diagnosticsRef.current = diagnostics
  onChangeRef.current = onChange
  onApplyEditsRef.current = onApplyEdits
  onNavigateRef.current = onNavigate
  engineReadyRef.current = engineReady

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const renameKeymap: KeyBinding[] = [
      {
        key: 'F2',
        run: (view) => {
          const pos = view.state.selection.main.head
          const word = wordAt(view.state.doc.toString(), pos)
          if (!word) return true
          const coords = view.coordsAtPos(word.from)
          const hostRect = host.getBoundingClientRect()
          setRename({
            from: word.from,
            to: word.to,
            original: word.text,
            top: coords ? coords.bottom - hostRect.top + 6 : 40,
            left: coords ? coords.left - hostRect.left : 12,
          })
          return true
        },
      },
    ]

    const view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          history(),
          drawSelection(),
          dropCursor(),
          rectangularSelection(),
          indentOnInput(),
          indentUnit.of('  '),
          bracketMatching(),
          closeBrackets(),
          highlightSelectionMatches(),
          semanticTokensField,
          semanticTokenTheme,
          labLanguage(),
          labTheme(),
          linter(
            (currentView) => {
              const length = currentView.state.doc.length
              const toCm = (diagnostic: Diagnostic): CmDiagnostic => ({
                from: Math.min(diagnostic.span.start, length),
                to: Math.max(Math.min(diagnostic.span.end, length), Math.min(diagnostic.span.start + 1, length)),
                severity:
                  diagnostic.severity === 'error'
                    ? 'error'
                    : diagnostic.severity === 'warning'
                      ? 'warning'
                      : 'info',
                message: diagnostic.message,
                source: diagnostic.code,
              })
              return diagnosticsRef.current.map(toCm)
            },
            { delay: 0 },
          ),
          hoverTooltip(async (_view, pos) => {
            if (!engineReadyRef.current) return null
            const result = await engine.hover(path, pos)
            if (!result) return null
            return {
              pos: result.span.start,
              end: result.span.end,
              above: true,
              create: () => ({ dom: renderHover(result.markdown) }),
            }
          }),
          autocompletion({
            override: [
              async (context: CompletionContext): Promise<CompletionResult | null> => {
                if (!engineReadyRef.current) return null
                const word = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*/)
                if (!word && !context.explicit) return null
                const items = await engine.completions(path, context.pos)
                if (!items.length) return null
                return {
                  from: word ? word.from : context.pos,
                  options: items.map((item) => ({
                    label: item.label,
                    type: COMPLETION_TYPE[item.kind],
                    detail: item.detail ?? undefined,
                  })),
                }
              },
            ],
          }),
          EditorView.domEventHandlers({
            mousedown: (event, view) => {
              if (!(event.metaKey || event.ctrlKey) || !engineReadyRef.current) return false
              const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
              if (pos == null) return false
              event.preventDefault()
              void engine.definition(path, pos).then((location) => {
                if (location) onNavigateRef.current(location)
              })
              return true
            },
          }),
          keymap.of([
            ...renameKeymap,
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...completionKeymap,
            ...lintKeymap,
            ...searchKeymap,
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString())
              setRename(null)
            }
          }),
        ],
      }),
    })

    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
    // Deliberately re-mounts a fresh editor per `path`: each open file gets
    // its own instance, so switching tabs doesn't need to reconcile one
    // EditorState against a different document's content and diagnostics.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  useImperativeHandle(
    ref,
    () => ({
      applyChanges(changes) {
        const view = viewRef.current
        if (!view || changes.length === 0) return
        view.dispatch({ changes })
      },
      select(from, to = from) {
        const view = viewRef.current
        if (!view) return
        const length = view.state.doc.length
        const anchor = Math.max(0, Math.min(from, length))
        const head = Math.max(0, Math.min(to, length))
        view.dispatch({ selection: { anchor, head }, scrollIntoView: true })
        view.focus()
      },
    }),
    [],
  )

  useEffect(() => {
    const view = viewRef.current
    if (view) forceLinting(view)
  }, [diagnostics])

  // Keyed off `diagnostics` rather than `value`: diagnostics only update
  // once the parent has actually pushed this file's latest text into the
  // engine (after a project resync or a debounced edit), so this avoids a
  // race where semantic tokens are fetched for a path the freshly-reset
  // wasm workspace doesn't have a document for yet (which would silently
  // resolve to an empty token list and never retry).
  useEffect(() => {
    if (!engineReady) return
    let cancelled = false
    engine.semanticTokens(path).then((tokens) => {
      const view = viewRef.current
      if (!cancelled && view) applySemanticTokens(view, tokens)
    })
    return () => {
      cancelled = true
    }
  }, [engine, engineReady, path, diagnostics])

  function submitRename(newName: string) {
    if (!rename) return
    const trimmed = newName.trim()
    if (trimmed && trimmed !== rename.original) {
      void engine.rename(path, rename.from, trimmed).then((edits) => {
        if (edits.length) onApplyEditsRef.current(edits)
      })
    }
    setRename(null)
    viewRef.current?.focus()
  }

  return (
    <div className="relative h-full">
      <div className="h-full" ref={hostRef} />
      {rename && (
        <div
          className="absolute z-20 flex items-center gap-2 rounded-lg border border-white/15 bg-vessel-raised px-2.5 py-2 shadow-xl"
          style={{ top: rename.top, left: rename.left }}
        >
          <span className="micro text-[#f6ece0]/45">Rename</span>
          <input
            autoFocus
            className="w-40 rounded-md border border-white/15 bg-black/30 px-2 py-1 font-mono text-[12.5px] text-[#f2e8db] outline-none focus:border-[#93e03f]/60"
            defaultValue={rename.original}
            onBlur={() => setRename(null)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitRename(event.currentTarget.value)
              if (event.key === 'Escape') setRename(null)
            }}
          />
        </div>
      )}
    </div>
  )
})
