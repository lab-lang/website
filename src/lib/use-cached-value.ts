import { useEffect, useState } from 'react'

/**
 * How to keep one value: where it comes from, where it rests, and how long an
 * answer stays good for.
 *
 * Every field has to be stable across renders, so define `load` and `parse` at
 * module scope rather than inline in the component. They are effect
 * dependencies, and a fresh identity each render re-runs the effect.
 */
export type CacheSpec<T> = {
  /** What renders before anything has been stored, and if `load` fails. */
  fallback: T
  /** The `localStorage` key. Namespace it: the origin is shared. */
  key: string
  /** Asks the source of truth. A rejection leaves the cache untouched. */
  load: () => Promise<T>
  /** How long a stored answer is served before `load` is asked again. */
  maxAgeMs: number
  /**
   * Narrows what came back out of storage. Anything can be sitting under a
   * key — a half-written record, or an older shape of the value — so the
   * value is only trusted if this returns it. Returning `null` means "not
   * usable", which is why `null` cannot itself be cached.
   */
  parse: (value: unknown) => T | null
}

type Parse<T> = CacheSpec<T>['parse']

type StoredRecord = {
  fetchedAt: number
  value: unknown
}

/**
 * The answer for this page load, per key. Components mount independently, and
 * without this each one would repeat the storage read and start its own
 * request for a value the last one already has.
 */
const settled = new Map<string, unknown>()

const inFlight = new Map<string, Promise<unknown>>()

function readStored<T>(key: string, parse: Parse<T>) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null

    const record: unknown = JSON.parse(raw)
    if (typeof record !== 'object' || record === null) return null

    const { fetchedAt, value } = record as Partial<StoredRecord>
    if (typeof fetchedAt !== 'number') return null

    const parsed = parse(value)
    return parsed === null ? null : { fetchedAt, value: parsed }
  } catch {
    // Storage is a nicety here: Safari's private mode throws on access, and
    // the network path still works without it.
    return null
  }
}

function writeStored(key: string, value: unknown) {
  try {
    const record: StoredRecord = { fetchedAt: Date.now(), value }
    localStorage.setItem(key, JSON.stringify(record))
  } catch {
    // As above — a visitor who cannot persist just asks again next visit.
  }
}

function loadOnce<T>(key: string, load: () => Promise<T>): Promise<T> {
  let pending = inFlight.get(key) as Promise<T> | undefined

  if (!pending) {
    pending = load().finally(() => inFlight.delete(key))
    inFlight.set(key, pending)
  }

  return pending
}

function initialValue<T>({ fallback, key, parse }: CacheSpec<T>): T {
  if (settled.has(key)) return settled.get(key) as T

  // Deliberately ignores `maxAgeMs`: an aged-out answer is still the best
  // thing to paint while the fresh one is on its way.
  const stored = readStored(key, parse)
  if (!stored) return fallback

  settled.set(key, stored.value)
  return stored.value
}

/**
 * A value fetched once and kept, across reloads and across the tabs of one
 * browser, until it ages out.
 *
 * Reads are stale-while-revalidate: a stored answer renders immediately even
 * past `maxAgeMs`, and a newer one replaces it only once it arrives, so the
 * value never blanks or reflows mid-read. Inside the window nothing is
 * requested at all. A failed `load` leaves whatever is already on screen.
 */
export function useCachedValue<T>(spec: CacheSpec<T>): T {
  const { key, load, maxAgeMs, parse } = spec
  const [value, setValue] = useState(() => initialValue(spec))

  useEffect(() => {
    const stored = readStored(key, parse)
    if (stored && Date.now() - stored.fetchedAt < maxAgeMs) return

    let cancelled = false

    void loadOnce(key, load).then(
      (next) => {
        settled.set(key, next)
        writeStored(key, next)
        if (!cancelled) setValue(next)
      },
      () => {
        // Unreachable, rejected, malformed: whatever is on screen is a better
        // thing to show than an error or a gap.
      },
    )

    return () => {
      cancelled = true
    }
  }, [key, load, maxAgeMs, parse])

  return value
}
