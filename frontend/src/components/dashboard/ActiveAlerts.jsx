import { motion } from 'framer-motion'
import { ALERTS } from '../../data/mock.js'

const TONE = {
  critical: 'text-mist border-void bg-crimson shadow-[3px_3px_0_#ffe44d]',
  high: 'text-void border-void bg-amber shadow-[3px_3px_0_#ff2e97]',
  medium: 'text-void border-void bg-cyan shadow-[3px_3px_0_#8b5cff]',
  low: 'text-void border-void bg-emerald shadow-[3px_3px_0_#00e5ff]',
}

export default function ActiveAlerts() {
  return (
    <div className="space-y-3">
      {ALERTS.map((alert, i) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.08 }}
          className={`rounded-lg border-[2.5px] px-3 py-2 ${TONE[alert.level]}`}
        >
          <div className="flex items-center justify-between font-display text-[10px] tracking-widest uppercase">
            <span>{alert.id}</span>
            <span>{alert.time}</span>
          </div>
          <p className="mt-1 text-sm text-mist">{alert.title}</p>
        </motion.div>
      ))}
    </div>
  )
}
