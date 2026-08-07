/**
 * Every token carries both of its values. The name is what components reach
 * for; which of the two they land on is the theme's business, not theirs.
 */
export interface ColorToken {
  name: string
  token: string
  light: string
  dark: string
  note: string
}

export const groundTokens: ColorToken[] = [
  {
    name: 'Paper',
    token: '--color-paper',
    light: '#f9efdd',
    dark: '#14100a',
    note: 'The page background.',
  },
  {
    name: 'Shell',
    token: '--color-shell',
    light: '#fef9ef',
    dark: '#1e1710',
    note: 'Cards and panels, a shade lighter than the page.',
  },
  {
    name: 'Sand',
    token: '--color-sand',
    light: '#eee0c3',
    dark: '#241c13',
    note: 'Used to set a section apart from the page around it.',
  },
  {
    name: 'Sand deep',
    token: '--color-sand-deep',
    light: '#e4d3b2',
    dark: '#2e2418',
    note: 'A slightly darker sand, for stacking surfaces.',
  },
]

export const inkTokens: ColorToken[] = [
  {
    name: 'Ink',
    token: '--color-ink',
    light: '#2b1c11',
    dark: '#f2e7d5',
    note: 'The main text color. A warm brown on paper, a warm off-white on dark.',
  },
  {
    name: 'Umber',
    token: '--color-umber',
    light: '#7c6551',
    dark: '#b3a189',
    note: 'Secondary text, like captions and body copy.',
  },
  {
    name: 'Umber soft',
    token: '--color-umber-soft',
    light: '#a08a74',
    dark: '#948270',
    note: 'The faintest text: fine print, disabled labels.',
  },
]

export const structureTokens: ColorToken[] = [
  {
    name: 'Amber',
    token: '--color-amber',
    light: '#e1901f',
    dark: '#e9a03a',
    note: 'Links, buttons, anything that needs to stand out on the page.',
  },
  {
    name: 'Amber deep',
    token: '--color-amber-deep',
    light: '#99560b',
    dark: '#f0b657',
    note: 'Small text and focus outlines. It darkens on paper and lightens on dark, so it stays readable either way.',
  },
]

export const fluorophoreTokens: ColorToken[] = [
  {
    name: 'GFP',
    token: '--color-gfp',
    light: '#93e03f',
    dark: '#93e03f',
    note: 'Dark backgrounds only. It looks like it’s glowing there.',
  },
  {
    name: 'mCherry',
    token: '--color-mcherry',
    light: '#e8446c',
    dark: '#e8446c',
    note: 'Dark backgrounds only. It looks like it’s glowing there.',
  },
  {
    name: 'CFP',
    token: '--color-cfp',
    light: '#4ec3d4',
    dark: '#4ec3d4',
    note: 'Dark backgrounds only. It looks like it’s glowing there.',
  },
]

export const vesselTokens: ColorToken[] = [
  {
    name: 'Vessel',
    token: '--color-vessel',
    light: '#1d1409',
    dark: '#0b0805',
    note: 'The main dark background color. It drops below the page in dark mode so code panels still read as recessed.',
  },
  {
    name: 'Vessel raised',
    token: '--color-vessel-raised',
    light: '#2b1e10',
    dark: '#17100a',
    note: 'A step lighter than vessel, for cards on a dark background.',
  },
]
