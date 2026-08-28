import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useMission } from '../../context/MissionContext.jsx'
import { nextAction } from '../../lib/missionLoop.js'

const TICK = [
  'DEFENSIVE HOLD ONLY',
  'NO LIVE TARGETING',
  'CWE CORPUS LOCKED',
  'TWIN MESH NOMINAL',
  'KAVACH 2026',
]

export default function StatusBar() {
  const { pathname } = useLocation()
  const { isAuthed } = useAuth()
  const { mission } = useMission()
  if (pathname === '/') return null

  const next = nextAction(mission)
  const twin = mission.twin?.name || 'No twin'
  const score = mission.scan?.score ?? '—'

  return (
    <div className="status-bar">
      <span className="live-dot shrink-0" />
      <span className="hidden shrink-0 sm:inline">{isAuthed ? 'Command online' : 'Clearance required'}</span>
      <div className="status-bar-tick">
        <div className="flex w-max gap-10">
          {[...TICK, ...TICK].map((item, i) => (
            <span key={`${item}-${i}`}>// {item}</span>
          ))}
        </div>
      </div>
      <span className="hidden shrink-0 md:inline">{twin}</span>
      <span className="hidden shrink-0 lg:inline">Score {score}</span>
      <span className="shrink-0">{next.label}</span>
    </div>
  )
}
