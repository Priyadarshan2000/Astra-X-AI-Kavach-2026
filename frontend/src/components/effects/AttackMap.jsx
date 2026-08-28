import { ATTACK_ARCS } from '../../data/mock.js'

/** Indo-Pac theatre projection centred on Bharat */
function project([lon, lat]) {
  const x = ((lon - 52) / 58) * 100
  const y = ((38 - lat) / 48) * 72
  return [Math.max(2, Math.min(98, x)), Math.max(4, Math.min(68, y))]
}

const BHARAT_NODES = [
  { name: 'Delhi', lon: 77.2, lat: 28.6, hub: true },
  { name: 'Mumbai', lon: 72.8, lat: 19.0 },
  { name: 'Chennai', lon: 80.2, lat: 13.0 },
  { name: 'Kolkata', lon: 88.3, lat: 22.5 },
  { name: 'Hyderabad', lon: 78.4, lat: 17.4 },
]

const INDIA =
  'M100 12 L118 22 L112 38 L128 46 L122 58 L172 52 L196 64 L202 84 L180 94 L154 86 L142 96 L150 118 L140 148 L128 176 L116 196 L104 206 L92 204 L84 184 L74 154 L64 132 L48 122 L32 110 L28 94 L46 86 L60 90 L70 76 L64 56 L80 42 L92 28 Z'

const SRI = 'M112 210 C122 208 128 218 122 226 C114 230 104 224 106 216 C106 212 108 210 112 210 Z'

const REGIONS = [
  { id: 'arabia', d: 'M4 30 L16 22 L30 28 L34 38 L22 48 L8 44 Z', fill: 'rgba(139,92,255,0.1)' },
  { id: 'china', d: 'M54 4 L82 2 L94 12 L88 24 L68 20 L54 14 Z', fill: 'rgba(255,46,151,0.08)' },
  { id: 'seasia', d: 'M78 26 L96 22 L98 36 L88 46 L74 42 Z', fill: 'rgba(0,229,255,0.08)' },
]

const DELHI = [77.2, 28.6]

