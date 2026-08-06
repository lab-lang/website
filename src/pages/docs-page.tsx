import { ArrowLeft, ArrowRight, ExternalLink, Search } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { REPO_URL } from '../lib/site'
import {
  DEFAULT_DOC_SLUG,
  docGroups,
  docPages,
  getDocPage,
} from '../lib/docs-content'
import { mdxComponents } from '../components/mdx-components'
import { SHORTCUT_LABEL, useOpenDocsSearch } from '../lib/docs-search-context'
import { usePageMeta } from '../lib/use-page-meta'

interface TocEntry {
  id: string
  text: string
}

/** Scans the rendered page for h2s once MDX content mounts, and tracks which is in view. */
function useDocToc(articleRef: RefObject<HTMLElement | null>, slug: string) {
  const [toc, setToc] = useState<TocEntry[]>([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const article = articleRef.current
    if (!article) return

    const headings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>('h2[id]'),
    )
    setToc(headings.map((h) => ({ id: h.id, text: h.textContent ?? '' })))
    setActive(headings[0]?.id ?? '')
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-72px 0px -62% 0px' },
    )

    for (const heading of headings) observer.observe(heading)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return { toc, active }
}

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

function DocNotFound({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-[1480px] px-5 py-24 text-center sm:px-8 lg:px-10">
      <span className="micro text-amber-deep">Documentation</span>
      <h1 className="type-title mt-4 text-[2rem]">Not in the docs</h1>
      <p className="prose-lab mt-4 text-[15px] text-umber">
        There is no page at{' '}
        <code className="rounded-md bg-ink/8 px-1.5 py-0.5 font-mono text-[13px] text-ink">
          /docs/{slug}
        </code>
        .
      </p>
      <Link
        className="press mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-[14px] text-paper"
        to={`/docs/${DEFAULT_DOC_SLUG}`}
      >
        Back to the docs
      </Link>
    </div>
  )
}

export function DocsPage() {
  const params = useParams()
  const navigate = useNavigate()
  const slug = params['*'] || DEFAULT_DOC_SLUG
  const page = getDocPage(slug)
  const articleRef = useRef<HTMLElement>(null)
  const { toc, active } = useDocToc(articleRef, slug)
  const openSearch = useOpenDocsSearch()

  usePageMeta({
    title: page ? `${page.frontmatter.title} — Lab` : 'Not in the docs — Lab',
    description: page?.frontmatter.description,
    path: `/docs/${slug}`,
    type: 'article',
    noindex: !page,
  })

  if (!page) return <DocNotFound slug={slug} />

  const index = docPages.findIndex((entry) => entry.slug === slug)
  const prev = index > 0 ? docPages[index - 1] : undefined
  const next = index < docPages.length - 1 ? docPages[index + 1] : undefined
  const { Component, frontmatter } = page

  return (
    <div className="mx-auto grid max-w-[1480px] px-5 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 lg:px-10">
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
                        <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-ink/10 pl-3">
                          {toc.map((entry) => (
                            <li key={entry.id}>
                              <a
                                aria-current={
                                  active === entry.id ? 'true' : undefined
                                }
                                className={`block rounded-md px-2 py-1 text-[12.5px] transition-colors duration-150 ${
                                  active === entry.id
                                    ? 'text-ink'
                                    : 'text-umber-soft hover:text-umber'
                                }`}
                                href={`#${entry.id}`}
                                onClick={(event) =>
                                  scrollToHeading(event, entry.id)
                                }
                              >
                                {entry.text}
                              </a>
                            </li>
                          ))}
                        </ul>
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

      <article className="min-w-0 py-10 sm:py-14 lg:py-16" ref={articleRef}>
        <label
          className="micro block text-ink/40 lg:hidden"
          htmlFor="doc-page-select"
        >
          Documentation
        </label>
        {/* The narrow-screen counterpart of the sidebar: jump to a page, or search across them. */}
        <div className="mt-2 flex gap-2 lg:hidden">
          <select
            className="min-h-12 min-w-0 flex-1 rounded-xl border border-ink/20 bg-shell px-3 py-2.5 text-[15px] text-ink"
            id="doc-page-select"
            onChange={(event) => navigate(`/docs/${event.target.value}`)}
            value={slug}
          >
            {docGroups.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.pages.map((groupPage) => (
                  <option key={groupPage.slug} value={groupPage.slug}>
                    {groupPage.frontmatter.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            aria-label="Search the documentation"
            className="press grid min-h-12 w-12 shrink-0 place-items-center rounded-xl border border-ink/20 text-umber"
            onClick={openSearch}
            type="button"
          >
            <Search aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="mt-8 lg:mt-0">
            <span className="micro text-amber-deep">
              {frontmatter.eyebrow}
            </span>
            <h1 className="type-display mt-5 text-[clamp(2.1rem,4.4vw,3.4rem)]">
              {frontmatter.title}
            </h1>
            <p className="prose-lab mt-6 text-pretty text-[16.5px] leading-[1.7] text-umber sm:text-[17px]">
              {frontmatter.description}
            </p>
          </div>

          <Component components={mdxComponents} />

          <nav
            aria-label="Page"
            className="mt-16 flex flex-col gap-3 border-t border-ink/12 pt-8 sm:flex-row sm:justify-between"
          >
            {prev ? (
              <Link
                className="press flex flex-col rounded-xl border border-ink/15 px-4 py-3 hover:border-ink/35 sm:max-w-xs"
                to={`/docs/${prev.slug}`}
              >
                <span className="micro flex items-center gap-1.5 text-ink/40">
                  <ArrowLeft aria-hidden="true" size={12} />
                  Previous
                </span>
                <span className="type-head mt-1 text-[14.5px] text-ink">
                  {prev.frontmatter.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                className="press flex flex-col items-end rounded-xl border border-ink/15 px-4 py-3 text-right hover:border-ink/35 sm:ml-auto sm:max-w-xs"
                to={`/docs/${next.slug}`}
              >
                <span className="micro flex items-center gap-1.5 text-ink/40">
                  Next
                  <ArrowRight aria-hidden="true" size={12} />
                </span>
                <span className="type-head mt-1 text-[14.5px] text-ink">
                  {next.frontmatter.title}
                </span>
              </Link>
            )}
          </nav>
        </div>
      </article>
    </div>
  )
}
