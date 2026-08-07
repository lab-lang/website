import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

const INSTALL = 'curl -sSf https://www.lab-lang.org/install.sh | sh'

export function InstallCommand() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-ink/15 bg-sand py-2 pl-4 pr-2">
      {/* Wraps on a phone and scrolls above sm: you should be able to read
       * everything you are about to pipe into sh. */}
      <code
        className="rail rail-quiet min-w-0 flex-1 whitespace-normal break-all font-mono text-[12.5px] text-ink sm:whitespace-nowrap"
        title={INSTALL}
      >
        <span className="text-amber-deep">$</span> {INSTALL}
      </code>
      <button
        className="press grid size-10 shrink-0 place-items-center rounded-lg text-umber hover:bg-ink/8 hover:text-ink sm:size-8"
        onClick={copy}
        type="button"
      >
        {copied ? (
          <Check aria-hidden="true" size={14} strokeWidth={2.6} />
        ) : (
          <Copy aria-hidden="true" size={14} />
        )}
        <span className="sr-only">
          {copied ? 'Command copied' : 'Copy install command'}
        </span>
      </button>
    </div>
  )
}
