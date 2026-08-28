import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className={`relative h-9 w-16 shrink-0 rounded-lg border-[2.5px] border-ink shadow-[3px_3px_0_#ff2e97] transition-colors duration-300 ${
        isDark ? 'bg-panel' : 'bg-amber'
      } ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5">
        <Sun className={`h-3.5 w-3.5 ${isDark ? 'text-fog/50' : 'opacity-0'}`} />
        <Moon className={`h-3.5 w-3.5 ${isDark ? 'opacity-0' : 'text-ink/40'}`} />
      </span>
      <motion.span
        aria-hidden
        className="absolute top-0.5 left-0.5 grid h-7 w-7 place-items-center rounded-md border-[2px] border-ink bg-cyan shadow-[2px_2px_0_#8b5cff]"
        animate={{ x: isDark ? 26 : 0 }}
        transition={{ type: 'spring', stiffness: 480, damping: 32 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="grid place-items-center text-ink"
          >
            {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  )
}
