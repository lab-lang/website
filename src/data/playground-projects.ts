/**
 * Every file in every project here is verified against the real engine
 * (via `lab-ide`'s multi-document resolution) and reports zero diagnostics
 * for the exact text below. Files are organized like a real Lab project
 * (`designs/`, `workflows/`, `programs/`, per docs/language/modules.md), and
 * a `use` of another project-local file resolves against that file's
 * synthesized module name (its path, dotted — `designs/plasmid.lab` is
 * `designs.plasmid`), since the playground has no `lab.toml` to namespace
 * modules under.
 */

export interface PlaygroundFile {
  path: string
  contents: string
}

export interface PlaygroundProject {
  id: string
  label: string
  note: string
  defaultFile: string
  files: PlaygroundFile[]
}

const circuitFile: PlaygroundFile = {
  path: 'designs/circuit.lab',
  contents: `# The same circuit that types itself in on the homepage. Generic circuits
# compose typed parts into reusable intent, independent of any one plasmid.
use std.bio.parts

circuit regulated_expression<I: Signal, O: Protein>:
  input promoter: Promoter<I>
  input coding: CDS<O>
  output Circuit<I, O>

  layout:
    promoter
    B0034
    coding
    B0015

tet_reporter = regulated_expression(pTet, sfGFP)
`,
}

const circuitPlasmidFile: PlaygroundFile = {
  path: 'designs/plasmid.lab',
  contents: `# A plasmid carries a circuit as cargo. This file declares its own copy of
# the circuit. Cross-file imports of project-local modules don't resolve
# yet, so today each file states everything it needs.
use std.bio.parts
use std.bio.backbones

circuit regulated_expression<I: Signal, O: Protein>:
  input promoter: Promoter<I>
  input coding: CDS<O>
  output Circuit<I, O>

  layout:
    promoter
    B0034
    coding
    B0015

tet_reporter = regulated_expression(pTet, sfGFP)

plasmid p_tet_reporter:
  backbone: p15A_kan
  cargo: tet_reporter

  require topology == circular
  require sites(BsaI) == 0
  require length <= 12 kb

  accept sequence == design.sequence
  accept concentration >= 100 ng/uL
`,
}

const heroBuildFile: PlaygroundFile = {
  path: 'workflows/build.lab',
  contents: `# The organism this build produces is itself an artifact, so the workflow
# names the strain it realizes rather than taking any design at all.
use std.bio.inventory
use std.lab.plasmid_actions
use designs.plasmid

DH5alpha = chassis("DH5alpha")
kanamycin = antibiotic("kanamycin")

strain tet_reporter_host:
  chassis: DH5alpha
  plasmids: [p_tet_reporter]
  selection: kanamycin

workflow build() -> Accepted<Plasmid> | Rejected<Plasmid>:
  design = p_tet_reporter
  fragments <- synthesize design
  construct <- assemble fragments
  plasmids = [construct]
  cells <- provision DH5alpha
  strain, culture <- transform tet_reporter_host from plasmids into cells
  culture <- recover culture for 1 h
  culture <- dilute culture
  plate <- plate culture on kanamycin
  <- dispose strain

  candidates <- pick 4 isolated colonies from plate
  <- dispose plate
  screening <- screen candidates against design

  clone <- grow screening.clones.highest_confidence at 37 C for 16 h
  purified <- purify clone
  quantity <- quantify purified

  if design.accepts([quantity]):
    purified <- store purified at -20 C
    return Accepted{material: purified, evidence: [quantity]}

  return Rejected{
    material: purified,
    reason: acceptance_failed,
    evidence: [quantity],
  }
`,
}

const heroMainFile: PlaygroundFile = {
  path: 'programs/main.lab',
  contents: `# The entry point: it imports the plasmid and the workflow rather than
# redefining them. A module name here is derived from its file's own path
# (no lab.toml exists in this playground to namespace it under yet).
use designs.plasmid
use workflows.build

workflow main() -> Accepted<Plasmid> | Rejected<Plasmid>:
  result <- build
  return result
`,
}

