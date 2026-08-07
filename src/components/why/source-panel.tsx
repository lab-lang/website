import { SourceCode, type SourceLanguage } from '@/components/source-code'

export function SourcePanel({
  role,
  tone = 'written',
  filename,
  language,
  body,
}: {
  role?: string
  tone?: 'written' | 'generated'
  filename: string
  language: SourceLanguage
  body: string
}) {
  const lines = body.split('\n').length
  const roleClass = tone === 'generated' ? 'text-gfp' : 'text-amber'

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/20 bg-vessel">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <span className="micro truncate text-[#f6ece0]/45">{filename}</span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="micro text-[#f6ece0]/30">{lines} lines</span>
          {role && <span className={`micro ${roleClass}`}>{role}</span>}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <SourceCode language={language} source={body} />
      </div>
    </div>
  )
}
