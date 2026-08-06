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
export function moduleIdFor(project: PlaygroundProject, path: string): string | undefined {
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
  contents: `use std.bio.inventory

# External inventory identities, kept apart from the designs that use them.
#
# A typed symbol here says only that a name refers to a catalogued item. It is
# not a claim that a suitable lot is on the shelf; that remains an inventory
# resolution and a runtime evidence question.

# Constitutive promoters of differing strength.
J23101 = part("J23101")
J23106 = part("J23106")

# Ribosome binding site and terminator shared by both transcription units.
B0034 = part("B0034")
B0015 = part("B0015")

# Fluorescent reporters.
GFP = part("GFP")
RFP = part("RFP")

# Assembly backbone and the type IIS enzyme that opens it.
pSB1C3 = backbone("pSB1C3")
BsaI = restriction_enzyme("BsaI")

# Host organisms. DH5alpha is a cloning strain; BL21 is an expression strain.
DH5alpha = chassis("DH5alpha")
BL21 = chassis("BL21")

chloramphenicol = antibiotic("chloramphenicol")
`,
}

const plasmidsFile: PlaygroundFile = {
  path: 'designs/plasmids.lab',
  contents: `use golden_gate.designs.inventory

# Two composite transcription units, each a promoter driving a fluorescent
# reporter through a shared RBS and terminator. Both are built by Golden Gate
# assembly into the same backbone with the same type IIS enzyme.
#
# Sequences are synthetic compiler fixtures, not qualified biological designs.
# The reaction chemistry below is scientific intent and travels with the
# design; where the reaction physically happens is a target profile's concern.

plasmid composite_plasmid_1:
  sequence: dna("GCTAGCGGATCCATGACCATGATTACGCCAAGCTTGAATTC")
  backbone: pSB1C3
  components: [J23101, B0034, GFP, B0015]
  restriction_enzyme: BsaI
  assembly_replicates: 1

  reaction_volume: 20 uL
  part_volume: 2 uL
  enzyme_volume: 2 uL
  ligase_volume: 4 uL
  buffer_volume: 2 uL
  assembly_cycles: 75
  digest_temperature: 37 C
  digest_duration: 2 min
  ligate_temperature: 16 C
  ligate_duration: 5 min

  require topology == circular
  accept sequence == design.sequence

plasmid composite_plasmid_2:
  sequence: dna("GCTAGCGGATCCATGGCCTCCTCCGAGGACGTCATCAAGGAATTC")
  backbone: pSB1C3
  components: [J23106, B0034, RFP, B0015]
  restriction_enzyme: BsaI
  assembly_replicates: 1

  reaction_volume: 20 uL
  part_volume: 2 uL
  enzyme_volume: 2 uL
  ligase_volume: 4 uL
  buffer_volume: 2 uL
  assembly_cycles: 75
  digest_temperature: 37 C
  digest_duration: 2 min
  ligate_temperature: 16 C
  ligate_duration: 5 min

  require topology == circular
  accept sequence == design.sequence
`,
}

