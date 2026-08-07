import { ExternalLink, Search } from 'lucide-react'
import { type MouseEvent } from 'react'
import { Link } from 'react-router-dom'

import { type TocEntry } from '@/components/docs/use-doc-toc'
import { docGroups } from '@/lib/docs-content'
import { SHORTCUT_LABEL, useOpenDocsSearch } from '@/lib/docs-search-context'
import { REPO_URL } from '@/lib/site'

/**
 * Owns the scroll for an in-page TOC click entirely, rather than letting the
 * browser's native smooth-scroll-to-anchor and App.tsx's RouteEffects
 * (which also reacts to hash changes through React Router) both try to
 * scroll for the same click, and that fight is what made the page appear to
 * jump around instead of just scrolling the content. `replaceState` updates
 * the URL without going through React Router's history listener, so
 * RouteEffects never fires a second, competing scroll.
 */
function scrollToHeading(event: MouseEvent<HTMLAnchorElement>, id: string) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }
  const target = document.getElementById(id)
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${id}`)
}

function PageToc({ toc, active }: { toc: TocEntry[]; active: string }) {
  return (
    <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-ink/10 pl-3">
      {toc.map((entry) => (
        <li key={entry.id}>
          <a
            aria-current={active === entry.id ? 'true' : undefined}
            className={`block rounded-md px-2 py-1 text-[12.5px] transition-colors duration-150 ${
              active === entry.id
                ? 'text-ink'
                : 'text-umber-soft hover:text-umber'
            }`}
            href={`#${entry.id}`}
            onClick={(event) => scrollToHeading(event, entry.id)}
          >
            {entry.text}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function DocsSidebar({
  slug,
  toc,
  active,
}: {
  slug: string
  toc: TocEntry[]
  active: string
}) {
  const openSearch = useOpenDocsSearch()

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="Documentation"
        className="sticky top-[92px] max-h-[calc(100dvh-112px)] overflow-y-auto py-16 pr-2"
      >
        {/*
         * Shaped like the field it opens, and sitting at the head of the
         * column it searches. The shortcut works site-wide; this is just
         * the place it is advertised.
         */}
        <button
          aria-keyshortcuts="Meta+K Control+K"
          className="press mb-8 flex w-full items-center gap-2 rounded-lg border border-ink/15 bg-shell/60 py-2 pl-2.5 pr-2 text-[13px] text-umber hover:border-ink/30 hover:text-ink"
          onClick={openSearch}
          type="button"
        >
          <Search aria-hidden="true" size={14} />
          Search
          <kbd className="ml-auto rounded-[5px] border border-ink/12 bg-ink/5 px-1.5 py-0.5 font-sans text-[10.5px] text-umber-soft">
            {SHORTCUT_LABEL}
          </kbd>
        </button>

        {docGroups.map((group) => (
          <div className="mt-7 first:mt-0" key={group.group}>
            <span className="micro text-ink/40">{group.group}</span>
            <ul className="mt-2.5 space-y-0.5">
              {group.pages.map((groupPage) => {
                const isActive = groupPage.slug === slug
                return (
                  <li key={groupPage.slug}>
                    <Link
                      aria-current={isActive ? 'page' : undefined}
                      className={`block rounded-lg px-3 py-1.5 text-[13.5px] transition-colors duration-150 ${
                        isActive
                          ? 'bg-ink/8 text-ink'
                          : 'text-umber hover:text-ink'
                      }`}
                      to={`/docs/${groupPage.slug}`}
                    >
                      {groupPage.frontmatter.title}
                    </Link>
                    {isActive && toc.length > 0 && (
                      <PageToc active={active} toc={toc} />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        <div className="mt-8 border-t border-ink/12 pt-5">
          <a
            className="inline-flex items-center gap-1.5 text-[13px] text-umber hover:text-ink"
            href={`${REPO_URL}/tree/master/docs`}
            rel="noreferrer"
            target="_blank"
          >
            Full design documents
            <ExternalLink aria-hidden="true" size={12} />
          </a>
        </div>
      </nav>
    </aside>
  )
}
