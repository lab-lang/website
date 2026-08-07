import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { type LabEditorHandle } from '@/components/playground/lab-editor'
import {
  goldenGateProject,
  moduleIdFor,
  newScratchProject,
  type PlaygroundProject,
} from '@/data/playground-projects'
import type {
  Diagnostic,
  DocumentSymbol,
  TextEdit,
} from '@/lib/lab-engine/types'
import { useLabEngine } from '@/lib/lab-engine/use-lab-engine'

const STORAGE_PREFIX = 'lab-playground:'

interface StoredProject {
  digest: string
  files: Record<string, string>
}

function defaultFiles(project: PlaygroundProject): Record<string, string> {
  return Object.fromEntries(
    project.files.map((file) => [file.path, file.contents]),
  )
}

/**
 * A cheap, non-cryptographic digest of a project's shipped default content.
 * Saved alongside a visitor's edits in localStorage so that shipping a copy
 * change to a starter project invalidates old saves automatically, instead
 * of every past visitor being stuck on stale content until they notice a
 * manual "Reset project" exists.
 */
function digestProject(project: PlaygroundProject): string {
  const text = project.files
    .map((file) => `${file.path} ${file.contents}`)
    .join('')
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

function loadStoredFiles(project: PlaygroundProject): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + project.id)
    if (raw) {
      const stored = JSON.parse(raw) as Partial<StoredProject>
      if (
        stored.digest === digestProject(project) &&
        stored.files &&
        typeof stored.files === 'object' &&
        Object.keys(stored.files).length > 0
      ) {
        return stored.files
      }
    }
  } catch {
    // Corrupted or inaccessible storage — fall back to the pristine project.
  }
  return defaultFiles(project)
}

/**
 * The playground's whole editing model: which project and file are open, the
 * text of every file, and the engine's view of all of it kept in step with
 * the visitor's edits.
 */
