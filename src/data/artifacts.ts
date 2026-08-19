import type { SourceLanguage } from '@/components/source-code'
import { heroPlasmidExamplePython, reporterExample } from '@/data/examples'

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
  /**
   * Only the two stages that still know which frontend they came from carry
   * these. Everything from LAIR onward is byte-identical either way, which is
   * the argument the rail exists to make, so leaving them unset is the point
   * rather than an omission.
   */
  python?: {
    emit?: string
    filename?: string
    language?: SourceLanguage
    body?: string
  }
}

const checkSummary = `$ labc reporter.lab

Lab module compiled

Resolved imports
  - std.bio.designs (builtin-standard-library)
  - std.bio.golden_gate (builtin-standard-library)

Verified declarations
  - catalog J23101: Part ("J23101")
  - catalog B0034: Part ("B0034")
  - catalog GFP: Part ("GFP")
  - catalog B0015: Part ("B0015")
  - catalog pSB1C3: Backbone ("pSB1C3")
  - catalog BsaI: RestrictionEnzyme ("BsaI")
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
    profile = PLAN["deck"]
    deck = profile["deck"]
    stage = profile["stages"]["assembly"]

    temperature = cast(
        protocol_api.TemperatureModuleContext,
        protocol.load_module(
            deck["temperature_module"]["model"], deck["temperature_module"]["slot"]
        ),
    )
    sources = temperature.load_labware(deck["temperature_module"]["labware"])
    thermocycler = cast(
        protocol_api.ThermocyclerContext,
        protocol.load_module(deck["thermocycler"]["model"]),
    )
    reaction_plate = thermocycler.load_labware(deck["thermocycler"]["labware"])
    tips = [
        protocol.load_labware(stage["small_tips"]["labware"], slot)
        for slot in stage["small_tips"]["slots"]
    ]
    pipette = protocol.load_instrument(
        profile["instruments"]["small"]["model"],
        profile["instruments"]["small"]["mount"],
        tip_racks=tips,
    )
    temperature.set_temperature(4)
    thermocycler.open_lid()

    source_wells = PLAN["assembly_source_wells"]
    for construct in PLAN["assemblies"]:
        chemistry = construct["chemistry"]
        part_volume = chemistry["part_volume_ul"]`

const benchProtocol = `# Lab automated plasmid build — manual protocol

> Concept protocol generated for \`opentrons.ot2\`. Review and qualify it for the actual laboratory before execution.

## Build summary

- Plasmids assembled: 1
- Strains built: 0
- Workflow: Golden Gate assembly → heat-shock transformation → serial dilution and selective plating
- Opentrons API level: 2.21

## Stage 1 — Golden Gate assembly

Keep DNA and enzymes cold. For every reaction, add reagents in the order shown.

### reporter

- Reaction wells: A1
- Final sequence length: 8 bp

| Reagent | Volume per reaction |
| --- | ---: |
| Nuclease-free water | 2 µL |
| T4 DNA ligase buffer | 2 µL |
| T4 DNA ligase | 4 µL |
| BsaI | 2 µL |
| pSB1C3 backbone | 2 µL |
| J23101 | 2 µL |
| B0034 | 2 µL |
| GFP | 2 µL |
| B0015 | 2 µL |
| **Total** | **20 µL** |

Run 75 cycles of 37 °C for 2 min and 16 °C for 5 min; then 50 °C for 5 min, 80 °C for 10 min, and hold at 4 °C.

## Stage 2 — Heat-shock transformation

Load the DNA plate as shown, then for each reaction combine that strain's cells and plasmid DNA in the volumes listed below.

| Strain | Host | Plasmids | DNA wells | Culture destination | Cells (µL) | DNA per plasmid (µL) | Recovery medium (µL) |
| --- | --- | --- | --- | --- | ---: | ---: | ---: |

## Stage 3 — Serial dilution and plating

| Strain | Selection | Culture | Dilution wells | Agar wells by dilution | Culture transfer (µL) | Colony transfer (µL) |
| --- | --- | --- | --- | --- | ---: | ---: |

## Execution boundary

This concept spike allocates one 96-well reaction plate, one DNA plate, one dilution plate, one agar plate, and 24-well source racks. It does not resolve inventory lots, verify DNA concentrations, design overhangs, domesticate internal restriction sites, or qualify the protocol for a specific lab.`

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
    python: {
      emit: 'reporter.py',
      filename: 'reporter.py',
      language: 'python',
      body: heroPlasmidExamplePython,
    },
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
    python: { body: checkSummary.replace('reporter.lab', 'reporter.py') },
  },
  {
    id: 'lair',
    emit: 'lab-opt',
    label: 'LAIR',
    filename: 'reporter.ir',
    headline: 'Meaning survives lowering',
    description:
      'LAIR, the Lab Automation Intermediate Representation, is where meaning survives specialization: a design layer for artifact intent, a workflow layer for target-neutral realization, and a protocol layer for target-selected operations. Every material value is typed, and the verifier requires that each has at most one consumer. This is the textual form `lab-opt` parses, verifies, and runs passes over.',
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

/**
 * Real diagnostics, captured from `labc` runs on deliberately broken programs.
 * The message is the checker's, so it is the same sentence whichever frontend
 * wrote the program; only the source it is reported against changes.
 */
export const diagnostics = [
  {
    id: 'double-spend',
    title: 'A material used twice',
    source: `strain, culture <- transform reporter_host from dependencies into cells
second, other  <- transform reporter_host from dependencies into more_cells`,
    pythonSource: `strain, culture = wf.perform(lab.transform(reporter_host, dna=dependencies, into=cells))
second, other = wf.perform(lab.transform(reporter_host, dna=dependencies, into=more_cells))`,
    error:
      "affine material-flow error in workflow 'double_spend' at body.5:\n  physical value 'dependencies' is no longer available",
    explanation:
      'The plasmid material was consumed by the first transformation. There is no second tube of it, so there is no second use of it.',
  },
  {
    id: 'unconsumed',
    title: 'A material left behind',
    source: `cells <- provision DH5alpha
return product`,
    pythonSource: `cells = wf.perform(lab.provision(DH5alpha))
return product`,
    error:
      "affine material-flow error in workflow 'leak' at body.2:\n  terminating path still owns cells; return, store, transfer, or dispose it",
    explanation:
      'Competent cells were provisioned and never used. Physical things do not fall out of scope; someone has to put them somewhere.',
  },
]
