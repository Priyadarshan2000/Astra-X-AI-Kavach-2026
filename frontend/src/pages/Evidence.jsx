import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import { useMission } from '../context/MissionContext.jsx'

const SEVERITY_DATA = [
  { name: 'Critical', value: 4, fill: '#ff4081' },
  { name: 'High', value: 7, fill: '#ffd740' },
  { name: 'Medium', value: 3, fill: '#00e5ff' },
  { name: 'Low', value: 2, fill: '#8b9cb8' },
]

const TIMELINE = [
  { t: 'T-00:00', event: 'Digital twin armed', status: 'done' },
  { t: 'T-00:08', event: 'Static scan complete', status: 'done' },
  { t: 'T-00:19', event: 'Patch synthesized', status: 'done' },
  { t: 'T-00:27', event: 'Lab fuzz validated', status: 'active' },
  { t: 'T-00:41', event: 'Regression certified', status: 'pending' },
]

const MITRE = [
  { id: 'T1190', name: 'Exploit Public-Facing App', mapped: true },
  { id: 'T1059', name: 'Command & Scripting', mapped: true },
  { id: 'T1565', name: 'Data Manipulation', mapped: false },
]

const OWASP = ['A03 Injection', 'A07 XSS', 'A08 Software Integrity', 'A05 Misconfiguration']

export default function Evidence() {
  const { mission } = useMission()
  const findings = mission.scan?.findings?.length ?? 14
  const patched = mission.patch ? Math.max(1, (mission.scan?.findings?.length ?? 4)) : 9
  const manual = 2

  const trend = useMemo(
    () => [
      { day: 'Mon', found: 18, patched: 12 },
      { day: 'Tue', found: 22, patched: 19 },
      { day: 'Wed', found: 14, patched: 14 },
      { day: 'Thu', found: 9, patched: 8 },
      { day: 'Fri', found: findings, patched: patched },
    ],
    [findings, patched],
  )

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader
        kicker="SOC evidence chain"
        title="EVIDENCE DASHBOARD"
        detail="Vulnerability telemetry, attack timeline, MITRE ATT&CK and OWASP mapping for Kavach evaluators."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Vulnerabilities found', value: findings, tone: 'magenta' },
          { label: 'Auto patched', value: patched, tone: 'cyan' },
          { label: 'Manual review', value: manual, tone: 'amber' },
          { label: 'Avg response', value: '4.2m', tone: 'violet' },
        ].map((c) => (
          <GlassPanel key={c.label} tone={c.tone} className="p-5">
            <p className="hud-label">{c.label}</p>
            <p className="mt-2 font-display text-3xl text-mist">{c.value}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-5" tone="cyan" hover={false}>
          <p className="hud-label mb-4">Threat severity distribution</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SEVERITY_DATA} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {SEVERITY_DATA.map((e) => (
                    <Cell key={e.name} fill={e.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0a0f2e', border: '2px solid #16131c' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5" tone="violet" hover={false}>
          <p className="hud-label mb-4">Findings vs patches (weekly)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <XAxis dataKey="day" stroke="#8b9cb8" fontSize={11} />
                <YAxis stroke="#8b9cb8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0a0f2e', border: '2px solid #16131c' }} />
                <Bar dataKey="found" fill="#ff4081" radius={4} />
                <Bar dataKey="patched" fill="#00e5ff" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassPanel className="p-5 lg:col-span-1" tone="yellow" hover={false}>
          <p className="hud-label mb-3">Attack timeline</p>
          <ul className="space-y-3">
            {TIMELINE.map((e) => (
              <li key={e.t} className="flex gap-3 text-sm">
                <span className="font-mono text-[10px] text-fog">{e.t}</span>
                <span className={e.status === 'done' ? 'text-cyan' : e.status === 'active' ? 'text-amber' : 'text-fog'}>
                  {e.event}
                </span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel className="p-5" tone="magenta" hover={false}>
          <p className="hud-label mb-3">MITRE ATT&CK mapping</p>
          <ul className="space-y-2">
            {MITRE.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-lg border border-ink/20 px-3 py-2 text-sm">
                <span className="text-mist">{m.id} — {m.name}</span>
                <span className={`text-[10px] uppercase ${m.mapped ? 'text-cyan' : 'text-fog'}`}>
                  {m.mapped ? 'Mapped' : '—'}
                </span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        <GlassPanel className="p-5" tone="cyan" hover={false}>
          <p className="hud-label mb-3">OWASP Top 10 coverage</p>
          <div className="flex flex-wrap gap-2">
            {OWASP.map((o) => (
              <span key={o} className="sticker sticker-violet">{o}</span>
            ))}
          </div>
        </GlassPanel>
      </div>
    </main>
  )
}
