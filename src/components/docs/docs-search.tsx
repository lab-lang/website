import { CornerDownLeft, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { docGroups } from '@/lib/docs-content'
import {
  highlight,
  searchDocs,
  searchTerms,
  type DocSearchResult,
} from '@/lib/docs-search'
import { isTyping, OpenSearch } from '@/lib/docs-search-context'

/**
 * With no query there is nothing to rank, so the palette lists the doc set
 * instead. That makes an empty box useful rather than blank, and gives the
 * keyboard the same list to walk in both states.
 */
const BROWSE: DocSearchResult[] = docGroups.flatMap((group) =>
  group.pages.map((page) => ({
    key: page.slug,
    slug: page.slug,
    hash: '',
    title: page.frontmatter.title,
    group: group.group,
    heading: '',
    snippet: page.frontmatter.description,
  })),
)

function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  return (
    <>
      {highlight(text, terms).map((run, index) =>
        run.match ? (
          <mark
            className="rounded-[3px] bg-amber/22 px-0.5 text-ink"
            key={index}
          >
            {run.text}
          </mark>
        ) : (
          <span key={index}>{run.text}</span>
        ),
      )}
    </>
  )
}

/**
 * Owns the palette and the keystrokes that summon it. The visible trigger
 * lives in the documentation sidebar rather than the site header, so the
 * marketing pages stay free of chrome, but the shortcut stays global: someone
 * who knows the site can reach for it from the homepage and land in the docs.
 */
export function DocsSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const command =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      const slash = event.key === '/' && !isTyping(event.target)
      if (!command && !slash) return

      event.preventDefault()
      setOpen(true)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <OpenSearch.Provider value={() => setOpen(true)}>
      {children}
      <DocsSearch onClose={() => setOpen(false)} open={open} />
    </OpenSearch.Provider>
  )
}

function Hint({ children }: { children: string }) {
  return (
    <kbd className="rounded-[5px] border border-ink/15 bg-ink/5 px-1.5 py-0.5 font-sans text-[10.5px] text-umber">
      {children}
    </kbd>
  )
}

function DocsSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const terms = useMemo(() => searchTerms(query), [query])
  const results = useMemo(
    () => (terms.length > 0 ? searchDocs(query) : BROWSE),
    [query, terms.length],
  )

  /*
   * Opening is the only time the palette resets, adjusted during render rather
   * than in an effect so the first paint already shows the empty box. Closing
   * leaves the query alone; the next deliberate open is what starts clean.
   */
  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (open) {
      setQuery('')
      setActive(0)
    }
  }

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // The palette covers the page, so the page beneath it must not scroll away.
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    const restoreFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
      restoreFocus?.focus?.()
    }
  }, [open])

  // Keyboard selection has to keep its target on screen as it walks past the fold.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  function go(result: DocSearchResult) {
    navigate(`/docs/${result.slug}${result.hash ? `#${result.hash}` : ''}`)
    onClose()
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (results.length === 0) return
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((index) => (index + step + results.length) % results.length)
      return
    }
    if (event.key === 'Enter' && results[active]) {
      event.preventDefault()
      go(results[active])
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-center px-4 pt-[8vh] sm:pt-[12vh]">
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-ink/35 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        aria-label="Search documentation"
        aria-modal="true"
        className="stage-panel relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-ink/15 bg-shell shadow-[0_28px_60px_-20px_rgb(43_28_17_/_0.45)] sm:max-w-2xl lg:max-w-3xl"
        onKeyDown={onKeyDown}
        role="dialog"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-ink/12 px-4">
          <Search
            aria-hidden="true"
            className="shrink-0 text-umber-soft"
            size={17}
          />
          <input
            aria-activedescendant={
              results[active] ? `docs-search-option-${active}` : undefined
            }
            aria-autocomplete="list"
            aria-controls="docs-search-results"
            aria-expanded="true"
            className="min-w-0 flex-1 bg-transparent py-4 text-[15px] text-ink outline-none placeholder:text-umber-soft"
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            placeholder="Search the documentation"
            ref={inputRef}
            role="combobox"
            spellCheck={false}
            type="text"
            value={query}
          />
          <button
            aria-label="Close search"
            className="press grid size-8 shrink-0 place-items-center rounded-lg text-umber hover:bg-ink/8 hover:text-ink"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        {results.length === 0 ? (
          <p className="prose-lab px-5 py-10 text-center text-[14px] text-umber">
            Nothing in the docs matches{' '}
            <span className="text-ink">“{query}”</span>.
          </p>
        ) : (
          <ul
            className="min-h-0 flex-1 overflow-y-auto p-2"
            id="docs-search-results"
            ref={listRef}
            role="listbox"
          >
            {results.map((result, index) => (
              <li key={result.key}>
                <button
                  aria-selected={index === active}
                  className={`block w-full rounded-xl px-3 py-2.5 text-left transition-colors duration-100 ${
                    index === active ? 'bg-ink/7' : ''
                  }`}
                  data-index={index}
                  id={`docs-search-option-${index}`}
                  onClick={() => go(result)}
                  onMouseMove={() => setActive(index)}
                  role="option"
                  type="button"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="type-head truncate text-[14.5px] text-ink">
                      <Highlighted terms={terms} text={result.title} />
                    </span>
                    {result.heading && (
                      <span className="truncate text-[13px] text-umber">
                        <span aria-hidden="true" className="text-umber-soft">
                          ›{' '}
                        </span>
                        <Highlighted terms={terms} text={result.heading} />
                      </span>
                    )}
                    <span className="micro ml-auto shrink-0 text-ink/35">
                      {result.group}
                    </span>
                  </div>
                  {result.snippet && (
                    <p className="prose-lab mt-1 line-clamp-2 text-[13px] leading-[1.55] text-umber">
                      <Highlighted terms={terms} text={result.snippet} />
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex shrink-0 items-center gap-4 border-t border-ink/12 px-4 py-2.5 text-[11.5px] text-umber-soft">
          <span className="flex items-center gap-1.5">
            <Hint>↑</Hint>
            <Hint>↓</Hint>
            to navigate
          </span>
          <span className="flex items-center gap-1.5">
            <CornerDownLeft aria-hidden="true" size={11} />
            to open
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <Hint>Esc</Hint>
            to close
          </span>
        </div>
      </div>
    </div>
  )
}
