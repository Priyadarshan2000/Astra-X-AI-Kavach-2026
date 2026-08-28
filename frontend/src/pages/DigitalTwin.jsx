import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cpu, Radio, Shield, Truck } from 'lucide-react'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import MissionStrip from '../components/ui/MissionStrip.jsx'
import { DIGITAL_TWINS } from '../data/twins.js'
import { SAMPLE_CODE } from '../data/mock.js'
import { useMission } from '../context/MissionContext.jsx'

const ICONS = { comms: Radio, drone: Cpu, logistics: Truck, auth: Shield }

export default function DigitalTwin() {
  const { selectTwin, mission } = useMission()
  const [open, setOpen] = useState(null)
  const navigate = useNavigate()
  const active = DIGITAL_TWINS.find((t) => t.id === open)

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader kicker="Simulation mesh" title="DIGITAL TWINS" detail="Four contested military systems. Select a twin to arm the scan corpus." />
      <MissionStrip />
      <div className="grid gap-6 md:grid-cols-2">
        {DIGITAL_TWINS.map((twin, i) => {
          const Icon = ICONS[twin.id]
          const selected = mission.twin?.id === twin.id
          const tones = ['cyan', 'violet', 'magenta', 'yellow']
          return (
            <GlassPanel key={twin.id} delay={i * 0.08} tone={tones[i]} className={`p-6 ${selected ? 'is-selected' : ''}`}>
              <div className="flex items-start justify-between">
                <Icon className="h-8 w-8 text-mist" />
                <span className="sticker sticker-magenta">{twin.status}</span>
              </div>
              <h2 className="mt-4 font-display text-lg tracking-widest text-mist">{twin.name}</h2>
              <p className="mt-1 text-xs uppercase tracking-widest text-amber">{twin.unit}</p>
              <p className="mt-3 text-sm text-fog">{twin.description}</p>
              <div className="mt-5 h-3 overflow-hidden rounded-md border-[2.5px] border-ink bg-abyss shadow-[3px_3px_0_#ff2e97]">
                <div className="h-full bg-gradient-to-r from-amber to-magenta" style={{ width: `${twin.threat}%` }} />
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-widest text-fog">Threat index {twin.threat}</p>
              <div className="mt-5">
                <NeonButton
                  onClick={() => {
                    selectTwin(twin)
                    setOpen(twin.id)
                  }}
                >
                  Simulate
                </NeonButton>
              </div>
            </GlassPanel>
          )
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-void/88 p-6"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass-strong max-w-2xl rounded-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="hud-label">{active.unit}</p>
              <h3 className="mt-2 font-display text-2xl tracking-widest text-mist">{active.name}</h3>
              <p className="mt-3 text-fog">{active.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {active.telemetry.map((t) => (
                  <span key={t} className="rounded-lg border-[2.5px] border-ink bg-amber px-3 py-1 text-xs text-ink shadow-[2px_2px_0_#ff2e97]">
                    {t}
                  </span>
                ))}
              </div>
              <pre className="mt-5 max-h-40 overflow-auto rounded-xl bg-code p-4 text-[11px] text-cyan/80">
                {(SAMPLE_CODE[active.language] || '').slice(0, 420)}
              </pre>
              <div className="mt-6 flex gap-3">
                <NeonButton onClick={() => navigate('/scan')}>Arm Scan</NeonButton>
                <NeonButton variant="ghost" onClick={() => setOpen(null)}>
                  Close
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
