import { DistinctionSection } from '@/components/home/distinction-section'
import { HeroSection } from '@/components/home/hero-section'
import { LoweringSection } from '@/components/home/lowering-section'
import { MaterialFlowSection } from '@/components/home/material-flow-section'
import { ReactiveSection } from '@/components/home/reactive-section'
import { StatusSection } from '@/components/home/status-section'
import { usePageMeta } from '@/lib/use-page-meta'

export function HomePage() {
  usePageMeta({ path: '/' })

  return (
    <>
      <HeroSection />
      <DistinctionSection />
      <ReactiveSection />
      <LoweringSection />
      <MaterialFlowSection />
      <StatusSection />
    </>
  )
}
