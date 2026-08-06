import type {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
} from 'react'
import type { MDXComponents } from 'mdx/types'
import { Link } from 'react-router-dom'
import { slugify } from '../lib/slugify'
import { SourceCode, type SourceLanguage } from './source-code'

function headingText(children: ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(headingText).join('')
  return ''
}

function Heading({
  level,
  className,
  children,
}: {
  level: 'h1' | 'h2' | 'h3'
  className: string
  children: ReactNode
}) {
  const Tag = level
  const id = slugify(headingText(children))
  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  )
}

function DocLink({ href = '', children }: ComponentPropsWithoutRef<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#')
  if (isInternal) {
    return (
      <Link className="rule-link text-ink" to={href}>
        {children}
      </Link>
    )
  }
  return (
    <a className="rule-link text-ink" href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  )
}

interface CodeElementProps {
  className?: string
  'data-filename'?: string
  children?: ReactNode
}

function Code({ className, children }: ComponentPropsWithoutRef<'code'>) {
  if (!className) {
    return (
      <code className="rounded-md bg-ink/8 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
        {children}
      </code>
    )
  }
  // Block code: rendered by the `pre` override below, which reads these
  // props straight off this element rather than off its rendered output.
  return <code className={className}>{children}</code>
}

function Pre({ children }: ComponentPropsWithoutRef<'pre'>) {
  const code = children as ReactElement<CodeElementProps>
  const codeProps = code.props
  const language = (/language-(\w+)/.exec(codeProps.className ?? '')?.[1] ??
    'lab') as SourceLanguage
  const filename = codeProps['data-filename']
  const source = String(codeProps.children ?? '').replace(/\n$/, '')

  return (
    <div className="mt-7 overflow-hidden rounded-2xl border border-ink/20 bg-vessel">
      {filename && (
        <div className="border-b border-white/10 px-5 py-3">
          <span className="micro text-[#f6ece0]/45">{filename}</span>
        </div>
      )}
      <SourceCode language={language} source={source} />
    </div>
  )
}

function Table({ children }: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/15">
      <table className="w-full min-w-[520px] border-collapse text-left">
        {children}
      </table>
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  h1: ({ children }: ComponentPropsWithoutRef<'h1'>) => (
    <Heading className="type-title mt-12 text-[1.9rem]" level="h1">
      {children}
    </Heading>
  ),
  h2: ({ children }: ComponentPropsWithoutRef<'h2'>) => (
    <Heading
      className="type-title mt-14 scroll-mt-24 border-t border-ink/12 pt-10 text-[1.55rem]"
      level="h2"
    >
      {children}
    </Heading>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<'h3'>) => (
    <Heading className="type-head mt-8 scroll-mt-24 text-[1.15rem]" level="h3">
      {children}
    </Heading>
  ),
  p: ({ children }: ComponentPropsWithoutRef<'p'>) => (
    <p className="prose-lab mt-5 text-[15.5px] leading-[1.72] text-umber">
      {children}
    </p>
  ),
  ul: ({ children }: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="prose-lab mt-5 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.65] text-umber marker:text-umber-soft">
      {children}
    </ul>
  ),
  ol: ({ children }: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="prose-lab mt-5 list-decimal space-y-1.5 pl-5 text-[15px] leading-[1.65] text-umber marker:text-umber-soft">
      {children}
    </ol>
  ),
  li: ({ children }: ComponentPropsWithoutRef<'li'>) => (
    <li className="pl-1 [&::marker]:text-umber-soft">{children}</li>
  ),
  blockquote: ({ children }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="prose-lab mt-6 border-l-2 border-amber-deep/50 pl-5 text-[15px] italic leading-[1.65] text-umber">
      {children}
    </blockquote>
  ),
  a: DocLink,
  hr: () => <div className="tick-rule mt-12" />,
  code: Code,
  pre: Pre,
  table: Table,
  thead: ({ children }: ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-sand/60">{children}</thead>
  ),
  tbody: ({ children }: ComponentPropsWithoutRef<'tbody'>) => (
    <tbody className="divide-y divide-ink/10">{children}</tbody>
  ),
  tr: ({ children }: ComponentPropsWithoutRef<'tr'>) => (
    <tr className="bg-shell/60">{children}</tr>
  ),
  th: ({ children }: ComponentPropsWithoutRef<'th'>) => (
    <th className="micro px-5 py-3.5 text-ink/50">{children}</th>
  ),
  td: ({ children }: ComponentPropsWithoutRef<'td'>) => (
    <td className="prose-lab px-5 py-3.5 align-top text-[13.5px] leading-[1.55] text-umber first:text-ink">
      {children}
    </td>
  ),
}
