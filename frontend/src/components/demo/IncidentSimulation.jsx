import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertOctagon, ShieldCheck, FileCheck } from 'lucide-react'
import NeonButton from '../ui/NeonButton.jsx'

const LOG_COLOR = {
  magenta: 'text-magenta',
  amber: 'text-amber',
  violet: 'text-violet',
  cyan: 'text-cyan',
}

const STEPS = [
  { t: 0, log: '[INCIDENT] SIG-7 breach attempt — Western Command relay compromised', tone: 'magenta' },
  { t: 3, log: '[DETECT] ASTRA-X pattern engine — CWE-78 command injection on Gateway-7', tone: 'amber' },
  { t: 6, log: '[REASON] Tactical agent: isolate exec path, bound argument list required', tone: 'violet' },
  { t: 9, log: '[PATCH] Bounded rewrite staged — system() removed, spawn allowlist applied', tone: 'cyan' },
  { t: 12, log: '[FUZZ] 1,240 variants rejected in lab sandbox — 0 critical bypass', tone: 'cyan' },
  { t: 15, log: '[REGRESSION] 5/5 tactical suites GREEN — Eastern Command hold lifted', tone: 'cyan' },
  { t: 18, log: '[CERT] Mission report KAVACH-2026-ASTRA-7741 issued — network restored', tone: 'amber' },
]

export default function IncidentSimulation({ open, onClose, onComplete }) {
  const [elapsed, setElapsed] = useState(0)
  const [logs, setLogs] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!open) {
      setElapsed(0)
      setLogs([])
      setDone(false)
      return
    }
    const tick = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(tick)
  }, [open])

  useEffect(() => {
    if (!open) return
    STEPS.forEach((step) => {
      if (elapsed === step.t) {
        setLogs((l) => [...l, step])
      }
    })
    if (elapsed >= 20) setDone(true)
  }, [elapsed, open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-void/92 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="glass-strong pop-magenta max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-[2px] border-ink/15 px-5 py-4">
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-magenta" />
                <div>
                  <p className="font-display text-xs tracking-[0.2em] text-magenta">EMERGENCY INCIDENT SIMULATION</p>
                  <p className="text-[10px] text-fog">30-second cyberattack → detect → patch → restore</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="rounded-lg border-[2px] border-ink p-1.5" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative h-2 bg-abyss">
              <motion.div
                className="h-full bg-gradient-to-r from-magenta via-violet to-cyan"
                animate={{ width: `${Math.min(100, (elapsed / 20) * 100)}%` }}
              />
            </div>

            <div className="max-h-64 overflow-y-auto p-5 font-mono text-[11px] leading-6">
              {logs.map((entry, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-1 ${LOG_COLOR[entry.tone] || 'text-cyan'}`}
                >
                  {entry.log}
                </motion.p>
              ))}
              {!done && <span className="animate-pulse text-amber">▊</span>}
            </div>

            {done && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t-[2px] border-ink/15 p-5"
              >
                <div className="flex items-center gap-2 text-cyan">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="font-display text-sm tracking-widest">NETWORK RESTORED — DEFENCE HOLD</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <NeonButton onClick={() => { onComplete?.(); onClose() }}>
                    <FileCheck className="mr-1 inline h-4 w-4" /> View Mission Report
                  </NeonButton>
                  <NeonButton variant="ghost" onClick={onClose}>Close</NeonButton>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
