import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Radio, Cpu, ShieldCheck, Lock, MapPin, X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import NeonButton from './NeonButton.jsx'
import IndiaMap from '../effects/IndiaMap.jsx'
import ThreatRadar from '../effects/ThreatRadar.jsx'
import { MISSION_SCENES } from '../../data/landing.js'

gsap.registerPlugin(useGSAP)

const ICONS = [Radio, Cpu, ShieldCheck, ShieldCheck, Lock]

export default function SimCinematic({ onClose, onLaunch }) {
  const root = useRef(null)
  const [idx, setIdx] = useState(0)
  const [logCount, setLogCount] = useState(0)
  const [playing, setPlaying] = useState(true)
  const scene = MISSION_SCENES[idx]
  const Icon = ICONS[idx]
  const done = idx === MISSION_SCENES.length - 1

  useGSAP(
    () => {
      gsap.from('.sim-panel', { y: 28, autoAlpha: 0, duration: 0.55, ease: 'power3.out' })
      gsap.from('.sim-tricolor', { scaleX: 0, duration: 0.6, ease: 'power3.out' })
    },
    { scope: root },
  )

  useEffect(() => {
    setLogCount(0)
    const lines = scene.logs.length
    const step = setInterval(() => {
      setLogCount((c) => {
        if (c >= lines) {
          clearInterval(step)
          return c
        }
        return c + 1
      })
    }, 520)
    return () => clearInterval(step)
  }, [idx, scene.logs.length])

  useEffect(() => {
    if (!playing || done) return undefined
    const t = setTimeout(() => setIdx((i) => Math.min(i + 1, MISSION_SCENES.length - 1)), 4200)
    return () => clearTimeout(t)
  }, [idx, done, playing])

  const advance = () => {
    if (done) return
    setIdx((i) => Math.min(i + 1, MISSION_SCENES.length - 1))
  }

  return (
    <motion.div
      ref={root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="sim-overlay fixed inset-0 z-[70] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Mission briefing simulation"
    >
      <div className="sim-tricolor" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgb(0_200_220_/_0.18),transparent_55%),radial-gradient(ellipse_at_100%_100%,rgb(255_46_151_/_0.1),transparent_50%),var(--void)]" />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="hud-label">
              <span className="live-dot inline-block align-middle" /> Kavach 2026 mission drill
            </p>
            <p className="hindi-kicker mt-2">भारतीय सेना — साइबर मिशन ब्रीफिंग</p>
            <h2 className="mt-1 font-display text-xl tracking-[0.14em] text-mist sm:text-2xl">LIVE OPERATION WALKTHROUGH</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-[2.5px] border-ink bg-panel p-2 text-mist shadow-[3px_3px_0_#ff2e97] transition hover:-translate-x-0.5 hover:-translate-y-0.5"
            aria-label="Close briefing"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="sim-panel grid flex-1 gap-5 lg:grid-cols-12">
          <div className="glass pop-cyan widget-ticks rounded-2xl p-4 lg:col-span-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="hud-label">Bharat defence mesh</span>
              <span className="sticker sticker-yellow">{scene.node.toUpperCase()}</span>
            </div>
            <div className="viz-well !min-h-0 grid place-items-center p-2">
              <IndiaMap progress={scene.progress} className="h-[min(38vh,300px)] w-full" />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-fog">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan" />
              <span>
                Active node: <strong className="text-mist">{scene.node}</strong> — national grid {scene.progress}%
              </span>
            </div>
            {idx === 2 ? (
              <div className="mt-3 grid place-items-center rounded-xl border-[2px] border-ink bg-field/80 p-2">
                <ThreatRadar className="h-24 w-24" idPrefix="sim" />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="glass pop-violet widget-ticks rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-[10px] tracking-[0.24em] text-violet">{scene.phase}</span>
                <span className="sticker sticker-yellow">SCENE {scene.n} / 05</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="mt-4"
                >
                  <p className="hindi-kicker text-sm">{scene.hindi}</p>
                  <div className="mt-2 flex items-start gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border-[2.5px] border-ink bg-cyan text-ink shadow-[4px_4px_0_#ff2e97]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl tracking-[0.12em] text-mist sm:text-2xl">{scene.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-fog">{scene.copy}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 h-2.5 overflow-hidden rounded-md border-[2.5px] border-ink bg-panel shadow-[3px_3px_0_#8b5cff]">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ff9933] via-[#ffe44d] to-[#138808]"
                  animate={{ width: `${((idx + 1) / MISSION_SCENES.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="sim-terminal flex-1 rounded-2xl border-[2.5px] border-ink bg-code p-4 shadow-[6px_6px_0_#00c8dc]">
              <div className="mb-3 flex items-center justify-between border-b border-cyan/30 pb-2">
                <span className="font-display text-[9px] tracking-[0.2em] text-cyan">ASTRA-X // TACTICAL LOG</span>
                <span className="live-dot" />
              </div>
              <div className="sim-log space-y-1.5 font-mono text-[11px] leading-relaxed sm:text-xs">
                {scene.logs.slice(0, logCount).map((line) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-emerald"
                  >
                    {line}
                  </motion.p>
                ))}
                {logCount < scene.logs.length ? (
                  <span className="inline-block h-3 w-2 animate-pulse bg-cyan" />
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {MISSION_SCENES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setPlaying(false)
                    setIdx(i)
                  }}
                  className={`rounded-lg border-[2px] border-ink px-2.5 py-1 font-display text-[9px] tracking-[0.14em] transition ${
                    i === idx
                      ? 'bg-amber text-ink shadow-[2px_2px_0_#ff2e97]'
                      : i < idx
                        ? 'bg-emerald/20 text-mist'
                        : 'bg-panel text-fog'
                  }`}
                >
                  {s.n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sim-panel mt-5 flex flex-wrap items-center justify-between gap-3 border-t-[2px] border-ink/10 pt-5">
          <p className="max-w-md text-xs text-fog">
            {done
              ? 'Mission drill complete. Enter the command deck to run the live twin → scan → patch loop.'
              : playing
                ? 'Auto-advancing through Army cyber certification phases…'
                : 'Manual control — advance or jump to any phase.'}
          </p>
          <div className="flex flex-wrap gap-3">
            {!done ? (
              <>
                <NeonButton variant="ghost" onClick={() => setPlaying((p) => !p)}>
                  {playing ? 'Pause' : 'Resume'}
                </NeonButton>
                <NeonButton onClick={advance}>
                  <span className="inline-flex items-center gap-2">
                    Next phase <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </NeonButton>
              </>
            ) : (
              <NeonButton onClick={onLaunch}>Enter Command Deck</NeonButton>
            )}
            <NeonButton variant="ghost" onClick={onClose}>
              Close
            </NeonButton>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
