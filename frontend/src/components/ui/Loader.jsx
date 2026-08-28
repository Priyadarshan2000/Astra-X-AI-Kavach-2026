import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import IndiaMap, { NODES } from '../effects/IndiaMap.jsx'

gsap.registerPlugin(useGSAP)

const STAGES = [
  'Uplink Delhi command',
  'Mesh Mumbai gateway',
  'Twin Hyderabad core',
  'Scan Bengaluru lab',
  'Hold Chennai coast',
  'Grid Kolkata east',
  'Northeast Guwahati',
  'National grid locked',
]

export default function Loader({ progress = 0, label = 'ARMING ASTRA-X KERNEL' }) {
  const root = useRef(null)
  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor((Math.min(100, progress) / 100) * STAGES.length))]
  const nodesHot = Math.max(1, Math.round((Math.min(100, progress) / 100) * NODES.length))

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          if (context.conditions.reduce) {
            gsap.set('.boot-kicker, .boot-title, .india-map, .boot-copy, .boot-frame', { autoAlpha: 1, y: 0, scale: 1 })
            gsap.set('.india-stroke', { strokeDashoffset: 0 })
            return
          }

          gsap.set('.india-stroke', { strokeDasharray: 1, strokeDashoffset: 1 })

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.from('.boot-kicker', { y: 14, autoAlpha: 0, duration: 0.4 })
            .from('.boot-title', { y: 20, autoAlpha: 0, duration: 0.5 }, '-=0.18')
            .from('.boot-frame', { y: 18, autoAlpha: 0, scale: 0.96, duration: 0.55 }, '-=0.28')
            .to('.india-stroke', { strokeDashoffset: 0, duration: 1.35, ease: 'power2.inOut' }, '-=0.25')
            .from('.boot-node', { scale: 0, autoAlpha: 0, stagger: 0.07, duration: 0.32, transformOrigin: '50% 50%' }, '-=0.85')
            .from('.boot-copy', { y: 12, autoAlpha: 0, duration: 0.4 }, '-=0.7')
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="boot-screen">
      <div className="boot-tricolor" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="scanlines absolute inset-0" />
      <div className="noise absolute inset-0" />
      <div className="boot-orb boot-orb-a" />
      <div className="boot-orb boot-orb-b" />
      <div className="hud-corners" />
      <div className="hud-corners-tr" />
      <div className="hud-corners-bl" />

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-5 py-16">
        <p className="boot-kicker hud-label">
          <span className="live-dot inline-block align-middle" /> Kavach 2026 // Bharat cyber command
        </p>
        <h1 className="boot-title title-pop mt-4 text-center font-display text-4xl tracking-[0.16em] sm:text-5xl">ASTRA-X</h1>
        <p className="boot-kicker mt-2 font-display text-[10px] tracking-[0.28em] text-fog">NATIONAL DEFENCE GRID</p>

        <div className="boot-frame glass pop-cyan mt-7 w-full max-w-[420px] rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="hud-label">India mesh</span>
            <span className="sticker sticker-yellow">{nodesHot}/{NODES.length} NODES</span>
          </div>
          <div className="viz-well !min-h-0 grid place-items-center p-3">
            <IndiaMap progress={progress} className="h-[min(52vh,420px)] w-full" />
          </div>
        </div>

        <div className="boot-copy mt-7 w-full max-w-[420px]">
          <p className="hud-label mb-3 w-full text-center">{label}</p>
          <div className="h-3.5 overflow-hidden rounded-md border-[2.5px] border-ink bg-panel shadow-[4px_4px_0_#8b5cff]">
            <div
              className="h-full bg-gradient-to-r from-cyan via-amber to-magenta"
              style={{ width: `${Math.min(100, progress)}%`, transition: 'width 180ms linear' }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between font-display text-[10px] tracking-[0.2em]">
            <span className="text-amber">{Math.round(progress)}%</span>
            <span className="text-mist">{stage}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
