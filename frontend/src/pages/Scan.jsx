import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileCode2, Brain } from 'lucide-react'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import MissionStrip from '../components/ui/MissionStrip.jsx'
import { languageFromName, SAMPLE_CODE, sampleFileName } from '../data/mock.js'
import { useMission } from '../context/MissionContext.jsx'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

const STEPS = ['Rotating scanner', 'Digital waveform', 'Code streaming', 'AI reasoning']

export default function Scan() {
  const inputRef = useRef(null)
  const { mission, ingestSource, runScan } = useMission()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [drag, setDrag] = useState(false)
  const [phase, setPhase] = useState(-1)
  const [busy, setBusy] = useState(false)

  const preview = useMemo(() => mission.source.split('\n').slice(0, 18).join('\n'), [mission.source])

  const acceptFile = async (file) => {
    const text = await file.text()
    ingestSource({ source: text, language: languageFromName(file.name), fileName: file.name })
  }

  const startScan = async () => {
    setBusy(true)
    setPhase(0)
    for (let i = 0; i < STEPS.length; i += 1) {
      setPhase(i)
      await new Promise((r) => setTimeout(r, 700))
    }
    try {
      if (token && token !== 'demo-jwt-token') {
        await api.scan({ code: mission.source, language: mission.language, fileName: mission.fileName }, token)
      }
      runScan()
    } catch {
      runScan()
    }
    setBusy(false)
    setPhase(STEPS.length)
  }

  const findings = mission.scan?.findings || []

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader kicker="Static intelligence" title="SOURCE SCAN" detail="Drop source or load a lab sample. ASTRA maps CWE classes with confidence scoring." />
      <MissionStrip />
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-6" hover={false} tone="cyan">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDrag(true)
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDrag(false)
              const file = e.dataTransfer.files?.[0]
              if (file) acceptFile(file)
            }}
            className={`grid min-h-[220px] place-items-center rounded-2xl border-[2.5px] border-dashed transition-all duration-200 ${
              drag ? 'border-amber bg-amber/10 shadow-[6px_6px_0_#ff2e97]' : 'border-cyan'
            }`}
          >
            <div className="text-center">
              <Upload className="mx-auto mb-3 h-8 w-8 text-cyan" />
              <p className="text-mist">Drop C / C++ / Python / Java / JS</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-2 text-sm text-cyan underline"
              >
                or browse a file
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".c,.h,.cpp,.cc,.cxx,.hpp,.py,.java,.js,.mjs,.jsx"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && acceptFile(e.target.files[0])}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.keys(SAMPLE_CODE).map((lang) => (
              <button
                key={lang}
                onClick={() => ingestSource({ source: SAMPLE_CODE[lang], language: lang, fileName: sampleFileName(lang) })}
                className="rounded-lg border-[2.5px] border-ink bg-cyan px-3 py-1 text-xs uppercase tracking-widest text-ink shadow-[3px_3px_0_#ff2e97] transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Load {lang}
              </button>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6" hover={false} tone="violet">
          <div className="mb-3 flex items-center justify-between">
            <p className="hud-label">File preview</p>
            <span className="flex items-center gap-2 text-xs text-fog">
              <FileCode2 className="h-4 w-4 text-cyan" />
              {mission.fileName} · {mission.language}
            </span>
          </div>
          <pre className="viz-well !min-h-0 max-h-64 overflow-auto p-4 text-[12px] leading-6 text-cyan/90">{preview}</pre>
          <div className="mt-5">
            <NeonButton onClick={startScan}>{busy ? 'Scanning…' : 'Initiate Scan'}</NeonButton>
          </div>
        </GlassPanel>
      </div>

      {phase >= 0 && (
        <GlassPanel className="mt-6 p-6" hover={false} tone="yellow">
          <div className="relative h-24 overflow-hidden rounded-xl bg-code">
            <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-cyan/30 to-transparent" style={{ animation: 'scan-beam 1.6s linear infinite' }} />
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-cyan">
              <Brain className="h-5 w-5 animate-flicker" />
              <span className="font-display text-xs tracking-[0.3em]">{STEPS[Math.min(phase, STEPS.length - 1)]}</span>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step} className={`rounded-lg border-[2.5px] px-3 py-2 text-xs ${i <= phase ? 'border-ink bg-amber text-ink shadow-[3px_3px_0_#ff2e97]' : 'border-cyan/40 text-fog'}`}>
                {step}
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {findings.length > 0 && (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {findings.map((f, idx) => (
            <GlassPanel key={f.id} className="p-5" tone={['cyan', 'violet', 'magenta', 'yellow'][idx % 4]}>
              <div className="flex items-center justify-between gap-2">
                <span className={`sticker sev-${f.severity}`}>{f.severity}</span>
                <span className="sticker sticker-violet">{f.cwe}</span>
              </div>
              <h3 className="mt-3 text-lg text-mist">{f.title}</h3>
              <p className="mt-1 text-sm text-fog">Line {f.line} · Risk {f.risk} · Confidence {Math.round(f.confidence * 100)}%</p>
              <p className="mt-3 text-sm text-mist/80">{f.fix}</p>
            </GlassPanel>
          ))}
          <div className="md:col-span-2">
            <NeonButton onClick={() => navigate('/patch')}>Generate Secure Patch</NeonButton>
          </div>
        </div>
      )}
    </main>
  )
}
