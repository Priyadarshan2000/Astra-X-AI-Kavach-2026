import { motion } from 'framer-motion'

export default function PageHeader({ kicker, title, detail, extra }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <p className="hud-label">{kicker}</p>
        <h1 className="mt-3 font-display text-3xl tracking-[0.14em] title-pop md:text-4xl">{title}</h1>
        {detail ? <p className="mt-2 max-w-2xl text-sm text-fog">{detail}</p> : null}
      </div>
      {extra}
    </motion.div>
  )
}
