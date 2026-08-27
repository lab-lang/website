import { GroupsSection } from '@/components/community/groups-section'
import { HeroSection } from '@/components/community/hero-section'
import { ParticipationSection } from '@/components/community/participation-section'
import { PeopleSection } from '@/components/community/people-section'
import { pageTitle } from '@/lib/site'
import { usePageMeta } from '@/lib/use-page-meta'

export function CommunityPage() {
  usePageMeta({
    title: pageTitle('Community'),
    description:
      'Explore Lab community strategy, governance, Special Interest Groups, Working Groups, contributors, and the repositories where work happens.',
    path: '/community',
  })

  return (
    <>
      <HeroSection />
      <GroupsSection />
      <PeopleSection />
      <ParticipationSection />
    </>
  )
}
