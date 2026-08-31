import { useState } from 'react'
import { motion } from 'framer-motion'
import { ARCHITECTURE_LAYERS } from '../../data/architecture.js'

const TONE = {
  cyan: 'border-cyan bg-cyan/10 text-cyan',
  violet: 'border-violet bg-violet/10 text-violet',
  magenta: 'border-magenta bg-magenta/10 text-magenta',
  amber: 'border-amber bg-amber/10 text-amber',
}

export default function ArchitectureViz() {
  const [active, setActive] = useState(ARCHITECTURE_LAYERS[0])

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-2 lg:col-span-2">
        {ARCHITECTURE_LAYERS.map((layer, i) => (
          <motion.button
            key={layer.id}
            type="button"
            onMouseEnter={() => setActive(layer)}
            onFocus={() => setActive(layer)}
            className={`w-full rounded-xl border-[2.5px] p-4 text-left transition-all ${
              active.id === layer.id
                ? `${TONE[layer.color]} shadow-[4px_4px_0_#ff2e97]`
                : 'border-ink/20 bg-panel/60 text-fog hover:border-cyan/40'
            }`}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <p className="font-display text-[10px] tracking-[0.18em]">LAYER {String(i + 1).padStart(2, '0')}</p>
            <p className="mt-1 font-display text-sm tracking-widest">{layer.title}</p>
          </motion.button>
        ))}
      </div>

      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass pop-cyan widget-ticks rounded-2xl p-6 lg:col-span-3"
      >
        <p className="hud-label">{active.title}</p>
        <p className="mt-3 text-lg text-mist">{active.summary}</p>
        <p className="mt-4 text-sm leading-relaxed text-fog">{active.detail}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {active.flows.map((f) => (
            <span key={f} className="sticker sticker-violet">{f}</span>
          ))}
        </div>
        <div className="mt-6 rounded-xl border-[2px] border-dashed border-cyan/30 p-4">
          <p className="text-[10px] uppercase tracking-widest text-fog">Data flow</p>
          <p className="mt-2 font-mono text-xs text-cyan">
            {ARCHITECTURE_LAYERS.map((l) => l.title).join(' → ')}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
