import { CapabilitySection } from '@/components/why/capability-section'
import { ComparisonSection } from '@/components/why/comparison-section'
import { ExpressibleSection } from '@/components/why/expressible-section'
import { GapsSection } from '@/components/why/gaps-section'
import { HeroSection } from '@/components/why/hero-section'
import { InstrumentsSection } from '@/components/why/instruments-section'
import { pageTitle } from '@/lib/site'
import { usePageMeta } from '@/lib/use-page-meta'

export function WhyPage() {
  usePageMeta({
    title: pageTitle('Why Lab'),
    description:
      'A protocol written for a robot is mostly deck geometry. Lab lets you describe the construct, the constraints, and the evidence, and generates the machine-specific part for whatever instrument you end up on.',
    path: '/why',
  })

  return (
    <>
      <HeroSection />
      <ComparisonSection />
      <ExpressibleSection />
      <CapabilitySection />
      <InstrumentsSection />
      <GapsSection />
    </>
  )
}
