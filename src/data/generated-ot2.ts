/**
 * Emitted by the Lab toolchain, not written by hand. `labSource` is the module;
 * `generatedProtocol` is exactly what `labc` produces for it:
 *
 *     labc build.lab --emit opentrons-assembly
 *
 * The output is committed because there is no Rust toolchain at deploy time.
 * Regenerate both together, from a checkout of the compiler, whenever the
 * backend changes what it emits. Do not edit either string.
 */

export const labSource = `use std.bio.build
use std.bio.designs
use std.bio.golden_gate

buy part J23101
buy part B0034
buy part GFP
buy part B0015
buy backbone pSB1C3

buy restriction_enzyme BsaI:
  digest_temperature = 37 C

/** The GFP reporter under a strong constitutive promoter. */
plasmid reporter:
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

export const generatedProtocol = `"""Golden Gate assembly protocol emitted by the Lab OT-2 backend."""

import json
from typing import TypedDict, cast

from opentrons import protocol_api


class Pipette(TypedDict):
    model: str
    mount: str


class Instruments(TypedDict):
    small: Pipette
    large: Pipette


class TemperatureModule(TypedDict):
    model: str
    slot: str
    labware: str
    capacity: int


class Thermocycler(TypedDict):
    model: str
    labware: str
    capacity: int


class SharedDeck(TypedDict):
    temperature_module: TemperatureModule
    thermocycler: Thermocycler


class Plates(TypedDict):
    labware: str
    slots: list[str]
    capacity: int


class MediaRack(TypedDict):
    labware: str
    slot: str
    medium_well: str


class AssemblyStage(TypedDict):
    small_tips: Plates


class TransformationStage(TypedDict):
    dna_plate: Plates
    small_tips: Plates
    large_tips: Plates


class PlatingStage(TypedDict):
    dilution_plate: Plates
    agar_plate: Plates
    media_rack: MediaRack
    small_tips: Plates
    large_tips: Plates


class Stages(TypedDict):
    assembly: AssemblyStage
    transformation: TransformationStage
    plating: PlatingStage


class TargetMetadata(TypedDict):
    name: str
    backend: str
    api_level: str


class TargetProfile(TypedDict):
    target: TargetMetadata
    instruments: Instruments
    deck: SharedDeck
    stages: Stages


class Well(TypedDict):
    plate: int
    well: str


class TransformationReaction(TypedDict):
    culture_well: str
    source_wells: list[Well]


class PlatingLayout(TypedDict):
    culture_well: str
    dilution_wells: list[Well]
    agar_wells: list[list[Well]]


class AssemblyChemistry(TypedDict):
    reaction_volume_ul: int
    part_volume_ul: int
    enzyme_volume_ul: int
    ligase_volume_ul: int
    buffer_volume_ul: int
    cycles: int
    digest_temperature_c: int
    digest_minutes: int
    ligate_temperature_c: int
    ligate_minutes: int


class StrainChemistry(TypedDict):
    cell_volume_ul: int
    dna_volume_ul: int
    recovery_volume_ul: int
    cold_minutes: int
    heat_shock_temperature_c: int
    heat_shock_minutes: int
    recovery_temperature_c: int
    recovery_minutes: int
    medium_volume_ul: int
    culture_volume_ul: int
    colony_volume_ul: int


class AssemblyPlan(TypedDict):
    artifact: str
    sequence: str
    backbone: str
    components: list[str]
    dependencies: list[str]
    restriction_enzyme: str
    assembly_replicates: int
    water_volume_ul: int
    assembly_wells: list[str]
    chemistry: AssemblyChemistry


class StrainPlan(TypedDict):
    artifact: str
    host: str
    plasmids: list[str]
    dependencies: list[str]
    selection: str
    transformation_replicates: int
    plating_replicates: int
    serial_dilutions: int
    transformations: list[TransformationReaction]
    plating: list[PlatingLayout]
    chemistry: StrainChemistry


