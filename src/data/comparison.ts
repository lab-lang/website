import type { SourceLanguage } from '@/components/source-code'

/** The build every file below expresses, as Lab expresses it. */
export const labSource = `use std.bio.build
use std.bio.designs
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
  assembly_replicates = 1

  require topology == circular
  accept sequence == design.sequence

workflow build_reporter() -> Material<Plasmid>:
  product <- realize reporter
  return product`

/** The same build, through the Python frontend, whose designs are pySBOL3. */
export const labSourcePython = `import sbol3

import lab
from lab import Material
from lab.bio.designs import Backbone, RestrictionEnzyme
from lab.bio.golden_gate import Plasmid
from lab.units import C

sbol3.set_namespace("https://synbiohub.org/user/marpaia/reporter")

IGEM = "https://synbiohub.org/public/igem"
J23101 = sbol3.SubComponent(f"{IGEM}/BBa_J23101/1")
B0034 = sbol3.SubComponent(f"{IGEM}/BBa_B0034/1")
GFP = sbol3.SubComponent(f"{IGEM}/BBa_E0040/1")
B0015 = sbol3.SubComponent(f"{IGEM}/BBa_B0015/1")

design = sbol3.Component(
    "reporter",
    [sbol3.SBO_DNA, sbol3.SO_CIRCULAR],
    roles=[sbol3.SO_ENGINEERED_REGION],
    sequences=[
        sbol3.Sequence(
            "reporter_seq",
            elements="ACGTACGT",
            encoding=sbol3.IUPAC_DNA_ENCODING,
        )
    ],
    features=[J23101, B0034, GFP, B0015],
    description="The GFP reporter under a strong constitutive promoter.",
)

pSB1C3 = Backbone.buy(identity=f"{IGEM}/pSB1C3/1")
BsaI = RestrictionEnzyme.buy(identity="NEB-R0535", digest_temperature=37 * C)

reporter = Plasmid.build(
    design,
    backbone=pSB1C3,
    restriction_enzyme=BsaI,
    assembly_replicates=1,
    accept=[lambda built: built.sequence == built.design.sequence],
)


@lab.workflow
def build_reporter(wf) -> Material[Plasmid]:
    return wf.perform(lab.realize(reporter))`

/*
 * The same build, as each system asks you to express it. These are written by
 * hand from each project's own documented usage, kept to the work the Lab
 * module covers, and not padded: where one is short, it is short because the
 * system is doing more, or because the part Lab expresses has nowhere to go.
 */

const buildCompiler = `"""Build the reporter with BuildCompiler.

Everything the design is lives in an SBOL document, so the parts, their
roles, the backbone, and the assembly are all built here first.
"""

from pathlib import Path

import sbol2

from buildcompiler.buildcompiler import BuildCompiler

sbol2.setHomespace("https://example.org/reporter")
doc = sbol2.Document()

PARTS = [
    ("pTet", sbol2.SO_PROMOTER, "tccctatcagtgatagagattgacatccctatcagtga"),
    ("B0034", sbol2.SO_RBS, "aaagaggagaaa"),
    ("sfGFP", sbol2.SO_CDS, "atgcgtaaaggcgaagagctgttcactggtgtcgtccct"),
    ("B0015", sbol2.SO_TERMINATOR, "ccaggcatcaaataaaacgaaaggctcagtcgaaagact"),
]

components = []
for display_id, role, elements in PARTS:
    part = sbol2.ComponentDefinition(display_id, sbol2.BIOPAX_DNA)
    part.roles = [role]
    part.sequence = sbol2.Sequence(
        f"{display_id}_seq", elements, sbol2.SBOL_ENCODING_IUPAC
    )
    doc.addComponentDefinition(part)
    components.append(part)

backbone = sbol2.ComponentDefinition("pSB1C3", sbol2.BIOPAX_DNA)
backbone.roles = [sbol2.SO_PLASMID]
backbone.sequence = sbol2.Sequence(
    "pSB1C3_seq", "tactagtagcggccgctgcag", sbol2.SBOL_ENCODING_IUPAC
)
doc.addComponentDefinition(backbone)

reporter = sbol2.ComponentDefinition("reporter", sbol2.BIOPAX_DNA)
reporter.types = [sbol2.BIOPAX_DNA, sbol2.SO_CIRCULAR]
reporter.roles = [sbol2.SO_PLASMID]
doc.addComponentDefinition(reporter)
reporter.assemblePrimaryStructure([backbone] + components)
reporter.compile()

# The enzyme is not a property of the design here: which restriction enzyme
# cuts is decided by the assembly stage the compiler routes this through.
compiler = BuildCompiler(
    collections=["https://synbiohub.org/public/reporter_parts"],
    sbh_registry="https://synbiohub.org",
    auth_token=TOKEN,
    sbol_doc=doc,
)

result = compiler.full_build(
    designs=[reporter],
    results_dir=Path("results/full_build"),
    chassis_name="E_coli_DH5alpha",
    protocol_type="automated",
    plating_params={"replicates": 1, "number_dilutions": 1},
    product_name_prefix="reporter",
    overwrite=True,
)

print(result["status"], result["manifest_path"])

# What the construct must satisfy, and what evidence would accept it, are
# not expressible in the design the compiler reads.`

