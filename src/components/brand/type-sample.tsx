export function TypeSample({
  name,
  role,
  sampleClassName,
  sample,
  note,
}: {
  name: string
  role: string
  sampleClassName: string
  sample: string
  note: string
}) {
  return (
    <div className="grid gap-4 border-t border-ink/10 py-7 first:border-t-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8">
      <div>
        <h3 className="type-head text-[15px]">{name}</h3>
        <span className="mt-1 block font-mono text-[11.5px] text-umber-soft">
          {role}
        </span>
      </div>
      <div>
        <p className={`${sampleClassName} text-ink`}>{sample}</p>
        <p className="prose-lab mt-3 max-w-[56ch] text-[13.5px] leading-[1.6] text-umber">
          {note}
        </p>
      </div>
    </div>
  )
}
