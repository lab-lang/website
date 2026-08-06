import {
  Braces,
  CheckCircle2,
  Pause,
  Play,
  TestTubeDiagonal,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { plasmidExample } from '../data/examples'
import { SourceCode } from './source-code'

const charactersPerTick = 2
const typingInterval = 24
const sourceHold = 700
const robotDuration = 7200

type DemoPhase = 'source' | 'robot'

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(media.matches)

    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  return prefersReducedMotion
}

function RobotScene() {
  const channelColors = ['#e96b3f', '#e9b95f', '#77a88b', '#6fa7c7'] as const
  const wells = Array.from({ length: 96 }, (_, index) => ({
    cx: 316 + (index % 12) * 20,
    cy: 250 + Math.floor(index / 12) * 11,
  }))

  return (
    <div className="relative flex h-full flex-col overflow-hidden px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-lab-lime/20 bg-lab-lime/8 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-lab-lime">
          <span className="robot-pulse size-1.5 rounded-full bg-lab-lime" />
          Protocol running
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.09em] text-white/35">
          96-well transfer
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 640 380"
        >
          <defs>
            <linearGradient id="deck" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#294237" />
              <stop offset="1" stopColor="#182b22" />
            </linearGradient>
            <linearGradient id="machine" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#f0eee5" />
              <stop offset="1" stopColor="#aab7af" />
            </linearGradient>
            <filter id="robot-shadow" height="160%" width="160%" x="-30%" y="-30%">
              <feDropShadow dx="0" dy="10" floodColor="#050a07" floodOpacity=".32" stdDeviation="10" />
            </filter>
          </defs>

          <rect fill="url(#deck)" height="128" rx="18" width="548" x="46" y="224" />
          <rect fill="none" height="111" rx="13" stroke="#769083" strokeOpacity=".24" width="530" x="55" y="232" />
          <path d="M68 338h502" stroke="#8ca095" strokeOpacity=".15" />

          <g>
            <rect fill="#21372d" height="86" rx="11" stroke="#8ca095" strokeOpacity=".24" width="132" x="78" y="248" />
            <text fill="#82958a" fontFamily="IBM Plex Mono" fontSize="7" letterSpacing="1.1" x="90" y="265">
              SAMPLE RACK
            </text>
            {[0, 1, 2, 3].map((column) => (
              <g key={column}>
                <rect
                  fill="#dfe5df"
                  height="37"
                  rx="5"
                  width="16"
                  x={96 + column * 20}
                  y="275"
                />
                <path
                  d={`M${99 + column * 20} 296h10v11a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3Z`}
                  fill={channelColors[column]}
                  opacity=".85"
                />
              </g>
            ))}
          </g>

          <g>
            <rect fill="#d9ded9" height="108" rx="10" width="270" x="298" y="236" />
            <rect fill="#aebbb3" fillOpacity=".35" height="92" rx="7" width="250" x="308" y="244" />
            <text fill="#65766c" fontFamily="IBM Plex Mono" fontSize="6" letterSpacing=".7" x="538" y="241">
              96 WELL
            </text>
            {wells.map((well) => (
              <circle
                cx={well.cx}
                cy={well.cy}
                data-plate-well=""
                fill="#263f33"
                key={`${well.cx}-${well.cy}`}
                r="4.1"
                stroke="#f4f1e8"
                strokeOpacity=".2"
              />
            ))}
            {[316, 336, 356, 376].map((cx, index) => (
              <circle
                className="robot-well-one"
                cx={cx}
                cy="250"
                fill={channelColors[index]}
                key={`first-transfer-${cx}`}
                opacity="0"
                r="4.1"
              />
            ))}
            {[396, 416, 436, 456].map((cx, index) => (
              <circle
                className="robot-well-two"
                cx={cx}
                cy="250"
                fill={channelColors[index]}
                key={`second-transfer-${cx}`}
                opacity="0"
                r="4.1"
              />
            ))}
          </g>

          <g filter="url(#robot-shadow)">
            <rect fill="url(#machine)" height="262" rx="13" width="24" x="64" y="54" />
            <rect fill="url(#machine)" height="262" rx="13" width="24" x="552" y="54" />
            <rect fill="#d8ded9" height="24" rx="10" width="488" x="76" y="58" />
            <rect fill="#687d71" height="5" rx="2.5" width="454" x="93" y="68" />

            <g className="robot-carriage robot-motion">
              <rect fill="#edf0eb" height="53" rx="10" stroke="#84968c" strokeWidth="1.5" width="108" x="80" y="78" />
              <rect fill="#263e32" height="8" rx="4" width="44" x="112" y="90" />
              <circle cx="92" cy="91" fill="#b9ef5b" r="3" />
              <g className="robot-pipette robot-motion">
                <rect fill="#c4cec7" height="58" rx="4" width="92" x="88" y="125" />
                {[0, 1, 2, 3].map((tip) => (
                  <g key={tip}>
                    <rect fill="#7f9187" height="26" rx="2" width="4" x={102 + tip * 20} y="183" />
                    <path
                      d={`M${101 + tip * 20} 208h6l-2 27h-2Z`}
                      fill="#e5eae6"
                      opacity=".92"
                    />
                    <path
                      className="robot-liquid robot-motion"
                      d={`M${103 + tip * 20} 226h2l-1 8Z`}
                      fill={channelColors[tip]}
                    />
                    <circle
                      className="robot-drop robot-motion"
                      cx={104 + tip * 20}
                      cy="234"
                      fill={channelColors[tip]}
                      r="1.8"
                    />
                  </g>
                ))}
              </g>
            </g>
          </g>

          <g fill="#b9ef5b" fontFamily="IBM Plex Mono" fontSize="8" letterSpacing=".7">
            <text className="robot-step robot-step-one" x="108" y="365">
              ASPIRATE · SAMPLE 01
            </text>
            <text className="robot-step robot-step-two" x="108" y="365">
              DISPENSE · A01–A04
            </text>
            <text className="robot-step robot-step-three" x="108" y="365">
              DISPENSE · A05–A08
            </text>
            <text className="robot-step robot-step-four" x="108" y="365">
              TRANSFER COMPLETE
            </text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-between rounded-lg border border-white/8 bg-black/15 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-white/38">
        <span>Deck verified</span>
        <span className="text-[#9fd5b4]">4 channels · 20 µL</span>
      </div>
    </div>
  )
}