const pyLabRobot = `"""Golden Gate assembly for the reporter, written against PyLabRobot.

Liquid handling only. The thermocycler profile, the transformation, the
plating, and every acceptance criterion live somewhere else.
"""

import asyncio

from pylabrobot.liquid_handling import LiquidHandler
from pylabrobot.liquid_handling.backends import OpentronsBackend
from pylabrobot.resources.opentrons import (
    OTDeck,
    nest_96_wellplate_100ul_pcr_full_skirt,
    opentrons_24_tuberack_nest_1_5ml_snapcap,
    opentrons_96_tiprack_20ul,
)

MASTER_MIX_UL = {
    "nuclease_free_water": 6.0,
    "t4_ligase_buffer": 2.0,
    "t4_ligase": 1.0,
    "bsai": 1.0,
}

PART_UL = 2.0
PARTS = ["pSB1C3", "pTet", "B0034", "sfGFP", "B0015"]

SOURCE_WELL = {
    "nuclease_free_water": "A1",
    "t4_ligase_buffer": "A2",
    "t4_ligase": "A3",
    "bsai": "A4",
    "pSB1C3": "B1",
    "pTet": "B2",
    "B0034": "B3",
    "sfGFP": "B4",
    "B0015": "B5",
}


def build_deck() -> OTDeck:
    deck = OTDeck()
    deck.assign_child_at_slot(opentrons_96_tiprack_20ul(name="tips"), slot=1)
    deck.assign_child_at_slot(
        opentrons_24_tuberack_nest_1_5ml_snapcap(name="reagents"), slot=2
    )
    deck.assign_child_at_slot(
        nest_96_wellplate_100ul_pcr_full_skirt(name="reaction"), slot=3
    )
    return deck


async def add(lh, reagents, reaction, tips, tip_index, source, volume, target):
    await lh.pick_up_tips(tips[tip_index])
    await lh.aspirate([reagents[SOURCE_WELL[source]]], vols=[volume])
    await lh.dispense([reaction[target]], vols=[volume])
    await lh.drop_tips()
    return tip_index + 1


async def main() -> None:
    deck = build_deck()
    lh = LiquidHandler(backend=OpentronsBackend(host="169.254.1.1"), deck=deck)
    await lh.setup()

    tips = deck.get_resource("tips")
    reagents = deck.get_resource("reagents")
    reaction = deck.get_resource("reaction")

    tip_index = 0
    for reagent, volume in MASTER_MIX_UL.items():
        tip_index = await add(
            lh, reagents, reaction, tips, tip_index, reagent, volume, "A1"
        )

    for part in PARTS:
        tip_index = await add(
            lh, reagents, reaction, tips, tip_index, part, PART_UL, "A1"
        )

    # No thermocycler here: run 30 cycles of 37 C for 1 min and 16 C for 1 min,
    # then 50 C for 5 min and 80 C for 10 min, by hand or in another script.
    await lh.stop()


if __name__ == "__main__":
    asyncio.run(main())`

