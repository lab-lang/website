/**
 * Every Lab program here compiles with the toolchain in this repository's
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

/*
 * The same package stated through the Python frontend, whose designs are
 * pySBOL3 components and whose circuits are LOICA networks.
 */

export const heroPlasmidExamplePython = `import sbol3

import lab
from lab.units import C, ng, uL
from lab.bio.designs import Backbone, RestrictionEnzyme
from lab.bio.golden_gate import Plasmid

sbol3.set_namespace("https://synbiohub.org/user/marpaia/reporter")

IGEM = "https://synbiohub.org/public/igem"
J23101 = sbol3.SubComponent(f"{IGEM}/BBa_J23101/1")
B0034 = sbol3.SubComponent(f"{IGEM}/BBa_B0034/1")
GFP = sbol3.SubComponent(f"{IGEM}/BBa_E0040/1")
B0015 = sbol3.SubComponent(f"{IGEM}/BBa_B0015/1")

sequence = sbol3.Sequence(
    "reporter_seq", elements="ACGTACGT", encoding=sbol3.IUPAC_DNA_ENCODING
)

design = sbol3.Component(
    "reporter",
    [sbol3.SBO_DNA, sbol3.SO_CIRCULAR],
    roles=[sbol3.SO_ENGINEERED_REGION],
    sequences=[sequence],
    features=[J23101, B0034, GFP, B0015],
    description="The GFP reporter under a strong constitutive promoter.",
)
design.constraints = [
    sbol3.Constraint(sbol3.SBOL_MEETS, J23101, B0034),
    sbol3.Constraint(sbol3.SBOL_MEETS, B0034, GFP),
    sbol3.Constraint(sbol3.SBOL_MEETS, GFP, B0015),
]

# SBOL states the design. Where a material comes from, and the evidence
# it is accepted on, are what lab adds.
pSB1C3 = Backbone.buy(identity=f"{IGEM}/pSB1C3/1")
BsaI = RestrictionEnzyme.buy(identity="NEB-R0535", digest_temperature=37 * C)

reporter = Plasmid.build(
    design,
    backbone=pSB1C3,
    restriction_enzyme=BsaI,
    require=[lambda plasmid: plasmid.sites(BsaI) == 0],
    across=3,
    accept=[
        lambda built: built.sequence == built.design.sequence,
        lambda built: built.concentration >= 100 * ng / uL,
        lab.Claim(lambda built: built.volume >= 20 * uL, across=1),
    ],
)`

export const heroCircuitExamplePython = `import loica
import sbol3

import lab
from lab.bio.parts import B0015, B0034

sbol3.set_namespace("https://synbiohub.org/user/marpaia/reporter")

# Ordinary LOICA: an inducer, a reporter, and the characterized
# operator that connects them.
aTc = loica.Supplement(
    name="aTc",
    sbol_comp=sbol3.Component("aTc", sbol3.SBO_SIMPLE_CHEMICAL),
)
sfGFP = loica.Reporter(
    name="sfGFP",
    signal_id="green",
    sbol_comp=sbol3.Component("sfGFP", sbol3.SBO_DNA, roles=[sbol3.SO_CDS]),
)
pTet = loica.Receiver(
    input=aTc,
    output=sfGFP,
    alpha=[0, 100],
    K=1,
    n=2,
    sbol_comp=sbol3.Component("pTet", sbol3.SBO_DNA, roles=[sbol3.SO_PROMOTER]),
)


@lab.circuit
def regulated_expression() -> lab.Network:
    """A promoter driving a coding sequence through a shared RBS and terminator."""
    network = loica.GeneticNetwork()
    network.add_operator(pTet)
    network.add_reporter(sfGFP)
    return lab.layout(network, rbs=B0034, terminator=B0015)


# aTc is SBO:0000247, a simple chemical, so it is the Trigger; sfGFP is what
# the operator expresses, so it is the Product. Circuit<ATc, SfGFP> is read
# off the network rather than declared a second time. This network has one
# unit, so \`tet_reporter\` is a list of one.
tet_reporter = regulated_expression()`

