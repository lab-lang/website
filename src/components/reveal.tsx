import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

/**
 * Reveals its children once, the first time they enter the viewport. The delay
 * staggers members of a group; keep it under ~240ms so a row still reads as one
 * gesture rather than a queue.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
  style,
}: {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          /*
           * A jump scroll can carry an element from below the fold to above it
           * between two observer samples, so treat "already passed" as shown.
           */
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            setShown(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      className={`reveal ${className}`}
      data-shown={shown}
      ref={ref}
      style={{ '--d': `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
