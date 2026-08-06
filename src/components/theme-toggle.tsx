import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { applyTheme, readStoredChoice, watchSystemTheme, type ThemeChoice } from '../lib/theme'

const OPTIONS: { choice: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { choice: 'system', label: 'System', Icon: Monitor },
  { choice: 'light', label: 'Light', Icon: Sun },
  { choice: 'dark', label: 'Dark', Icon: Moon },
]

/**
 * The trigger reports the choice, not the outcome: on System it shows the
 * monitor glyph whichever way the OS is currently leaning, because that is the
 * setting the next click acts on.
 */
export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>(readStoredChoice)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  /*
   * On System the page has to keep tracking the OS while it sits open, so the
   * resolved theme is re-derived on every change rather than only on click.
   */
  useEffect(() => {
    if (choice !== 'system') return
    return watchSystemTheme(() => applyTheme('system'))
  }, [choice])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (next: ThemeChoice) => {
    setChoice(next)
    applyTheme(next)
    setOpen(false)
  }

  const active = OPTIONS.find((option) => option.choice === choice) ?? OPTIONS[0]
  const ActiveIcon = active.Icon

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden" ref={rootRef}>
      {open && (
        <div
          aria-label="Theme"
          className="stage-panel absolute bottom-full right-0 mb-2.5 w-[168px] overflow-hidden rounded-2xl border border-ink/15 bg-shell p-1.5 shadow-[0_18px_44px_-16px_color-mix(in_oklab,var(--cast)_60%,transparent)]"
          role="menu"
        >
          {OPTIONS.map(({ choice: value, label, Icon }) => {
            const selected = value === choice

            return (
              <button
                aria-checked={selected}
                className={`press flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[14px] ${
                  selected ? 'bg-ink/8 text-ink' : 'text-umber hover:bg-ink/5 hover:text-ink'
                }`}
                key={value}
                onClick={() => select(value)}
                role="menuitemradio"
                type="button"
              >
                <Icon aria-hidden="true" size={15} strokeWidth={1.9} />
                {label}
                {selected && (
                  <Check aria-hidden="true" className="ml-auto text-amber-deep" size={14} />
                )}
              </button>
            )
          })}
        </div>
      )}

      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Theme: ${active.label.toLowerCase()}`}
        className="press grid size-11 place-items-center rounded-full border border-ink/15 bg-shell text-umber shadow-[0_10px_28px_-10px_color-mix(in_oklab,var(--cast)_55%,transparent)] hover:border-ink/30 hover:text-ink"
        onClick={() => setOpen((isOpen) => !isOpen)}
        ref={triggerRef}
        type="button"
      >
        <ActiveIcon aria-hidden="true" size={18} strokeWidth={1.9} />
      </button>
    </div>
  )
}
