/**
 * The Golden Gate example, verbatim from `examples/golden-gate/` in the
 * compiler repository, laid out under the same paths its package uses.
 * Every file reports zero diagnostics against the real engine.
 */

export interface PlaygroundFile {
  path: string
  contents: string
}

export interface PlaygroundProject {
  id: string
  note: string
  defaultFile: string
  files: PlaygroundFile[]
  /**
   * The package namespace this project's modules live under, as a `lab.toml`
   * would establish it. Absent for a loose project, whose files are named by
   * path alone.
   */
  namespace?: string
}

/**
 * The module name a file answers to, derived the way a package derives one:
 * the path under `src/`, dotted, `-` to `_`, beneath the package namespace.
 * Files in a project without a namespace keep the engine's own path-derived
 * naming, so this returns nothing for them.
 */
export function moduleIdFor(
  project: PlaygroundProject,
  path: string,
): string | undefined {
  if (!project.namespace) return undefined
  const segments = path
    .replace(/\.lab$/, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, '_'))
  return [project.namespace, ...segments].join('.')
}

const inventoryFile: PlaygroundFile = {
  path: 'designs/inventory.lab',
  contents: `/*!
 * External inventory identities, kept apart from the designs that use them.
 *
 * A typed symbol here says only that a name refers to a catalogued item. It is
 * not a claim that a suitable lot is on the shelf; that remains an inventory
 * resolution and a runtime evidence question.
 */

use std.bio.designs

// Constitutive promoters of differing strength, the shared ribosome binding
// site and terminator, and the fluorescent reporters.
buy part J23101
buy part J23106
buy part B0034
buy part B0015
buy part GFP
buy part RFP

// Assembly backbone and the type IIS enzyme that opens it.
buy backbone pSB1C3

// BsaI cuts at 37 C; every plasmid it opens digests the same way.
buy restriction_enzyme BsaI:
  digest_temperature = 37 C
  digest_duration = 2 min

// Host organisms. DH5alpha is a cloning strain; BL21 is an expression strain.
// Both are transformed the way competent cells are: chilled, shocked, recovered.
buy chassis DH5alpha:
  heat_shock_temperature = 42 C
  cold_incubation = 30 min
  recovery_temperature = 37 C
  recovery_duration = 60 min

buy chassis BL21:
  heat_shock_temperature = 42 C
  cold_incubation = 30 min
  recovery_temperature = 37 C
  recovery_duration = 60 min

buy antibiotic chloramphenicol
`,
}

const plasmidsFile: PlaygroundFile = {
  path: 'designs/plasmids.lab',
  contents: `/*!
 * Two composite transcription units, each a promoter driving a fluorescent
 * reporter through a shared RBS and terminator.
 *
 * Sequences are synthetic compiler fixtures, not qualified biological designs.
 * The reaction chemistry in each design is scientific intent and travels with
 * the artifact; where the reaction physically happens is a target profile's
 * concern.
 */

use std.bio.designs
use std.bio.golden_gate

use golden_gate.designs.inventory

/**
 * A GFP transcription unit in the pSB1C3 backbone.
 *
 * J23101 drives GFP through the shared RBS and terminator, assembled by Golden
 * Gate with BsaI. Accepted only if the built sequence matches the design.
 */
plasmid composite_plasmid_1:
  sequence = dna("GCTAGCGGATCCATGACCATGATTACGCCAAGCTTGAATTC")
  backbone = pSB1C3
  components = [J23101, B0034, GFP, B0015]
  restriction_enzyme = BsaI
  assembly_replicates = 1

  reaction_volume = 20 uL
  part_volume = 2 uL
  enzyme_volume = 2 uL
  ligase_volume = 4 uL
  buffer_volume = 2 uL
  assembly_cycles = 75
  ligate_temperature = 16 C
  ligate_duration = 5 min

  require topology == circular
  accept sequence == design.sequence

/**
 * An RFP transcription unit in the pSB1C3 backbone.
 *
 * Identical in construction to \`composite_plasmid_1\` but driven by the weaker
 * J23106 promoter, so the panel reports two promoter strengths against two
 * reporters.
 */
plasmid composite_plasmid_2:
  sequence = dna("GCTAGCGGATCCATGGCCTCCTCCGAGGACGTCATCAAGGAATTC")
  backbone = pSB1C3
  components = [J23106, B0034, RFP, B0015]
  restriction_enzyme = BsaI
  assembly_replicates = 1

  reaction_volume = 20 uL
  part_volume = 2 uL
  enzyme_volume = 2 uL
  ligase_volume = 4 uL
  buffer_volume = 2 uL
  assembly_cycles = 75
  ligate_temperature = 16 C
  ligate_duration = 5 min

  require topology == circular
  accept sequence == design.sequence
`,
}

