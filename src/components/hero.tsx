import { Check, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { BuildTransition } from '@/components/build-transition'
import { CircuitGraph } from '@/components/circuit-graph'
import { CodeLanguageToggle } from '@/components/code-language-toggle'
import { HandlerGraph } from '@/components/handler-graph'
import { LiquidHandler } from '@/components/liquid-handler'
import { PlasmidMap } from '@/components/plasmid-map'
import { ProgramGraph } from '@/components/program-graph'
import { SourceCode } from '@/components/source-code'
import { WorkflowGraph } from '@/components/workflow-graph'
import { BUILD_STAGES, BUILD_STEP_MS } from '@/data/build-stages'
import {
  heroCircuitExample,
  heroCircuitExamplePython,
  heroMainExample,
  heroMainExamplePython,
  heroObserveExample,
  heroObserveExamplePython,
  heroPlasmidExample,
  heroPlasmidExamplePython,
  heroWorkflowExample,
  heroWorkflowExamplePython,
} from '@/data/examples'
import { features } from '@/data/plasmid-features'
import { useCodeLanguage, type CodeLanguage } from '@/lib/code-language'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

/*
 * The opening file takes about this long to type whatever it is, so the
 * hero keeps one rhythm across frontends: the same design states in 604
 * characters of Lab and 1683 of Python, and a fixed per-tick step would
 * make the Python view sit almost three times as long before the build
 * starts.
 */
const TYPING_MS = 4200
const TICK_MS = 40
const HOLD_BEFORE_BUILD = 600
/** How long the compiler panel stays up receding. Matches `.stage-recede`. */
const HANDOFF_MS = 300

type View = 'design' | 'execution'

const views: Array<{ id: View; label: string }> = [
  { id: 'design', label: 'Design' },
  { id: 'execution', label: 'Build' },
]

type FileId = 'workflow' | 'circuit' | 'plasmid' | 'observe' | 'main'

/**
 * Every file is written both ways. The summaries count what is in the file,
 * so a file counts differently between them: pySBOL3 states the reporter's
 * topology in the component's own types, which is one fewer requirement for
 * Lab to carry.
 */
const files: Array<{
  id: FileId
  stem: string
  lab: string
  python?: string
  summary: Record<CodeLanguage, string>
}> = [
  {
    id: 'workflow',
    stem: 'workflow',
    lab: heroWorkflowExample,
    python: heroWorkflowExamplePython,
    summary: {
      lab: '1 strain, 1 workflow · 6 durable effects',
      python: '1 strain, 1 workflow · 6 durable effects',
    },
  },
  {
    id: 'circuit',
    stem: 'circuit',
    lab: heroCircuitExample,
    python: heroCircuitExamplePython,
    summary: {
      lab: '1 circuit · 4 parts in layout',
      python: '1 LOICA network · 1 characterized unit',
    },
  },
  {
    id: 'plasmid',
    stem: 'plasmid',
    lab: heroPlasmidExample,
    python: heroPlasmidExamplePython,
    summary: {
      lab: '2 requirements, 3 acceptance claims',
      python: '1 requirement, 3 acceptance claims',
    },
  },
  {
    id: 'observe',
    stem: 'observe',
    lab: heroObserveExample,
    python: heroObserveExamplePython,
    summary: {
      lab: '1 reactive workflow · 2 timers',
      python: '1 reactive workflow · 2 timers',
    },
  },
  {
    id: 'main',
    stem: 'main',
    lab: heroMainExample,
    python: heroMainExamplePython,
    summary: {
      lab: 'entry point · 2 events, 1 match',
      python: 'entry point · 2 events, 1 match',
    },
  },
]

/** The frontend a file is actually shown in, which is Lab unless it has a Python form. */
function shownIn(
  file: (typeof files)[number],
  language: CodeLanguage,
): CodeLanguage {
  return language === 'python' && file.python ? 'python' : 'lab'
}

function sourceOf(file: (typeof files)[number], language: CodeLanguage) {
  return shownIn(file, language) === 'python' ? file.python! : file.lab
}

const EXTENSION: Record<CodeLanguage, string> = { lab: '.lab', python: '.py' }

/**
 * Types the program out character by character once `active` flips true.
 * Replay remounts this component, so the count starts fresh without an
 * effect having to reset it. The target is passed in rather than read from a
 * constant: switching frontend mid-type keeps typing, in the new language.
 */
function useTypedSource(active: boolean, length: number) {
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!active) return

    const step = Math.max(1, Math.ceil(length / (TYPING_MS / TICK_MS)))
    const timer = window.setInterval(() => {
      setTyped((current) => {
        const next = current + step
        if (next >= length) {
          window.clearInterval(timer)
          return length
        }
        return next
      })
    }, TICK_MS)

    return () => window.clearInterval(timer)
  }, [active, length])

  return typed
}

/**
 * The show waits for its audience: on a phone the specimen sits below the
 * fold, and typing that starts on page load would finish before anyone
 * scrolls to it. One-shot, like a reveal — and a jump that lands past the
 * specimen counts as seen, so a deep link is never stuck on an empty pane.
 */
