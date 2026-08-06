export interface SourceInspection {
  lines: number
  declarations: number
  durableEffects: number
  acceptanceChecks: number
}

export function inspectSource(source: string): SourceInspection {
  const declarationPattern =
    /^\s*(?:plasmid|circuit|workflow|record|material|observation|evidence|event|outcome)\s+/gm

  return {
    lines: source.length === 0 ? 0 : source.split('\n').length,
    declarations: source.match(declarationPattern)?.length ?? 0,
    durableEffects: source.match(/<-/g)?.length ?? 0,
    acceptanceChecks: source.match(/^\s*accept\s+/gm)?.length ?? 0,
  }
}
