import { HeroSection } from '@/components/home/hero-section'
import { usePageMeta } from '@/lib/use-page-meta'

export function HomePage() {
  usePageMeta({ path: '/' })

  return <HeroSection />
}