function useStarted(ref: React.RefObject<HTMLDivElement | null>) {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || started) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0) {
          setStarted(true)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)

    return () => observer.disconnect()
  }, [ref, started])

  return started
}

/** Holds the arcs back a frame so they draw in when the file is opened. */
function DrawnMap({
  tokens,
  accepted,
}: {
  tokens: string[]
  accepted: boolean
}) {
  const joined = tokens.join('|')
  const [shown, setShown] = useState<string[]>([])

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShown(joined.split('|').filter(Boolean)),
      40,
    )
    return () => window.clearTimeout(timer)
  }, [joined])

  return <PlasmidMap accepted={accepted} revealed={shown} />
}

export function HeroSpecimen() {
  const [runId, setRunId] = useState(0)
  return <Specimen key={runId} onReplay={() => setRunId((id) => id + 1)} />
}

function Specimen({ onReplay }: { onReplay: () => void }) {
  const reducedMotion = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const started = useStarted(rootRef)
  const language = useCodeLanguage()
  const openingFile = files.find((f) => f.id === 'plasmid') ?? files[0]
  const opening = sourceOf(openingFile, language)
  const typed = useTypedSource(!reducedMotion && started, opening.length)
  const [view, setView] = useState<View>('design')
  const [pinned, setPinned] = useState(false)
  const [fileId, setFileId] = useState<FileId>('plasmid')
  const [buildStep, setBuildStep] = useState<number | null>(null)
  const [handingOff, setHandingOff] = useState(false)
  /* The compiler panel is arriving or holding; the design behind it recedes. */
  const building = buildStep !== null
  /* It is on screen either way, coming up over the design or leaving the target. */
  const compiling = building || handingOff

  const complete = reducedMotion || typed >= opening.length

  /* Once the program is written, the build starts on its own. */
  useEffect(() => {
    if (
      !started ||
      !complete ||
      pinned ||
      reducedMotion ||
      view === 'execution'
    )
      return

    const timer = window.setTimeout(() => setBuildStep(0), HOLD_BEFORE_BUILD)
    return () => window.clearTimeout(timer)
  }, [started, complete, pinned, reducedMotion, view])

  /* Walk the compile stages, then hand the panel to the target. */
  useEffect(() => {
    if (buildStep === null) return

    if (buildStep >= BUILD_STAGES.length) {
      /* The target mounts under the compiler panel, which then recedes off it. */
      const timer = window.setTimeout(() => {
        setBuildStep(null)
        setHandingOff(true)
        setView('execution')
      }, 300)
      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(
      () => setBuildStep((current) => (current === null ? null : current + 1)),
      BUILD_STEP_MS,
    )
    return () => window.clearTimeout(timer)
  }, [buildStep])

  /* The compiler panel comes down once it has faded off the target. */
  useEffect(() => {
    if (!handingOff) return

    const timer = window.setTimeout(() => setHandingOff(false), HANDOFF_MS)
    return () => window.clearTimeout(timer)
  }, [handingOff])

  const activeFile = files.find((f) => f.id === fileId) ?? files[0]
  const activeLanguage = shownIn(activeFile, language)

  /* Only the opening file types itself; switching files shows it whole. */
  const typing = fileId === 'plasmid' && !complete
  const visibleSource =
    fileId !== 'plasmid'
      ? sourceOf(activeFile, language)
      : complete
        ? opening
        : opening.slice(0, typed)

  /* A feature's arc draws once its identifier has been written. */
  const revealed = useMemo(
    () =>
      features
        .filter((feature) => visibleSource.includes(feature.token))
        .map((feature) => feature.token),
    [visibleSource],
  )

  /* Opening a file is a design gesture: come back from the target to show it. */
  function chooseFile(next: FileId) {
    setFileId(next)
    setPinned(true)
    setBuildStep(null)
    setHandingOff(false)
    setView('design')
  }

  function choose(next: View) {
    setPinned(true)
    /* Going to the target compiles; coming back is just a change of view. */
    if (next === 'execution' && view !== 'execution' && !reducedMotion) {
      setHandingOff(false)
      setBuildStep(0)
      return
    }
    setBuildStep(null)
    setHandingOff(false)
    setView(next)
  }

  return (
    <div
      className="relative overflow-hidden rounded-[20px] border border-ink/25 bg-vessel shadow-[0_30px_80px_-20px_rgb(43_28_17_/_0.45)]"
      ref={rootRef}
    >
      <div className="relative flex flex-col gap-2 border-b border-white/10 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5">
        {/*
         * Five filenames plus the view toggle do not fit a phone on one line,
         * so on small screens the files take their own scrolling row.
         */}
        <div
          aria-label="Example file"
          className="rail rail-quiet rail-fade -mx-4 flex min-w-0 items-center gap-1 px-4 sm:mx-0 sm:px-0"
          role="tablist"
        >
          {files.map((file) => (
            <button
              aria-selected={fileId === file.id}
              className={`press shrink-0 rounded-md px-2.5 py-3 font-mono text-[11px] sm:py-1.5 ${
                fileId === file.id
                  ? 'bg-[#f6ece0]/10 text-[#f6ece0]/85'
                  : 'text-[#f6ece0]/35 hover:text-[#f6ece0]/65'
              }`}
              key={file.id}
              onClick={() => chooseFile(file.id)}
              role="tab"
              type="button"
            >
              {file.stem}
              {EXTENSION[shownIn(file, language)]}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <CodeLanguageToggle />

          <div
            aria-label="Specimen view"
            className="flex items-center gap-1 rounded-lg border border-white/10 p-1"
            role="tablist"
          >
            {views.map((item) => (
              <button
                aria-label={`${item.label} view`}
                aria-selected={
                  building ? item.id === 'execution' : view === item.id
                }
                className={`press rounded-md px-3 py-2.5 sm:py-1.5 ${
                  (building ? item.id === 'execution' : view === item.id)
                    ? 'bg-gfp/15 text-gfp'
                    : 'text-[#f6ece0]/40 hover:text-[#f6ece0]/75'
                }`}
                key={item.id}
                onClick={() => choose(item.id)}
                role="tab"
                type="button"
              >
                <span className="micro">{item.label}</span>
              </button>
            ))}
          </div>

          <button
            className="press grid size-10 shrink-0 place-items-center rounded-md border border-white/10 text-[#f6ece0]/40 hover:border-white/25 hover:text-[#f6ece0]/80 sm:size-7"
            onClick={onReplay}
            title="Replay"
            type="button"
          >
            <RotateCcw aria-hidden="true" size={12} />
            <span className="sr-only">Replay from the beginning</span>
          </button>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="order-2 min-w-0 border-t border-white/10 lg:order-1 lg:border-r lg:border-t-0">
          {/*
           * On a phone the pane cannot own vertical scroll: a fixed-height
           * inner scroller stacked in the page captures the swipe. A file
           * longer than the pane trails off behind the bottom fade, because
           * the pane is an illustration, not a workbench.
           */}
          <div className="scroll-fade-y h-[440px] overflow-hidden sm:h-[470px] sm:overflow-y-auto">
            <SourceCode
              cursor={typing}
              language={activeLanguage}
              source={visibleSource}
            />
          </div>
        </div>

        {/*
         * min-w-0: the stage panels pan wider than the screen, and without it
         * that width sizes the grid track instead of the panel's scroller.
         */}
        <div className="relative order-1 h-[340px] min-w-0 sm:h-[470px] lg:order-2">
          {/*
           * The compiler panel comes up over the design it is compiling rather
           * than replacing it outright, so the design recedes under it instead
           * of cutting to an empty panel.
           */}
          <div className={`h-full ${building ? 'stage-recede' : ''}`}>
            {view === 'design' && fileId === 'workflow' ? (
              <div className="stage-panel h-full" key="flow">
                <WorkflowGraph />
              </div>
            ) : view === 'design' && fileId === 'circuit' ? (
              <div className="stage-panel h-full" key="circuit">
                <CircuitGraph />
              </div>
            ) : view === 'design' && fileId === 'observe' ? (
              <div className="stage-panel h-full" key="handlers">
                <HandlerGraph />
              </div>
            ) : view === 'design' && fileId === 'main' ? (
              <div className="stage-panel h-full" key="program">
                <ProgramGraph />
              </div>
            ) : view === 'design' ? (
              <div
                className="stage-panel h-full overflow-hidden p-3 sm:p-8"
                key="design"
              >
                <div className="mx-auto h-full w-full max-w-[540px]">
                  <DrawnMap accepted tokens={revealed} />
                </div>
              </div>
            ) : (
              <div className="stage-emerge h-full" key="execution">
                <LiquidHandler />
              </div>
            )}
          </div>

          {compiling && (
            <div
              className={`absolute inset-0 ${
                handingOff ? 'stage-recede' : 'stage-emerge'
              }`}
              key="build"
            >
              <BuildTransition
                step={handingOff ? BUILD_STAGES.length : (buildStep ?? 0)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center gap-2.5 border-t border-white/10 px-4 py-3.5 sm:px-5">
        {building ? (
          <p className="min-w-0 truncate font-mono text-[11px] text-amber sm:text-xs">
            lowering to opentrons_ot2…
          </p>
        ) : view === 'execution' ? (
          <p className="min-w-0 truncate font-mono text-[11px] text-[#f6ece0]/55 sm:text-xs">
            <span className="text-amber">compiled for opentrons_ot2</span> ·
            concept protocol, qualify before running
          </p>
        ) : complete ? (
          <>
            <Check
              aria-hidden="true"
              className="shrink-0 text-gfp"
              size={14}
              strokeWidth={2.6}
            />
            <p className="min-w-0 truncate font-mono text-[11px] text-gfp sm:text-xs">
              {activeFile.summary[activeLanguage]}
              <span className="text-[#f6ece0]/35">
                {' '}
                · no laboratory target selected
              </span>
            </p>
          </>
        ) : (
          <p className="font-mono text-[11px] text-[#f6ece0]/55 sm:text-xs">
            writing portable intent…
          </p>
        )}
      </div>
    </div>
  )
}
