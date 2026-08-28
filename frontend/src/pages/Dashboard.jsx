import { motion } from 'framer-motion'
import { Check, ChevronRight, Cpu, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import ThreatRadar from '../components/effects/ThreatRadar.jsx'
import AttackMap from '../components/effects/AttackMap.jsx'
import ConfidenceGauge from '../components/dashboard/ConfidenceGauge.jsx'
import MissionTimeline from '../components/dashboard/MissionTimeline.jsx'
import SystemHealth from '../components/dashboard/SystemHealth.jsx'
import ActiveAlerts from '../components/dashboard/ActiveAlerts.jsx'
import { useMission } from '../context/MissionContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { ALERTS } from '../data/mock.js'

function nextAction(mission) {
  if (mission.tests) return { to: '/reports', label: 'Open Report' }
  if (mission.fuzz) return { to: '/regression', label: 'Run Tests' }
  if (mission.patch) return { to: '/fuzz', label: 'Fuzz Twin' }
  if (mission.scan) return { to: '/patch', label: 'Synthesize Patch' }
  if (mission.twin) return { to: '/scan', label: 'Run Scan' }
  return { to: '/twin', label: 'Arm Twin' }
}

export default function Dashboard() {
  const { user } = useAuth()
  const { mission } = useMission()
  const navigate = useNavigate()
  const score = mission.scan?.score ?? 74
  const twin = mission.twin?.name || 'No twin armed'
  const confidence = mission.patch ? 96 : 91
  const next = nextAction(mission)
  const loop = [
    { key: 'twin', label: 'Twin', to: '/twin', done: Boolean(mission.twin) },
    { key: 'scan', label: 'Scan', to: '/scan', done: Boolean(mission.scan) },
    { key: 'patch', label: 'Patch', to: '/patch', done: Boolean(mission.patch) },
    { key: 'fuzz', label: 'Fuzz', to: '/fuzz', done: Boolean(mission.fuzz) },
  ]
  const currentIdx = loop.findIndex((step) => !step.done)
  const operator = user?.name && user.name.toLowerCase() !== 'operator' ? user.name : 'Command'

  return (
    <main className="relative mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader
        kicker="Security operations center"
        title="COMMAND DECK"
        detail="Live twin picture. Follow the loop — next action is highlighted."
        extra={
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-end gap-2"
          >
            <span className="sticker">{operator}</span>
            <span className="sticker sticker-violet">{twin}</span>
            <div className="score-chip">
              <Shield className="h-4 w-4" />
              <div>
                <p className="score-chip-kicker">Security</p>
                <p className="score-chip-value">{score}</p>
              </div>
              <span className="live-dot" />
            </div>
          </motion.div>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <p className="font-display text-[10px] tracking-[0.2em] text-fog">MISSION LOOP</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {loop.map((step, i) => {
            const state = step.done ? 'is-done' : i === currentIdx ? 'is-now' : 'is-wait'
            return (
              <div key={step.key} className="flex items-center gap-1.5">
                {i > 0 ? <span className="loop-rail" /> : null}
                <button type="button" className={`loop-step ${state}`} onClick={() => navigate(step.to)}>
                  {step.done ? <Check className="h-3 w-3" /> : <span className="loop-index">{i + 1}</span>}
                  {step.label}
                </button>
              </div>
            )
          })}
        </div>
        <NeonButton className="!px-4 !py-2" onClick={() => navigate(next.to)}>
          <span className="inline-flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5" /> {next.label}
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </NeonButton>
      </div>

      <div className="grid gap-6 pb-2 lg:grid-cols-12">
        <GlassPanel className="flex min-h-[340px] flex-col p-5 lg:col-span-4" delay={0.04} tone="cyan">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="hud-label">Live threat radar</p>
            <span className="sticker">7 TRACKS</span>
          </div>
          <div className="viz-well grid flex-1 place-items-center p-3">
            <ThreatRadar className="h-56 w-56" idPrefix="deck" />
          </div>
        </GlassPanel>
        <GlassPanel className="flex min-h-[340px] flex-col p-5 lg:col-span-5" delay={0.1} tone="violet">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="hud-label">Global attack map</p>
            <span className="sticker sticker-magenta">6 HOPS</span>
          </div>
          <div className="viz-well flex-1 p-3">
            <AttackMap className="h-56" idPrefix="deck" />
          </div>
        </GlassPanel>
        <GlassPanel className="flex min-h-[340px] flex-col p-5 lg:col-span-3" delay={0.14} hover={false} tone="magenta">
          <p className="hud-label mb-3">AI confidence</p>
          <div className="viz-well grid flex-1 place-items-center p-3">
            <ConfidenceGauge value={confidence} label={mission.patch ? 'PATCH HOLD' : 'SCAN HOLD'} />
          </div>
        </GlassPanel>
        <GlassPanel className="flex min-h-[300px] flex-col p-5 lg:col-span-4" delay={0.18} tone="yellow">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="hud-label">Mission timeline</p>
            <span className="sticker sticker-yellow">LIVE</span>
          </div>
          <div className="min-h-0 max-h-[280px] flex-1 overflow-y-auto pr-1">
            <MissionTimeline />
          </div>
        </GlassPanel>
        <GlassPanel className="flex min-h-[300px] flex-col p-5 lg:col-span-4" delay={0.22} tone="cyan">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="hud-label">System health</p>
            <span className="sticker">NOMINAL</span>
          </div>
          <SystemHealth />
        </GlassPanel>
        <GlassPanel className="flex min-h-[300px] flex-col p-5 lg:col-span-4" delay={0.26} tone="magenta">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="hud-label">Active alerts</p>
            <span className="sticker sticker-magenta">{ALERTS.length}</span>
          </div>
          <div className="min-h-0 max-h-[280px] flex-1 overflow-y-auto pb-1 pr-1">
            <ActiveAlerts />
          </div>
        </GlassPanel>
      </div>
    </main>
  )
}
