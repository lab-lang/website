import { ChannelsSection } from '@/components/community/channels-section'
import { ClosingSection } from '@/components/community/closing-section'
import { DecisionsSection } from '@/components/community/decisions-section'
import { FlowSection } from '@/components/community/flow-section'
import { GetInvolvedSection } from '@/components/community/get-involved-section'
import { HeroSection } from '@/components/community/hero-section'
import { pageTitle } from '@/lib/site'
import { usePageMeta } from '@/lib/use-page-meta'

export function CommunityPage() {
  usePageMeta({
    title: pageTitle('Community'),
    description:
      'Where Lab is discussed and decided: issues, discussions, and a numbered log of every accepted tradeoff in the compiler.',
    path: '/community',
  })

  return (
    <>
      <HeroSection />
      <ChannelsSection />
      <FlowSection />
      <GetInvolvedSection />
      <DecisionsSection />
      <ClosingSection />
    </>
  )
}
