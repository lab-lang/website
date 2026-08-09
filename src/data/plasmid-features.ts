export const CENTER = 230
export const RING_RADIUS = 138
export const RING_WIDTH = 13
export const TOTAL_BP = 4214

export interface Feature {
  /** Matches the identifier as it appears in Lab source. */
  token: string
  label: string
  kind: string
  start: number
  end: number
  color: string
  /** Distance from the centre at which the leader line turns to its label. */
  labelRadius: number
  directional: boolean
}

/**
 * Features of the `reporter` plasmid declared in the hero source. Each token is
 * a symbol the source names, so an arc is drawn as the line that declares it is
 * typed out. Coordinates are illustrative; the arrangement follows a standard
 * iGEM transcription unit on a pSB1C3 backbone, which carries chloramphenicol
 * resistance and a pMB1 origin.
 */
export const features: Feature[] = [
  {
    token: 'J23101',
    label: 'J23101',
    kind: 'promoter',
    start: 120,
    end: 250,
    color: 'var(--color-amber)',
    labelRadius: 172,
    directional: true,
  },
  {
    token: 'B0034',
    label: 'B0034',
    kind: 'RBS',
    start: 290,
    end: 350,
    color: '#f2b95c',
    labelRadius: 236,
    directional: false,
  },
  {
    token: 'GFP',
    label: 'GFP',
    kind: 'CDS',
    start: 390,
    end: 1110,
    color: 'var(--color-gfp)',
    labelRadius: 172,
    directional: true,
  },
  {
    token: 'B0015',
    label: 'B0015',
    kind: 'terminator',
    start: 1150,
    end: 1290,
    color: '#cbb59c',
    labelRadius: 194,
    directional: false,
  },
  {
    token: 'pSB1C3',
    label: 'CmR',
    kind: 'resistance',
    start: 1950,
    end: 2760,
    color: 'var(--color-cfp)',
    labelRadius: 172,
    directional: true,
  },
  {
    token: 'pSB1C3',
    label: 'pMB1 ori',
    kind: 'origin',
    start: 3250,
    end: 3850,
    color: 'var(--color-mcherry)',
    labelRadius: 172,
    directional: true,
  },
]
