import type { SourceLanguage } from '../components/source-code'
import { reporterExample } from './examples'

/**
 * The five artifacts below are what the toolchain actually produces for one
 * program. Compiler output, LAIR text, generated Python, and the generated
 * bench protocol are reproduced from real runs rather than illustrated.
 */
export interface Stage {
  id: string
  /** The `--emit` value or command that produces this artifact. */
  emit: string
  label: string
  filename: string
  headline: string
  description: string
  language: SourceLanguage
  body: string
}

const checkSummary = `$ labc reporter.lab

Lab module compiled

Resolved imports
  - std.bio.inventory (builtin-standard-library)

Verified declarations
  - binding J23101
  - binding B0034
  - binding GFP
  - binding B0015
  - binding pSB1C3
  - binding BsaI
  - plasmid reporter (2 requirements, 3 acceptance claims)

This is verified portable module IR; no laboratory target was
selected or executed.`

const protocolIr = `builtin.module @reporter
{
  ^block1v1():
    design_v0 = design.plasmid () [] [
      artifact_name: builtin.string "reporter",
      topology: design.topology Circular,
      exact_sequence_required: builtin.bool true,
      acceptance_minimum_concentration_ng_per_ul: <100: ui32>,
      acceptance_minimum_volume_ul: <20: ui32>]:
      <() -> (design.artifact)> !0;

    cells_v1 = protocol.provision () [] [
      item: builtin.string "DH5alpha"]:
      <() -> (protocol.material CompetentCells)> !1;

    fragments_v2 = protocol.synthesize (design_v0) [] []:
      <(design.artifact) -> (protocol.material LinearDna)> !2;

    construct_v3 = protocol.assemble (fragments_v2) [] []:
      <(protocol.material LinearDna)
        -> (protocol.material CircularDna)> !3;

    culture_v4 = protocol.transform (construct_v3, cells_v1) [] []:
      <(protocol.material CircularDna,
        protocol.material CompetentCells)
        -> (protocol.material TransformedCulture)> !4
}`

const ot2Python = `def run(protocol: protocol_api.ProtocolContext) -> None:
    temperature = cast(
        protocol_api.TemperatureModuleContext,
        protocol.load_module("temperature module gen2", "1"),
    )
    sources = temperature.load_labware(
        "opentrons_24_aluminumblock_nest_1.5ml_snapcap"
    )
    thermocycler = cast(
        protocol_api.ThermocyclerContext,
        protocol.load_module("thermocycler module gen2"),
    )
    reaction_plate = thermocycler.load_labware(
        "nest_96_wellplate_100ul_pcr_full_skirt"
    )
    tips = protocol.load_labware("opentrons_96_tiprack_20ul", "2")
    pipette = protocol.load_instrument(
        "p20_single_gen2", "left", tip_racks=[tips]
    )
    temperature.set_temperature(4)
    thermocycler.open_lid()

    source_wells = PLAN["assembly_source_wells"]
    for construct in PLAN["constructs"]:
        additions = [
            ("reagent:nuclease_free_water", construct["water_volume_ul"]),
            ("reagent:T4_DNA_ligase_buffer", 2),
            ("reagent:T4_DNA_ligase", 4),
            ("enzyme:" + construct["restriction_enzyme"], 2),
            ("dna:" + construct["backbone"], 2),
        ] + [("dna:" + part, 2) for part in construct["components"]]`

