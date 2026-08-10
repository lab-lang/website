/**
 * Every program here compiles with the Lab toolchain in this repository's
 * sibling `lab` checkout. Together they form one package: a reporter plasmid,
 * the circuit it carries, the workflow that builds it, the handler that
 * watches its plate, and the entry point that ties them together. Sequences
 * are synthetic compiler fixtures.
 */

export const heroCircuitExample = `use std.bio.designs
use std.bio.parts

/** A promoter driving a coding sequence through a shared RBS and terminator. */
circuit regulated_expression(
  promoter: Promoter<Trigger: Signal>,
  coding: CDS<Product: Protein>,
) -> Circuit<Trigger, Product>:
  layout:
    promoter
    B0034
    coding
    B0015

tet_reporter = regulated_expression(pTet, sfGFP)`

export const heroPlasmidExample = `use std.bio.designs
use std.bio.golden_gate

buy:
  part J23101
  part B0034
  part GFP
  part B0015
  backbone pSB1C3
  restriction_enzyme BsaI:
    digest_temperature = 37 C

/** The GFP reporter under a strong constitutive promoter. */
build plasmid reporter:
  sequence = dna("ACGTACGT")
  backbone = pSB1C3
  components = [J23101, B0034, GFP, B0015]
  restriction_enzyme = BsaI

  require topology == circular
  require sites(BsaI) == 0

  across 3 biological replicates

  accept sequence == design.sequence
  accept concentration >= 100 ng/uL
  accept volume >= 20 uL across 1 biological replicate`

export const heroWorkflowExample = `use std.bio.designs
use std.bio.build
use std.lab.plasmid

use reporter.plasmid

buy:
  chassis DH5alpha:
    heat_shock_temperature = 42 C
    recovery_duration = 60 min
  antibiotic chloramphenicol

/** The reporter carried in a cloning strain. */
build strain reporter_host:
  chassis = DH5alpha
  plasmids = [reporter]
  selection = chloramphenicol

/** Assemble the reporter, transform it, and plate what recovers. */
workflow build_reporter() -> (
  strain: Material<Strain>,
  plate: Material<Plate>,
):
  product <- realize reporter
  dependencies = [product]
  cells <- provision DH5alpha
  strain, culture <- transform reporter_host from dependencies into cells
  culture <- recover culture for 1 h
  culture <- dilute culture
  plate <- plate culture on chloramphenicol
  return strain, plate`

export const heroObserveExample = `use std.lab.plasmid

/** One image, what was counted in it, and how long the plate had been growing. */
record PlateObservation is Evidential:
  image: Image
  colonies: ColonyMap
  elapsed: Duration

/** What watching a plate produced. */
record ColonyGrowth:
  plate: Material<Plate>
  observations: List<PlateObservation>

  case Ready:
    colonies: ColonyMap

  case TimedOut

/** Image every half hour, and stop at the first plate worth picking from. */
workflow grow_colonies(plate: Material<Plate>) -> ColonyGrowth:

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
    }`

export const heroMainExample = `use std.lab.plasmid
use reporter.workflow
use reporter.observe

/** A plate reached the point where there was something worth picking. */
record ColoniesReady is Event:
  colonies: ColonyMap

/** A plate was given up on: nothing more was going to grow. */
record PlateAbandoned is Event:
  observations: List<PlateObservation>

/**
 * Build the reporter strain, and watch its plate until it has something to say.
 *
 * The compiler derives the build order from the material each call consumes
 * rather than from the order written here.
 */
workflow main() -> Material<Strain>:
  strain, plate <- build_reporter
  growth <- grow_colonies plate

  match growth:
    case Ready:
      emit ColoniesReady{colonies: growth.colonies}
      <- dispose growth.plate

    case TimedOut:
      emit PlateAbandoned{observations: growth.observations}
      <- dispose growth.plate

  return strain`

/** The design on its own, as `labc` compiles a single file. */
export const reporterExample = heroPlasmidExample

/** The durable build workflow, shown apart from the package it belongs to. */
export const workflowExample = heroWorkflowExample

/** The reactive handler, shown apart from the package it belongs to. */
export const reactiveExample = heroObserveExample

/**
 * The phone-width excerpt of `reactiveExample`: both `when` clauses whole —
 * they are the section's whole argument — with the record payloads elided so
 * the pair fits one screen with no inner scroll.
 */
export const reactiveExampleMobile = `workflow grow_colonies(plate: Material<Plate>) -> ColonyGrowth:

  state observations: List<PlateObservation> = []

  when every 30 min:
    image <- capture image of plate
    colonies = detect_colonies(image)
    observations = observations + [PlateObservation{…}]

    if colonies.isolated.count >= 8:
      return Ready{plate: plate, colonies: colonies, …}

  when after 18 h:
    return TimedOut{plate: plate, observations: observations}`

/** The generic circuit, shown apart from the package it belongs to. */
export const circuitExample = heroCircuitExample

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
    note: 'Handlers wake on a schedule and settle into a tagged result.',
    source: reactiveExample,
  },
  {
    id: 'circuit',
    label: 'Generic circuit',
    note: 'Circuits compose typed parts into reusable intent.',
    source: circuitExample,
  },
] as const
