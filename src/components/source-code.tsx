const tokenPattern =
  /("(?:[^"\\]|\\.)*"|#.*$|\b(?:use|plasmid|circuit|workflow|record|material|observation|evidence|event|outcome|state|require|accept|return|when|every|after|match|case|if|else|for|in)\b|\b\d+(?:\.\d+)?\b|<-|->|==|>=|<=)/g

function tokenClass(token: string) {
  if (token.startsWith('#')) return 'text-[#82958a]'
  if (token.startsWith('"')) return 'text-[#e7bb69]'
  if (/^\d/.test(token)) return 'text-[#ef997c]'
  if (/^(?:<-|->|==|>=|<=)$/.test(token)) return 'text-lab-lime'
  return 'text-[#9fd5b4]'
}

function HighlightedLine({ line }: { line: string }) {
  const tokens = line.split(tokenPattern)

  return (
    <>
      {tokens.map((token, index) => (
        <span className={tokenClass(token)} key={`${token}-${index}`}>
          {token}
        </span>
      ))}
    </>
  )
}

export function SourceCode({
  source,
  cursor = false,
}: {
  source: string
  cursor?: boolean
}) {
  const lines = source.split('\n')

  return (
    <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-6 text-[#f2f0e8] sm:px-6 sm:text-sm">
      <code>
        {lines.map((line, index) => (
          <span className="flex min-w-max" key={`${line}-${index}`}>
            <span
              aria-hidden="true"
              className="mr-5 w-5 shrink-0 select-none text-right text-[#61766a]"
            >
              {index + 1}
            </span>
            <span className="pr-6">
              <HighlightedLine line={line} />
              {cursor && index === lines.length - 1 && (
                <span aria-hidden="true" className="typing-cursor text-lab-lime">
                  ▌
                </span>
              )}
            </span>
          </span>
        ))}
      </code>
    </pre>
  )
}