const strainsFile: PlaygroundFile = {
  path: 'designs/strains.lab',
  contents: `/*!
 * Four engineered organisms: each composite plasmid in each of two chassis.
 *
 * The same plasmid appearing in two strains is the point. A strain is its own
 * artifact, so DH5alpha carrying composite_plasmid_1 and BL21 carrying the same
 * plasmid are two distinct things to build, accept, and store. Neither is a
 * property of the plasmid.
 *
 * The heat-shock and plating parameters are shared across all four, because one
 * robot run holds every strain in a single thermocycler block.
 */

use std.bio.designs
use std.bio.golden_gate

use golden_gate.designs.inventory
use golden_gate.designs.plasmids

/** The GFP reporter carried in the DH5alpha cloning strain. */
strain composite_strain_1:
  chassis = DH5alpha
  plasmids = [composite_plasmid_1]
  selection = chloramphenicol
  transformation_replicates = 2
  plating_replicates = 1
  serial_dilutions = 2

  cell_volume = 20 uL
  dna_volume = 2 uL
  recovery_volume = 60 uL
  heat_shock_duration = 1 min
  medium_volume = 18 uL
  culture_volume = 2 uL
  colony_volume = 4 uL

/** The RFP reporter carried in the DH5alpha cloning strain. */
strain composite_strain_2:
  chassis = DH5alpha
  plasmids = [composite_plasmid_2]
  selection = chloramphenicol
  transformation_replicates = 2
  plating_replicates = 1
  serial_dilutions = 2

  cell_volume = 20 uL
  dna_volume = 2 uL
  recovery_volume = 60 uL
  heat_shock_duration = 1 min
  medium_volume = 18 uL
  culture_volume = 2 uL
  colony_volume = 4 uL

/** The GFP reporter carried in the BL21 expression strain. */
strain composite_strain_3:
  chassis = BL21
  plasmids = [composite_plasmid_1]
  selection = chloramphenicol
  transformation_replicates = 2
  plating_replicates = 1
  serial_dilutions = 2

  cell_volume = 20 uL
  dna_volume = 2 uL
  recovery_volume = 60 uL
  heat_shock_duration = 1 min
  medium_volume = 18 uL
  culture_volume = 2 uL
  colony_volume = 4 uL

/** The RFP reporter carried in the BL21 expression strain. */
strain composite_strain_4:
  chassis = BL21
  plasmids = [composite_plasmid_2]
  selection = chloramphenicol
  transformation_replicates = 2
  plating_replicates = 1
  serial_dilutions = 2

  cell_volume = 20 uL
  dna_volume = 2 uL
  recovery_volume = 60 uL
  heat_shock_duration = 1 min
  medium_volume = 18 uL
  culture_volume = 2 uL
  colony_volume = 4 uL
`,
}

const assembleFile: PlaygroundFile = {
  path: 'workflows/assemble.lab',
  contents: `/*!
 * Stage 1 of the Golden Gate workflow: parts and backbone are cut and ligated
 * into a circular product.
 */

use std.bio.build
use golden_gate.designs.plasmids

/**
 * Assemble the GFP reporter plasmid.
 *
 * Returns the plasmid it produces and takes no material input, so the compiler
 * places this build ahead of everything that consumes the plasmid without any
 * declared order.
 */
workflow assemble_composite_plasmid_1() -> Material<Plasmid>:
  product <- realize composite_plasmid_1
  return product

/**
 * Assemble the RFP reporter plasmid.
 *
 * The companion to \`assemble_composite_plasmid_1\`, differing only in the
 * design it realizes. The two builds share no material and may run in either
 * order.
 */
workflow assemble_composite_plasmid_2() -> Material<Plasmid>:
  product <- realize composite_plasmid_2
  return product
`,
}

