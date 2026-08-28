import { ATTACK_ARCS } from '../../data/mock.js'

function project([lon, lat]) {
  const x = ((lon + 180) / 360) * 100
  const y = ((90 - lat) / 180) * 100
  return [x, y]
}

const CONTINENTS = [
  'M12 28 C18 22 28 24 32 30 C30 38 22 42 14 40 C10 36 10 31 12 28Z',
  'M34 22 C42 18 50 20 54 26 C52 34 44 38 36 34 C32 30 32 24 34 22Z',
  'M56 30 C66 26 76 32 78 42 C72 50 62 52 56 46 C52 40 52 34 56 30Z',
  'M20 52 C28 48 36 54 34 64 C28 70 20 68 16 60 C16 56 18 53 20 52Z',
  'M70 58 C78 54 88 58 90 66 C86 74 76 74 70 68 C68 64 68 60 70 58Z',
  'M82 78 C88 76 94 80 92 86 C86 88 80 84 82 78Z',
]

export default function AttackMap({ className = '', idPrefix = 'map' }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 56" className="h-full w-full">
        <defs>
          <linearGradient id={`${idPrefix}-arc`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c4dff" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
          <filter id={`${idPrefix}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {CONTINENTS.map((d, i) => (
          <path key={i} d={d} fill="rgba(0,229,255,0.12)" stroke="rgba(0,229,255,0.35)" strokeWidth="0.25" />
        ))}
        {ATTACK_ARCS.map((arc, i) => {
          const [x1, y1] = project(arc.from)
          const [x2, y2] = project(arc.to)
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2 - 10
          return (
            <g key={i}>
              <path
                d={`M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                fill="none"
                stroke={`url(#${idPrefix}-arc)`}
                strokeWidth="0.55"
                filter={`url(#${idPrefix}-glow)`}
                strokeDasharray="4 6"
                opacity={arc.intensity}
                style={{ animation: 'dash-flow 3.2s linear infinite' }}
              />
              <circle cx={x1} cy={y1} r="0.9" fill="#ff3b5c">
                <animate attributeName="r" values="0.7;1.6;0.7" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x2} cy={y2} r="0.8" fill="#00e5ff" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
