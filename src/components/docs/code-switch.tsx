import {
  isValidElement,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'

import { CodeLanguageToggle } from '@/components/code-language-toggle'
import { SourceCode, type SourceLanguage } from '@/components/source-code'
import {
  setCodeLanguage,
  useCodeLanguage,
  type CodeLanguage,
} from '@/lib/code-language'

interface Variant {
  language: CodeLanguage
  filename?: string
  source: string
}

interface CodeElementProps {
  className?: string
  'data-filename'?: string
  children?: ReactNode
}

/*
 * MDX renders a fenced block as pre > code, substituting both elements from
 * the component mapping. The mapping happens lazily at render, so the
 * children seen here still carry the fence's language class and meta as
 * props, the same place the `pre` override reads them from.
 */
function variants(children: ReactNode): Variant[] {
  const nodes = Array.isArray(children) ? children : [children]
  const found: Variant[] = []

  for (const node of nodes) {
    if (!isValidElement(node)) continue
    const code = (node.props as { children?: ReactNode })
      .children as ReactElement<CodeElementProps>
    if (!isValidElement(code)) continue

    const language = /language-(\w+)/.exec(code.props.className ?? '')?.[1]
    if (language !== 'lab' && language !== 'python') continue

    found.push({
      language,
      filename: code.props['data-filename'],
      source: String(code.props.children ?? '').replace(/\n$/, ''),
    })
  }

  return found
}

/**
 * One example in every frontend that can express it. Wrap adjacent `lab` and
 * `python` fences; the tabs switch every CodeSwitch on the site at once, and
 * the choice persists across pages and visits.
 */
export function CodeSwitch({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null)
  const language = useCodeLanguage()
  const all = variants(children)
  const active = all.find((variant) => variant.language === language) ?? all[0]

  if (!active) return null

  function choose(next: CodeLanguage) {
    /*
     * Switchers earlier in the page change height in the same commit, which
     * would slide this block out from under the cursor. Measure, flush the
     * re-render synchronously, and scroll the difference away.
     */
    const before = container.current?.getBoundingClientRect().top ?? 0
    flushSync(() => setCodeLanguage(next))
    const after = container.current?.getBoundingClientRect().top ?? before
    window.scrollBy(0, after - before)
  }

  return (
    <div
      className="mt-7 overflow-hidden rounded-2xl border border-ink/20 bg-vessel"
      ref={container}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-2">
        <span className="micro text-[#f6ece0]/45">{active.filename}</span>
        {/* A single-flavor block states its filename and offers no choice. */}
        {all.length > 1 && <CodeLanguageToggle onChange={choose} />}
      </div>
      <SourceCode
        language={active.language as SourceLanguage}
        source={active.source}
      />
    </div>
  )
}
