/*
 * Editor-toolbar controls: named rather than drawn, and flat until pointed
 * at, the way the file tree and tab row in the panes below already behave. A
 * row of bare glyphs would make a visitor hover each one to learn what it
 * does, and a row of outlined pills would sit on the chrome rather than in
 * it. The two groups act on different things — the left pair swaps which
 * project is open, the right pair acts on the file in the editor — so a
 * divider separates them.
 */
const BUTTON =
  'press inline-flex h-8 shrink-0 items-center rounded-md px-2.5 text-[12.5px] text-[#f6ece0]/55 hover:bg-white/8 hover:text-[#f2e8db] disabled:pointer-events-none disabled:opacity-35'

export function PlaygroundToolbar({
  onNewScratch,
  onDeleteScratch,
  inScratch,
  onReset,
  onCopy,
  copied,
  onFormat,
  formatDisabled,
}: {
  onNewScratch: () => void
  onDeleteScratch: () => void
  inScratch: boolean
  onReset: () => void
  onCopy: () => void
  copied: boolean
  onFormat: () => void
  formatDisabled: boolean
}) {
  return (
    <div className="flex w-full items-center sm:w-auto">
      <div className="-mr-1.5 ml-auto flex flex-wrap items-center justify-end gap-0.5 sm:ml-0">
        {inScratch ? (
          <button
            className={BUTTON}
            onClick={onDeleteScratch}
            title="Discard this scratch file and go back to the example"
            type="button"
          >
            Back to example
          </button>
        ) : (
          <button
            className={BUTTON}
            onClick={onNewScratch}
            title="Open a blank file to try your own ideas"
            type="button"
          >
            New scratch
          </button>
        )}
        <button
          className={BUTTON}
          onClick={onReset}
          title="Restore every file in this project to how it shipped"
          type="button"
        >
          Reset
        </button>

        <span
          aria-hidden="true"
          className="mx-1.5 hidden h-4 w-px bg-white/12 sm:block"
        />

        <button
          className={BUTTON}
          disabled={formatDisabled}
          onClick={onFormat}
          title="Format the file in the editor"
          type="button"
        >
          Format
        </button>
        <button
          className={BUTTON}
          onClick={onCopy}
          title="Copy the file in the editor"
          type="button"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
