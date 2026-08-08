import { REPO_SLUG } from '@/lib/site'
import { useCachedValue, type CacheSpec } from '@/lib/use-cached-value'

/**
 * What renders when GitHub has not answered yet and nothing is cached: a
 * first-time visitor's first paint, an offline browser, a browser with no
 * usable storage, or an address that has spent the unauthenticated API's
 * hourly budget. It is the floor, not the source of truth, so it only needs
 * to be plausible rather than current.
 */
export const FALLBACK_VERSION = '0.1.0'

const ENDPOINT = `https://api.github.com/repos/${REPO_SLUG}/releases/latest`

async function fetchVersion(): Promise<string> {
  const response = await fetch(ENDPOINT, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!response.ok) {
    throw new Error(`GitHub answered ${response.status}`)
  }

  const release: unknown = await response.json()
  const tag = (release as { tag_name?: unknown }).tag_name
  if (typeof tag !== 'string' || tag === '') {
    throw new Error('latest release has no tag name')
  }

  // Tags carry the `v`; the site sets it separately so the hero can keep it
  // lowercase inside an otherwise uppercased line.
  return tag.replace(/^v/, '')
}

function parseVersion(value: unknown): string | null {
  return typeof value === 'string' && value !== '' ? value : null
}

/**
 * A release lands every few weeks at most and the number is a byline on a
 * marketing page, so a visitor inside this window sends no request at all.
 */
const MAX_AGE_MS = 6 * 60 * 60 * 1000

const SPEC: CacheSpec<string> = {
  fallback: FALLBACK_VERSION,
  key: 'lab:latest-release',
  load: fetchVersion,
  maxAgeMs: MAX_AGE_MS,
  parse: parseVersion,
}

/** The latest released version of the compiler, without its leading `v`. */
export function useLatestRelease(): string {
  return useCachedValue(SPEC)
}
