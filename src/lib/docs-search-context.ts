import { createContext, useContext } from 'react'

/** Apple keyboards label the key ⌘; everything else spells it out. */
export const SHORTCUT_LABEL = /Mac|iPhone|iPad/.test(navigator.userAgent)
  ? '⌘K'
  : 'Ctrl K'

/** True while the keystroke belongs to whatever the visitor is typing in. */
export function isTyping(target: EventTarget | null) {
  const element = target as HTMLElement | null
  if (!element) return false
  return (
    element.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
  )
}

export const OpenSearch = createContext<() => void>(() => {})

/** Opens the palette from wherever a trigger happens to be rendered. */
export function useOpenDocsSearch() {
  return useContext(OpenSearch)
}
