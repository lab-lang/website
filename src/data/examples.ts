/**
 * Every program here compiles with the Lab toolchain in this repository's
 * sibling `lab` checkout. Sequences are synthetic compiler fixtures.
 */

export const reporterExample = `use std.bio.parts
use std.bio.inventory

pSB1C3 = backbone("pSB1C3")

plasmid reporter:
  sequence: dna("ACGTACGT")
  backbone: pSB1C3
  components: [pTet, B0034, sfGFP, B0015]
  restriction_enzyme: BsaI

  require topology == circular
  require sites(BsaI) == 0

  accept sequence == design.sequence
  accept concentration >= 100 ng/uL
  accept volume >= 20 uL`

export const heroCircuitExample = `use std.bio.parts

circuit regulated_expression<I: Signal, O: Protein>:
  input promoter: Promoter<I>
  input coding: CDS<O>
  output Circuit<I, O>

  layout:
    promoter
    B0034
    coding
    B0015

tet_reporter = regulated_expression(pTet, sfGFP)`

export const heroPlasmidExample = `use std.bio.parts
use std.bio.inventory
use lab.designs.circuit

pSB1C3 = backbone("pSB1C3")

plasmid reporter:
  backbone: pSB1C3
  cargo: tet_reporter
  restriction_enzyme: BsaI

  require topology == circular
  require sites(BsaI) == 0

  accept sequence == design.sequence
  accept concentration >= 100 ng/uL
  accept volume >= 20 uL`

export const heroWorkflowExample = `use std.bio.inventory
use std.lab.plasmid_actions

DH5alpha = chassis("DH5alpha")
kanamycin = antibiotic("kanamycin")

strain reporter_host:
  chassis: DH5alpha
  plasmids: [reporter]
  selection: kanamycin

workflow build() -> Accepted<Plasmid> | Rejected<Plasmid>:
  design = reporter
  fragments <- synthesize design
  construct <- assemble fragments
  plasmids = [construct]
  cells <- provision DH5alpha
  strain, culture <- transform reporter_host from plasmids into cells
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
  }`

export const heroMainExample = `use lab.designs.plasmid
use lab.workflows.workflow

workflow main() -> Accepted<Plasmid> | Rejected<Plasmid>:
  result <- build

  match result:
    case Accepted:
      emit built{
        material: result.material,
        evidence: result.evidence,
      }
      return result

    case Rejected:
      emit rejected{
        reason: result.reason,
        evidence: result.evidence,
      }
      return result`

export const workflowExample = `use std.bio.inventory
use std.lab.plasmid_actions

workflow build_plasmid() -> Accepted<Plasmid> | Rejected<Plasmid>:
  design = reporter
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
      screening <- screen candidates against design`

export const reactiveExample = `observation PlateObservation:
  image: Image
  colonies: ColonyMap
  elapsed: Duration

workflow await_colonies(plate: Material<Plate>) -> ColonyGrowth:

  state observations: List<PlateObservation> = []

  when every 30 min:
    image <- capture image of plate
    colonies = detect_colonies(image)
    observations = observations + [PlateObservation{
      image: image,
      colonies: colonies,
      elapsed: workflow.elapsed,
    }]

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
    }`

/**
 * The phone-width excerpt of `reactiveExample`: both `when` clauses whole —
 * they are the section's whole argument — with the record payloads elided so
 * the pair fits one screen with no inner scroll.
 */
export const reactiveExampleMobile = `workflow await_colonies(plate: Material<Plate>) -> ColonyGrowth:

  state observations: List<PlateObservation> = []

  when every 30 min:
    image <- capture image of plate
    colonies = detect_colonies(image)
    observations = observations + [PlateObservation{…}]

    if colonies.isolated.count >= 8:
      return Ready{plate: plate, colonies: colonies, …}

  when after 18 h:
    return TimedOut{plate: plate, observations: observations}`

export const circuitExample = `use std.bio.parts
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
  accept concentration >= 100 ng/uL`

export const examples = [
  {
    id: 'reporter',
    label: 'Plasmid acceptance',
    note: 'A design states what must exist and how it will be judged.',
    source: reporterExample,
  },
  {
    id: 'workflow',
    label: 'Durable workflow',
    note: 'Physical steps use <- and cannot be replayed.',
    source: workflowExample,
  },
  {
    id: 'reactive',
    label: 'Reactive timers',
    note: 'Handlers wake on a schedule and settle into an outcome.',
    source: reactiveExample,
  },
  {
    id: 'circuit',
    label: 'Generic circuit',
    note: 'Circuits compose typed parts into reusable intent.',
    source: circuitExample,
  },
] as const
