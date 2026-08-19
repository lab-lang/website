import {
  CODE_LANGUAGE_LABELS,
  setCodeLanguage,
  useCodeLanguage,
  type CodeLanguage,
} from '@/lib/code-language'

const LANGUAGES: CodeLanguage[] = ['lab', 'python']

/**
 * Picks the frontend every example on the site is read in. One shared choice,
 * so a reader who thinks in Python sets it once and the whole site follows.
 *
 * Styled as the same segmented control as the hero specimen's Design/Build
 * toggle, in the cream that marks source choices, where the fluorophore green
 * marks pipeline stages.
 *
 * `tone` picks the palette: `dark` for the panels set on vessel, `light` for
 * the paper ground.
 */
export function CodeLanguageToggle({
  tone = 'dark',
  compact = false,
  onChange,
}: {
  tone?: 'dark' | 'light'
  /**
   * Sheds the touch-sized padding for small utility rows, where a control
   * built to match a code panel's header would stand taller than the thing
   * it labels.
   */
  compact?: boolean
  /** Called before the switch, for a caller that has to hold its scroll. */
  onChange?: (next: CodeLanguage) => void
}) {
  const language = useCodeLanguage()
  const dark = tone === 'dark'

  return (
    <div
      aria-label="Example language"
      className={`flex items-center gap-1 rounded-lg border ${
        compact ? 'p-0.5' : 'p-1'
      } ${dark ? 'border-white/10' : 'border-ink/15'}`}
      role="group"
    >
      {LANGUAGES.map((option) => {
        const selected = option === language
        return (
          <button
            aria-pressed={selected}
            className={`press rounded-md ${
              compact ? 'px-2 py-1 leading-none' : 'px-3 py-2.5 sm:py-1.5'
            } ${
              selected
                ? dark
                  ? 'bg-[#f6ece0]/10 text-[#f6ece0]/85'
                  : 'bg-ink/8 text-ink'
                : dark
                  ? 'text-[#f6ece0]/40 hover:text-[#f6ece0]/75'
                  : 'text-umber-soft hover:text-ink'
            }`}
            key={option}
            onClick={() =>
              onChange ? onChange(option) : setCodeLanguage(option)
            }
            type="button"
          >
            <span className="micro">{CODE_LANGUAGE_LABELS[option]}</span>
          </button>
        )
      })}
    </div>
  )
}