const buildStrainsFile: PlaygroundFile = {
  path: 'workflows/build_strains.lab',
  contents: `/*!
 * Stages 2 and 3: assembled plasmids are introduced into competent cells by
 * heat shock, the recovered culture is serially diluted, and each dilution is
 * spotted onto selective agar.
 */

use std.lab.plasmid
use golden_gate.designs.inventory
use golden_gate.designs.strains

/**
 * Build the GFP reporter in DH5alpha.
 *
 * Consumes the \`composite_plasmid_1\` material it transforms, so the compiler
 * knows this strain cannot be built before that plasmid exists. Returns the
 * strain and the selective plate it was recovered on.
 */
workflow build_composite_strain_1(
  composite_plasmid_1: Material<Plasmid>,
) -> (
  strain: Material<Strain>,
  plate: Material<Plate>,
):
  dependencies = [composite_plasmid_1]
  cells <- provision DH5alpha
  strain, culture <- transform composite_strain_1 from dependencies into cells
  culture <- recover culture for 1 h
  culture <- dilute culture
  plate <- plate culture on chloramphenicol
  return strain, plate

/**
 * Build the RFP reporter in DH5alpha.
 *
 * Consumes the \`composite_plasmid_2\` material it transforms, so the compiler
 * knows this strain cannot be built before that plasmid exists. Returns the
 * strain and the selective plate it was recovered on.
 */
workflow build_composite_strain_2(
  composite_plasmid_2: Material<Plasmid>,
) -> (
  strain: Material<Strain>,
  plate: Material<Plate>,
):
  dependencies = [composite_plasmid_2]
  cells <- provision DH5alpha
  strain, culture <- transform composite_strain_2 from dependencies into cells
  culture <- recover culture for 1 h
  culture <- dilute culture
  plate <- plate culture on chloramphenicol
  return strain, plate

/**
 * Build the GFP reporter in BL21.
 *
 * Consumes the \`composite_plasmid_1\` material it transforms, so the compiler
 * knows this strain cannot be built before that plasmid exists. Returns the
 * strain and the selective plate it was recovered on.
 */
workflow build_composite_strain_3(
  composite_plasmid_1: Material<Plasmid>,
) -> (
  strain: Material<Strain>,
  plate: Material<Plate>,
):
  dependencies = [composite_plasmid_1]
  cells <- provision BL21
  strain, culture <- transform composite_strain_3 from dependencies into cells
  culture <- recover culture for 1 h
  culture <- dilute culture
  plate <- plate culture on chloramphenicol
  return strain, plate

/**
 * Build the RFP reporter in BL21.
 *
 * Consumes the \`composite_plasmid_2\` material it transforms, so the compiler
 * knows this strain cannot be built before that plasmid exists. Returns the
 * strain and the selective plate it was recovered on.
 */
workflow build_composite_strain_4(
  composite_plasmid_2: Material<Plasmid>,
) -> (
  strain: Material<Strain>,
  plate: Material<Plate>,
):
  dependencies = [composite_plasmid_2]
  cells <- provision BL21
  strain, culture <- transform composite_strain_4 from dependencies into cells
  culture <- recover culture for 1 h
  culture <- dilute culture
  plate <- plate culture on chloramphenicol
  return strain, plate
`,
}

const reporterPanelFile: PlaygroundFile = {
  path: 'programs/reporter_panel.lab',
  contents: `use std.lab.plasmid
use golden_gate.workflows.assemble
use golden_gate.workflows.build_strains

/**
 * Build the four-strain reporter panel.
 *
 * The runnable entry point. It calls the workflows that make up the panel; the
 * compiler derives the build order from the material each call consumes rather
 * than from the order written here.
 */
workflow main() -> (
  strain_1: Material<Strain>,
  strain_2: Material<Strain>,
  strain_3: Material<Strain>,
  strain_4: Material<Strain>,
):
  composite_plasmid_1 <- assemble_composite_plasmid_1
  composite_plasmid_2 <- assemble_composite_plasmid_2

  // Each plasmid goes into two chassis. Material is affine, so a transformation
  // consumes an aliquot of its own rather than the same value twice.
  for_dh5alpha_1, for_bl21_1 <- split composite_plasmid_1
  for_dh5alpha_2, for_bl21_2 <- split composite_plasmid_2

  strain_1, plate_1 <- build_composite_strain_1 for_dh5alpha_1
  strain_2, plate_2 <- build_composite_strain_2 for_dh5alpha_2
  strain_3, plate_3 <- build_composite_strain_3 for_bl21_1
  strain_4, plate_4 <- build_composite_strain_4 for_bl21_2

  <- dispose plate_1
  <- dispose plate_2
  <- dispose plate_3
  <- dispose plate_4

  return strain_1, strain_2, strain_3, strain_4
`,
}

export const goldenGateProject: PlaygroundProject = {
  id: 'golden-gate',
  note: 'The Golden Gate cloning workflow, broken down into assembly, transformation, and plating.',
  defaultFile: plasmidsFile.path,
  namespace: 'golden_gate',
  files: [
    inventoryFile,
    plasmidsFile,
    strainsFile,
    assembleFile,
    buildStrainsFile,
    reporterPanelFile,
  ],
}

/** A fresh, empty project a visitor can write anything into. */
export function newScratchProject(): PlaygroundProject {
  return {
    id: 'scratch',
    note: 'A blank file \u2014 write anything here.',
    defaultFile: 'programs/scratch.lab',
    files: [
      {
        path: 'programs/scratch.lab',
        contents: '// Write anything here.\n',
      },
    ],
  }
}
