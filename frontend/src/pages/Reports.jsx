import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import { useMission } from '../context/MissionContext.jsx'
import { buildReport } from '../data/mock.js'

export default function Reports() {
  const { mission } = useMission()
  const report =
    mission.report ||
    buildReport({
      scan: mission.scan,
      patch: mission.patch,
      fuzz: mission.fuzz,
      tests: mission.tests,
      project: mission.twin?.name,
    })

  return (
    <main className="mx-auto max-w-4xl px-5 pb-16 pt-24">
      <PageHeader kicker="After-action" title="MISSION REPORT" />
      <GlassPanel className="p-0" hover={false} tone="cyan">
        <div className="border-b-[2.5px] border-cyan bg-magenta px-8 py-6">
          <p className="sticker sticker-yellow">{report.classification}</p>
          <h2 className="mt-3 font-display text-2xl text-white text-glow">{report.project}</h2>
          <p className="mt-1 text-sm text-white/80">
            Dossier {report.id} · {new Date(report.generatedAt).toUTCString()}
          </p>
        </div>
        <div className="space-y-8 px-8 py-8">
          <section>
            <h3 className="hud-label mb-2">Executive summary</h3>
            <p className="text-fog">{report.executive}</p>
          </section>
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="glass pop-cyan rounded-xl p-4">
              <p className="hud-label">Risk score</p>
              <p className="mt-2 font-display text-3xl text-mist">{report.riskScore}</p>
            </div>
            <div className="glass pop-magenta rounded-xl p-4">
              <p className="hud-label">Vulnerabilities</p>
              <p className="mt-2 font-display text-3xl text-mist">{report.vulnerabilities.length}</p>
            </div>
            <div className="glass pop-yellow rounded-xl p-4">
              <p className="hud-label">Validation</p>
              <p className="mt-2 font-display text-3xl text-mist">{report.validation?.length || 0}/5</p>
            </div>
          </section>
          <section>
            <h3 className="hud-label mb-3">Vulnerabilities</h3>
            <div className="space-y-2">
              {report.vulnerabilities.map((v) => (
                <div key={v.id} className="flex justify-between rounded-lg border-[2.5px] border-cyan bg-abyss px-4 py-3 text-sm shadow-[3px_3px_0_#8b5cff]">
                  <span className="text-mist">{v.title}</span>
                  <span className="sticker sticker-violet">{v.cwe}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="hud-label mb-3">Patch</h3>
            <ul className="list-disc space-y-1 pl-5 text-fog">
              {(report.patchNotes.length ? report.patchNotes : ['Patch not yet synthesized.']).map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="hud-label mb-3">Recommendations</h3>
            <ol className="list-decimal space-y-2 pl-5 text-fog">
              {report.recommendations.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ol>
          </section>
        </div>
      </GlassPanel>
    </main>
  )
}
