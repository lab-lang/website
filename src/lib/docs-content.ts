import type { MDXContent } from 'mdx/types'

import type { DocSection } from '@/lib/doc-section'

export interface DocFrontmatter {
  title: string
  eyebrow: string
  description: string
  group: string
  order: number
  /** Omit to follow this group, or set null to end the reading path. */
  previous?: string | null
  next?: string | null
  /** Landing pages can keep the sidebar focused on destinations instead of local headings. */
  toc?: boolean
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
 * Contribution paths lead the documentation. References follow in their own groups.
 * Sidebar, mobile navigation, browsing, and reading order share this sequence.
 */
const GROUP_ORDER = [
  'Start here',
  'Contribution paths',
  'Language guide',
  'Compiler reference',
  'Instrument reference',
]

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
  .sort(
    (a, b) =>
      GROUP_ORDER.indexOf(a.frontmatter.group) -
        GROUP_ORDER.indexOf(b.frontmatter.group) ||
      a.frontmatter.order - b.frontmatter.order,
  )

for (const page of docPages) {
  if (!GROUP_ORDER.includes(page.frontmatter.group)) {
    throw new Error(`Unknown documentation group in ${page.slug}`)
  }
  for (const destination of [
    page.frontmatter.previous,
    page.frontmatter.next,
  ]) {
    if (
      typeof destination === 'string' &&
      !docPages.some((entry) => entry.slug === destination)
    ) {
      throw new Error(
        `Unknown reading-path destination ${destination} in ${page.slug}`,
      )
    }
  }
}

export const docGroups: DocGroup[] = GROUP_ORDER.map((group) => ({
  group,
  pages: docPages.filter((page) => page.frontmatter.group === group),
})).filter((entry) => entry.pages.length > 0)

export function getDocPage(slug: string): DocPage | undefined {
  return docPages.find((page) => page.slug === slug)
}

/** Independent contribution paths return to the chooser, not the next unrelated specialty. */
export function getDocNavigation(page: DocPage): {
  prev?: DocPage
  next?: DocPage
} {
  const peers = docPages.filter(
    (entry) => entry.frontmatter.group === page.frontmatter.group,
  )
  const index = peers.indexOf(page)
  const resolve = (
    destination: string | null | undefined,
    fallback?: DocPage,
  ) =>
    destination === undefined
      ? fallback
      : destination === null
        ? undefined
        : getDocPage(destination)

  return {
    prev: resolve(page.frontmatter.previous, peers[index - 1]),
    next: resolve(page.frontmatter.next, peers[index + 1]),
  }
}

export const DEFAULT_DOC_SLUG = 'contributing'
