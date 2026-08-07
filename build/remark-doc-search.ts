import { valueToEstree } from 'estree-util-value-to-estree'
import type { Heading, Root, RootContent } from 'mdast'
import type { Plugin } from 'unified'

import type { DocSection } from '../src/lib/doc-section'
import { slugify } from '../src/lib/slugify'

/** Node types whose `value` is prose a reader would search for. */
const TEXTUAL = new Set(['text', 'inlineCode', 'code'])

/** Node types that carry no searchable prose: frontmatter and import statements. */
const SKIPPED = new Set(['yaml', 'toml', 'mdxjsEsm', 'mdxFlowExpression'])

interface UnknownNode {
  type: string
  value?: string
  alt?: string | null
  children?: UnknownNode[]
}

function collectText(node: UnknownNode, into: string[]) {
  if (SKIPPED.has(node.type)) return

  if (TEXTUAL.has(node.type) && typeof node.value === 'string') {
    into.push(node.value)
  }

  // An image contributes its alt text, which is the only prose it has.
  if (node.type === 'image' && node.alt) into.push(node.alt)

  // Recursing into JSX covers <Callout>, whose body is ordinary page prose.
  for (const child of node.children ?? []) collectText(child, into)
}

function textOf(node: UnknownNode): string {
  const parts: string[] = []
  collectText(node, parts)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

/**
 * Splits a document into one searchable record per heading, and exports the
 * result as `sections` from the compiled MDX module. The site builds its docs
 * search index from those exports, so the index is derived from the same parse
 * that renders the page rather than from a second pass over the source.
 */
const remarkDocSearch: Plugin<[], Root> = () => (tree) => {
  const sections: DocSection[] = []
  let current: DocSection = { id: '', heading: '', depth: 0, text: '' }
  const parts: string[] = []

  const flush = () => {
    const text = parts.join(' ').replace(/\s+/g, ' ').trim()
    if (text || current.heading) sections.push({ ...current, text })
    parts.length = 0
  }

  for (const node of tree.children) {
    if (node.type === 'heading' && (node as Heading).depth <= 3) {
      flush()
      const heading = textOf(node as UnknownNode)
      current = {
        id: slugify(heading),
        heading,
        depth: (node as Heading).depth,
        text: '',
      }
      continue
    }

    const text = textOf(node as UnknownNode)
    if (text) parts.push(text)
  }

  flush()

  tree.children.unshift({
    type: 'mdxjsEsm',
    value: '',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        comments: [],
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            attributes: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'sections' },
                  init: valueToEstree(sections),
                },
              ],
            },
          },
        ],
      },
    },
  } as unknown as RootContent)
}

export default remarkDocSearch
