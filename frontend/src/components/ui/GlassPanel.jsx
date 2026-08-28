import { motion } from 'framer-motion'

export default function GlassPanel({ children, className = '', delay = 0, hover = true, tone = 'cyan' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass pop-${tone} widget-ticks rounded-2xl ${hover ? 'can-lift' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
