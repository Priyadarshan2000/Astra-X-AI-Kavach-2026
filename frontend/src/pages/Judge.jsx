import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import ArchitectureViz from '../components/architecture/ArchitectureViz.jsx'
import { COMPARISON_TABLE, JUDGE_CHECKLIST, ROADMAP } from '../data/judge.js'
import { VULN_CARDS, AI_PIPELINE } from '../data/vulnerabilities.js'

const GITHUB = 'https://github.com/Priyadarshan2000/Astra-X-AI-Kavach-2026'
const API = 'https://tan-hummingbird-842514.hostingersite.com/health.php'

export default function Judge() {
  const [checked, setChecked] = useState({})
  const navigate = useNavigate()

  const toggle = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }))
  const score = JUDGE_CHECKLIST.filter((i) => checked[i.id]).length

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader
        kicker="Kavach 2026 evaluator mode"
        title="WHY ASTRA-X MATTERS"
        detail="Defence relevance, operational workflow, comparison matrix, and interactive evaluation checklist."
      />

      <GlassPanel className="mt-8 p-6" tone="yellow" hover={false}>
        <p className="hud-label">Evaluator score</p>
        <p className="mt-2 font-display text-4xl text-mist">{score} / {JUDGE_CHECKLIST.length}</p>
        <p className="mt-2 text-sm text-fog">Check each item as you verify the platform during your walkthrough.</p>
      </GlassPanel>

      <div className="mt-6 grid gap-3">
        {JUDGE_CHECKLIST.map((item) => (
          <div
            key={item.id}
            className={`flex w-full items-start gap-3 rounded-xl border-[2.5px] p-4 ${
              checked[item.id] ? 'border-cyan bg-cyan/10' : 'border-ink/20 bg-panel/60'
            }`}
          >
            <button type="button" onClick={() => toggle(item.id)} className="flex flex-1 items-start gap-3 text-left">
              {checked[item.id] ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-fog" />
              )}
              <div>
                <p className="font-display text-sm tracking-widest text-mist">{item.label}</p>
                <p className="mt-1 text-sm text-fog">{item.detail}</p>
              </div>
            </button>
            {item.route ? (
              <NeonButton variant="ghost" onClick={() => navigate(item.route)}>Open</NeonButton>
            ) : null}
          </div>
        ))}
      </div>

      <section className="mt-16">
        <p className="hud-label">Comparison matrix</p>
        <h2 className="mt-2 font-display text-2xl tracking-widest text-mist">ASTRA-X vs EXISTING TOOLS</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border-[2.5px] border-ink">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-amber text-ink">
              <tr>
                <th className="px-4 py-3 font-display tracking-widest">Capability</th>
                <th className="px-4 py-3 font-display tracking-widest">Existing Tools</th>
                <th className="px-4 py-3 font-display tracking-widest">ASTRA-X</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row) => (
                <tr key={row.capability} className="border-t border-ink/15 bg-panel/80">
                  <td className="px-4 py-3 font-medium text-mist">{row.capability}</td>
                  <td className="px-4 py-3 text-fog">{row.existing}</td>
                  <td className="px-4 py-3 text-cyan">{row.astra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <p className="hud-label">Platform architecture</p>
        <h2 className="mt-2 font-display text-2xl tracking-widest text-mist">INTERACTIVE LAYERS</h2>
        <div className="mt-6">
          <ArchitectureViz />
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {VULN_CARDS.map((v) => (
          <GlassPanel key={v.id} className="p-5" tone="violet">
            <p className="font-display text-sm tracking-widest text-mist">{v.title}</p>
            <p className="mt-1 text-[10px] text-cyan">{v.cwe}</p>
            <p className="mt-3 text-xs text-fog"><strong className="text-mist">Detect:</strong> {v.detect}</p>
            <p className="mt-2 text-xs text-fog"><strong className="text-mist">Patch:</strong> {v.patch}</p>
            <p className="mt-2 text-xs text-fog"><strong className="text-mist">Test:</strong> {v.test}</p>
          </GlassPanel>
        ))}
      </section>

      <section className="mt-16">
        <p className="hud-label">AI pipeline</p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {AI_PIPELINE.map((s) => (
            <GlassPanel key={s.step} className="p-4" tone="cyan">
              <p className="font-display text-lg text-amber">{s.step}</p>
              <p className="mt-2 font-display text-xs tracking-widest text-mist">{s.title}</p>
              <p className="mt-2 text-xs text-fog">{s.detail}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <p className="hud-label">Future roadmap</p>
        <div className="mt-4 space-y-3">
          {ROADMAP.map((r) => (
            <GlassPanel key={r.phase} className="p-4" tone="magenta">
              <p className="text-[10px] uppercase tracking-widest text-amber">{r.phase}</p>
              <p className="mt-1 font-display text-sm tracking-widest text-mist">{r.title}</p>
              <p className="mt-2 text-sm text-fog">{r.detail}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <NeonButton onClick={() => window.open(GITHUB, '_blank')}>
          <ExternalLink className="mr-1 inline h-4 w-4" /> GitHub Repository
        </NeonButton>
        <NeonButton variant="ghost" onClick={() => window.open(API, '_blank')}>Live API Health</NeonButton>
        <NeonButton variant="ghost" onClick={() => navigate('/demo')}>Demo Video Script</NeonButton>
      </div>
    </main>
  )
}
