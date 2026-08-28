const TRACKS = [
  { angle: 32, dist: 38, hostile: true, id: 'T-01', sector: 'NE' },
  { angle: 78, dist: 30, hostile: true, id: 'T-02', sector: 'E' },
  { angle: 128, dist: 42, hostile: false, id: 'T-03', sector: 'SE' },
  { angle: 168, dist: 26, hostile: true, id: 'T-04', sector: 'S' },
  { angle: 215, dist: 36, hostile: false, id: 'T-05', sector: 'SW' },
  { angle: 258, dist: 44, hostile: false, id: 'T-06', sector: 'W' },
  { angle: 312, dist: 34, hostile: true, id: 'T-07', sector: 'NW' },
]

function polar(cx, cy, angleDeg, dist) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + Math.cos(rad) * dist, y: cy + Math.sin(rad) * dist }
}

export default function ThreatRadar({ className = '', blips = 7, idPrefix = 'radar' }) {
  const tracks = TRACKS.slice(0, blips)
  const hostile = tracks.filter((t) => t.hostile).length

  return (
    <div className={`threat-radar-shell relative ${className}`}>
      <div className="viz-hud-corners" aria-hidden />
      <svg viewBox="0 0 100 100" className="relative z-[1] h-full w-full">
        <defs>
          <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#8b5cff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0c0818" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${idPrefix}-sweep`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>
          <filter id={`${idPrefix}-bloom`}>
            <feGaussianBlur stdDeviation="0.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="50" cy="50" r="48" fill={`url(#${idPrefix}-glow)`} />
        {[48, 38, 28, 18].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(0,229,255,0.22)" strokeWidth="0.35" />
        ))}

        {Array.from({ length: 12 }, (_, i) => {
          const a = i * 30 - 90
          const rad = (a * Math.PI) / 180
          const x2 = 50 + Math.cos(rad) * 46
          const y2 = 50 + Math.sin(rad) * 46
          return (
            <line key={i} x1="50" y1="50" x2={x2} y2={y2} stroke="rgba(0,229,255,0.12)" strokeWidth="0.35" />
          )
        })}

        <text x="50" y="7" textAnchor="middle" fill="rgba(255,228,77,0.85)" fontSize="3.2" fontFamily="Orbitron, sans-serif">
          N
        </text>

        <g style={{ transformOrigin: '50px 50px', animation: 'radar-spin 5s linear infinite' }}>
          <path d="M50 50 L50 3 A47 47 0 0 1 84 18 Z" fill={`url(#${idPrefix}-sweep)`} opacity="0.9" />
          <path d="M50 50 L50 3 A47 47 0 0 1 72 10 Z" fill="rgba(0,229,255,0.12)" />
        </g>

        <g transform="translate(50 50)">
          <circle r="3.2" fill="#ffe44d" stroke="#16131c" strokeWidth="0.8" />
          {Array.from({ length: 8 }, (_, s) => (
            <line
              key={s}
              x1="0"
              y1="-1.2"
              x2="0"
              y2="-5.5"
              stroke="#00e5ff"
              strokeWidth="0.55"
              transform={`rotate(${s * 45})`}
            />
          ))}
        </g>

        {tracks.map((track, i) => {
          const p = polar(50, 50, track.angle, track.dist)
          const color = track.hostile ? '#ff3b5c' : '#00e5ff'
          return (
            <g key={track.id} filter={`url(#${idPrefix}-bloom)`}>
              <line
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke={color}
                strokeOpacity="0.25"
                strokeWidth="0.35"
                strokeDasharray="1.5 2"
              />
              <circle cx={p.x} cy={p.y} r="1.8" fill={color} stroke="#16131c" strokeWidth="0.45">
                <animate attributeName="opacity" values="1;0.35;1" dur="1.8s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={p.x} cy={p.y} r="5" fill="none" stroke={color} strokeOpacity="0.5">
                <animate attributeName="r" values="2.5;8" dur="2s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.65;0" dur="2s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
              </circle>
              <text
                x={p.x + 2.5}
                y={p.y - 2}
                fill="rgba(255,245,255,0.75)"
                fontSize="2.6"
                fontFamily="Orbitron, sans-serif"
              >
                {track.id}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="threat-radar-legend">
        <span className="threat-radar-pill threat-radar-pill-hostile">{hostile} HOSTILE</span>
        <span className="threat-radar-pill threat-radar-pill-watch">{tracks.length - hostile} WATCH</span>
        <span className="threat-radar-pill threat-radar-pill-hold">HOLD</span>
      </div>
    </div>
  )
}