const inventoryPartsFile: PlaygroundFile = {
  path: 'designs/parts.lab',
  contents: `# Typed inventory identities, kept separate from the design that uses them.
use std.bio.inventory

pSB1C3 = backbone("pSB1C3")
`,
}

const reporterFile: PlaygroundFile = {
  path: 'designs/reporter.lab',
  contents: `# A design states what must exist and how it will be judged.
use std.bio.parts
use designs.parts

plasmid reporter:
  sequence: dna("ACGTACGT")
  backbone: pSB1C3
  components: [pTet, B0034, sfGFP, B0015]
  restriction_enzyme: BsaI

  require topology == circular
  require sites(BsaI) == 0

  accept sequence == design.sequence
  accept concentration >= 100 ng/uL
  accept volume >= 20 uL
`,
}

const reportersFile: PlaygroundFile = {
  path: 'designs/reporters.lab',
  contents: `# Two independent designs. Renaming p_gfp here updates every reference in
# this project, including the workflow file next to it.
use std.bio.inventory

pSB1C3 = backbone("pSB1C3")
BsaI = restriction_enzyme("BsaI")

plasmid p_gfp:
  sequence: dna("GCTAGCGGATCCATGACCATGATTACGCCAAGCTTGAATTC")
  backbone: pSB1C3
  restriction_enzyme: BsaI
  require topology == circular
  accept sequence == design.sequence

plasmid p_rfp:
  sequence: dna("GATCCTCTAGAGTCGACCTGCAGGCATGCAAGCTTGGCACT")
  backbone: pSB1C3
  restriction_enzyme: BsaI
  require topology == circular
  accept sequence == design.sequence
`,
}

const realizePlasmidFile: PlaygroundFile = {
  path: 'workflows/realize_plasmid.lab',
  contents: `# Assembly produces a plasmid; transformation produces a strain. Each is a
# separate artifact, so each gets its own workflow, and the compiler derives
# build order from the material each one consumes.
use std.bio.build
use std.bio.inventory
use std.lab.plasmid_actions
use designs.reporters

DH5alpha = chassis("DH5alpha")
chloramphenicol = antibiotic("chloramphenicol")

strain gfp_host:
  chassis: DH5alpha
  plasmids: [p_gfp]
  selection: chloramphenicol

strain rfp_host:
  chassis: DH5alpha
  plasmids: [p_rfp]
  selection: chloramphenicol

workflow assemble_p_gfp() -> Material<Plasmid>:
  product <- realize p_gfp
  return product

workflow assemble_p_rfp() -> Material<Plasmid>:
  product <- realize p_rfp
  return product

workflow build_gfp_host(
  p_gfp: Material<Plasmid>,
) -> (
  strain: Material<Strain>,
  plate: Material<Plate>,
):
  dependencies = [p_gfp]
  cells <- provision DH5alpha
  strain, culture <- transform gfp_host from dependencies into cells
  culture <- recover culture for 1 h
  culture <- dilute culture
  plate <- plate culture on chloramphenicol
  return strain, plate

workflow build_rfp_host(
  p_rfp: Material<Plasmid>,
) -> (
  strain: Material<Strain>,
  plate: Material<Plate>,
):
  dependencies = [p_rfp]
  cells <- provision DH5alpha
  strain, culture <- transform rfp_host from dependencies into cells
  culture <- recover culture for 1 h
  culture <- dilute culture
  plate <- plate culture on chloramphenicol
  return strain, plate
`,
}

const buildInventoryFile: PlaygroundFile = {
  path: 'designs/inventory.lab',
  contents: `# Typed inventory identities, kept separate from the workflow that uses
# them (the chassis and selection this build needs, and nothing else).
use std.bio.inventory

competent_ecoli = chassis("competent_ecoli")
kanamycin = antibiotic("kanamycin")
p15A_kan = backbone("p15A_kan")
BsaI = restriction_enzyme("BsaI")
GFP = part("GFP")
`,
}