const benchProtocol = `# reporter — manual build protocol

> Generated for a lab without a robot: the same verified Protocol
> operations \`labc\` would otherwise hand to a liquid handler,
> rendered here as something a person can follow at a bench.
> Review and qualify before running.

## What you're building

One circular construct, four parts in order: pTet, B0034, sfGFP,
B0015, carried on a pSB1C3 backbone. Golden Gate assembly, one
enzyme, one pot.

## Before you start

- BsaI, T4 DNA ligase, and T4 DNA ligase buffer, thawed on ice
- pSB1C3 backbone and all four parts, at working concentration
- Nuclease-free water
- A thermocycler with a heated lid
- One PCR tube or well, labeled \`reporter\`

## Reaction: reporter

Add reagents to a single tube in the order below, on ice. Mix by
pipetting, then spin down briefly before cycling.

- Reaction well: A1
- Final sequence length: 8 bp

| Reagent | Volume |
| --- | ---: |
| Nuclease-free water | 6 µL |
| T4 DNA ligase buffer | 2 µL |
| T4 DNA ligase | 1 µL |
| BsaI | 1 µL |
| pSB1C3 backbone | 2 µL |
| pTet | 2 µL |
| B0034 | 2 µL |
| sfGFP | 2 µL |
| B0015 | 2 µL |
| **Total** | **20 µL** |

## Thermocycler program

Heated lid on, 105 °C.

1. 37 °C for 2 min, 16 °C for 5 min — repeat for 75 cycles
2. 50 °C for 5 min (final digestion)
3. 80 °C for 10 min (enzyme heat-kill)
4. Hold at 4 °C

## When it's done

The well now holds \`construct\`, the same value \`protocol.assemble\`
produces in the LAIR view of this program. It is not a stable
storage form: proceed directly to transformation rather than
holding the reaction at room temperature.`

export const stages: Stage[] = [
  {
    id: 'source',
    emit: 'reporter.lab',
    label: 'Source',
    filename: 'reporter.lab',
    headline: 'What the scientist needs',
    description:
      'The program names parts, states the constraints that must hold before construction, and lists the evidence that would justify accepting the result. It says nothing about a facility, an assembly method, or a pipette.',
    language: 'lab',
    body: reporterExample,
  },
  {
    id: 'check',
    emit: 'labc',
    label: 'Check',
    filename: 'stdout',
    headline: 'Verified before anything is touched',
    description:
      'Names resolve against the standard-library catalog, types check, action contracts resolve, and material ownership is verified. The compiler reports what it proved and reminds you that nothing has been selected or executed.',
    language: 'shell',
    body: checkSummary,
  },
  {
    id: 'lair',
    emit: '--emit target-selected-protocol',
    label: 'LAIR',
    filename: 'reporter.ir',
    headline: 'Meaning survives lowering',
    description:
      "LAIR, the Lab Automation Intermediate Representation, is where meaning survives specialization: a design layer for artifact intent, a workflow layer for target-neutral realization, and a protocol layer for target-selected operations. Every material value is typed, and the verifier requires that each has at most one consumer.",
    language: 'ir',
    body: protocolIr,
  },
  {
    id: 'ot2',
    emit: '--emit opentrons-assembly',
    label: 'OT-2',
    filename: 'assembly_protocol.py',
    headline: 'Compiled to a liquid handler',
    description:
      'The Opentrons backend consumes only verified protocol operations. It allocates deck wells, picks labware and pipettes, and emits Python at API level 2.21 that is checked against the official Opentrons simulator.',
    language: 'python',
    body: ot2Python,
  },
  {
    id: 'bench',
    emit: '--emit manual-protocol',
    label: 'Bench',
    filename: 'manual_protocol.md',
    headline: 'Or instructions a person can use',
    description:
      'The same verified operations render as instructions for a human, with reaction tables and thermocycler settings. A lab without a robot runs the identical program.',
    language: 'markdown',
    body: benchProtocol,
  },
]

/** Real diagnostics, captured from `labc` runs on deliberately broken programs. */
export const diagnostics = [
  {
    id: 'double-spend',
    title: 'A material used twice',
    source: `culture <- transform construct into cells
second  <- transform construct into cells`,
    error:
      "affine material-flow error in workflow 'double_spend' at body.4:\n  physical value 'construct' is no longer available",
    explanation:
      'The construct was consumed by the first transformation. There is no second tube of it, so there is no second use of it.',
  },
  {
    id: 'unconsumed',
    title: 'A material left behind',
    source: `cells <- provision DH5alpha
return construct`,
    error:
      "affine material-flow error in workflow 'leak' at body.3:\n  terminating path still owns cells; return, store, transfer, or dispose it",
    explanation:
      'Competent cells were provisioned and never used. Physical things do not fall out of scope; someone has to put them somewhere.',
  },
]
