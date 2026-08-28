import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import MissionStrip from '../components/ui/MissionStrip.jsx'

export default function About() {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-16 pt-24">
      <PageHeader kicker="Doctrine" title="ABOUT ASTRA-X" detail="Defence-grade copilot for Kavach 2026. Scan. Patch. Certify. Never weaponize." />
      <MissionStrip />
      <GlassPanel className="p-8" hover={false} tone="magenta">
        <p className="text-lg text-fog">
          ASTRA-X (Autonomous Security Tactical Reasoning Agent) is a defence-tech command platform designed for Kavach
          2026. It demonstrates how an AI copilot can ingest mission software, map vulnerability classes, synthesize
          defensive patches, and certify the result through simulated fuzzing and regression — without ever becoming an
          offensive toolkit.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ['Scan', 'Pattern-based static analysis for C, C++, Python and Java.', 'pop-cyan'],
            ['Patch', 'Secure rewrite with confidence, risk reduction and impact.', 'pop-violet'],
            ['Fuzz', 'Lab-only attack-surface simulation before and after patch.', 'pop-magenta'],
            ['Certify', 'Five tactical suites lock the mission green.', 'pop-yellow'],
          ].map(([t, d, tone]) => (
            <div key={t} className={`glass ${tone} rounded-xl p-4`}>
              <h2 className="font-display text-sm tracking-widest text-mist">{t}</h2>
              <p className="mt-2 text-sm text-fog">{d}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </main>
  )
}