const buildPlasmidFile: PlaygroundFile = {
  path: 'programs/build_plasmid.lab',
  contents: `use std.lab.plasmid_actions
use designs.inventory

observation PlateObservation:
  image: Image
  colonies: ColonyMap
  elapsed: Duration

outcome ColonyGrowth:
  plate: Material<Plate>
  observations: List<PlateObservation>

  case Ready:
    colonies: ColonyMap

  case TimedOut

outcome SequenceCheck:
  material: Material<Plasmid>
  evidence: List<Evidence>

  case Exact
  case Mismatch
  case Inconclusive

workflow await_colonies(plate: Material<Plate>) -> ColonyGrowth:

  state observations: List<PlateObservation> = []

  when every 30 min:
    image <- capture image of plate
    colonies = detect_colonies(image)
    observation = PlateObservation{
      image: image,
      colonies: colonies,
      elapsed: workflow.elapsed,
    }
    observations = observations + [observation]

    if colonies.isolated.count >= 8:
      return Ready{
        plate: plate,
        colonies: colonies,
        observations: observations,
      }

  when after 18 h:
    return TimedOut{
      plate: plate,
      observations: observations,
    }

plasmid p_reporter:
  sequence: dna("ACGTACGT")
  backbone: p15A_kan
  components: [GFP]
  restriction_enzyme: BsaI

  require topology == circular
  accept sequence == design.sequence

strain reporter_host:
  chassis: competent_ecoli
  plasmids: [p_reporter]
  selection: kanamycin

workflow build_plasmid() -> Accepted<Plasmid> | Rejected<Plasmid>:

  design = p_reporter
  fragments <- synthesize design
  construct <- assemble fragments
  plasmids = [construct]
  cells <- provision competent_ecoli
  strain, culture <- transform reporter_host from plasmids into cells
  culture <- recover culture for 1 h
  culture <- dilute culture
  plate <- plate culture on kanamycin
  <- dispose strain

  colony_result <- await_colonies plate

  match colony_result:
    case TimedOut:
      <- dispose colony_result.plate
      return Rejected{
        material: None,
        reason: no_colonies,
        evidence: colony_result.observations,
      }

    case Ready:
      candidates <- pick 4 isolated colonies from colony_result.plate
      <- dispose colony_result.plate
      screening <- screen candidates against design

  clone = screening.clones.highest_confidence
  culture <- grow clone at 37 C for 16 h
  plasmid <- purify culture
  retained, aliquot <- split plasmid
  sequence_result <- sequence aliquot

  match sequence_result:
    case Mismatch:
      <- dispose sequence_result.material
      return Rejected{
        material: retained,
        reason: sequence_mismatch,
        evidence: sequence_result.evidence,
      }

    case Inconclusive:
      <- dispose sequence_result.material
      return Rejected{
        material: retained,
        reason: inconclusive_sequence,
        evidence: sequence_result.evidence,
      }

    case Exact:
      <- dispose sequence_result.material
      quantity <- quantify retained

  evidence = sequence_result.evidence + [quantity]

  if design.accepts(evidence):
    retained <- store retained at -20 C
    return Accepted{
      material: retained,
      evidence: evidence,
    }

  return Rejected{
    material: retained,
    reason: acceptance_failed,
    evidence: evidence,
  }
`,
}

export const playgroundProjects: PlaygroundProject[] = [
  {
    id: 'regulated-reporter',
    label: 'Regulated reporter',
    note: 'The homepage circuit, as a real project: an entry point that imports the plasmid and workflow next to it.',
    defaultFile: circuitFile.path,
    files: [circuitFile, circuitPlasmidFile, heroBuildFile, heroMainFile],
  },
  {
    id: 'reporter',
    label: 'Plasmid acceptance',
    note: 'A design states what must exist and how it will be judged.',
    defaultFile: reporterFile.path,
    files: [reporterFile, inventoryPartsFile],
  },
  {
    id: 'reporter-library',
    label: 'Reporter library',
    note: 'Two plasmids, each assembled and then transformed into its own strain. Try renaming p_gfp.',
    defaultFile: reportersFile.path,
    files: [reportersFile, realizePlasmidFile],
  },
  {
    id: 'reactive-build',
    label: 'Reactive build',
    note: 'A durable workflow that polls on a timer and settles into an outcome, with its inventory kept in a file of its own.',
    defaultFile: buildPlasmidFile.path,
    files: [buildPlasmidFile, buildInventoryFile],
  },
]
