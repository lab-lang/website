import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { GithubMark, Wordmark } from '@/components/site/marks'
import { REPO_URL } from '@/lib/site'

const navigation = [
  { label: 'Why Lab', to: '/why' },
  { label: 'Docs', to: '/docs' },
  { label: 'Playground', to: '/playground' },
  { label: 'Community', to: '/community' },
]

/*
 * The hit area is padded but never painted: a hover fill here would read as a
 * toolbar of buttons. Only the label and its dot respond.
 */
function navClass({ isActive }: { isActive: boolean }) {
  return `press group flex items-center gap-2 px-3 py-2 text-[14px] transition-colors ${isActive ? 'text-ink' : 'text-umber hover:text-ink'}`
}

/** The same link, sized for a thumb rather than a cursor. */
function mobileNavClass({ isActive }: { isActive: boolean }) {
  return `press group flex min-h-12 items-center gap-3 rounded-xl px-3 text-[16px] transition-colors ${isActive ? 'bg-ink/6 text-ink' : 'text-umber active:bg-ink/6'}`
}

function NavDot({ isActive }: { isActive: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`size-1.5 shrink-0 rounded-full transition-colors duration-300 ${isActive ? 'bg-amber' : 'bg-ink/8 group-hover:bg-ink/25'}`}
    />
  )
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const [menuPath, setMenuPath] = useState(pathname)

  /*
   * Navigating is the point of the menu, so arriving somewhere closes it. This
   * covers the browser's own back and forward, which the links cannot.
   */
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /*
   * The menu covers the page on a phone, so the page beneath it must not
   * scroll away underneath the panel.
   */
  useEffect(() => {
    if (!menuOpen) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-ink/12 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ${scrolled ? 'nav-elevated bg-paper/95' : 'bg-paper/80'}`}
      >
        <div className="mx-auto flex h-[60px] max-w-[1480px] items-center justify-between px-5 sm:h-[68px] sm:px-8 lg:px-10">
          <Wordmark full />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {navigation.map((item) => (
              <NavLink className={navClass} key={item.to} to={item.to}>
                {({ isActive }) => (
                  <>
                    <NavDot isActive={isActive} />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}

            <span aria-hidden="true" className="mx-2 h-5 w-px bg-ink/12" />

            {/*
             * The octocat takes the slot the nav dot holds on the links beside
             * it, so this reads in the same grammar as the rest of the row
             * rather than as a painted button dropped on the end.
             */}
            <a
              className="press group flex items-center gap-2 px-3 py-2 text-[14px] text-umber hover:text-ink"
              href={REPO_URL}
              rel="noreferrer"
              target="_blank"
            >
              <GithubMark size={15} />
              GitHub
            </a>
          </nav>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="press -mr-1.5 grid size-11 place-items-center rounded-lg border border-ink/18 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {menuOpen && (
          <nav
            aria-label="Mobile"
            className="stage-panel relative border-t border-ink/12 bg-paper px-4 pb-5 pt-3 md:hidden"
            id="mobile-navigation"
          >
            <div className="flex flex-col gap-0.5">
              {navigation.map((item) => (
                <NavLink
                  className={mobileNavClass}
                  key={item.to}
                  onClick={() => setMenuOpen(false)}
                  to={item.to}
                >
                  {({ isActive }) => (
                    <>
                      <NavDot isActive={isActive} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
              <a
                className="press mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ink/18 text-[15px] text-ink"
                href={REPO_URL}
                onClick={() => setMenuOpen(false)}
                rel="noreferrer"
                target="_blank"
              >
                <GithubMark size={15} />
                GitHub
              </a>
            </div>
          </nav>
        )}
      </header>

      {/*
       * A sibling of the header, not a child: the header's backdrop-filter
       * would otherwise become this element's containing block and confine the
       * dimming to the header itself. Tapping it dismisses the menu.
       */}
      {menuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-ink/25 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
