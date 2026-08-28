import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import MissionStrip from '../components/ui/MissionStrip.jsx'
import { useMission } from '../context/MissionContext.jsx'

export default function Fuzzing() {
  const { mission, runFuzz } = useMission()
  const navigate = useNavigate()
  const [stage, setStage] = useState('idle')
  const fuzz = mission.fuzz

  const run = async () => {
    setStage('before')
    await new Promise((r) => setTimeout(r, 900))
    runFuzz()
    setStage('after')
  }

  useEffect(() => {
    if (!mission.patch) return
  }, [mission.patch])

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader
        kicker="Autonomous attack simulation"
        title="FUZZ CAMPAIGN"
        detail="Lab-only replay against the original binary and the patched twin. No live targeting."
      />
      <MissionStrip />
      <div className="mb-6">
        <NeonButton onClick={run}>Engage Simulation</NeonButton>
      </div>
      {fuzz && (
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ['Attack counter', fuzz.attacks],
            ['Requests / sec', fuzz.rps],
            ['Crash attempts', stage === 'after' ? fuzz.after.crashes : fuzz.before.crashes],
            ['Defence hold', `${stage === 'after' ? fuzz.after.defence : fuzz.before.defence}%`],
          ].map(([label, value], i) => (
            <GlassPanel key={label} className="p-5" tone={['cyan', 'violet', 'magenta', 'yellow'][i]}>
              <p className="hud-label">{label}</p>
              <p className="mt-2 font-display text-2xl text-mist">{value}</p>
            </GlassPanel>
          ))}
        </div>
      )}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <GlassPanel className="p-5" hover={false} tone="magenta">
          <p className="hud-label mb-3">Before patch</p>
          <div className="mb-4 h-3 overflow-hidden rounded-md border-[2.5px] border-ink bg-panel shadow-[3px_3px_0_#ff2e97]">
            <div className="h-full bg-crimson" style={{ width: fuzz ? '92%' : '0%' }} />
          </div>
          <pre className="viz-well !min-h-0 min-h-48 p-4 text-[12px] leading-6 text-crimson/90">
            {(fuzz?.logBefore || ['[STANDBY] awaiting corpus']).join('\n')}
            <span className="ml-1 inline-block h-3 w-2 bg-crimson" style={{ animation: 'terminal-blink 1s step-end infinite' }} />
          </pre>
        </GlassPanel>
        <GlassPanel className="p-5" hover={false} tone="cyan">
          <p className="hud-label mb-3">After patch</p>
          <div className="mb-4 h-3 overflow-hidden rounded-md border-[2.5px] border-ink bg-panel shadow-[3px_3px_0_#22d3a6]">
            <div className="h-full bg-emerald" style={{ width: stage === 'after' ? '98%' : '0%' }} />
          </div>
          <pre className="viz-well !min-h-0 min-h-48 p-4 text-[12px] leading-6 text-emerald/90">
            {(stage === 'after' ? fuzz?.logAfter : ['[HOLD] patch not yet certified']).join('\n')}
          </pre>
        </GlassPanel>
      </div>
      {stage === 'after' && (
        <div className="mt-6">
          <NeonButton onClick={() => navigate('/regression')}>Open Regression Deck</NeonButton>
        </div>
      )}
    </main>
  )
}
