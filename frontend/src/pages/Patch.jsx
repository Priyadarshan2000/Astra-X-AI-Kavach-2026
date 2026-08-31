import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import MissionStrip from '../components/ui/MissionStrip.jsx'
import CodePane from '../components/code/CodePane.jsx'
import PatchExplanation from '../components/patch/PatchExplanation.jsx'
import { generatePatch } from '../data/mock.js'
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

async function fetchExplanation(source, patch, language, findings) {
  try {
    const data = await api.explainPatch({
      original: source,
      patched: patch.patched,
      language,
      notes: patch.notes,
      findings: findings || [],
    })
    return data
  } catch {
    return null
  }
}

export default function Patch() {
  const { mission, setMission } = useMission()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [explainLoading, setExplainLoading] = useState(false)
  const patch = mission.patch
  const highlights = useMemo(
    () => (patch ? changedLines(mission.source, patch.patched) : []),
    [mission.source, patch],
  )

  const generate = async () => {
    setBusy(true)
    setExplainLoading(true)

    let nextPatch = null

    try {
      if (token && token !== 'demo-jwt-token') {
        const data = await api.patch(
          {
            code: mission.source,
            language: mission.language,
            findings: mission.scan?.findings || [],
          },
          token,
        )
        nextPatch = {
          patched: data.patched,
          notes: data.notes,
          confidence: data.confidence,
          riskReduction: data.riskReduction,
          impact: data.impact,
          explanation: data.explanation,
        }
      }
    } catch {
      /* fall through to local synthesis */
    }

    if (!nextPatch) {
      nextPatch = generatePatch(mission.source, mission.language)
    }

    if (!nextPatch.explanation) {
      const explanation = await fetchExplanation(
        mission.source,
        nextPatch,
        mission.language,
        mission.scan?.findings,
      )
      if (explanation) nextPatch.explanation = explanation
    }

    setMission((m) => ({ ...m, patch: nextPatch }))
    setBusy(false)
    setExplainLoading(false)
  }

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader kicker="Defensive rewrite" title="SECURE PATCH" detail="Original corpus on the left. Hardened synthesis on the right." />
      <MissionStrip />
      <div className="mb-6 flex flex-wrap gap-3">
        <NeonButton onClick={generate} disabled={busy}>
          {busy ? 'Synthesizing…' : 'Synthesize Patch'}
        </NeonButton>
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
            <p className="hud-label mb-3">ASTRA-X analysis</p>
            <PatchExplanation
              explanation={patch.explanation}
              loading={explainLoading}
              fallbackNotes={patch.notes}
            />
          </GlassPanel>
        </div>
      )}
    </main>
  )
}
