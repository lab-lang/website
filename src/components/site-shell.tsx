import { FlaskConical, GitFork, Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Docs', to: '/docs' },
  { label: 'Playground', to: '/playground' },
]

function Logo() {
  return (
    <Link
      className="pressable inline-flex items-center gap-2.5 rounded-md font-semibold tracking-[-0.02em]"
      to="/"
      aria-label="Lab home"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-ink text-lab-lime">
        <FlaskConical aria-hidden="true" size={18} strokeWidth={2.2} />
      </span>
      <span className="text-lg">lab</span>
    </Link>
  )
}

function navClass({ isActive }: { isActive: boolean }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
    isActive
      ? 'bg-lab-green-light text-ink'
      : 'text-ink-muted hover:text-ink'
  }`
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Logo />

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navigation.map((item) => (
              <NavLink className={navClass} key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
            <a
              aria-label="Lab on GitHub"
              className="pressable ml-2 inline-flex size-9 items-center justify-center rounded-lg border border-ink/15 bg-white/40 text-ink-muted hover:border-ink/30 hover:text-ink"
              href="https://github.com/lab-lang/lab"
              rel="noreferrer"
              target="_blank"
            >
              <GitFork aria-hidden="true" size={17} />
            </a>
          </nav>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="pressable grid size-10 place-items-center rounded-lg border border-ink/15 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {menuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-ink/10 px-5 py-4 md:hidden"
            id="mobile-navigation"
          >
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
              {navigation.map((item) => (
                <NavLink
                  className={navClass}
                  key={item.to}
                  onClick={() => setMenuOpen(false)}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                className="mt-2 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-muted"
                href="https://github.com/lab-lang/lab"
                rel="noreferrer"
                target="_blank"
              >
                <GitFork aria-hidden="true" size={16} />
                GitHub
              </a>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ink/10 bg-paper-deep/45">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-7 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm leading-6 text-ink-muted">
              A programming language and compiler toolkit for portable,
              inspectable laboratory work.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            <Link className="hover:text-ink" to="/docs">
              Documentation
            </Link>
            <Link className="hover:text-ink" to="/playground">
              Playground
            </Link>
            <a
              className="hover:text-ink"
              href="https://github.com/lab-lang/lab"
              rel="noreferrer"
              target="_blank"
            >
              Source
            </a>
            <span>Apache-2.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
