import * as React from 'react'

declare module 'mdx/types.js' {
  export import JSX = React.JSX
}

// Typed frontmatter for docs content, exported by remark-mdx-frontmatter.
// This intentionally overrides (not merges with) @types/mdx's own `*.mdx`
// declaration, so its default export is re-declared here too.
declare module '*.mdx' {
  import type { Element, MDXProps } from 'mdx/types'
  import type { DocFrontmatter } from './lib/docs-content'

  export const frontmatter: DocFrontmatter

  export default function MDXContent(props: MDXProps): Element
}
