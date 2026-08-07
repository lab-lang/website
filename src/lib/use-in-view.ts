import { useEffect, useRef, useState } from 'react'

/**
 * True once the element has scrolled into view, and stays true afterward —
 * a section should settle in once, not replay every time it crosses the
 * viewport edge.
 */
/*
 * The default margin trims only the bottom edge, and by less than a reveal is
 * tall: the fade should be finishing as the element clears the viewport edge,
 * never holding fully-visible content blank.
 */
export function useInView<T extends HTMLElement>(
  rootMargin = '0px 0px -48px 0px',
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // An instant jump (back-navigation scroll restoration, a deep link)
        // can land past the section without ever rendering a frame where it
        // intersects, so the section would stay invisible forever. Once it's
        // above the viewport it has already been "seen" as far as a reveal
        // animation is concerned, so show it rather than leave it blank.
        if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0) {
          setInView(true)
        }
      },
      { rootMargin },
    )
    observer.observe(node)

    return () => observer.disconnect()
  }, [inView, rootMargin])

  return { ref, inView }
}
