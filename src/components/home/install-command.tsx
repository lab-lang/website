import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { CodeLanguageToggle } from '@/components/code-language-toggle'
import {
  setCodeLanguage,
  useCodeLanguage,
  type CodeLanguage,
} from '@/lib/code-language'

const INSTALL: Record<CodeLanguage, string> = {
  lab: 'curl -sSf https://www.lab-compiler.org/install.sh | sh',
  python: 'pip install lab-compiler',
}

export function InstallCommand() {
  const [copied, setCopied] = useState(false)
  const language = useCodeLanguage()
  const command = INSTALL[language]

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink/15 bg-sand">
      {/*
       * Copy sits in the header beside the frontend picker rather than beside
       * the command. Both are chrome, and keeping them together leaves the
       * command row the card's full measure, which is what lets a curl line
       * carrying a domain and a path be read without panning it sideways.
       */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 py-1 pl-3 pr-1">
        <span className="micro text-ink/45">Install</span>
        <div className="flex items-center gap-1">
          {/* Clearing the tick matters: the confirmation would otherwise stand
           * over a command the reader never copied. */}
          <CodeLanguageToggle
            compact
            onChange={(next) => {
              setCopied(false)
              setCodeLanguage(next)
            }}
            tone="light"
          />
          <button
            className="press grid size-8 shrink-0 place-items-center rounded-lg text-umber hover:bg-ink/8 hover:text-ink"
            onClick={copy}
            type="button"
          >
            {copied ? (
              <Check aria-hidden="true" size={13} strokeWidth={2.6} />
            ) : (
              <Copy aria-hidden="true" size={13} />
            )}
            <span className="sr-only">
              {copied ? 'Command copied' : 'Copy install command'}
            </span>
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5">
        {/* Wraps rather than scrolls if a command ever outgrows the card: you
         * should be able to read everything you are about to pipe into sh. */}
        <code
          className="block whitespace-normal break-words font-mono text-[12.5px] leading-[1.5] text-ink"
          title={command}
        >
          <span className="text-amber-deep">$</span> {command}
        </code>
      </div>
    </div>
  )
}
