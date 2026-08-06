import type { MDXContent } from 'mdx/types'
import type { DocSection } from './remark-doc-search'

export interface DocFrontmatter {
  title: string
  eyebrow: string
  description: string
  group: string
  order: number
}

export interface DocPage {
  slug: string
  frontmatter: DocFrontmatter
  Component: MDXContent
  /** Per-heading plaintext, injected at build time by `remark-doc-search`. */
  sections: DocSection[]
}

export interface DocGroup {
  group: string
  pages: DocPage[]
}

/**
 * Sidebar order. A page's frontmatter names one of these groups; unknown
 * group names simply never surface in the sidebar, which is the signal to
 * add them here when a new section is introduced.
 */
const GROUP_ORDER = ['Learn Lab', 'Toolchain', 'Backends', 'Reference']

const modules = import.meta.glob<{
  default: DocPage['Component']
  frontmatter: DocFrontmatter
  sections: DocSection[]
}>('/src/content/docs/**/*.mdx', { eager: true })

export const docPages: DocPage[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.replace('/src/content/docs/', '').replace(/\.mdx$/, ''),
    frontmatter: mod.frontmatter,
    Component: mod.default,
    sections: mod.sections,
  }))
  .sort((a, b) => a.frontmatter.order - b.frontmatter.order)

export const docGroups: DocGroup[] = GROUP_ORDER.map((group) => ({
  group,
  pages: docPages.filter((page) => page.frontmatter.group === group),
})).filter((entry) => entry.pages.length > 0)

export function getDocPage(slug: string): DocPage | undefined {
  return docPages.find((page) => page.slug === slug)
}

export const DEFAULT_DOC_SLUG = 'overview'
