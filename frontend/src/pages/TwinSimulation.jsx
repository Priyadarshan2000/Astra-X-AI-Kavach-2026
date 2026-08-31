import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Radar, Cpu, Network } from 'lucide-react'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import { DEFENCE_NODES } from '../data/twinNetwork.js'
import { useNavigate } from 'react-router-dom'

const ICONS = { command: Network, drone: Cpu, radar: Radar, iot: Radio }

export default function TwinSimulation() {
  const [active, setActive] = useState(null)
  const node = DEFENCE_NODES.find((n) => n.id === active)
  const navigate = useNavigate()

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader
        kicker="Bharat defence mesh"
        title="DEFENCE DIGITAL TWIN SIMULATION"
        detail="Military command network, drone comms, radar systems, and battlefield IoT — click each node for threat analysis."
      />

      <GlassPanel className="relative mt-8 min-h-[420px] p-6" tone="cyan" hover={false}>
        <p className="hud-label mb-4">Theatre topology — click a node</p>
        <div className="relative mx-auto aspect-[16/10] max-w-3xl rounded-xl border-[2.5px] border-ink bg-code">
          <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
            {DEFENCE_NODES.map((n, i) =>
              DEFENCE_NODES.slice(i + 1).map((m) => (
                <line
                  key={`${n.id}-${m.id}`}
                  x1={`${n.x}%`}
                  y1={`${n.y}%`}
                  x2={`${m.x}%`}
                  y2={`${m.y}%`}
                  stroke="#00e5ff"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )),
            )}
          </svg>
          {DEFENCE_NODES.map((n) => {
            const Icon = ICONS[n.icon] || Network
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setActive(n.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border-[2.5px] p-3 transition ${
                  active === n.id
                    ? 'border-amber bg-amber text-ink shadow-[4px_4px_0_#ff2e97]'
                    : 'border-cyan bg-panel text-cyan shadow-[3px_3px_0_#8b5cff] hover:-translate-y-1'
                }`}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <Icon className="h-5 w-5" />
                <p className="mt-1 whitespace-nowrap font-display text-[8px] tracking-widest">{n.label}</p>
              </button>
            )
          })}
        </div>
      </GlassPanel>

      <AnimatePresence mode="wait">
        {node && (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            <GlassPanel className="p-5" tone="magenta">
              <p className="hud-label">Threat detected</p>
              <p className="mt-2 text-sm text-mist">{node.threat}</p>
            </GlassPanel>
            <GlassPanel className="p-5" tone="violet">
              <p className="hud-label">AI reasoning</p>
              <p className="mt-2 text-sm text-fog">{node.reasoning}</p>
            </GlassPanel>
            <GlassPanel className="p-5" tone="cyan">
              <p className="hud-label">Recommended action</p>
              <p className="mt-2 text-sm text-fog">{node.action}</p>
              <NeonButton className="mt-4" onClick={() => navigate('/scan')}>Arm Scan</NeonButton>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
