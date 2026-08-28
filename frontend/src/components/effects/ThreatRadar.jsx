export default function ThreatRadar({ className = '', blips = 7, idPrefix = 'radar' }) {
  const points = Array.from({ length: blips }, (_, i) => {
    const angle = (i / blips) * Math.PI * 2 + 0.4
    const dist = 28 + (i % 4) * 10
    return { x: 50 + Math.cos(angle) * dist, y: 50 + Math.sin(angle) * dist, delay: i * 0.35 }
  })

  return (
    <div className={`relative overflow-hidden threat-radar ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <radialGradient id={`${idPrefix}-fill`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill={`url(#${idPrefix}-fill)`} stroke="rgba(0,229,255,0.45)" strokeWidth="0.7" />
        {[16, 28, 40].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(0,229,255,0.28)" strokeWidth="0.45" />
        ))}
        <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(0,229,255,0.2)" strokeWidth="0.4" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(0,229,255,0.2)" strokeWidth="0.4" />
        <g style={{ transformOrigin: '50px 50px', animation: 'radar-spin 4.5s linear infinite' }}>
          <path d="M50 50 L50 4 A46 46 0 0 1 78 14 Z" fill="rgba(0,229,255,0.28)" />
        </g>
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="1.5" fill={i % 3 === 0 ? '#00e5ff' : '#ff3b5c'}>
              <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" begin={`${p.delay}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={p.x} cy={p.y} r="4" fill="none" stroke={i % 3 === 0 ? '#00e5ff' : '#ff3b5c'} strokeOpacity="0.55">
              <animate attributeName="r" values="2;7" dur="1.8s" begin={`${p.delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur="1.8s" begin={`${p.delay}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  )
}
