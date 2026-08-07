/**
 * The contract between the `remark-doc-search` build plugin, which produces
 * these records while the MDX is parsed, and the site, which reads them off
 * the compiled module to build its search index.
 */
export interface DocSection {
  /**
   * The heading's anchor, matching the id `mdx-components` gives the rendered
   * heading, so a search result can deep-link straight to it. Empty for the
   * text that sits above a page's first heading.
   */
  id: string
  heading: string
  depth: number
  text: string
}
