import { motion } from 'framer-motion'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import ThreatRadar from '../components/effects/ThreatRadar.jsx'
import AttackMap from '../components/effects/AttackMap.jsx'
import ConfidenceGauge from '../components/dashboard/ConfidenceGauge.jsx'
import MissionTimeline from '../components/dashboard/MissionTimeline.jsx'
import SystemHealth from '../components/dashboard/SystemHealth.jsx'
import ActiveAlerts from '../components/dashboard/ActiveAlerts.jsx'
import { useMission } from '../context/MissionContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Shield } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { mission } = useMission()
  const score = mission.scan?.score ?? 74

  return (
    <main className="relative mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader
        kicker="Security operations center"
        title="COMMAND DECK"
        detail={`Operator ${user?.name} // twin ${mission.twin?.name}`}
        extra={
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass pop-yellow flex items-center gap-3 rounded-xl px-4 py-2"
          >
            <Shield className="h-4 w-4 text-cyan" />
            <span className="font-display text-xs tracking-widest text-cyan">SECURITY SCORE {score}</span>
            <span className="live-dot" />
          </motion.div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <GlassPanel className="p-5 lg:col-span-4" delay={0.04} tone="cyan">
          <p className="hud-label mb-3">Live threat radar</p>
          <ThreatRadar className="mx-auto h-64 w-64" />
        </GlassPanel>
        <GlassPanel className="p-5 lg:col-span-5" delay={0.1} tone="violet">
          <p className="hud-label mb-3">Global attack map</p>
          <AttackMap className="h-64" idPrefix="deck" />
        </GlassPanel>
        <GlassPanel className="grid place-items-center p-5 lg:col-span-3" delay={0.14} hover={false} tone="magenta">
          <ConfidenceGauge value={mission.patch ? 96 : 91} />
        </GlassPanel>
        <GlassPanel className="p-5 lg:col-span-4" delay={0.18} tone="yellow">
          <p className="hud-label mb-4">Mission timeline</p>
          <MissionTimeline />
        </GlassPanel>
        <GlassPanel className="p-5 lg:col-span-4" delay={0.22} tone="cyan">
          <p className="hud-label mb-4">System health</p>
          <SystemHealth />
        </GlassPanel>
        <GlassPanel className="p-5 lg:col-span-4" delay={0.26} tone="magenta">
          <p className="hud-label mb-4">Active alerts</p>
          <ActiveAlerts />
        </GlassPanel>
      </div>
    </main>
  )
}
