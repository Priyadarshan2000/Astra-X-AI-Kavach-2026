import { Check, ChevronRight, Cpu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NeonButton from './NeonButton.jsx'
import { useMission } from '../../context/MissionContext.jsx'
import { loopSteps, nextAction } from '../../lib/missionLoop.js'

export default function MissionStrip() {
  const { mission } = useMission()
  const navigate = useNavigate()
  const loop = loopSteps(mission)
  const next = nextAction(mission)
  const currentIdx = loop.findIndex((step) => !step.done)

  return (
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
  )
}
