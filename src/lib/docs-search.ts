import { docPages } from '@/lib/docs-content'

export interface DocSearchResult {
  /** Stable identity for React keys and the active-descendant id. */
  key: string
  slug: string
  hash: string
  title: string
  group: string
  heading: string
  snippet: string
}

interface Entry {
  key: string
  slug: string
  hash: string
  title: string
  group: string
  heading: string
  description: string
  text: string
  depth: number
  /** First section on its page, and so the stand-in for the page as a whole. */
  opening: boolean
  haystack: string
}

/*
 * A match in a page title says more about relevance than a match buried in
 * prose, and the sections carry far more text than the titles do, so the
 * weights have to be this far apart for a title hit to survive the volume.
 */
const WEIGHT = { title: 14, heading: 10, description: 6, text: 3 }
const SNIPPET_RADIUS = 68
const RESULTS_PER_PAGE = 2
const RESULT_LIMIT = 8

const entries: Entry[] = docPages.flatMap((page) => {
  const { title, description, group } = page.frontmatter

  return page.sections.map((section, index) => ({
    key: `${page.slug}#${section.id || index}`,
    slug: page.slug,
    hash: section.id,
    title,
    group,
    heading: section.heading,
    description,
    text: section.text,
    depth: section.depth,
    opening: index === 0,
    haystack:
      `${title} ${description} ${section.heading} ${section.text}`.toLowerCase(),
  }))
})

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Terms are matched as substrings, but starting a word scores higher. */
function fieldScore(field: string, term: string, weight: number) {
  const haystack = field.toLowerCase()
  const at = haystack.indexOf(term)
  if (at === -1) return 0

  const startsWord = at === 0 || /[\s\-_./(]/.test(haystack[at - 1])
  const exact = haystack === term
  return weight * (exact ? 2.4 : startsWord ? 1.6 : 1)
}

/**
 * Cuts a window of `text` around the first term that appears in it, trimmed to
 * word boundaries so a result never opens mid-word.
 */
function snippetFor(entry: Entry, terms: string[]) {
  const lower = entry.text.toLowerCase()
  let at = -1
  let hit = ''

  // The longest term is the most specific, so it makes the most useful anchor.
  for (const term of [...terms].sort((a, b) => b.length - a.length)) {
    const found = lower.indexOf(term)
    if (found !== -1) {
      at = found
      hit = term
      break
    }
  }

  /*
   * Nothing to centre on means the match came from the page's title or dek, so
   * the dek is the honest summary to show. Truncating the body at an arbitrary
   * character would only look like a snippet without being one.
   */
  if (at === -1) return entry.description

  let start = Math.max(0, at - SNIPPET_RADIUS)
  let end = Math.min(entry.text.length, at + hit.length + SNIPPET_RADIUS)

  if (start > 0) {
    const space = entry.text.indexOf(' ', start)
    if (space !== -1 && space < at) start = space + 1
  }
  if (end < entry.text.length) {
    const space = entry.text.lastIndexOf(' ', end)
    if (space > at + hit.length) end = space
  }

  return `${start > 0 ? '…' : ''}${entry.text.slice(start, end).trim()}${
    end < entry.text.length ? '…' : ''
  }`
}

/** Splits a query into the terms every result must contain. */
export function searchTerms(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean)
}

export function searchDocs(query: string): DocSearchResult[] {
  const terms = searchTerms(query)
  if (terms.length === 0) return []

  const scored: { entry: Entry; score: number }[] = []

  for (const entry of entries) {
    let score = 0
    let matchedAll = true
    let local = 0

    for (const term of terms) {
      if (!entry.haystack.includes(term)) {
        matchedAll = false
        break
      }

      const inSection = Math.max(
        fieldScore(entry.heading, term, WEIGHT.heading),
        fieldScore(entry.text, term, WEIGHT.text),
      )
      if (inSection > 0) local += 1

      score += Math.max(
        inSection,
        fieldScore(entry.title, term, WEIGHT.title),
        fieldScore(entry.description, term, WEIGHT.description),
      )
    }

    if (!matchedAll) continue

    /*
     * Title and description belong to the whole page, so on their own they
     * make every section of it match. A section earns its own row only by
     * containing something; otherwise the page speaks once, through its
     * opening, instead of listing its table of contents at the reader.
     */
    if (local === 0 && !entry.opening) continue

    // Prose a reader can actually see beats a match inherited from the page.
    score += local * 4

    // The whole query appearing intact beats the same words scattered apart.
    if (terms.length > 1 && entry.haystack.includes(terms.join(' '))) score += 8

    // A section heading is a more precise destination than one nested under it.
    if (entry.depth === 2) score += 1.5

    scored.push({ entry, score })
  }

  scored.sort((a, b) => b.score - a.score)

  const perPage = new Map<string, number>()
  const results: DocSearchResult[] = []

  for (const { entry } of scored) {
    const taken = perPage.get(entry.slug) ?? 0
    if (taken >= RESULTS_PER_PAGE) continue
    perPage.set(entry.slug, taken + 1)

    results.push({
      key: entry.key,
      slug: entry.slug,
      hash: entry.hash,
      title: entry.title,
      group: entry.group,
      heading: entry.heading,
      snippet: snippetFor(entry, terms),
    })

    if (results.length >= RESULT_LIMIT) break
  }

  return results
}

/** Splits text into alternating unmatched and matched runs, for highlighting. */
export function highlight(
  text: string,
  terms: string[],
): { text: string; match: boolean }[] {
  if (terms.length === 0) return [{ text, match: false }]

  // The pattern only ever captures a whole term, so a run is a match exactly
  // when it equals one, case aside. Testing the regex again here would not
  // work: it is global, and so carries `lastIndex` between calls.
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  return text
    .split(pattern)
    .filter(Boolean)
    .map((part) => ({ text: part, match: terms.includes(part.toLowerCase()) }))
}
