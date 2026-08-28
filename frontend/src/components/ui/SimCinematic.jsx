import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Cpu, Radio, Lock } from 'lucide-react'
import NeonButton from './NeonButton.jsx'
import ThreatRadar from '../effects/ThreatRadar.jsx'

const SCENES = [
  {
    id: 'mesh',
    n: '01',
    title: 'TWIN MESH ARMED',
    copy: 'Secure Communication gateway synchronized across contested spectrum.',
    icon: Radio,
  },
  {
    id: 'scan',
    n: '02',
    title: 'STATIC INTELLIGENCE',
    copy: 'CWE-120 · CWE-78 · CWE-134 mapped. Confidence 94%.',
    icon: Cpu,
  },
  {
    id: 'patch',
    n: '03',
    title: 'PATCH SYNTHESIS',
    copy: 'Bounded rewrite locked. Risk reduced 78%. Exec path removed.',
    icon: ShieldCheck,
  },
  {
    id: 'hold',
    n: '04',
    title: 'DEFENCE HOLD',
    copy: 'Fuzz corpus rejected. Five tactical suites certified green.',
    icon: Lock,
  },
]

export default function SimCinematic({ onClose, onLaunch }) {
  const [idx, setIdx] = useState(0)
  const scene = SCENES[idx]
  const Icon = scene.icon
  const done = idx === SCENES.length - 1

  useEffect(() => {
    if (done) return undefined
    const t = setTimeout(() => setIdx((i) => Math.min(i + 1, SCENES.length - 1)), 2100)
    return () => clearTimeout(t)
  }, [idx, done])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] grid place-items-center bg-void/90 p-5"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-strong relative w-full max-w-2xl rounded-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="scan-y" />
        <div className="mb-6 flex items-center justify-between">
          <p className="hud-label">Live simulation</p>
          <span className="font-display text-[10px] tracking-[0.3em] text-violet">SCENE {scene.n} / 04</span>
        </div>

        <div className="grid items-center gap-6 md:grid-cols-[180px_1fr]">
          <div className="relative mx-auto h-40 w-40">
            {idx === 0 && <ThreatRadar className="h-full w-full" />}
            {idx > 0 && (
              <div className="grid h-full place-items-center rounded-2xl border-[2.5px] border-void bg-cyan text-void shadow-[8px_8px_0_#ff2e97]">
                <Icon className="h-14 w-14" />
              </div>
            )}
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display text-2xl tracking-[0.16em] text-mist text-glow">{scene.title}</h3>
                <p className="mt-3 text-fog">{scene.copy}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 h-3 overflow-hidden rounded-md border-[2.5px] border-void bg-panel shadow-[3px_3px_0_#8b5cff]">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan via-amber to-magenta"
                initial={{ width: 0 }}
                animate={{ width: `${((idx + 1) / SCENES.length) * 100}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <NeonButton onClick={onLaunch}>Enter Command Deck</NeonButton>
          <NeonButton variant="ghost" onClick={onClose}>
            Close
          </NeonButton>
        </div>
      </motion.div>
    </motion.div>
  )
}
