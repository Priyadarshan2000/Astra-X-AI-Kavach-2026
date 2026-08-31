import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Shield, Zap } from 'lucide-react'
import NeonButton from '../ui/NeonButton.jsx'

const LOG_COLOR = {
  magenta: 'text-magenta',
  amber: 'text-amber',
  violet: 'text-violet',
  cyan: 'text-cyan',
}

const VULN_SAMPLE = `// logistics_api.js — vulnerable gateway
app.get('/user', (req, res) => {
  const q = "SELECT * FROM ops WHERE id=" + req.query.id;
  db.query(q);
  res.send('<div>' + req.query.name + '</div>');
  require('child_process').exec('ping ' + req.query.host);
});`

const PATCH_SAMPLE = `// logistics_api.js — ASTRA-X hardened
app.get('/user', (req, res) => {
  db.query('SELECT * FROM ops WHERE id=?', [req.query.id]);
  res.setHeader('Content-Type', 'text/plain');
  res.send(String(req.query.name));
  spawn('ping', ['-c', '1', req.query.host]);
});`

const FINDINGS = [
  { id: 1, title: 'SQL Injection', cwe: 'CWE-89', severity: 'critical', delay: 800 },
  { id: 2, title: 'Cross-Site Scripting (XSS)', cwe: 'CWE-79', severity: 'high', delay: 1600 },
  { id: 3, title: 'Buffer Overflow Warning', cwe: 'CWE-120', severity: 'high', delay: 2400 },
]

export default function LiveDemoPanel({ onLaunchFull }) {
  const [phase, setPhase] = useState('idle')
  const [visibleFindings, setVisibleFindings] = useState([])
  const [scanLine, setScanLine] = useState(0)

  useEffect(() => {
    if (phase !== 'scanning') return
    const t = setInterval(() => setScanLine((l) => (l + 1) % 8), 180)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'scanning') return
    FINDINGS.forEach((f) => {
      setTimeout(() => setVisibleFindings((v) => [...v, f]), f.delay)
    })
    const done = setTimeout(() => setPhase('patching'), 3200)
    return () => clearTimeout(done)
  }, [phase])

  useEffect(() => {
    if (phase !== 'patching') return
    const t = setTimeout(() => setPhase('certified'), 2200)
    return () => clearTimeout(t)
  }, [phase])

  const start = () => {
    setVisibleFindings([])
    setScanLine(0)
    setPhase('scanning')
  }

  return (
    <div className="glass pop-violet widget-ticks rounded-2xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="hud-label">Interactive live demo</p>
          <h3 className="font-display text-lg tracking-widest text-mist">SOC SCAN → PATCH → CERTIFY</h3>
        </div>
        {phase === 'idle' ? (
          <NeonButton onClick={start}>Start Scan</NeonButton>
        ) : phase === 'certified' ? (
          <NeonButton variant="ghost" onClick={onLaunchFull}>Run Full Mission</NeonButton>
        ) : (
          <span className="sticker sticker-yellow"><span className="live-dot" /> LIVE</span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl border-[2.5px] border-ink bg-code">
          <div className="border-b-[2px] border-ink/20 px-3 py-2 text-[10px] uppercase tracking-widest text-fog">
            {phase === 'patching' || phase === 'certified' ? 'Hardened patch' : 'Vulnerable corpus'}
          </div>
          <pre className="max-h-48 overflow-auto p-3 font-mono text-[11px] leading-6 text-cyan/90">
            {(phase === 'patching' || phase === 'certified' ? PATCH_SAMPLE : VULN_SAMPLE)
              .split('\n')
              .map((line, i) => (
                <div key={i} className={phase === 'scanning' && i === scanLine ? 'bg-cyan/15' : ''}>
                  <span className="mr-3 text-fog/40">{i + 1}</span>
                  {line}
                </div>
              ))}
          </pre>
          {phase === 'scanning' && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 h-8 bg-gradient-to-b from-cyan/40 to-transparent"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {visibleFindings.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 rounded-lg border-[2px] border-magenta/40 bg-magenta/10 px-3 py-2"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-magenta" />
                <div>
                  <p className="text-sm font-medium text-mist">{f.title}</p>
                  <p className="text-[10px] uppercase tracking-widest text-fog">{f.cwe} · {f.severity}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {phase === 'patching' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 rounded-lg border-[2px] border-violet/40 bg-violet/10 px-3 py-2">
              <Zap className="h-4 w-4 text-violet" />
              <p className="text-sm text-mist">ASTRA-X synthesizing bounded patch…</p>
            </motion.div>
          )}

          {phase === 'certified' && (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border-[2px] border-cyan/40 bg-cyan/10 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-cyan" />
                <p className="text-sm text-mist">Regression tests passed — 5/5 GREEN</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border-[2px] border-amber/40 bg-amber/10 px-3 py-2">
                <Shield className="h-4 w-4 text-amber" />
                <p className="text-sm text-mist">Risk score reduced 78% · Deployment approved</p>
              </div>
            </motion.div>
          )}

          {phase === 'idle' && (
            <p className="text-sm text-fog">Click Start Scan to watch ASTRA-X detect SQLi, XSS, and overflow patterns — then auto-patch and certify.</p>
          )}
        </div>
      </div>
    </div>
  )
}
