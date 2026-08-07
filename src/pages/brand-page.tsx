import { ColorSection } from '@/components/brand/color-section'
import { HeroSection } from '@/components/brand/hero-section'
import { MarkSection } from '@/components/brand/mark-section'
import { TypeSection } from '@/components/brand/type-section'
import { UsageSection } from '@/components/brand/usage-section'
import { pageTitle } from '@/lib/site'
import { usePageMeta } from '@/lib/use-page-meta'

export function BrandPage() {
  usePageMeta({
    title: pageTitle('Brand'),
    description:
      'The Lab mark and wordmarks, what each asset is for, and the rules for setting them.',
    path: '/brand',
  })

  return (
    <>
      <HeroSection />
      <MarkSection />
      <ColorSection />
      <TypeSection />
      <UsageSection />
    </>
  )
}
