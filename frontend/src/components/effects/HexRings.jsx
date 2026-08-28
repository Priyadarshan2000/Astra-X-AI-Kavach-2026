export default function HexRings({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g fill="none" strokeWidth="0.6">
        <g style={{ transformOrigin: '100px 100px', animation: 'spin-slow 22s linear infinite' }}>
          <polygon points="100,18 168,58 168,142 100,182 32,142 32,58" stroke="rgba(0,229,255,0.3)" fill="none" />
        </g>
        <g style={{ transformOrigin: '100px 100px', animation: 'spin-slow 32s linear infinite reverse' }}>
          <polygon points="100,36 152,66 152,134 100,164 48,134 48,66" stroke="rgba(124,77,255,0.38)" fill="none" />
        </g>
        <circle cx="100" cy="100" r="44" fill="none" stroke="rgba(0,229,255,0.15)" />
        <circle cx="100" cy="100" r="22" fill="none" stroke="rgba(0,229,255,0.22)" />
      </g>
    </svg>
  )
}
