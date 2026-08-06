/**
 * The `layout` block of the `regulated_expression` circuit, in source order.
 * `promoter` and `coding` are the circuit's generic inputs, bound by
 * `regulated_expression(pTet, sfGFP)`. Colours match the matching arc on the
 * plasmid ring so a part reads the same in either view.
 */
export const CIRCUIT_PARTS = [
  {
    slot: 'promoter',
    name: 'pTet',
    role: 'promoter',
    glyph: 'promoter',
    color: '#e1901f',
    generic: true,
  },
  {
    slot: 'B0034',
    name: 'B0034',
    role: 'RBS',
    glyph: 'rbs',
    color: '#f2b95c',
    generic: false,
  },
  {
    slot: 'coding',
    name: 'sfGFP',
    role: 'CDS',
    glyph: 'cds',
    color: '#93e03f',
    generic: true,
  },
  {
    slot: 'B0015',
    name: 'B0015',
    role: 'terminator',
    glyph: 'terminator',
    color: '#cbb59c',
    generic: false,
  },
]
