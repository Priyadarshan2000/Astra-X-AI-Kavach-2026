const NODES = [
  { id: 'del', name: 'Delhi', x: 102, y: 78, hub: true },
  { id: 'amd', name: 'Ahmedabad', x: 62, y: 108 },
  { id: 'mum', name: 'Mumbai', x: 68, y: 138 },
  { id: 'hyd', name: 'Hyderabad', x: 108, y: 158 },
  { id: 'blr', name: 'Bengaluru', x: 98, y: 188 },
  { id: 'maa', name: 'Chennai', x: 122, y: 196 },
  { id: 'ccu', name: 'Kolkata', x: 148, y: 118 },
  { id: 'gau', name: 'Guwahati', x: 186, y: 86 },
]

const LINKS = [
  ['del', 'amd'],
  ['del', 'mum'],
  ['del', 'hyd'],
  ['del', 'ccu'],
  ['del', 'gau'],
  ['mum', 'hyd'],
  ['hyd', 'blr'],
  ['blr', 'maa'],
  ['hyd', 'ccu'],
]

export { NODES }

export default function IndiaMap({ progress = 0, className = '' }) {
  const lit = Math.max(1, Math.round((Math.min(100, progress) / 100) * NODES.length))
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))

  return (
    <svg viewBox="0 0 230 230" className={`india-map ${className}`} aria-hidden>
      <defs>
        <linearGradient id="india-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#8b5cff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ff2e97" stopOpacity="0.24" />
        </linearGradient>
        <clipPath id="india-clip">
          <path d={INDIA} />
        </clipPath>
        <filter id="india-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g opacity="0.2" clipPath="url(#india-clip)">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`h${i}`} x1="20" x2="210" y1={18 + i * 18} y2={18 + i * 18} stroke="#00e5ff" strokeWidth="0.4" />
        ))}
      </g>

      <path d={INDIA} fill="url(#india-fill)" />
      <path
        className="india-stroke"
        d={INDIA}
        fill="none"
        stroke="#00e5ff"
        strokeWidth="2.2"
        strokeLinejoin="round"
        pathLength="1"
        filter="url(#india-glow)"
      />
      <path d={SRI} fill="rgba(0,229,255,0.22)" stroke="#00e5ff" strokeWidth="1.3" />
      <circle cx="178" cy="168" r="2.6" fill="none" stroke="#00e5ff" strokeWidth="1.1" />
      <circle cx="184" cy="180" r="1.8" fill="none" stroke="#8b5cff" strokeWidth="1" />

      <g clipPath="url(#india-clip)">
        <rect className="india-sweep" x="30" y="0" width="170" height="36" fill="#00e5ff" opacity="0.18" />
      </g>

      {LINKS.map(([a, b]) => {
        const from = byId[a]
        const to = byId[b]
        return (
          <line
            key={`${a}-${b}`}
            className="india-link"
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#ff2e97"
            strokeWidth="1.1"
            strokeDasharray="3 4"
            opacity="0.7"
          />
        )
      })}

      {NODES.map((node, i) => {
        const on = i < lit
        return (
          <g key={node.id} className="boot-node">
            {node.hub ? (
              <g transform={`translate(${node.x} ${node.y})`}>
                <circle r="15" fill="none" stroke="#ffe44d" strokeWidth="1.5" />
                {Array.from({ length: 12 }, (_, s) => (
                  <line
                    key={s}
                    x1="0"
                    y1="-4.5"
                    x2="0"
                    y2="-12"
                    stroke="#00e5ff"
                    strokeWidth="1.15"
                    transform={`rotate(${s * 30})`}
                  />
                ))}
                <circle r="4.2" fill="#ffe44d" stroke="#12101a" strokeWidth="1.2" />
              </g>
            ) : (
              <>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={on ? 4.6 : 3.2}
                  fill={on ? '#ff2e97' : '#00e5ff'}
                  stroke="#12101a"
                  strokeWidth="1.2"
                />
                {on ? (
                  <circle cx={node.x} cy={node.y} r="8" fill="none" stroke="#ff2e97" strokeOpacity="0.65">
                    <animate attributeName="r" values="5;12" dur="1.5s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.75;0" dur="1.5s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
                  </circle>
                ) : null}
              </>
            )}
            <text
              x={node.x + (node.hub ? 18 : 7)}
              y={node.y - 7}
              fill="#fff5ff"
              fontSize="8"
              fontFamily="Orbitron, sans-serif"
              letterSpacing="0.1em"
            >
              {node.name.toUpperCase()}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const INDIA =
  'M100 12 L118 22 L112 38 L128 46 L122 58 L172 52 L196 64 L202 84 L180 94 L154 86 L142 96 L150 118 L140 148 L128 176 L116 196 L104 206 L92 204 L84 184 L74 154 L64 132 L48 122 L32 110 L28 94 L46 86 L60 90 L70 76 L64 56 L80 42 L92 28 Z'

const SRI = 'M112 210 C122 208 128 218 122 226 C114 230 104 224 106 216 C106 212 108 210 112 210 Z'
