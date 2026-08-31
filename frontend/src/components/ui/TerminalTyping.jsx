import { useEffect, useState } from 'react'

export default function TerminalTyping({ lines = [], speed = 38, className = '' }) {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done || !lines.length) return
    const current = lines[lineIdx] || ''
    if (charIdx < current.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), speed)
      return () => clearTimeout(t)
    }
    if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setLineIdx((l) => l + 1)
        setCharIdx(0)
      }, 420)
      return () => clearTimeout(t)
    }
    setDone(true)
  }, [charIdx, lineIdx, lines, speed, done])

  return (
    <div className={`rounded-xl border-[2.5px] border-ink bg-code p-4 font-mono text-[11px] leading-6 shadow-[4px_4px_0_#8b5cff] ${className}`}>
      <div className="mb-3 flex items-center gap-2 border-b border-cyan/20 pb-2">
        <span className="h-2 w-2 rounded-full bg-magenta" />
        <span className="h-2 w-2 rounded-full bg-amber" />
        <span className="h-2 w-2 rounded-full bg-cyan" />
        <span className="ml-2 text-[10px] uppercase tracking-widest text-fog">astra-x@kavach-2026 ~ uplink</span>
      </div>
      {lines.slice(0, lineIdx + 1).map((line, i) => (
        <p key={i} className="text-cyan/90">
          <span className="text-violet">{'>'}</span>{' '}
          {i < lineIdx ? line : line.slice(0, charIdx)}
          {i === lineIdx && !done ? <span className="animate-pulse text-amber">▊</span> : null}
        </p>
      ))}
    </div>
  )
}
