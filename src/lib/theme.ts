/**
 * Three choices, two outcomes: `system` defers to the OS, the other two pin the
 * page. The resolved outcome is carried on `<html>` as the `dark` class, which
 * is what the `dark` variant in index.css matches and what the token overrides
 * hang off.
 *
 * The same read-and-apply runs as an inline script in index.html so the first
 * paint is already correct. Changing the storage key or the class name here
 * means changing it there too.
 */
export type ThemeChoice = 'system' | 'light' | 'dark'

export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'lab-theme'

export const THEME_CHOICES: readonly ThemeChoice[] = ['system', 'light', 'dark']

/** Mirrors --color-paper in each theme, for the mobile browser chrome. */
const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: '#f9efdd',
  dark: '#14100a',
}

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function prefersDark() {
  return window.matchMedia(DARK_QUERY).matches
}

/** Fires whenever the OS appearance changes. Returns its own unsubscribe. */
export function watchSystemTheme(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export function readStoredChoice(): ThemeChoice {
  /*
   * Storage throws rather than returning null under Safari's private mode and
   * under a blocked-cookies policy, and an unreadable preference is not worth
   * breaking the page over.
   */
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // Fall through to the default.
  }

  return 'system'
}

export function resolveChoice(choice: ThemeChoice): ResolvedTheme {
  if (choice === 'system') return prefersDark() ? 'dark' : 'light'
  return choice
}

/**
 * Writes the choice through to the document and to storage. `system` is stored
 * explicitly rather than by removing the key, so a later default change does
 * not silently reinterpret someone's deliberate choice.
 */
export function applyTheme(choice: ThemeChoice) {
  const resolved = resolveChoice(choice)

  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.dataset.theme = resolved

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLOR[resolved])

  try {
    localStorage.setItem(THEME_STORAGE_KEY, choice)
  } catch {
    // A session-only theme is better than a failed click.
  }
}
