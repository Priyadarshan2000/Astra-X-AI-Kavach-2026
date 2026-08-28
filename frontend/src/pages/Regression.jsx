import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, CircleDashed } from 'lucide-react'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import MissionStrip from '../components/ui/MissionStrip.jsx'
import { simulateRegression } from '../data/mock.js'
import { useMission } from '../context/MissionContext.jsx'

export default function Regression() {
  const { runRegression, mission } = useMission()
  const navigate = useNavigate()
  const [rows, setRows] = useState(simulateRegression().map((t) => ({ ...t, status: 'pending' })))
  const [done, setDone] = useState(false)

  const run = async () => {
    const pending = simulateRegression().map((t) => ({ ...t, status: 'pending' }))
    setRows(pending)
    setDone(false)
    for (let i = 0; i < pending.length; i += 1) {
      await new Promise((r) => setTimeout(r, 520))
      setRows((cur) => cur.map((row, idx) => (idx === i ? { ...row, status: 'pass' } : row)))
    }
    runRegression()
    setDone(true)
  }

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader kicker="Certification suite" title="REGRESSION LOCK" detail="Five tactical suites. Each animates from pending to pass." />
      <MissionStrip />
      <div className="mb-6">
        <NeonButton onClick={run}>Execute Tests</NeonButton>
      </div>
      <div className="mt-6 space-y-3">
        {rows.map((row, i) => (
          <GlassPanel key={row.id} className="flex items-center justify-between p-5" hover={false} tone={['cyan', 'violet', 'magenta', 'yellow', 'cyan'][i]}>
            <div className="flex items-center gap-4">
              {row.status === 'pass' ? (
                <CheckCircle2 className="h-6 w-6 text-emerald" />
              ) : (
                <CircleDashed className="h-6 w-6 animate-spin text-cyan" />
              )}
              <div>
                <p className="font-display text-sm tracking-widest text-mist">{row.name}</p>
                <p className="text-sm text-fog">{row.detail}</p>
              </div>
            </div>
            <span className={`sticker ${row.status === 'pass' ? 'sticker-yellow' : ''}`}>
              {row.status === 'pass' ? `PASS · ${row.latency}ms` : 'PENDING'}
            </span>
          </GlassPanel>
        ))}
      </div>
      {done && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-emerald">All five tactical suites certified. Report {mission.report?.id} staged.</p>
          <NeonButton onClick={() => navigate('/reports')}>Open Mission Report</NeonButton>
        </div>
      )}
    </main>
  )
}