const autoprotocol = `{
  "refs": {
    "reagents": {
      "new": "micro-1.5",
      "discard": true
    },
    "reaction_plate": {
      "new": "96-pcr",
      "store": { "where": "cold_4" }
    }
  },
  "instructions": [
    {
      "op": "provision",
      "resource_id": "rs17gmh5wafm5p",
      "to": [
        { "well": "reaction_plate/0", "volume": "6.0:microliter" }
      ]
    },
    {
      "op": "transfer",
      "from": "reagents/0",
      "to": "reaction_plate/0",
      "volume": "2.0:microliter",
      "mix_after": { "volume": "5:microliter", "repetitions": 3 }
    },
    {
      "op": "transfer",
      "from": "reagents/1",
      "to": "reaction_plate/0",
      "volume": "1.0:microliter"
    },
    {
      "op": "transfer",
      "from": "reagents/2",
      "to": "reaction_plate/0",
      "volume": "1.0:microliter"
    },
    {
      "op": "thermocycle",
      "object": "reaction_plate",
      "volume": "20:microliter",
      "lid_temperature": "105:celsius",
      "groups": [
        {
          "cycles": 30,
          "steps": [
            { "temperature": "37:celsius", "duration": "1:minute" },
            { "temperature": "16:celsius", "duration": "1:minute" }
          ]
        },
        {
          "cycles": 1,
          "steps": [
            { "temperature": "50:celsius", "duration": "5:minute" },
            { "temperature": "80:celsius", "duration": "10:minute" }
          ]
        }
      ]
    }
  ]
}`

const labop = `"""Golden Gate assembly for the reporter, written against LabOP.

The protocol is an SBOL 3 document, so it travels between laboratories and
renders either as machine steps or as text a person can follow.
"""

import sbol3
import labop
import tyto
from labop.utils.harness import ProtocolHarness

sbol3.set_namespace("https://labop.example.org/reporter/")
doc = sbol3.Document()

protocol = labop.Protocol("golden_gate_assembly")
protocol.name = "Golden Gate assembly of the reporter"
doc.add(protocol)

water = sbol3.Component("ddH2O", "https://identifiers.org/pubchem.substance:24901740")
buffer = sbol3.Component("t4_ligase_buffer", tyto.NCIT.Buffer)
ligase = sbol3.Component("t4_ligase", tyto.NCIT.Enzyme)
bsai = sbol3.Component("BsaI", tyto.NCIT.Enzyme)
for component in (water, buffer, ligase, bsai):
    doc.add(component)

plate_spec = labop.ContainerSpec(
    "reaction_plate",
    name="reaction plate",
    queryString="cont1:Corning96WellPlate360uLFlat",
    prefixMap={"cont1": "https://sift.net/container-ontology/container-ontology#"},
)
plate = protocol.primitive_step("EmptyContainer", specification=plate_spec)

reaction = protocol.primitive_step(
    "PlateCoordinates", source=plate.output_pin("samples"), coordinates="A1"
)

for component, volume in (
    (water, 6.0),
    (buffer, 2.0),
    (ligase, 1.0),
    (bsai, 1.0),
):
    protocol.primitive_step(
        "Provision",
        resource=component,
        destination=reaction.output_pin("samples"),
        amount=sbol3.Measure(volume, tyto.OM.microlitre),
    )

# Each part is transferred from its own source well, then the plate goes to a
# thermocycler. What the assembled construct must satisfy is described in the
# SBOL design beside this protocol, not inside it.

harness = ProtocolHarness(protocol=protocol, base_dir=".")
harness.run()`

