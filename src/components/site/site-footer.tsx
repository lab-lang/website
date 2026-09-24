import { Wordmark } from '@/components/site/marks'
import { REPO_URL } from '@/lib/site'
import { useLatestRelease } from '@/lib/use-latest-release'

export function SiteFooter() {
  const version = useLatestRelease()

  return (
    <footer className="border-t border-ink/12 bg-sand/45">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <Wordmark size={28} />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-umber-soft">
          <span>Apache-2.0 · v{version}</span>
          <a
            className="rule-link text-umber hover:text-ink"
            href={REPO_URL}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <a
            className="rule-link text-umber hover:text-ink"
            href={`${REPO_URL}/issues`}
            rel="noreferrer"
            target="_blank"
          >
            Issues
          </a>
        </div>
      </div>
    </footer>
  )
}
