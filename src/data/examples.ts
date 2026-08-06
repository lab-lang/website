export const plasmidExample = `use std.bio.inventory

pSB1C3 = backbone("pSB1C3")

plasmid p_sensor:
  sequence: dna("ATGCGTACGTTAGCTA")
  backbone: pSB1C3

  require topology == circular
  accept sequence == design.sequence
  accept concentration >= 100 ng/uL
  accept volume >= 20 uL`

export const workflowExample = `use std.lab.plasmid_actions

workflow build_plasmid(
  design: Plasmid,
) -> Accepted<Plasmid> | Rejected<Plasmid>:
  fragments <- synthesize design
  construct <- assemble fragments
  cells <- provision competent_ecoli
  culture <- transform construct into cells
  plate <- plate culture on kanamycin

  result <- await_colonies plate

  match result:
    case TimedOut:
      <- dispose result.plate
      return Rejected{
        material: None,
        reason: no_colonies,
        evidence: result.observations,
      }

    case Ready:
      return screen result against design`

export const examples = [
  { id: 'plasmid', label: 'Plasmid acceptance', source: plasmidExample },
  { id: 'workflow', label: 'Durable workflow', source: workflowExample },
] as const
