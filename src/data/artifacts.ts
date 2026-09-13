import type { SourceLanguage } from '@/components/source-code'
import { reporterExample, reporterExamplePython } from '@/data/examples'

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
  - catalog J23101: Promoter ("J23101")
  - catalog B0034: Part ("B0034")
  - catalog GFP: CDS ("GFP")
  - catalog B0015: Part ("B0015")
  - catalog pSB1C3: Backbone ("pSB1C3")
  - catalog BsaI: RestrictionEnzyme ("BsaI")
  - plasmid reporter (2 requirements, 3 acceptance claims)

This is verified portable module IR; no laboratory target was
selected or executed.`

const allocatedLair = `builtin.module @lab_build
{
  ^block1v1():
    lair.stage () [] [stage: builtin.string "allocated-procedure"];
    allocation.context () [] [
      facility: builtin.string "https://example.org/facility",
      inventory_sha256: builtin.string "…"];
    allocation.method () [] [
      selected_method: builtin.string
        "https://www.lab-compiler.org/ns/method#automated-golden-gate",
      selected_source_operation: builtin.string "std.bio.build.realize"];
    reaction = procedure.task (design) [] [
      operation: builtin.string
        "https://www.lab-compiler.org/ns/procedure#SetupGoldenGateReaction"]:
      <(design.artifact) ->
        (procedure.material <"https://www.lab-compiler.org/ns/material-state#AssemblyReaction">)>;
    capability.requirement () [] [
      capability_kind: builtin.string
        "https://sbol.io/ns/capability#LiquidHandling",
      minimum_qualification: builtin.string
        "https://sbol.io/ns/facility#Plannable"];
    allocation.binding () [] [
      bound_offering: builtin.string
        "https://example.org/opentrons_ot2_liquid_handling",
      bound_asset: builtin.string "https://example.org/opentrons_ot2",
      adapter_driver: builtin.string "opentrons.ot2"]
}`

const ot2Python = `def run(protocol: protocol_api.ProtocolContext) -> None:
    profile = PLAN["deck"]
    deck = profile["deck"]
    stage = profile["stages"]["assembly"]
    execution = PLAN["execution"]

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

    for destination_name in execution["reaction_wells"]:
        destination = reaction_plate[destination_name]
        for addition in execution["additions"]:
            pipette.transfer(
                addition["volume_ul"],
                sources[addition["source_well"]],
                destination,
                new_tip="always",
            )`

const benchProtocol = `# Golden Gate reaction setup

> Procedure task allocated to \`https://example.org/opentrons_ot2\` through the \`opentrons.ot2\` adapter. Review and qualify it for the actual laboratory before execution.

## Exact allocation

- Capability: \`https://sbol.io/ns/capability#LiquidHandling\`
- Offering: \`https://example.org/opentrons_ot2_liquid_handling\`
- Control mode: \`ReviewedFileControl\`
- Reaction well: A1
- Final reaction volume: 20 µL

## Material additions

| Role | Exact source | Volume |
| --- | --- | ---: |
| Water | \`nuclease_free_water_lot\` | 2 µL |
| Buffer | \`T4_DNA_ligase_buffer_lot\` | 2 µL |
| Ligase | \`T4_DNA_ligase_lot\` | 4 µL |
| Restriction enzyme | \`BsaI_lot\` | 2 µL |
| Backbone | \`pSB1C3_lot\` | 2 µL |
| Components | four exact part lots | 8 µL |

## Execution boundary

This document covers one exact allocated Requirement. Thermal cycling, transformation, recovery, dilution, and plating remain separate Procedure tasks with their own bindings and reviewed documents.`

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
      body: reporterExamplePython,
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
      'LAIR, the Lab Automation Intermediate Representation, is where meaning survives specialization. Method alternatives carry Procedure dataflow and first-class Capability requirements into one joint facility solution; Allocated Procedure freezes the exact Method, material, offering, Asset, and adapter bindings before device lowering.',
    language: 'ir',
    body: allocatedLair,
  },
  {
    id: 'ot2',
    emit: 'lab build',
    label: 'OT-2',
    filename: 'automation_protocol.py',
    headline: 'Compiled to a liquid handler',
    description:
      'Facility allocation binds a semantic requirement to an exact qualified OT-2 offering and Asset. The explicitly bound Opentrons adapter allocates deck wells, applies the checked profile, and emits reviewed Python at API level 2.21.',
    language: 'python',
    body: ot2Python,
  },
  {
    id: 'bench',
    emit: 'lab build',
    label: 'Bench',
    filename: 'manual_protocol.pdf',
    headline: 'Or instructions a person can use',
    description:
      'The same exact allocated task renders as an operator document with its Requirement, offering, Asset, materials, parameters, and execution boundary. Manual and automated tasks remain distinct nodes in one reviewed facility plan.',
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
