import { useSyncExternalStore } from 'react'

/**
 * The two frontends an example can be read in. `lab` is the native language;
 * `python` states the same program with its designs as SBOL 3 components.
 */
export type CodeLanguage = 'lab' | 'python'

export const CODE_LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  lab: 'Lab',
  python: 'Python',
}

const STORAGE_KEY = 'lab-code-language'

/**
 * Python is what a visitor is most likely to already write, so it is what an
 * unset preference resolves to. Only an explicit choice of Lab is read back.
 */
function read(): CodeLanguage {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'lab' ? 'lab' : 'python'
  } catch {
    return 'python'
  }
}

/*
 * One module-level value rather than per-component state: every switcher on
 * every page renders the same choice, and a toggle on one block flips them
 * all in the same commit.
 */
let current: CodeLanguage = read()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setCodeLanguage(language: CodeLanguage) {
  if (language === current) return
  current = language
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // A blocked storage write only costs persistence, not the toggle.
  }
  listeners.forEach((listener) => listener())
}

export function useCodeLanguage(): CodeLanguage {
  return useSyncExternalStore(subscribe, () => current)
}
