import type { PlaygroundProject } from '../data/playground-projects'

const SCRATCH_KEY = 'lab-playground:scratch'
const SCRATCH_ID_PATTERN = /^scratch-(\d+)$/

export function isScratchProject(id: string): boolean {
  return SCRATCH_ID_PATTERN.test(id)
}

export function loadScratchProjects(): PlaygroundProject[] {
  try {
    const raw = localStorage.getItem(SCRATCH_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) return parsed as PlaygroundProject[]
  } catch {
    // Corrupted or inaccessible storage — start with no scratch projects.
  }
  return []
}

export function saveScratchProjects(projects: PlaygroundProject[]): void {
  try {
    localStorage.setItem(SCRATCH_KEY, JSON.stringify(projects))
  } catch {
    // Storage can be unavailable (private mode, quota) — edits still work in-memory.
  }
}

/** A fresh, empty project a visitor can write anything into, numbered past whatever scratch projects already exist. */
export function newScratchProject(existing: PlaygroundProject[]): PlaygroundProject {
  const numbers = existing
    .map((project) => SCRATCH_ID_PATTERN.exec(project.id)?.[1])
    .filter((value): value is string => value != null)
    .map(Number)
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1
  return {
    id: `scratch-${next}`,
    label: `Scratch ${next}`,
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