export default function AttackMap({ className = '', idPrefix = 'map', variant = 'deck' }) {
  const hero = variant === 'hero'
  const [hx, hy] = project(DELHI)

  return (
    <div className={`attack-map-shell ${hero ? 'attack-map-hero' : ''} relative ${className}`}>
      <div className="viz-hud-corners" aria-hidden />
      {hero ? <div className="attack-map-tricolor" aria-hidden /> : null}

      <svg viewBox="0 0 100 72" className="relative z-[1] h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`${idPrefix}-arc`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff3b5c" />
            <stop offset="45%" stopColor="#ff2e97" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-shield`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#138808" stopOpacity="0.12" />
          </linearGradient>
          <radialGradient id={`${idPrefix}-hub`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe44d" />
            <stop offset="100%" stopColor="#ff9933" stopOpacity="0.5" />
          </radialGradient>
          <filter id={`${idPrefix}-glow`}>
            <feGaussianBlur stdDeviation="0.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={`${idPrefix}-india-clip`}>
            <g transform="translate(24 6) scale(0.245)">
              <path d={INDIA} />
            </g>
          </clipPath>
        </defs>

        <rect width="100" height="72" fill="#080612" />

        {Array.from({ length: 9 }, (_, i) => (
          <line key={`g${i}`} x1="0" x2="100" y1={i * 8} y2={i * 8} stroke="rgba(0,229,255,0.07)" strokeWidth="0.3" />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`gv${i}`} y1="0" y2="72" x1={i * 10} x2={i * 10} stroke="rgba(0,229,255,0.05)" strokeWidth="0.3" />
        ))}

        {REGIONS.map((r) => (
          <path key={r.id} d={r.d} fill={r.fill} stroke="rgba(0,229,255,0.2)" strokeWidth="0.35" />
        ))}

        <g transform="translate(24 6) scale(0.245)" filter={`url(#${idPrefix}-glow)`}>
          <path d={INDIA} fill="rgba(255,153,51,0.18)" stroke="#00e5ff" strokeWidth="2.2" />
          <path d={SRI} fill="rgba(0,229,255,0.15)" stroke="#00e5ff" strokeWidth="1.2" />
        </g>

        <ellipse
          cx={hx}
          cy={hy + 2}
          rx="18"
          ry="14"
          fill="none"
          stroke={`url(#${idPrefix}-shield)`}
          strokeWidth="0.6"
          strokeDasharray="2 3"
          opacity="0.85"
        >
          <animate attributeName="rx" values="16;20;16" dur="3s" repeatCount="indefinite" />
          <animate attributeName="ry" values="12;16;12" dur="3s" repeatCount="indefinite" />
        </ellipse>

        <g clipPath={`url(#${idPrefix}-india-clip)`}>
          <rect className="attack-map-sweep" x="20" y="0" width="60" height="20" fill="rgba(0,229,255,0.12)" />
        </g>

        {ATTACK_ARCS.map((arc, i) => {
          const [x1, y1] = project(arc.from)
          const [x2, y2] = project(arc.to)
          const mx = (x1 + x2) / 2
          const my = Math.min(y1, y2) - 10 - i * 1.2
          const d = `M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`
          return (
            <g key={arc.label || i}>
              <path d={d} fill="none" stroke="rgba(255,59,92,0.15)" strokeWidth="1.2" />
              <path
                d={d}
                fill="none"
                stroke={`url(#${idPrefix}-arc)`}
                strokeWidth="0.7"
                filter={`url(#${idPrefix}-glow)`}
                strokeDasharray="4 5"
                opacity={0.6 + arc.intensity * 0.35}
                className="attack-arc"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
              <circle cx={x1} cy={y1} r="1.4" fill="#ff3b5c" stroke="#16131c" strokeWidth="0.4">
                <animate attributeName="r" values="1;2.2;1" dur="2s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
              </circle>
              {hero ? (
                <text x={x1 + 1.5} y={y1 - 1.5} fill="rgba(255,245,255,0.65)" fontSize="2.2" fontFamily="Orbitron, sans-serif">
                  {arc.label?.split('→')[0]}
                </text>
              ) : null}
              <circle r="1" fill="#ffe44d" filter={`url(#${idPrefix}-glow)`}>
                <animateMotion dur={`${2.4 + i * 0.35}s`} repeatCount="indefinite" path={d} />
              </circle>
              <g transform={`translate(${mx} ${my + 4})`}>
                <rect x="-4" y="-2.5" width="8" height="3" rx="0.5" fill="#138808" stroke="#16131c" strokeWidth="0.3" />
                <text textAnchor="middle" y="0" fill="#fffdf8" fontSize="1.8" fontFamily="Orbitron, sans-serif">
                  ✕
                </text>
              </g>
            </g>
          )
        })}

        {BHARAT_NODES.map((node, i) => {
          const [x, y] = project([node.lon, node.lat])
          if (node.hub) return null
          return (
            <g key={node.name}>
              <circle cx={x} cy={y} r="1.2" fill="#00e5ff" stroke="#16131c" strokeWidth="0.35">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              {hero ? (
                <text x={x + 1.5} y={y + 0.5} fill="rgba(255,245,255,0.55)" fontSize="2" fontFamily="Orbitron, sans-serif">
                  {node.name.slice(0, 3).toUpperCase()}
                </text>
              ) : null}
            </g>
          )
        })}

        <g filter={`url(#${idPrefix}-glow)`}>
          <circle cx={hx} cy={hy} r="6" fill="none" stroke="#ffe44d" strokeOpacity="0.55">
            <animate attributeName="r" values="5;11" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx={hx} cy={hy} r="3.5" fill={`url(#${idPrefix}-hub)`} stroke="#16131c" strokeWidth="0.55" />
          <g transform={`translate(${hx} ${hy})`}>
            {Array.from({ length: 12 }, (_, s) => (
              <line
                key={s}
                x1="0"
                y1="-0.9"
                x2="0"
                y2="-3"
                stroke="#00e5ff"
                strokeWidth="0.45"
                transform={`rotate(${s * 30})`}
              />
            ))}
          </g>
          <text x={hx + 4.5} y={hy - 3.5} fill="#ffe44d" fontSize="3" fontFamily="Orbitron, sans-serif" letterSpacing="0.1em">
            DELHI HQ
          </text>
          <text x={hx + 4.5} y={hy + 0.5} fill="rgba(255,245,255,0.6)" fontSize="2.2" fontFamily="Orbitron, sans-serif">
            NATIONAL GRID
          </text>
        </g>

        <text x="3" y="6" fill="rgba(255,228,77,0.85)" fontSize="2.8" fontFamily="Orbitron, sans-serif" letterSpacing="0.12em">
          INDO-PAC THEATRE
        </text>
        <text x="97" y="6" textAnchor="end" fill="rgba(34,211,166,0.9)" fontSize="2.4" fontFamily="Orbitron, sans-serif">
          DEFENCE HOLD
        </text>
      </svg>

      {hero ? (
        <div className="attack-map-telemetry">
          <div className="attack-map-stat">
            <span className="attack-map-stat-val">6</span>
            <span className="attack-map-stat-lbl">Hops</span>
          </div>
          <div className="attack-map-stat attack-map-stat-green">
            <span className="attack-map-stat-val">0</span>
            <span className="attack-map-stat-lbl">Breach</span>
          </div>
          <div className="attack-map-stat attack-map-stat-amber">
            <span className="attack-map-stat-val">5</span>
            <span className="attack-map-stat-lbl">Nodes</span>
          </div>
        </div>
      ) : null}

      <div className="attack-map-legend">
        {(hero ? ATTACK_ARCS : ATTACK_ARCS.slice(0, 3)).map((arc) => (
          <span key={arc.label} className="attack-map-hop">
            {arc.label}
          </span>
        ))}
        <span className="attack-map-hop attack-map-hop-secure">ALL BLOCKED</span>
      </div>
    </div>
  )
}
