import { Menu, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { REPO_URL } from '../lib/site'

const navigation = [
  { label: 'Docs', to: '/docs' },
  { label: 'Playground', to: '/playground' },
  { label: 'Community', to: '/community' },
]

/** `=` above `<-`: what replay may repeat, and what it may not. */
function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      height={size}
      viewBox="0 0 64 64"
      width={size}
    >
      <rect fill="currentColor" height="64" rx="15" width="64" />
      <rect
        fill="#f0e3c9"
        fillOpacity=".34"
        height="5.5"
        rx="2.75"
        width="31"
        x="17"
        y="17.5"
      />
      <rect
        fill="var(--color-amber)"
        height="5.5"
        rx="2.75"
        width="26"
        x="22"
        y="36"
      />
      <path
        d="M27 33.25 20 38.75 27 44.25"
        fill="none"
        stroke="var(--color-amber)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.5"
      />
    </svg>
  )
}

/** The GitHub octocat, inlined since lucide-react ships no brand marks. */
function GithubMark({ size = 14 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="currentColor" height={size} viewBox="0 0 24 24" width={size}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.44-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  )
}

function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <Link
      aria-label="Lab home"
      className="press group inline-flex items-center rounded-md text-ink"
      to="/"
    >
      <span className="nudge inline-flex items-center gap-2.5 group-hover:translate-x-[-3px]">
        <Mark size={size} />
        <span className="type-head text-[20px] tracking-[-0.012em]">Lab</span>
      </span>
    </Link>
  )
}

function navClass({ isActive }: { isActive: boolean }) {
  return `press group flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] transition-colors ${isActive ? 'text-ink' : 'text-umber hover:bg-ink/6 hover:text-ink'
    }`
}

/** The same link, sized for a thumb rather than a cursor. */
function mobileNavClass({ isActive }: { isActive: boolean }) {
  return `press group flex min-h-12 items-center gap-3 rounded-xl px-3 text-[16px] transition-colors ${isActive ? 'bg-ink/6 text-ink' : 'text-umber active:bg-ink/6'
    }`
}

function NavDot({ isActive }: { isActive: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`size-1.5 shrink-0 rounded-full transition-colors duration-300 ${isActive ? 'bg-amber' : 'bg-ink/8 group-hover:bg-ink/25'
        }`}
    />
  )
}

export function SiteShell({ children }: { children: ReactNode }) {
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
    <div className="flex min-h-dvh flex-col">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        href="#main"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-50 border-b border-ink/12 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ${scrolled ? 'nav-elevated bg-paper/95' : 'bg-paper/80'
          }`}
      >
        <div className="mx-auto flex h-[60px] max-w-[1480px] items-center justify-between px-5 sm:h-[68px] sm:px-8 lg:px-10">
          <Wordmark />

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

            <a
              className="press flex items-center gap-1.5 rounded-lg border border-ink/18 px-3 py-2 text-[13px] text-umber hover:border-ink/35 hover:text-ink"
              href={REPO_URL}
              rel="noreferrer"
              target="_blank"
            >
              <GithubMark />
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
                onClick={() => setMenuOpen(false)}
                href={REPO_URL}
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

      <main className="flex-1" id="main">
        {children}
      </main>

      <footer className="border-t border-ink/12 bg-sand/45">
        <div className="mx-auto max-w-[1480px] px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Wordmark size={28} />
              <p className="prose-lab mt-4 text-[14px] leading-[1.7] text-umber">
                Lab is a programming language and compiler toolchain for
                describing biology and orchestrating work in the laboratory.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[14px] sm:gap-x-20">
              <div className="flex flex-col gap-3">
                <span className="micro text-ink/40">Learn</span>
                <Link className="rule-link w-fit text-umber hover:text-ink" to="/docs">
                  Documentation
                </Link>
                <Link
                  className="rule-link w-fit text-umber hover:text-ink"
                  to="/playground"
                >
                  Playground
                </Link>
                <Link
                  className="rule-link w-fit text-umber hover:text-ink"
                  to="/community"
                >
                  Community
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <span className="micro text-ink/40">Build</span>
                <a
                  className="rule-link w-fit text-umber hover:text-ink"
                  href={REPO_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
                <a
                  className="rule-link w-fit text-umber hover:text-ink"
                  href={`${REPO_URL}/issues`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Issues
                </a>
                <a
                  className="rule-link w-fit text-umber hover:text-ink"
                  href={`${REPO_URL}/tree/master/docs`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Design documents
                </a>
                <Link className="rule-link w-fit text-umber hover:text-ink" to="/brand">
                  Brand
                </Link>
              </div>
            </div>
          </div>

          <div className="tick-rule mt-12" />
          <div className="mt-5 text-[13px] text-umber-soft">
            <span>Apache-2.0 · v0.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