class Ot2ExecutionPlan(TypedDict):
    schema_version: str
    target: str
    api_level: str
    deck: TargetProfile
    assembly_source_wells: dict[str, str]
    transformation_source_wells: dict[str, str]
    dna_source_wells: dict[str, Well]
    assemblies: list[AssemblyPlan]
    strains: list[StrainPlan]

metadata = {
    "protocolName": "Lab Golden Gate assembly",
    "author": "Lab Compiler",
    "description": "Generated concept protocol",
}
requirements = {
    "robotType": "OT-2",
    "apiLevel": "2.21",  # LAB:API_LEVEL
}
PLAN_JSON = (
    "{\\"schema_version\\":\\"lab.automation.v0\\",\\"target\\":\\"opentrons.ot2\\",\\"api_level\\":"
    "\\"2.21\\",\\"deck\\":{\\"target\\":{\\"name\\":\\"reference-bench\\",\\"backend\\":\\"opentrons.ot"
    "2\\",\\"api_level\\":\\"2.21\\"},\\"instruments\\":{\\"small\\":{\\"model\\":\\"p20_single_gen2\\","
    "\\"mount\\":\\"left\\"},\\"large\\":{\\"model\\":\\"p300_single_gen2\\",\\"mount\\":\\"right\\"}},\\""
    "deck\\":{\\"temperature_module\\":{\\"model\\":\\"temperature module gen2\\",\\"slot\\":\\"1\\","
    "\\"labware\\":\\"opentrons_24_aluminumblock_nest_1.5ml_snapcap\\",\\"capacity\\":24},\\"therm"
    "ocycler\\":{\\"model\\":\\"thermocycler module gen2\\",\\"labware\\":\\"nest_96_wellplate_100u"
    "l_pcr_full_skirt\\",\\"capacity\\":96}},\\"stages\\":{\\"assembly\\":{\\"small_tips\\":{\\"labwa"
    "re\\":\\"opentrons_96_tiprack_20ul\\",\\"slots\\":[\\"2\\"],\\"capacity\\":96}},\\"transformatio"
    "n\\":{\\"dna_plate\\":{\\"labware\\":\\"nest_96_wellplate_100ul_pcr_full_skirt\\",\\"slots\\":["
    "\\"2\\"],\\"capacity\\":96},\\"small_tips\\":{\\"labware\\":\\"opentrons_96_tiprack_20ul\\",\\"sl"
    "ots\\":[\\"3\\"],\\"capacity\\":96},\\"large_tips\\":{\\"labware\\":\\"opentrons_96_filtertiprac"
    "k_200ul\\",\\"slots\\":[\\"6\\"],\\"capacity\\":96}},\\"plating\\":{\\"dilution_plate\\":{\\"labwa"
    "re\\":\\"nest_96_wellplate_100ul_pcr_full_skirt\\",\\"slots\\":[\\"2\\",\\"3\\"],\\"capacity\\":9"
    "6},\\"agar_plate\\":{\\"labware\\":\\"nest_96_wellplate_100ul_pcr_full_skirt\\",\\"slots\\":["
    "\\"5\\",\\"6\\"],\\"capacity\\":96},\\"media_rack\\":{\\"labware\\":\\"opentrons_15_tuberack_falc"
    "on_15ml_conical\\",\\"slot\\":\\"4\\",\\"medium_well\\":\\"A1\\"},\\"small_tips\\":{\\"labware\\":"
    "\\"opentrons_96_filtertiprack_20ul\\",\\"slots\\":[\\"9\\"],\\"capacity\\":96},\\"large_tips\\":"
    "{\\"labware\\":\\"opentrons_96_filtertiprack_200ul\\",\\"slots\\":[\\"1\\"],\\"capacity\\":96}}}"
    "},\\"assembly_source_wells\\":{\\"dna:B0015\\":\\"A1\\",\\"dna:B0034\\":\\"B1\\",\\"dna:GFP\\":\\"C"
    "1\\",\\"dna:J23101\\":\\"D1\\",\\"dna:pSB1C3\\":\\"A2\\",\\"enzyme:BsaI\\":\\"B2\\",\\"reagent:T4_DN"
    "A_ligase\\":\\"C2\\",\\"reagent:T4_DNA_ligase_buffer\\":\\"D2\\",\\"reagent:nuclease_free_wate"
    "r\\":\\"A3\\"},\\"transformation_source_wells\\":{\\"reagent:recovery_medium\\":\\"A1\\"},\\"dna"
    "_source_wells\\":{},\\"assemblies\\":[{\\"artifact\\":\\"reporter\\",\\"sequence\\":\\"ACGTACGT"
    "\\",\\"backbone\\":\\"pSB1C3\\",\\"components\\":[\\"J23101\\",\\"B0034\\",\\"GFP\\",\\"B0015\\"],\\"d"
    "ependencies\\":[],\\"restriction_enzyme\\":\\"BsaI\\",\\"assembly_replicates\\":1,\\"water_vol"
    "ume_ul\\":2,\\"assembly_wells\\":[\\"A1\\"],\\"chemistry\\":{\\"reaction_volume_ul\\":20,\\"part"
    "_volume_ul\\":2,\\"enzyme_volume_ul\\":2,\\"ligase_volume_ul\\":4,\\"buffer_volume_ul\\":2,\\""
    "cycles\\":75,\\"digest_temperature_c\\":37,\\"digest_minutes\\":2,\\"ligate_temperature_c\\":"
    "16,\\"ligate_minutes\\":5}}],\\"strains\\":[]}"
)  # LAB:EXECUTION_PLAN
PLAN = cast(Ot2ExecutionPlan, json.loads(PLAN_JSON))


def run(protocol: protocol_api.ProtocolContext) -> None:
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
        part_volume = chemistry["part_volume_ul"]
        additions = [
            ("reagent:nuclease_free_water", construct["water_volume_ul"]),
            ("reagent:T4_DNA_ligase_buffer", chemistry["buffer_volume_ul"]),
            ("reagent:T4_DNA_ligase", chemistry["ligase_volume_ul"]),
            ("enzyme:" + construct["restriction_enzyme"], chemistry["enzyme_volume_ul"]),
            ("dna:" + construct["backbone"], part_volume),
        ] + [("dna:" + component, part_volume) for component in construct["components"]]
        for destination_name in construct["assembly_wells"]:
            destination = reaction_plate[destination_name]
            for source_name, volume in additions:
                pipette.transfer(
                    volume,
                    sources[source_wells[source_name]],
                    destination,
                    new_tip="always",
                )
            pipette.pick_up_tip()
            pipette.mix(3, 15, destination)
            pipette.drop_tip()

    # Every assembly in a batch shares one thermal profile, so the first
    # construct's chemistry drives the block.
    profile_chemistry = PLAN["assemblies"][0]["chemistry"]
    thermocycler.close_lid()
    thermocycler.set_lid_temperature(105)
    thermocycler.execute_profile(
        steps=[
            {
                "temperature": profile_chemistry["digest_temperature_c"],
                "hold_time_minutes": profile_chemistry["digest_minutes"],
            },
            {
                "temperature": profile_chemistry["ligate_temperature_c"],
                "hold_time_minutes": profile_chemistry["ligate_minutes"],
            },
        ],
        repetitions=profile_chemistry["cycles"],
        block_max_volume=profile_chemistry["reaction_volume_ul"],
    )
    thermocycler.set_block_temperature(50, hold_time_minutes=5)
    thermocycler.set_block_temperature(80, hold_time_minutes=10)
    thermocycler.set_block_temperature(4)
    thermocycler.deactivate_lid()
    thermocycler.open_lid()
    protocol.comment(
        "Assembly complete. Preserve the reaction plate for transformation_protocol.py."
    )`
