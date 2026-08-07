import { type ColorToken } from '@/data/brand-tokens'

/*
 * The chip is painted from a literal hex rather than the token, so both values
 * are visible at once whichever theme the reader is in. The theme name rides
 * along in the label because the chips alone cannot say which is which for a
 * token like GFP, where the two values are the same color.
 */
function Swatch({ hex, theme }: { hex: string; theme: 'Light' | 'Dark' }) {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-7 shrink-0 rounded-lg border border-ink/15"
        style={{ backgroundColor: hex }}
      />
      <span className="flex flex-col leading-tight">
        <span className="micro text-ink/35">{theme}</span>
        <span className="mt-1 font-mono text-[11.5px] text-umber-soft">
          {hex}
        </span>
      </span>
    </span>
  )
}

export function ColorGroup({
  title,
  note,
  tokens,
}: {
  title: string
  note: string
  tokens: ColorToken[]
}) {
  return (
    <div>
      <h3 className="type-head text-[15px]">{title}</h3>
      <p className="prose-lab mt-1.5 max-w-[52ch] text-[13.5px] leading-[1.6] text-umber">
        {note}
      </p>
      <div className="mt-4 divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/12">
        {tokens.map((color) => (
          <div
            className="flex flex-col gap-3 bg-shell/60 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-5"
            key={color.token}
          >
            <div className="flex flex-col gap-1.5 sm:w-[232px] sm:shrink-0">
              <span className="text-[13.5px] font-medium text-ink">
                {color.name}
              </span>
              <div className="flex items-center gap-4">
                <Swatch hex={color.light} theme="Light" />
                <Swatch hex={color.dark} theme="Dark" />
              </div>
            </div>
            <p className="prose-lab text-[13px] leading-[1.55] text-umber sm:flex-1">
              {color.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
