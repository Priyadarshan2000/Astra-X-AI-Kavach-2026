import { motion } from 'framer-motion'
import { HEALTH } from '../../data/mock.js'

export default function SystemHealth() {
  return (
    <div className="space-y-4">
      {HEALTH.map((row, i) => (
        <div key={row.name}>
          <div className="mb-1 flex justify-between font-ui text-[11px] uppercase tracking-widest text-fog">
            <span>{row.name}</span>
            <span className="text-cyan">{row.value}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-md border-[2px] border-void bg-abyss shadow-[3px_3px_0_#8b5cff]">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan via-amber to-magenta"
              initial={{ width: 0 }}
              animate={{ width: `${row.value}%` }}
              transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
