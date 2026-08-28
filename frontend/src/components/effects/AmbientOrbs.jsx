export default function AmbientOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="orb h-[360px] w-[360px] bg-magenta/25" style={{ top: '-10%', left: '-8%' }} />
      <div className="orb h-[320px] w-[320px] bg-cyan/20" style={{ top: '-8%', right: '-10%' }} />
      <div className="blob blob-cyan" style={{ top: '6%', left: '-3%' }} />
      <div className="blob blob-magenta" style={{ top: '14%', right: '-4%' }} />
      <div className="blob blob-yellow" style={{ bottom: '12%', left: '14%' }} />
      <div className="blob blob-violet" style={{ bottom: '-4%', right: '8%' }} />
    </div>
  )
}
