export default function NeonButton({ children, onClick, variant = 'primary', className = '', type = 'button' }) {
  const styles =
    variant === 'ghost'
      ? 'btn-ghost bg-void text-cyan border-cyan shadow-[5px_5px_0_#8b5cff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#8b5cff]'
      : variant === 'yellow'
        ? 'bg-amber text-ink border-ink shadow-[5px_5px_0_#ff2e97] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#ff2e97]'
        : 'bg-cyan text-ink border-ink shadow-[5px_5px_0_#ff2e97] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#ff2e97]'

  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border-[2.5px] px-6 py-3 font-display text-[11px] tracking-[0.22em] uppercase transition-transform duration-150 will-change-transform active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${styles} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}
