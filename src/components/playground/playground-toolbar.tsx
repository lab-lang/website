import { Check, ChevronDown, Copy, Plus, RotateCcw, Trash2, WrapText } from 'lucide-react'
import type { PlaygroundProject } from '../../data/playground-projects'

export function PlaygroundToolbar({
  projects,
  scratchProjects,
  activeProjectId,
  onSelectProject,
  onNewScratch,
  onDeleteScratch,
  showDeleteScratch,
  onReset,
  onCopy,
  copied,
  onFormat,
  formatDisabled,
}: {
  projects: PlaygroundProject[]
  scratchProjects: PlaygroundProject[]
  activeProjectId: string
  onSelectProject: (id: string) => void
  onNewScratch: () => void
  onDeleteScratch: () => void
  showDeleteScratch: boolean
  onReset: () => void
  onCopy: () => void
  copied: boolean
  onFormat: () => void
  formatDisabled: boolean
}) {
  return (
    /*
     * On a phone the project name gets a row of its own: sharing one with five
     * controls leaves it too narrow to read the name it is there to show.
     */
    <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:flex-nowrap">
      <div className="relative w-full sm:w-auto">
        <select
          aria-label="Playground project"
          className="press h-9 w-full appearance-none truncate rounded-lg border border-white/10 bg-white/5 pl-3 pr-8 text-[13px] text-[#f2e8db] hover:border-white/20 sm:h-8 sm:w-auto sm:text-[12.5px]"
          onChange={(event) => onSelectProject(event.target.value)}
          value={activeProjectId}
        >
          <optgroup label="Examples">
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.label}
              </option>
            ))}
          </optgroup>
          {scratchProjects.length > 0 && (
            <optgroup label="Scratch">
              {scratchProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.label}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#f6ece0]/45"
          size={13}
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
        <button
          className="press grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-[#f6ece0]/60 hover:border-white/20 hover:text-[#f2e8db] sm:size-8"
          onClick={onNewScratch}
          title="New scratch project — a blank file to try your own ideas"
          type="button"
        >
          <Plus aria-hidden="true" size={13} />
          <span className="sr-only">New scratch project</span>
        </button>
        {showDeleteScratch && (
          <button
            className="press grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-[#f6ece0]/60 hover:border-mcherry/40 hover:text-mcherry sm:size-8"
            onClick={onDeleteScratch}
            title="Delete this scratch project"
            type="button"
          >
            <Trash2 aria-hidden="true" size={13} />
            <span className="sr-only">Delete scratch project</span>
          </button>
        )}
        <button
          className="press grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-[#f6ece0]/60 hover:border-white/20 hover:text-[#f2e8db] sm:size-8"
          onClick={onReset}
          title="Reset this project to its original files"
          type="button"
        >
          <RotateCcw aria-hidden="true" size={13} />
          <span className="sr-only">Reset project</span>
        </button>
        <button
          className="press grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-[#f6ece0]/60 hover:border-white/20 hover:text-[#f2e8db] disabled:opacity-40 sm:size-8"
          disabled={formatDisabled}
          onClick={onFormat}
          title="Format the active file"
          type="button"
        >
          <WrapText aria-hidden="true" size={13} />
          <span className="sr-only">Format file</span>
        </button>
        <button
          className="press inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-[12.5px] text-[#f6ece0]/60 hover:border-white/20 hover:text-[#f2e8db] sm:h-8"
          onClick={onCopy}
          type="button"
        >
          {copied ? (
            <Check aria-hidden="true" size={12} strokeWidth={2.6} />
          ) : (
            <Copy aria-hidden="true" size={12} />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