export const heroWorkflowExamplePython = `"""Assemble the reporter, transform it, and plate what recovers."""

import lab
from lab import Material, Plate
from lab.bio.designs import Antibiotic, Chassis
from lab.bio.golden_gate import Strain
from lab.units import C, h, minutes

from .plasmid import reporter

module = lab.Module("reporter.workflow", doc=__doc__)

DH5alpha = Chassis.buy(
    identity="ATCC-53868",
    heat_shock_temperature=42 * C,
    recovery_duration=60 * minutes,
)
chloramphenicol = Antibiotic.buy(identity="SIGMA-C0378")

reporter_host = Strain.build(
    chassis=DH5alpha,
    plasmids=[reporter],
    selection=chloramphenicol,
    doc="The reporter carried in a cloning strain.",
)


@lab.workflow
def build_reporter(wf) -> tuple[Material[Strain], Material[Plate]]:
    """Assemble the reporter, transform it, and plate what recovers."""
    product = wf.perform(lab.realize(reporter))
    cells = wf.perform(lab.provision(DH5alpha))
    strain, culture = wf.perform(
        lab.transform(reporter_host, dna=[product], into=cells)
    )
    culture = wf.perform(lab.recover(culture, duration=1 * h))
    culture = wf.perform(lab.dilute(culture))
    plate = wf.perform(lab.plate(culture, selection=chloramphenicol))
    return strain, plate`

export const heroObserveExamplePython = `"""Watch a plate until it has something worth picking from."""

import lab
from lab import (
    ColonyMap,
    Duration,
    Evidential,
    Image,
    Material,
    Plate,
    detect_colonies,
)
from lab.units import h, minutes

module = lab.Module("reporter.observe", doc=__doc__)


@lab.record
class PlateObservation(Evidential):
    """One image, what was counted in it, and how long the plate had grown."""

    image: Image
    colonies: ColonyMap
    elapsed: Duration


@lab.record
class ColonyGrowth:
    """What watching a plate produced."""

    plate: Material[Plate]
    observations: list[PlateObservation]

    @lab.case
    class Ready:
        colonies: ColonyMap

    @lab.case
    class TimedOut:
        pass


@lab.workflow
def grow_colonies(wf, plate: Material[Plate]) -> ColonyGrowth:
    """Image every half hour, and stop at the first plate worth picking from."""
    observations = wf.state(list[PlateObservation], [])

    # Assignment binds a computation and replays freely. A durable effect
    # goes through wf.perform, and nothing else does.
    @wf.every(30 * minutes)
    def observe():
        image = wf.perform(lab.capture_image(plate))
        colonies = detect_colonies(image)
        observations.append(
            PlateObservation(image=image, colonies=colonies, elapsed=wf.elapsed)
        )

        if colonies.isolated.count >= 8:
            return ColonyGrowth.Ready(
                plate=plate,
                colonies=colonies,
                observations=observations,
            )

    @wf.after(18 * h)
    def give_up():
        return ColonyGrowth.TimedOut(
            plate=plate,
            observations=observations,
        )`

export const heroMainExamplePython = `"""Build the reporter strain, and watch its plate until it has something to say."""

import lab
from lab import ColonyMap, Event, Material, Strain

from .observe import ColonyGrowth, PlateObservation, grow_colonies
from .workflow import build_reporter

module = lab.Module("reporter.main", doc=__doc__)


@lab.record
class ColoniesReady(Event):
    """A plate reached the point where there was something worth picking."""

    colonies: ColonyMap


@lab.record
class PlateAbandoned(Event):
    """A plate was given up on: nothing more was going to grow."""

    observations: list[PlateObservation]


@lab.workflow
def main(wf) -> Material[Strain]:
    """The entry point a project actually builds.

    The compiler derives the build order from the material each call
    consumes rather than from the order written here.
    """
    strain, plate = wf.perform(build_reporter())
    growth = wf.perform(grow_colonies(plate))

    match growth:
        case ColonyGrowth.Ready():
            wf.emit(ColoniesReady(colonies=growth.colonies))
            wf.perform(lab.dispose(growth.plate))

        case ColonyGrowth.TimedOut():
            wf.emit(PlateAbandoned(observations=growth.observations))
            wf.perform(lab.dispose(growth.plate))

    return strain`

/** The phone-width excerpt of the Python reactive handler. */
export const reactiveExampleMobilePython = `@lab.workflow
def grow_colonies(wf, plate: Material[Plate]) -> ColonyGrowth:
    observations = wf.state(list[PlateObservation], [])

    @wf.every(30 * minutes)
    def observe():
        image = wf.perform(lab.capture_image(plate))
        colonies = detect_colonies(image)
        observations.append(PlateObservation(...))

        if colonies.isolated.count >= 8:
            return ColonyGrowth.Ready(plate=plate, colonies=colonies, ...)

    @wf.after(18 * h)
    def give_up():
        return ColonyGrowth.TimedOut(plate=plate, observations=observations)`

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
