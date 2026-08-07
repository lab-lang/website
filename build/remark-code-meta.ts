import type { Root, Code } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
// Side-effect import: registers `hProperties` on mdast node `data`.
import type {} from 'mdast-util-to-hast'

/**
 * Carries a fenced code block's info-string meta (the filename in
 * ```lab reporter.lab) onto the rendered <code> element as data-filename, so
 * the `pre` MDX component override can show it without any JSX authoring.
 */
const remarkCodeMeta: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'code', (node: Code) => {
    if (!node.meta) return
    node.data ??= {}
    node.data.hProperties = {
      ...node.data.hProperties,
      'data-filename': node.meta,
    }
  })
}

export default remarkCodeMeta
