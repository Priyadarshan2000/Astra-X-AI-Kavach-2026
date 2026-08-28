import { useEffect, useState } from 'react'

export default function StatCounter({ value, suffix = '', duration = 1600 }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setN(value)
      return
    }
    const start = performance.now()
    let frame
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(value * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  const formatted = Number.isInteger(value) ? Math.round(n).toLocaleString() : n.toFixed(1)
  return (
    <span>
      {formatted}
      {suffix}
    </span>
  )
}