const strainsFile: PlaygroundFile = {
  path: 'designs/strains.lab',
  contents: `use golden_gate.designs.inventory
use golden_gate.designs.plasmids

# Four engineered organisms: each composite plasmid in each of two chassis.
#
# The same plasmid appearing in two strains is the point. A strain is its own
# artifact, so DH5alpha carrying composite_plasmid_1 and BL21 carrying the same
# plasmid are two distinct things to build, accept, and store. Neither is a
# property of the plasmid.
#
# The heat-shock and plating parameters below are shared, because one robot run
# holds every strain in a single thermocycler block.

strain composite_strain_1:
  chassis: DH5alpha
  plasmids: [composite_plasmid_1]
  selection: chloramphenicol
  transformation_replicates: 2
  plating_replicates: 1
  serial_dilutions: 2

  cell_volume: 20 uL
  dna_volume: 2 uL
  recovery_volume: 60 uL
  cold_incubation: 30 min
  heat_shock_temperature: 42 C
  heat_shock_duration: 1 min
  recovery_temperature: 37 C
  recovery_duration: 60 min
  medium_volume: 18 uL
  culture_volume: 2 uL
  colony_volume: 4 uL

strain composite_strain_2:
  chassis: DH5alpha
  plasmids: [composite_plasmid_2]
  selection: chloramphenicol
  transformation_replicates: 2
  plating_replicates: 1
  serial_dilutions: 2

  cell_volume: 20 uL
  dna_volume: 2 uL
  recovery_volume: 60 uL
  cold_incubation: 30 min
  heat_shock_temperature: 42 C
  heat_shock_duration: 1 min
  recovery_temperature: 37 C
  recovery_duration: 60 min
  medium_volume: 18 uL
  culture_volume: 2 uL
  colony_volume: 4 uL

strain composite_strain_3:
  chassis: BL21
  plasmids: [composite_plasmid_1]
  selection: chloramphenicol
  transformation_replicates: 2
  plating_replicates: 1
  serial_dilutions: 2

  cell_volume: 20 uL
  dna_volume: 2 uL
  recovery_volume: 60 uL
  cold_incubation: 30 min
  heat_shock_temperature: 42 C
  heat_shock_duration: 1 min
  recovery_temperature: 37 C
  recovery_duration: 60 min
  medium_volume: 18 uL
  culture_volume: 2 uL
  colony_volume: 4 uL

strain composite_strain_4:
  chassis: BL21
  plasmids: [composite_plasmid_2]
  selection: chloramphenicol
  transformation_replicates: 2
  plating_replicates: 1
  serial_dilutions: 2

  cell_volume: 20 uL
  dna_volume: 2 uL
  recovery_volume: 60 uL
  cold_incubation: 30 min
  heat_shock_temperature: 42 C
  heat_shock_duration: 1 min
  recovery_temperature: 37 C
  recovery_duration: 60 min
  medium_volume: 18 uL
  culture_volume: 2 uL
  colony_volume: 4 uL
`,
}

const assembleFile: PlaygroundFile = {
  path: 'workflows/assemble.lab',
  contents: `use std.bio.build
use golden_gate.designs.plasmids

# Stage 1 of the Golden Gate workflow: parts and backbone are cut and ligated
# into a circular product.
#
# Each workflow takes the artifacts its assembly consumes as typed material
# inputs and returns the plasmid it produces. Neither declares a build order;
# the compiler derives one from this dataflow.

workflow assemble_composite_plasmid_1() -> Material<Plasmid>:
  product <- realize composite_plasmid_1
  return product

workflow assemble_composite_plasmid_2() -> Material<Plasmid>:
  product <- realize composite_plasmid_2
  return product
`,
}

const buildStrainsFile: PlaygroundFile = {
  path: 'workflows/build_strains.lab',
  contents: `use std.lab.plasmid_actions
use golden_gate.designs.inventory
use golden_gate.designs.strains

# Stages 2 and 3: assembled plasmids are introduced into competent cells by
# heat shock, the recovered culture is serially diluted, and each dilution is
# spotted onto selective agar.
#
# Each workflow consumes the plasmid material it transforms, so the compiler
# knows a strain cannot be built before its plasmid exists. Two strains
# consuming the same plasmid are two independent builds of two artifacts, not
# one build with a shared step.

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
  contents: `use std.lab.plasmid_actions
use golden_gate.workflows.assemble
use golden_gate.workflows.build_strains

# The runnable entry point. It calls the workflows that make up the panel; the
# compiler derives the build order from the material each call consumes rather
# than from the order written here.

workflow main() -> (
  strain_1: Material<Strain>,
  strain_2: Material<Strain>,
  strain_3: Material<Strain>,
  strain_4: Material<Strain>,
):
  composite_plasmid_1 <- assemble_composite_plasmid_1
  composite_plasmid_2 <- assemble_composite_plasmid_2

  # Each plasmid goes into two chassis. Material is affine, so a transformation
  # consumes an aliquot of its own rather than the same value twice.
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
    note: 'A blank file — write anything here.',
    defaultFile: 'programs/scratch.lab',
    files: [
      {
        path: 'programs/scratch.lab',
        contents: '# Write anything here.\n',
      },
    ],
  }
}
