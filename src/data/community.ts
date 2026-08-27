import {
  Bot,
  BookOpen,
  Braces,
  Code2,
  Cpu,
  FlaskConical,
  PackageCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

import { COMMUNITY_REPO_URL, REPO_URL } from '@/lib/site'

export interface CommunityLink {
  label: string
  href: string
}

export interface CommunityDocument extends CommunityLink {
  description: string
}

export const startHere: CommunityDocument[] = [
  {
    label: 'Strategy',
    description: 'Shared mission, principles, and architectural direction.',
    href: `${COMMUNITY_REPO_URL}/blob/master/STRATEGY.md`,
  },
  {
    label: 'Governance',
    description: 'SIGs, WGs, chairs, decisions, and group lifecycle.',
    href: `${COMMUNITY_REPO_URL}/blob/master/GOVERNANCE.md`,
  },
  {
    label: 'Community Groups',
    description: 'The canonical group, chair, and GitHub Project roster.',
    href: `${COMMUNITY_REPO_URL}/blob/master/GROUPS.md`,
  },
]

export interface SpecialInterestGroup {
  slug: string
  name: string
  category: string
  icon: LucideIcon
  summary: string
  owns: string[]
  contribute: string
  repositories: CommunityLink[]
  charterUrl: string
  projectNumber: number
  projectUrl: string
  chairIds: string[]
}

const charterUrl = (slug: string) =>
  `${COMMUNITY_REPO_URL}/tree/master/sig-${slug}`

/**
 * README order is intentional. This is the public roster people encounter in
 * the community repository, not a compiler pipeline diagram.
 */
export const sigs: SpecialInterestGroup[] = [
  {
    slug: 'compiler',
    name: 'Compiler',
    category: 'Core compiler',
    icon: Cpu,
    summary:
      'Core compiler infrastructure, including checked representations, planning, lowering, and reviewed run artifacts.',
    owns: ['Pliron and LAIR', 'Planning and lowering', 'Run documents'],
    contribute:
      'Compiler engineering, formal methods, planning, scheduling, and artifact design.',
    repositories: [{ label: 'lab-lang/lab', href: REPO_URL }],
    charterUrl: charterUrl('compiler'),
    projectNumber: 1,
    projectUrl: 'https://github.com/orgs/lab-lang/projects/1',
    chairIds: ['marpaia'],
  },
  {
    slug: 'instruments',
    name: 'Instruments',
    category: 'Laboratory edge',
    icon: FlaskConical,
    summary:
      'Support for laboratory robots and instruments through explicit, testable execution boundaries.',
    owns: ['Instrument profiles', 'Target backends', 'Workcells and recovery'],
    contribute:
      'Instrument integrations, vendor protocols, workcells, safety, and hardware qualification.',
    repositories: [
      { label: 'lab-lang/lab', href: REPO_URL },
      {
        label: 'instrument repositories',
        href: `${COMMUNITY_REPO_URL}/tree/master/sig-instruments#repositories`,
      },
    ],
    charterUrl: charterUrl('instruments'),
    projectNumber: 9,
    projectUrl: 'https://github.com/orgs/lab-lang/projects/9',
    chairIds: ['marpaia'],
  },
  {
    slug: 'lab-language',
    name: 'Lab Language',
    category: 'Authoring',
    icon: Braces,
    summary:
      'The Lab programming language for biological designs, materials, workflows, constraints, and scientific vocabulary.',
    owns: ['Syntax and semantics', 'Packages', 'Frontend lowering'],
    contribute:
      'Language design, type systems, diagnostics, biological DSLs, and package design.',
    repositories: [{ label: 'lab-lang/lab', href: REPO_URL }],
    charterUrl: charterUrl('lab-language'),
    projectNumber: 2,
    projectUrl: 'https://github.com/orgs/lab-lang/projects/2',
    chairIds: ['marpaia'],
  },
  {
    slug: 'python',
    name: 'Python',
    category: 'Authoring',
    icon: Code2,
    summary:
      'Typed, idiomatic Python support within the Lab Compiler and its shared semantic model.',
    owns: ['Python authoring APIs', 'Lowering', 'Typing and source maps'],
    contribute:
      'Python API design, typing, notebooks, source maps, and scientific object adapters.',
    repositories: [{ label: 'lab-lang/lab', href: REPO_URL }],
    charterUrl: charterUrl('python'),
    projectNumber: 3,
    projectUrl: 'https://github.com/orgs/lab-lang/projects/3',
    chairIds: ['gonza10v'],
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    category: 'Tooling',
    icon: Wrench,
    summary:
      'The Lab CLI, language server, editor support, WebAssembly hosts, and shared project analysis.',
    owns: ['CLI and IDE services', 'Language server', 'Editor extensions'],
    contribute:
      'Developer experience, language tooling, editors, browser hosts, and workspace analysis.',
    repositories: [
      { label: 'lab-lang/lab', href: REPO_URL },
      {
        label: 'lab-lang/website',
        href: 'https://github.com/lab-lang/website',
      },
    ],
    charterUrl: charterUrl('developer-tools'),
    projectNumber: 5,
    projectUrl: 'https://github.com/orgs/lab-lang/projects/5',
    chairIds: ['marpaia'],
  },
  {
    slug: 'docs',
    name: 'Docs',
    category: 'Documentation',
    icon: BookOpen,
    summary:
      'Lab documentation, the public website, learning material, and the browser playground.',
    owns: ['Information architecture', 'Teaching and accessibility', 'Website'],
    contribute:
      'Technical writing, learning design, accessibility, frontend work, and documentation systems.',
    repositories: [
      {
        label: 'lab-lang/website',
        href: 'https://github.com/lab-lang/website',
      },
      { label: 'lab-lang/lab', href: REPO_URL },
    ],
    charterUrl: charterUrl('docs'),
    projectNumber: 4,
    projectUrl: 'https://github.com/orgs/lab-lang/projects/4',
    chairIds: ['marpaia'],
  },
  {
    slug: 'robotics',
    name: 'Robotics',
    category: 'Downstream research',
    icon: Bot,
    summary:
      'Simulation and training infrastructure for increasingly robotic laboratories.',
    owns: ['Simulation scenes', 'Robot tasks and training', 'Evaluation'],
    contribute:
      'Robotics, physics, simulation, learning, facility models, and reproducible evaluation.',
    repositories: [
      {
        label: 'lab-lang/robotics',
        href: 'https://github.com/lab-lang/robotics',
      },
      { label: 'lab-lang/lab', href: REPO_URL },
    ],
    charterUrl: charterUrl('robotics'),
    projectNumber: 6,
    projectUrl: 'https://github.com/orgs/lab-lang/projects/6',
    chairIds: ['marpaia'],
  },
  {
    slug: 'release',
    name: 'Release',
    category: 'Delivery',
    icon: PackageCheck,
    summary:
      'Building, packaging, qualifying, and releasing the Lab Compiler and its related components.',
    owns: ['Qualification', 'Packaging and integrity', 'Compatibility'],
    contribute:
      'Build systems, release engineering, supply-chain trust, and platform testing.',
    repositories: [
      { label: 'lab-lang/lab', href: REPO_URL },
      {
        label: 'lab-lang/website',
        href: 'https://github.com/lab-lang/website',
      },
    ],
    charterUrl: charterUrl('release'),
    projectNumber: 7,
    projectUrl: 'https://github.com/orgs/lab-lang/projects/7',
    chairIds: ['marpaia'],
  },
]

export interface WorkingGroup {
  slug: string
  name: string
  status: string
  chairIds: string[]
  purpose: string
  sponsors: string[]
  deliverables: string[]
  completion: string
  projectNumber: number
  projectUrl: string
  charterUrl: string
}

export const workingGroups: WorkingGroup[] = [
  {
    slug: 'experimental-validation',
    name: 'Experimental Validation',
    status: 'Draft',
    chairIds: ['jdfdragon'],
    purpose:
      'Validate compiler capabilities and instrument integrations with reproducible experimental evidence.',
    sponsors: ['Compiler', 'Instruments', 'Release'],
    deliverables: [
      'Claim-and-evidence matrix',
      'Reference experiments through both frontends',
      'Reproducible validation packages and reports',
    ],
    completion:
      'Closes when its evidence model, initial reference experiments, and continuing responsibilities are accepted by the sponsoring SIGs.',
    projectNumber: 8,
    projectUrl: 'https://github.com/orgs/lab-lang/projects/8',
    charterUrl: `${COMMUNITY_REPO_URL}/tree/master/wg-experimental-validation`,
  },
]

export interface CommunityMember {
  id: string
  name: string
  avatarUrl: string
  profileUrl: string
}

export interface CommunityPerson extends CommunityMember {
  handle: string
  role: string
  affiliation?: string
  contribution: string
  areas: string[]
}

/** Public contribution profiles are not governance rank. */
export const communityPeople: CommunityPerson[] = [
  {
    id: 'marpaia',
    name: 'Mike Arpaia',
    handle: '@marpaia',
    role: 'BDFL',
    affiliation: 'University of Colorado Boulder',
    contribution:
      'Compiler architecture, Lab programming language, instrument integration, developer tools, documentation, community, and more.',
    areas: ['Community', 'Compiler', 'Instruments', 'Docs'],
    avatarUrl: 'https://avatars.githubusercontent.com/u/927168?v=4',
    profileUrl: 'https://github.com/marpaia',
  },
  {
    id: 'gonza10v',
    name: 'Gonzalo Vidal',
    handle: '@Gonza10V',
    role: 'SIG Python Chair',
    affiliation: 'University of Bristol',
    contribution:
      'Python SDK, robotics, lab automation, and experimental verification.',
    areas: ['Python', 'Synthetic biology', 'Automation'],
    avatarUrl: 'https://avatars.githubusercontent.com/u/35148159?v=4',
    profileUrl: 'https://github.com/Gonza10V',
  },
  {
    id: 'cjmyers',
    name: 'Chris Myers',
    handle: '@cjmyers',
    role: 'Core contributor',
    affiliation: 'University of Colorado Boulder',
    contribution:
      'Synthetic biology standards, genetic design automation, and ecosystem interoperability.',
    areas: ['Standards', 'Design automation', 'Verification'],
    avatarUrl: 'https://avatars.githubusercontent.com/u/3507191?v=4',
    profileUrl: 'https://github.com/cjmyers',
  },
  {
    id: 'jdfdragon',
    name: 'Jackson Fairborn',
    handle: '@jdfdragon',
    role: 'WG Experimental Validation Chair',
    affiliation: 'University of Colorado Boulder',
    contribution:
      'Experimental validation, instrument integration, and reproducible evidence for compiler capabilities.',
    areas: ['Experimental validation', 'Instruments', 'Reproducibility'],
    avatarUrl: 'https://avatars.githubusercontent.com/u/228396248?v=4',
    profileUrl: 'https://github.com/jdfdragon',
  },
]

export const communityDirectory: CommunityMember[] = communityPeople

export type RepositoryKind =
  'Compiler' | 'Community' | 'Simulation' | 'Website' | 'Protocol' | 'Driver'

export interface RepositoryHome extends CommunityLink {
  kind: RepositoryKind
  description: string
}

export const repositoryHomes: RepositoryHome[] = [
  {
    label: 'lab-lang/lab',
    href: REPO_URL,
    kind: 'Compiler',
    description:
      'Compiler, frontends, packages, runtime, instrument integrations, CLI, and editor infrastructure.',
  },
  {
    label: 'lab-lang/robotics',
    href: 'https://github.com/lab-lang/robotics',
    kind: 'Simulation',
    description:
      'Downstream simulation, visualization, physics, and robot-learning work.',
  },
  {
    label: 'lab-lang/community',
    href: COMMUNITY_REPO_URL,
    kind: 'Community',
    description:
      'Strategy, governance, group charters, and community structure.',
  },
  {
    label: 'lab-lang/website',
    href: 'https://github.com/lab-lang/website',
    kind: 'Website',
    description:
      'Public website, documentation renderer, and browser playground.',
  },
  {
    label: 'lab-lang/opentrons-protocol',
    href: 'https://github.com/lab-lang/opentrons-protocol',
    kind: 'Protocol',
    description:
      'Typed authoring and construction-time validation for Opentrons JSON protocols.',
  },
  {
    label: 'lab-lang/hamilton-star',
    href: 'https://github.com/lab-lang/hamilton-star',
    kind: 'Driver',
    description:
      'Typed Hamilton STAR and STARlet firmware protocol and USB transport.',
  },
  {
    label: 'lab-lang/byonoy-hid',
    href: 'https://github.com/lab-lang/byonoy-hid',
    kind: 'Driver',
    description: 'Typed Byonoy Absorbance 96 plate-reader driver over USB HID.',
  },
  {
    label: 'lab-lang/inheco-sila',
    href: 'https://github.com/lab-lang/inheco-sila',
    kind: 'Driver',
    description:
      'Typed drivers for Inheco SiLA instruments, beginning with the ODTC thermocycler.',
  },
]
