import { useEffect } from 'react'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_ORIGIN,
  SOCIAL_IMAGE,
} from './site'

export interface PageMeta {
  /** The whole `<title>`, including whatever suffix the page wants. */
  title?: string
  description?: string
  /** Absolute path this page canonically lives at, leading slash included. */
  path: string
  /** `article` for a documentation page, `website` for everything else. */
  type?: 'website' | 'article'
  /** Keeps a page out of search results. Only the 404 wants this. */
  noindex?: boolean
}

/*
 * The site renders on the client, so index.html can only ever carry one set of
 * tags. Search engines and social crawlers that run scripts read the DOM after
 * hydration, which is what these updates are for; the tags in index.html stay
 * as the homepage's answer for the ones that do not.
 */
function upsert(selector: string, create: () => HTMLElement, content: string) {
  const existing = document.head.querySelector(selector)
  const element = existing ?? document.head.appendChild(create())
  element.setAttribute(
    element.tagName === 'LINK' ? 'href' : 'content',
    content,
  )
}

function meta(attribute: 'name' | 'property', key: string, content: string) {
  upsert(`meta[${attribute}="${key}"]`, () => {
    const element = document.createElement('meta')
    element.setAttribute(attribute, key)
    return element
  }, content)
}

export function usePageMeta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path,
  type = 'website',
  noindex = false,
}: PageMeta) {
  useEffect(() => {
    const url = `${SITE_ORIGIN}${path}`
    const image = `${SITE_ORIGIN}${SOCIAL_IMAGE}`

    document.title = title

    meta('name', 'description', description)
    meta('property', 'og:title', title)
    meta('property', 'og:description', description)
    meta('property', 'og:url', url)
    meta('property', 'og:type', type)
    meta('property', 'og:site_name', SITE_NAME)
    meta('property', 'og:image', image)
    meta('name', 'twitter:card', 'summary_large_image')
    meta('name', 'twitter:title', title)
    meta('name', 'twitter:description', description)
    meta('name', 'twitter:image', image)

    upsert(
      'link[rel="canonical"]',
      () => {
        const element = document.createElement('link')
        element.setAttribute('rel', 'canonical')
        return element
      },
      url,
    )

    const robots = document.head.querySelector('meta[name="robots"]')
    if (noindex) {
      meta('name', 'robots', 'noindex')
    } else {
      robots?.remove()
    }
  }, [description, noindex, path, title, type])
}
