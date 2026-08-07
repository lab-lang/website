import { type ReactNode } from 'react'

import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { ThemeToggle } from '@/components/site/theme-toggle'

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        href="#main"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main className="flex-1" id="main">
        {children}
      </main>

      <SiteFooter />

      {/* Pinned to the viewport, so it rides above every route the shell wraps. */}
      <ThemeToggle />
    </div>
  )
}
