import type { SourceLanguage } from '../components/source-code'
import { generatedProtocol } from './generated-ot2'

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

export interface Implementation {
  id: string
  label: string
  filename: string
  language: SourceLanguage
  href: string
  /** True for the one file here nobody types: the toolchain emits it. */
  generated: boolean
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
    generated: true,
    note: 'Deck slots, labware load names, pipette mounts, transfer volumes: the shape of what you would otherwise write and maintain against the Opentrons Python API. Here it is the toolchain’s output rather than anyone’s source, replaced on every build and checked against the official Opentrons simulator.',
    body: generatedProtocol,
  },
  {
    id: 'pylabrobot',
    label: 'PyLabRobot',
    filename: 'assembly.py',
    language: 'python',
    href: 'https://github.com/PyLabRobot/pylabrobot',
    generated: false,
    note: 'One interface across vendors, driven interactively or from a script. It stops at liquid handling, which is why it is short: the thermocycling, the transformation, and every acceptance criterion are not expressible here.',
    body: pyLabRobot,
  },
  {
    id: 'buildcompiler',
    label: 'BuildCompiler',
    filename: 'build_reporter.py',
    language: 'python',
    href: 'https://buildcompiler.readthedocs.io/en/latest/',
    generated: false,
    note: 'The closest peer here, and a compiler in the same sense: it plans MoClo levels, checks a design against indexed inventory, and picks the route needing the least new build work. Lab does none of that. The difference is shape rather than length — the design is SBOL, so parts and their roles are constructed object by object, and what the construct must satisfy has nowhere in that document to go.',
    body: buildCompiler,
  },
  {
    id: 'autoprotocol',
    label: 'Autoprotocol',
    filename: 'assembly.json',
    language: 'json',
    href: 'https://github.com/autoprotocol/autoprotocol-python',
    generated: false,
    note: 'The reaction as a machine-readable instruction list. It travels between facilities, which the Python does not, and still says nothing about what the construct is for or what would make it acceptable.',
    body: autoprotocol,
  },
  {
    id: 'labop',
    label: 'LabOP',
    filename: 'assembly.py',
    language: 'python',
    href: 'https://github.com/Bioprotocols/labop',
    generated: false,
    note: 'A community standard, built on SBOL, so one protocol renders either as machine steps or as text a person can follow. It describes the procedure; what the construct must satisfy lives in the SBOL design beside it rather than in one artifact a compiler checks across.',
    body: labop,
  },
]
