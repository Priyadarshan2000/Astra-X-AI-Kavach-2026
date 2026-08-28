import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import CodePane from '../components/code/CodePane.jsx'
import { useMission } from '../context/MissionContext.jsx'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

function changedLines(a = '', b = '') {
  const left = a.split('\n')
  const right = b.split('\n')
  const hits = []
  right.forEach((line, i) => {
    if (left[i] !== line) hits.push(i + 1)
  })
  return hits
}

export default function Patch() {
  const { mission, runPatch } = useMission()
  const { token } = useAuth()
  const navigate = useNavigate()
  const patch = mission.patch
  const highlights = useMemo(
    () => (patch ? changedLines(mission.source, patch.patched) : []),
    [mission.source, patch],
  )

  const generate = async () => {
    try {
      if (token && token !== 'demo-jwt-token') {
        await api.patch({ code: mission.source, language: mission.language }, token)
      }
    } catch {
      /* local synthesis remains the source of truth for the demo deck */
    }
    runPatch()
  }

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader kicker="Defensive rewrite" title="SECURE PATCH" detail="Original corpus on the left. Hardened synthesis on the right." />
      <div className="mb-6 flex flex-wrap gap-3">
        <NeonButton onClick={generate}>Synthesize Patch</NeonButton>
        {patch && <NeonButton variant="ghost" onClick={() => navigate('/fuzz')}>Run Fuzz Campaign</NeonButton>}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CodePane code={mission.source} language={mission.language} label="Original corpus" />
        <CodePane
          code={patch?.patched || '// Awaiting synthesis'}
          language={mission.language}
          label="Hardened patch"
          highlightLines={highlights}
        />
      </div>
      {patch && (
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <GlassPanel className="p-5" tone="cyan">
            <p className="hud-label">Patch confidence</p>
            <p className="mt-2 font-display text-3xl text-cyan">{Math.round(patch.confidence * 100)}%</p>
          </GlassPanel>
          <GlassPanel className="p-5" tone="violet">
            <p className="hud-label">Risk reduction</p>
            <p className="mt-2 font-display text-3xl text-emerald">{patch.riskReduction}%</p>
          </GlassPanel>
          <GlassPanel className="p-5" tone="magenta">
            <p className="hud-label">Estimated impact</p>
            <p className="mt-2 text-mist">{patch.impact}</p>
          </GlassPanel>
          <GlassPanel className="p-5 md:col-span-3" hover={false} tone="yellow">
            <p className="hud-label mb-3">AI explanation</p>
            <ul className="space-y-2 text-sm text-fog">
              {(patch.notes || []).map((n) => (
                <li key={n} className="border-l-[3px] border-amber pl-3">
                  {n}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      )}
    </main>
  )
}
