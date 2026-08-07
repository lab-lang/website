/** What a reader gets from the artifact itself, before wrapping anything around it. */
export const CRITERIA = [
  { key: 'result', label: 'States the result' },
  { key: 'deck', label: 'No deck geometry' },
  { key: 'material', label: 'Tracks material' },
  { key: 'checked', label: 'Checked before it runs' },
  { key: 'machines', label: 'More than one machine' },
] as const

export type Criterion = (typeof CRITERIA)[number]['key']

export type Level = 0 | 1 | 2

export const LEVEL_LABEL: Record<Level, string> = {
  0: 'no',
  1: 'partly',
  2: 'yes',
}

export interface CapabilityRow {
  name: string
  href: string
  marks: Record<Criterion, Level>
}

/*
 * Graded on what the artifact carries, not on project health, and not on what
 * a layer built over it could add. Lab's empty mark in the last column is the
 * point of grading honestly: there is one backend today.
 */
export const CAPABILITY_ROWS: CapabilityRow[] = [
  {
    name: 'Opentrons Python API',
    href: 'https://docs.opentrons.com/',
    marks: { result: 0, deck: 0, material: 0, checked: 1, machines: 0 },
  },
  {
    name: 'PyLabRobot',
    href: 'https://github.com/PyLabRobot/pylabrobot',
    marks: { result: 0, deck: 0, material: 0, checked: 1, machines: 2 },
  },
  {
    name: 'BuildCompiler',
    href: 'https://buildcompiler.readthedocs.io/en/latest/',
    marks: { result: 1, deck: 2, material: 1, checked: 2, machines: 1 },
  },
  {
    name: 'Autoprotocol',
    href: 'https://github.com/autoprotocol/autoprotocol-python',
    marks: { result: 0, deck: 2, material: 0, checked: 1, machines: 2 },
  },
  {
    name: 'LabOP',
    href: 'https://github.com/Bioprotocols/labop',
    marks: { result: 0, deck: 2, material: 0, checked: 1, machines: 2 },
  },
  {
    name: 'Lab',
    href: '/docs/overview',
    marks: { result: 2, deck: 2, material: 2, checked: 2, machines: 0 },
  },
]
