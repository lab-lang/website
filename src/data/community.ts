import { Bug, MessageSquare, ScrollText, type LucideIcon } from 'lucide-react'

import { REPO_URL } from '@/lib/site'

export interface Channel {
  icon: LucideIcon
  title: string
  detail: string
  cta: string
  href: string
}

export const channels: Channel[] = [
  {
    icon: Bug,
    title: 'Issues',
    detail:
      'Report a bug, or ask for something the checker or compiler does not do yet.',
    cta: 'Open an issue',
    href: `${REPO_URL}/issues`,
  },
  {
    icon: MessageSquare,
    title: 'Discussions',
    detail:
      'Ask a question, share what you built, or float an idea before it becomes a decision document.',
    cta: 'Start a discussion',
    href: `${REPO_URL}/discussions`,
  },
  {
    icon: ScrollText,
    title: 'Design decisions',
    detail:
      'Every accepted tradeoff in the language is a numbered, dated document, not a chat log.',
    cta: 'Read the log',
    href: `${REPO_URL}/tree/master/docs/language/decisions`,
  },
]

export const flow = [
  {
    title: 'Open',
    detail: 'A bug, a gap, or a question, filed as a small, concrete issue.',
  },
  {
    title: 'Discuss',
    detail:
      'The tradeoff gets argued in the open against decisions already on record.',
  },
  {
    title: 'Decide',
    detail: 'An accepted tradeoff becomes a numbered, dated document.',
  },
  {
    title: 'Land',
    detail: 'The change ships in the checker, the compiler, or the docs.',
  },
]

export const steps = [
  {
    title: 'Read the decision log',
    detail:
      'Understand why the language looks the way it does before proposing that it look different. Most open questions already have a document.',
  },
  {
    title: 'Run something in the playground',
    detail:
      'The playground runs the real checker against real source. A diagnostic you did not expect is worth reporting.',
  },
  {
    title: 'Check what is not built yet',
    detail:
      'The homepage and the support matrix name the gaps directly, including the durable workflow runtime, which does not exist.',
  },
  {
    title: 'Open a small, concrete issue',
    detail:
      'A specific program that behaves wrong is more useful right now than a proposal for a large redesign.',
  },
]

export interface Decision {
  id: string
  title: string
  status: string
  detail: string
  file: string
}

export const decisions: Decision[] = [
  {
    id: '0001',
    title: 'Minimal language kernel',
    status: 'Accepted, partially implemented',
    detail:
      'Indentation for behavior, braces for data, = for pure evaluation, <- for durable effects.',
    file: '0001-language-kernel.md',
  },
  {
    id: '0004',
    title: 'Portable module compilation boundary',
    status: 'Accepted, implemented',
    detail:
      'Every module compiles first to a verified, backend-neutral IR before any target is chosen.',
    file: '0004-portable-module-ir.md',
  },
  {
    id: '0006',
    title: 'Affine material flow in portable workflows',
    status: 'Accepted, initial implementation',
    detail:
      'Every physical material has one owning place, verified after type checking using copy, borrow, and take.',
    file: '0006-affine-material-flow.md',
  },
  {
    id: '0011',
    title: 'Artifact dependencies from material dataflow',
    status: 'Accepted, initial target lowering implemented',
    detail:
      'What depends on what is derived from typed dataflow, not from naming conventions.',
    file: '0011-dependencies-from-material-dataflow.md',
  },
]
