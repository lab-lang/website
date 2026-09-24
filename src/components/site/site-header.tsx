import { useEffect, useState } from 'react'

import { GithubMark, Wordmark } from '@/components/site/marks'
import { REPO_URL } from '@/lib/site'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-ink/12 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ${scrolled ? 'nav-elevated bg-paper/95' : 'bg-paper/80'}`}
    >
      <div className="mx-auto flex h-[60px] max-w-[1480px] items-center justify-between px-5 sm:h-[68px] sm:px-8 lg:px-10">
        <Wordmark full />
        <a
          className="press flex min-h-11 items-center gap-2 px-3 py-2 text-[14px] text-umber hover:text-ink"
          href={REPO_URL}
          rel="noreferrer"
          target="_blank"
        >
          <GithubMark size={15} />
          GitHub
        </a>
      </div>
    </header>
  )
}
