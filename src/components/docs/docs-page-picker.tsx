import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { docGroups } from '@/lib/docs-content'
import { useOpenDocsSearch } from '@/lib/docs-search-context'

/** The narrow-screen counterpart of the sidebar: jump to a page, or search across them. */
export function DocsPagePicker({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const openSearch = useOpenDocsSearch()

  return (
    <>
      <label
        className="micro block text-ink/40 lg:hidden"
        htmlFor="doc-page-select"
      >
        Documentation
      </label>
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
    </>
  )
}
