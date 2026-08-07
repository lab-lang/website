import { useEffect, useState, type RefObject } from 'react'

export interface TocEntry {
  id: string
  text: string
}

/** Scans the rendered page for h2s once MDX content mounts, and tracks which is in view. */
export function useDocToc(
  articleRef: RefObject<HTMLElement | null>,
  slug: string,
) {
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
