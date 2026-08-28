import { AnimatePresence, motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, x: 22, y: 8 },
  animate: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -16, y: -6 },
}

export default function PageTransition({ routeKey, children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
