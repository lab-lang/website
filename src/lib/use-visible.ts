import { useEffect, useRef, useState } from 'react'

/**
 * Whether the element is on screen right now, flipping both ways — for
 * ambient loops that should play while watched and pause while scrolled
 * past. `useInView` is the one-shot counterpart for settle-in reveals.
 */
export function useVisible<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold },
    )
    observer.observe(node)

    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}
