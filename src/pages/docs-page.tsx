import { useRef } from 'react'
import { useParams } from 'react-router-dom'

import { DocNotFound } from '@/components/docs/doc-not-found'
import { DocPager } from '@/components/docs/doc-pager'
import { DocsPagePicker } from '@/components/docs/docs-page-picker'
import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { mdxComponents } from '@/components/docs/mdx-components'
import { useDocToc } from '@/components/docs/use-doc-toc'
import { DEFAULT_DOC_SLUG, docPages, getDocPage } from '@/lib/docs-content'
import { pageTitle } from '@/lib/site'
import { usePageMeta } from '@/lib/use-page-meta'

export function DocsPage() {
  const params = useParams()
  const slug = params['*'] || DEFAULT_DOC_SLUG
  const page = getDocPage(slug)
  const articleRef = useRef<HTMLElement>(null)
  const { toc, active } = useDocToc(articleRef, slug)

  usePageMeta({
    title: pageTitle(page ? page.frontmatter.title : 'Not in the docs'),
    description: page?.frontmatter.description,
    path: `/docs/${slug}`,
    type: 'article',
    noindex: !page,
  })

  if (!page) return <DocNotFound slug={slug} />

  const index = docPages.findIndex((entry) => entry.slug === slug)
  const prev = index > 0 ? docPages[index - 1] : undefined
  const next = index < docPages.length - 1 ? docPages[index + 1] : undefined
  const { Component, frontmatter } = page

  return (
    <div className="mx-auto grid max-w-[1480px] px-5 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 lg:px-10">
      <DocsSidebar active={active} slug={slug} toc={toc} />

      <article className="min-w-0 py-10 sm:py-14 lg:py-16" ref={articleRef}>
        <DocsPagePicker slug={slug} />

        <div className="mx-auto max-w-3xl">
          <div className="mt-8 lg:mt-0">
            <span className="micro text-amber-deep">{frontmatter.eyebrow}</span>
            <h1 className="type-display mt-5 text-[clamp(2.1rem,4.4vw,3.4rem)]">
              {frontmatter.title}
            </h1>
            <p className="prose-lab mt-6 text-pretty text-[16.5px] leading-[1.7] text-umber sm:text-[17px]">
              {frontmatter.description}
            </p>
          </div>

          <Component components={mdxComponents} />

          <DocPager next={next} prev={prev} />
        </div>
      </article>
    </div>
  )
}