const opentrons = `"""Golden Gate assembly of the GFP reporter, written against the Opentrons API.

One 20 uL BsaI reaction, cycled between digestion and ligation and then
heat-killed. Transformation, plating, and screening are separate protocols.
"""

from opentrons import protocol_api

metadata = {
    "protocolName": "Golden Gate assembly: GFP reporter",
    "author": "Your laboratory",
    "description": "J23101, B0034, GFP and B0015 into pSB1C3, cut with BsaI.",
}

requirements = {"robotType": "OT-2", "apiLevel": "2.21"}

# Aluminium block on the temperature module, held at 4 C. Every address here
# is a promise about where someone put a tube this morning.
REAGENT_WELL = {
    "nuclease_free_water": "A3",
    "t4_ligase_buffer": "D2",
    "t4_ligase": "C2",
    "BsaI": "B2",
    "pSB1C3": "A2",
    "J23101": "D1",
    "B0034": "B1",
    "GFP": "C1",
    "B0015": "A1",
}

# 20 uL total: the parts and the backbone at 2 uL each, the rest master mix.
MASTER_MIX_UL = {
    "nuclease_free_water": 2,
    "t4_ligase_buffer": 2,
    "t4_ligase": 4,
    "BsaI": 2,
}
DNA_UL = 2
DNA = ["pSB1C3", "J23101", "B0034", "GFP", "B0015"]

REACTION_WELL = "A1"
REACTION_UL = 20

CYCLES = 75
DIGEST_C = 37
DIGEST_MINUTES = 2
LIGATE_C = 16
LIGATE_MINUTES = 5


def run(protocol: protocol_api.ProtocolContext) -> None:
    temperature_module = protocol.load_module("temperature module gen2", 1)
    reagents = temperature_module.load_labware(
        "opentrons_24_aluminumblock_nest_1.5ml_snapcap"
    )

    thermocycler = protocol.load_module("thermocycler module gen2")
    reaction_plate = thermocycler.load_labware(
        "nest_96_wellplate_100ul_pcr_full_skirt"
    )

    tips = protocol.load_labware("opentrons_96_tiprack_20ul", 2)
    p20 = protocol.load_instrument("p20_single_gen2", "left", tip_racks=[tips])

    temperature_module.set_temperature(4)
    thermocycler.open_lid()

    reaction = reaction_plate[REACTION_WELL]
    additions = list(MASTER_MIX_UL.items()) + [(name, DNA_UL) for name in DNA]
    for reagent, volume in additions:
        p20.transfer(
            volume, reagents[REAGENT_WELL[reagent]], reaction, new_tip="always"
        )

    p20.pick_up_tip()
    p20.mix(3, 15, reaction)
    p20.drop_tip()

    thermocycler.close_lid()
    thermocycler.set_lid_temperature(105)
    thermocycler.execute_profile(
        steps=[
            {"temperature": DIGEST_C, "hold_time_minutes": DIGEST_MINUTES},
            {"temperature": LIGATE_C, "hold_time_minutes": LIGATE_MINUTES},
        ],
        repetitions=CYCLES,
        block_max_volume=REACTION_UL,
    )

    # Final ligation, then kill both enzymes before the plate comes off.
    thermocycler.set_block_temperature(50, hold_time_minutes=5)
    thermocycler.set_block_temperature(80, hold_time_minutes=10)
    thermocycler.set_block_temperature(4)
    thermocycler.deactivate_lid()
    thermocycler.open_lid()

    # Whether the construct that comes off this plate is the right one, and
    # what measurement would settle it, are not things this file can say.
    protocol.comment("Assembly complete. Hold at 4 C for transformation.")`

export interface Implementation {
  id: string
  label: string
  filename: string
  language: SourceLanguage
  href: string
  note: string
  body: string
}

export const implementations: Implementation[] = [
  {
    id: 'opentrons',
    label: 'Opentrons',
    filename: 'assembly_protocol.py',
    language: 'python',
    href: 'https://docs.opentrons.com/',
    note: 'Deck slots, labware load names, pipette mounts, transfer volumes: what you write and maintain against the Opentrons Python API, and what you rewrite when the bench changes underneath it. Every well address is a promise about where someone put a tube. The construct being assembled is a comment at best, and what would make it acceptable has nowhere to go.',
    body: opentrons,
  },
  {
    id: 'pylabrobot',
    label: 'PyLabRobot',
    filename: 'assembly.py',
    language: 'python',
    href: 'https://github.com/PyLabRobot/pylabrobot',
    note: 'One interface across vendors, driven interactively or from a script. It stops at liquid handling, which is why it is short: the thermocycling, the transformation, and every acceptance criterion are not expressible here.',
    body: pyLabRobot,
  },
  {
    id: 'buildcompiler',
    label: 'BuildCompiler',
    filename: 'build_reporter.py',
    language: 'python',
    href: 'https://buildcompiler.readthedocs.io/en/latest/',
    note: 'The closest peer here, and a compiler in the same sense: it plans MoClo levels, checks a design against indexed inventory, and picks the route needing the least new build work. Lab does none of that. The difference is shape rather than length: the design is SBOL, so parts and their roles are constructed object by object, and what the construct must satisfy has nowhere in that document to go.',
    body: buildCompiler,
  },
  {
    id: 'autoprotocol',
    label: 'Autoprotocol',
    filename: 'assembly.json',
    language: 'json',
    href: 'https://github.com/autoprotocol/autoprotocol-python',
    note: 'The reaction as a machine-readable instruction list. It travels between facilities, which the Python does not, and still says nothing about what the construct is for or what would make it acceptable.',
    body: autoprotocol,
  },
  {
    id: 'labop',
    label: 'LabOP',
    filename: 'assembly.py',
    language: 'python',
    href: 'https://github.com/Bioprotocols/labop',
    note: 'A community standard, built on SBOL, so one protocol renders either as machine steps or as text a person can follow. It describes the procedure; what the construct must satisfy lives in the SBOL design beside it rather than in one artifact a compiler checks across.',
    body: labop,
  },
]