function StaticReducedMotionDemo() {
  return (
    <div className="h-[430px]">
      <RobotScene />
      <span className="sr-only">
        A Lab program has been lowered to an automated liquid-handling transfer.
      </span>
    </div>
  )
}

export function HeroDemo() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState<DemoPhase>('source')
  const [visibleCharacters, setVisibleCharacters] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || isPaused || phase !== 'source') return

    const timer = window.setInterval(() => {
      setVisibleCharacters((current) =>
        Math.min(current + charactersPerTick, plasmidExample.length),
      )
    }, typingInterval)

    return () => window.clearInterval(timer)
  }, [isPaused, phase, prefersReducedMotion])

  useEffect(() => {
    if (
      prefersReducedMotion ||
      isPaused ||
      phase !== 'source' ||
      visibleCharacters < plasmidExample.length
    ) {
      return
    }

    const timer = window.setTimeout(() => setPhase('robot'), sourceHold)
    return () => window.clearTimeout(timer)
  }, [isPaused, phase, prefersReducedMotion, visibleCharacters])

  useEffect(() => {
    if (prefersReducedMotion || isPaused || phase !== 'robot') return

    const timer = window.setTimeout(() => {
      setVisibleCharacters(0)
      setPhase('source')
    }, robotDuration)

    return () => window.clearTimeout(timer)
  }, [isPaused, phase, prefersReducedMotion])

  const sourceComplete = visibleCharacters >= plasmidExample.length
  const currentSource = plasmidExample.slice(0, visibleCharacters)
  const status = prefersReducedMotion
    ? 'source → automated liquid transfer'
    : isPaused
      ? 'animation paused'
      : phase === 'source'
        ? sourceComplete
          ? 'source checked · lowering to target'
          : 'writing portable intent'
        : 'executing liquid transfer'

  return (
    <div
      className="hero-demo relative overflow-hidden rounded-2xl border border-ink/20 bg-terminal shadow-[0_26px_70px_rgb(22_39_31_/_0.2)]"
      data-paused={isPaused}
      data-robot-active={!prefersReducedMotion && phase === 'robot'}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#f07a57]" />
          <span className="size-2.5 rounded-full bg-[#e9c75f]" />
          <span className="size-2.5 rounded-full bg-[#81bd72]" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/40">
            {prefersReducedMotion
              ? 'automation.plan'
              : phase === 'source'
                ? 'p_sensor.lab'
                : 'automation.plan'}
          </span>
          {!prefersReducedMotion && (
            <button
              aria-label={isPaused ? 'Play hero animation' : 'Pause hero animation'}
              className="pressable grid size-7 place-items-center rounded-md border border-white/10 text-white/45 hover:border-white/20 hover:text-white/80"
              onClick={() => setIsPaused((paused) => !paused)}
              type="button"
            >
              {isPaused ? (
                <Play aria-hidden="true" fill="currentColor" size={11} />
              ) : (
                <Pause aria-hidden="true" fill="currentColor" size={11} />
              )}
            </button>
          )}
        </div>
      </div>

      {prefersReducedMotion ? (
        <StaticReducedMotionDemo />
      ) : (
        <div className="relative h-[430px]">
          <div
            aria-hidden={phase !== 'source'}
            className={`hero-demo-panel absolute inset-0 overflow-hidden ${
              phase === 'source'
                ? 'translate-y-0 opacity-100'
                : '-translate-y-2 opacity-0'
            }`}
          >
            <SourceCode
              cursor={!sourceComplete && !isPaused}
              source={currentSource}
            />
          </div>
          <div
            aria-hidden={phase !== 'robot'}
            className={`hero-demo-panel absolute inset-0 ${
              phase === 'robot'
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
          >
            <RobotScene />
          </div>
          <span className="sr-only">
            Lab source is written, checked, and then executed by an automated
            liquid handler.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] text-[#9fd5b4] sm:text-[11px]">
          {sourceComplete && phase === 'source' && !prefersReducedMotion ? (
            <CheckCircle2 aria-hidden="true" className="shrink-0" size={13} />
          ) : phase === 'source' && !prefersReducedMotion ? (
            <Braces aria-hidden="true" className="shrink-0" size={13} />
          ) : phase === 'robot' || prefersReducedMotion ? (
            <TestTubeDiagonal aria-hidden="true" className="shrink-0" size={13} />
          ) : null}
          <span className="truncate">{status}</span>
        </div>
        <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
          <span
            className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
              phase === 'source' && !prefersReducedMotion
                ? 'w-6 bg-lab-lime'
                : 'w-1.5 bg-white/20'
            }`}
          />
          <span
            className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
              phase === 'robot' || prefersReducedMotion
                ? 'w-6 bg-lab-lime'
                : 'w-1.5 bg-white/20'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
