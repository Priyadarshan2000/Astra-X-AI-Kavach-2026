import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import MissionStrip from '../components/ui/MissionStrip.jsx'
import ThreatRadar from '../components/effects/ThreatRadar.jsx'
import AttackMap from '../components/effects/AttackMap.jsx'
import ConfidenceGauge from '../components/dashboard/ConfidenceGauge.jsx'
import MissionTimeline from '../components/dashboard/MissionTimeline.jsx'
import SystemHealth from '../components/dashboard/SystemHealth.jsx'
import ActiveAlerts from '../components/dashboard/ActiveAlerts.jsx'
import { useMission } from '../context/MissionContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { ALERTS } from '../data/mock.js'

export default function Dashboard() {
  const { user } = useAuth()
  const { mission } = useMission()
  const score = mission.scan?.score ?? 74
  const twin = mission.twin?.name || 'No twin armed'
  const confidence = mission.patch ? 96 : 91
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

      <MissionStrip />

      <div className="grid gap-6 pb-2 lg:grid-cols-12">
        <GlassPanel className="flex min-h-[360px] flex-col p-5 lg:col-span-4" delay={0.04} tone="cyan">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="hud-label">Live threat radar</p>
              <p className="mt-1 font-display text-[8px] tracking-[0.2em] text-fog">DELHI SECTOR · 250 KM</p>
            </div>
            <span className="sticker sticker-yellow">7 TRACKS</span>
          </div>
          <div className="viz-well viz-well-tactical grid flex-1 place-items-center p-2">
            <ThreatRadar className="h-full w-full max-h-60 max-w-60" idPrefix="deck" />
          </div>
        </GlassPanel>
        <GlassPanel className="flex min-h-[360px] flex-col p-5 lg:col-span-5" delay={0.1} tone="violet">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <p className="hud-label">Indo-Pac threat fabric</p>
              <p className="mt-1 font-display text-[8px] tracking-[0.2em] text-fog">INBOUND HOPS → BHARAT HQ</p>
            </div>
            <span className="sticker sticker-magenta">6 HOPS</span>
          </div>
          <div className="viz-well viz-well-tactical flex-1 p-2">
            <AttackMap className="h-full min-h-[220px]" idPrefix="deck" />
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