export function useWorkspace() {
  const { engine, status } = useLabEngine()

  // The example is what a visit starts on. A scratch project is a detour
  // from it, so there is one at most and it lives only as long as the tab.
  const [activeProject, setActiveProject] =
    useState<PlaygroundProject>(goldenGateProject)
  const [filesByProject, setFilesByProject] = useState<
    Record<string, Record<string, string>>
  >(() => ({ [goldenGateProject.id]: loadStoredFiles(goldenGateProject) }))
  const [activePath, setActivePath] = useState(goldenGateProject.defaultFile)
  const [diagnostics, setDiagnostics] = useState<Record<string, Diagnostic[]>>(
    {},
  )
  const [symbols, setSymbols] = useState<DocumentSymbol[]>([])
  const [copied, setCopied] = useState(false)
  const [syncNonce, setSyncNonce] = useState(0)

  const activeProjectId = activeProject.id
  const inScratch = activeProjectId !== goldenGateProject.id
  // A file in a package answers to the name its manifest gives it, not to one
  // guessed from its path, so every document handed to the engine carries it.
  const moduleFor = useCallback(
    (path: string) => moduleIdFor(activeProject, path),
    [activeProject],
  )
  const activeFiles = useMemo(
    () => filesByProject[activeProjectId] ?? {},
    [filesByProject, activeProjectId],
  )
  const activeText = activeFiles[activePath] ?? ''

  // These mirror the latest render's state for use inside callbacks and the
  // resync effect below, which intentionally does not depend on every
  // keystroke — refs are updated post-render (effects), never during it.
  const filesByProjectRef = useRef(filesByProject)
  const activeProjectIdRef = useRef(activeProjectId)
  const activePathRef = useRef(activePath)
  const pendingSelectionRef = useRef<{ path: string; offset: number } | null>(
    null,
  )
  const versionsRef = useRef<Record<string, number>>({})
  const syncTimerRef = useRef<number | undefined>(undefined)
  const editorRef = useRef<LabEditorHandle>(null)

  useEffect(() => {
    filesByProjectRef.current = filesByProject
  }, [filesByProject])
  useEffect(() => {
    activeProjectIdRef.current = activeProjectId
  }, [activeProjectId])
  useEffect(() => {
    activePathRef.current = activePath
  }, [activePath])

  // Persist every edit locally, per project, so a reload doesn't lose work.
  // Tagged with a digest of the project's shipped defaults (see
  // digestProject) so a future content update doesn't get masked by an old
  // save.
  useEffect(() => {
    try {
      const stored: StoredProject = {
        digest: digestProject(activeProject),
        files: activeFiles,
      }
      localStorage.setItem(
        STORAGE_PREFIX + activeProjectId,
        JSON.stringify(stored),
      )
    } catch {
      // Storage can be unavailable (private mode, quota) — edits still work in-memory.
    }
  }, [activeProjectId, activeFiles, activeProject])

  // Covers diagnostics only — the outline effect below refetches symbols
  // whenever this changes, so it doesn't need its own call here too.
  const refreshDiagnostics = useCallback(async () => {
    const files = filesByProjectRef.current[activeProjectIdRef.current] ?? {}
    const entries = await Promise.all(
      Object.keys(files).map(
        async (path) => [path, await engine.diagnostics(path)] as const,
      ),
    )
    setDiagnostics(Object.fromEntries(entries))
  }, [engine])

  function scheduleRefresh() {
    if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current)
    syncTimerRef.current = window.setTimeout(() => {
      void refreshDiagnostics()
    }, 250)
  }

  // Full resync: fires on mount, on project switch, and on an explicit
  // reset. Rebuilds the workspace from scratch so no document from a
  // previous project can leak into name-based cross-file features.
  useEffect(() => {
    let cancelled = false
    async function sync() {
      await engine.resetWorkspace()
      const files = filesByProjectRef.current[activeProjectId] ?? {}
      for (const [path, text] of Object.entries(files)) {
        if (cancelled) return
        versionsRef.current[path] = 1
        await engine.setDocument(path, 1, text, moduleFor(path))
      }
      if (!cancelled) await refreshDiagnostics()
    }
    void sync()
    return () => {
      cancelled = true
    }
  }, [engine, activeProjectId, syncNonce, refreshDiagnostics, moduleFor])

  // Runs after the newly active file's editor has mounted (child effects
  // commit before this one), so the pending cross-file jump lands correctly.
  useEffect(() => {
    const pending = pendingSelectionRef.current
    if (pending && pending.path === activePath) {
      editorRef.current?.select(pending.offset, pending.offset)
      pendingSelectionRef.current = null
    }
  }, [activePath])

  // The outline is per-active-file, so switching tabs needs its own fetch —
  // `diagnostics` covers every open file already, but `symbols` doesn't.
  useEffect(() => {
    let cancelled = false
    void engine.documentSymbols(activePath).then((result) => {
      if (!cancelled) setSymbols(result)
    })
    return () => {
      cancelled = true
    }
  }, [engine, activePath, diagnostics])

  function jumpTo(path: string, offset: number) {
    if (path === activePath) {
      editorRef.current?.select(offset, offset)
      return
    }
    pendingSelectionRef.current = { path, offset }
    setActivePath(path)
  }

  function handleActiveFileChange(text: string) {
    setFilesByProject((prev) => ({
      ...prev,
      [activeProjectId]: { ...prev[activeProjectId], [activePath]: text },
    }))
    const version = (versionsRef.current[activePath] ?? 0) + 1
    versionsRef.current[activePath] = version
    void engine.setDocument(activePath, version, text, moduleFor(activePath))
    scheduleRefresh()
  }

  function applyTextEdits(edits: TextEdit[]) {
    if (edits.length === 0) return
    const byFile = new Map<string, TextEdit[]>()
    for (const edit of edits) {
      const list = byFile.get(edit.source) ?? []
      list.push(edit)
      byFile.set(edit.source, list)
    }

    // The active file's own edits go straight into the live view; its
    // onChange flow (handleActiveFileChange) then takes care of state and
    // the engine, so it is deliberately skipped in the loop below.
    const activeEdits = byFile.get(activePath)
    if (activeEdits && editorRef.current) {
      editorRef.current.applyChanges(
        activeEdits.map((edit) => ({
          from: edit.span.start,
          to: edit.span.end,
          insert: edit.new_text,
        })),
      )
    }

    const current = filesByProjectRef.current[activeProjectId] ?? {}
    const next = { ...current }
    let touchedOtherFiles = false
    for (const [path, fileEdits] of byFile) {
      if (path === activePath) continue
      const text = next[path]
      if (text == null) continue
      touchedOtherFiles = true
      const sorted = [...fileEdits].sort((a, b) => b.span.start - a.span.start)
      let updated = text
      for (const edit of sorted) {
        updated =
          updated.slice(0, edit.span.start) +
          edit.new_text +
          updated.slice(edit.span.end)
      }
      next[path] = updated
      const version = (versionsRef.current[path] ?? 0) + 1
      versionsRef.current[path] = version
      void engine.setDocument(path, version, updated, moduleFor(path))
    }
    if (touchedOtherFiles) {
      setFilesByProject((prev) => ({ ...prev, [activeProjectId]: next }))
    }
    scheduleRefresh()
  }

  function openProject(project: PlaygroundProject) {
    setActiveProject(project)
    setActivePath(project.defaultFile)
    pendingSelectionRef.current = null
    setDiagnostics({})
    setSymbols([])
  }

  /** Opens a blank project, discarding any scratch already open. */
  function createScratch() {
    const project = newScratchProject()
    setFilesByProject((prev) => ({
      ...prev,
      [project.id]: defaultFiles(project),
    }))
    openProject(project)
  }

  function closeScratch() {
    const id = activeProjectId
    setFilesByProject((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    try {
      localStorage.removeItem(STORAGE_PREFIX + id)
    } catch {
      // Ignore — in-memory state is already cleared.
    }
    openProject(goldenGateProject)
  }

  function resetProject() {
    const defaults = defaultFiles(activeProject)
    setFilesByProject((prev) => ({ ...prev, [activeProjectId]: defaults }))
    setActivePath(activeProject.defaultFile)
    try {
      localStorage.removeItem(STORAGE_PREFIX + activeProjectId)
    } catch {
      // Ignore — in-memory state is already reset.
    }
    setSyncNonce((n) => n + 1)
  }

  function addFile(folder: string) {
    const files = filesByProjectRef.current[activeProjectId] ?? {}
    let path = folder ? `${folder}/untitled.lab` : 'untitled.lab'
    let index = 1
    while (files[path] != null) {
      index += 1
      path = folder
        ? `${folder}/untitled-${index}.lab`
        : `untitled-${index}.lab`
    }
    const contents = '# New file.\n'
    setFilesByProject((prev) => ({
      ...prev,
      [activeProjectId]: { ...prev[activeProjectId], [path]: contents },
    }))
    versionsRef.current[path] = 1
    void engine
      .setDocument(path, 1, contents, moduleFor(path))
      .then(scheduleRefresh)
    setActivePath(path)
  }

  function renameFile(oldPath: string, newName: string) {
    const trimmed = newName.trim()
    if (!trimmed) return
    const folder = oldPath.includes('/')
      ? oldPath.slice(0, oldPath.lastIndexOf('/'))
      : ''
    const finalName = trimmed.includes('.') ? trimmed : `${trimmed}.lab`
    const newPath = folder ? `${folder}/${finalName}` : finalName
    if (newPath === oldPath) return
    const files = filesByProjectRef.current[activeProjectId] ?? {}
    if (files[newPath] != null) return

    const text = files[oldPath] ?? ''
    setFilesByProject((prev) => {
      const projectFiles = { ...prev[activeProjectId] }
      delete projectFiles[oldPath]
      projectFiles[newPath] = text
      return { ...prev, [activeProjectId]: projectFiles }
    })
    void engine.removeDocument(oldPath)
    versionsRef.current[newPath] = 1
    void engine
      .setDocument(newPath, 1, text, moduleFor(newPath))
      .then(scheduleRefresh)
    if (activePath === oldPath) setActivePath(newPath)
  }

  function deleteFile(path: string) {
    const files = filesByProjectRef.current[activeProjectId] ?? {}
    const remaining = Object.keys(files).filter(
      (candidate) => candidate !== path,
    )
    if (remaining.length === 0) return
    setFilesByProject((prev) => {
      const projectFiles = { ...prev[activeProjectId] }
      delete projectFiles[path]
      return { ...prev, [activeProjectId]: projectFiles }
    })
    void engine.removeDocument(path)
    if (activePath === path) setActivePath(remaining[0])
    scheduleRefresh()
  }

  async function formatActiveFile() {
    const formatted = await engine.formatDocument(activePath)
    const current =
      filesByProjectRef.current[activeProjectId]?.[activePath] ?? ''
    if (formatted == null || formatted === current) return
    editorRef.current?.applyChanges([
      { from: 0, to: current.length, insert: formatted },
    ])
  }

  async function copySource() {
    try {
      await navigator.clipboard.writeText(activeText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const errorPaths = new Set(
    Object.entries(diagnostics)
      .filter(([, entries]) =>
        entries.some((entry) => entry.severity === 'error'),
      )
      .map(([path]) => path),
  )
  const diagnosticsByFile = Object.keys(activeFiles).map((path) => ({
    path,
    diagnostics: diagnostics[path] ?? [],
  }))
  const filePaths = Object.keys(activeFiles)

  const fileList = activeProject.files
    .map((f) => ({ path: f.path, contents: activeFiles[f.path] ?? f.contents }))
    .concat(
      filePaths
        .filter((path) => !activeProject.files.some((f) => f.path === path))
        .map((path) => ({ path, contents: activeFiles[path] })),
    )

  return {
    engine,
    status,
    editorRef,
    activeProject,
    activePath,
    activeText,
    inScratch,
    copied,
    diagnostics,
    symbols,
    errorPaths,
    diagnosticsByFile,
    filePaths,
    fileList,
    setActivePath,
    jumpTo,
    handleActiveFileChange,
    applyTextEdits,
    createScratch,
    closeScratch,
    resetProject,
    addFile,
    renameFile,
    deleteFile,
    formatActiveFile,
    copySource,
  }
}
