import { motion } from 'framer-motion'
import { HEALTH } from '../../data/mock.js'

export default function SystemHealth() {
  return (
    <div className="space-y-4">
      {HEALTH.map((row, i) => {
        const watch = row.value < 90
        return (
          <div key={row.name}>
            <div className="mb-1.5 flex items-center justify-between font-ui text-[11px] uppercase tracking-widest text-fog">
              <span>{row.name}</span>
              <span className="flex items-center gap-2">
                <span className={`font-display text-[9px] tracking-[0.16em] ${watch ? 'text-magenta' : 'text-emerald'}`}>
                  {watch ? 'WATCH' : 'OK'}
                </span>
                <span className="font-display text-mist">{row.value}%</span>
              </span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-md border-[2px] border-ink bg-abyss shadow-[3px_3px_0_#8b5cff]">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan via-amber to-magenta"
                initial={{ width: 0 }}
                animate={{ width: `${row.value}%` }}
                transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
