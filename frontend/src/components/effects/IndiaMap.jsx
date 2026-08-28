const NODES = [
  { id: 'del', name: 'Delhi', x: 128, y: 96, hub: true },
  { id: 'mum', name: 'Mumbai', x: 86, y: 172 },
  { id: 'hyd', name: 'Hyderabad', x: 138, y: 204 },
  { id: 'blr', name: 'Bengaluru', x: 126, y: 248 },
  { id: 'maa', name: 'Chennai', x: 156, y: 260 },
  { id: 'ccu', name: 'Kolkata', x: 198, y: 152 },
  { id: 'gau', name: 'Guwahati', x: 244, y: 108 },
  { id: 'amd', name: 'Ahmedabad', x: 84, y: 142 },
]

export { NODES }

export default function IndiaMap({ progress = 0, className = '' }) {
  const lit = Math.max(1, Math.round((Math.min(100, progress) / 100) * NODES.length))

  return (
    <svg viewBox="0 0 300 340" className={`india-map ${className}`} aria-hidden>
      <defs>
        <linearGradient id="india-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#8b5cff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ff2e97" stopOpacity="0.22" />
        </linearGradient>
        <clipPath id="india-clip">
          <path d={INDIA} />
        </clipPath>
        <filter id="india-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="india-grid" opacity="0.22" clipPath="url(#india-clip)">
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`h${i}`} x1="20" x2="280" y1={30 + i * 22} y2={30 + i * 22} stroke="#00e5ff" strokeWidth="0.4" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} y1="16" y2="320" x1={40 + i * 20} x2={40 + i * 20} stroke="#00e5ff" strokeWidth="0.4" />
        ))}
      </g>

      <path className="india-land" d={INDIA} fill="url(#india-fill)" stroke="none" />
      <path
        className="india-stroke"
        d={INDIA}
        fill="none"
        stroke="#00e5ff"
        strokeWidth="2.4"
        strokeLinejoin="round"
        pathLength="1"
        filter="url(#india-glow)"
      />

      <path d={SRI} fill="rgba(0,229,255,0.2)" stroke="#00e5ff" strokeWidth="1.4" />
      <circle cx="228" cy="228" r="3.2" fill="none" stroke="#00e5ff" strokeWidth="1.2" />
      <circle cx="234" cy="242" r="2.2" fill="none" stroke="#8b5cff" strokeWidth="1.1" />
      <circle cx="238" cy="254" r="1.6" fill="none" stroke="#ff2e97" strokeWidth="1" />

      <g clipPath="url(#india-clip)">
        <rect className="india-sweep" x="20" y="0" width="260" height="52" fill="url(#india-fill)" opacity="0.55" />
      </g>

      {NODES.map((node, i) => {
        const on = i < lit
        return (
          <g key={node.id} className="boot-node">
            {node.hub ? (
              <g transform={`translate(${node.x} ${node.y})`}>
                <circle r="16" fill="none" stroke="#ffe44d" strokeWidth="1.4" opacity="0.9" />
                {Array.from({ length: 12 }, (_, s) => (
                  <line
                    key={s}
                    x1="0"
                    y1="-5"
                    x2="0"
                    y2="-13"
                    stroke="#00e5ff"
                    strokeWidth="1.1"
                    transform={`rotate(${s * 30})`}
                  />
                ))}
                <circle r="4.5" fill="#ffe44d" stroke="#12101a" strokeWidth="1.2" />
              </g>
            ) : (
              <>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={on ? 5 : 3.4}
                  fill={on ? '#ff2e97' : '#00e5ff'}
                  stroke="#12101a"
                  strokeWidth="1.3"
                />
                {on ? (
                  <circle cx={node.x} cy={node.y} r="9" fill="none" stroke="#ff2e97" strokeOpacity="0.7">
                    <animate attributeName="r" values="6;14" dur="1.6s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.6s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
                  </circle>
                ) : null}
              </>
            )}
            <text
              x={node.x + (node.hub ? 20 : 8)}
              y={node.y - 8}
              fill="#fff5ff"
              fontSize="9"
              fontFamily="Orbitron, sans-serif"
              letterSpacing="0.12em"
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
  'M148 22 C162 14 178 28 172 48 C186 52 198 64 188 78 C226 70 262 90 264 122 C250 138 226 126 208 120 C206 142 218 168 202 192 C192 224 180 258 162 286 C148 310 132 326 118 322 C106 302 102 268 92 234 C70 216 42 198 38 168 C36 144 62 142 78 134 C72 110 86 86 104 68 C116 48 134 32 148 22 Z'

const SRI = 'M148 300 C158 298 164 308 158 318 C150 324 140 318 142 308 C142 302 144 300 148 300 Z'
