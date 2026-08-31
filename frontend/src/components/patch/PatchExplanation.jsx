const SEVERITY = {
  critical: { label: 'CRITICAL', className: 'border-magenta bg-magenta/10 text-magenta' },
  high: { label: 'HIGH', className: 'border-amber bg-amber/10 text-amber' },
  medium: { label: 'MEDIUM', className: 'border-cyan bg-cyan/10 text-cyan' },
  low: { label: 'LOW', className: 'border-fog bg-panel text-fog' },
}

function severityTone(level = 'medium') {
  return SEVERITY[level] || SEVERITY.medium
}

export default function PatchExplanation({ explanation, loading, fallbackNotes = [] }) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-amber/20" />
        <div className="h-16 animate-pulse rounded-xl border-[2px] border-ink/10 bg-panel/60" />
        <div className="h-16 animate-pulse rounded-xl border-[2px] border-ink/10 bg-panel/60" />
        <p className="text-xs uppercase tracking-widest text-fog">ASTRA-X analyzing rewrite…</p>
      </div>
    )
  }

  const items = explanation?.items?.length ? explanation.items : fallbackNotes.map((note) => ({
    title: 'Defensive rewrite',
    cwe: 'CWE-000',
    severity: 'medium',
    change: note,
    detail: note,
    reviewerTip: 'Validate in lab fuzz before certification.',
  }))

  return (
    <div className="space-y-4">
      {explanation?.summary ? (
        <p className="rounded-xl border-[2px] border-cyan/30 bg-cyan/5 px-4 py-3 text-sm leading-relaxed text-mist">
          {explanation.summary}
        </p>
      ) : null}

      <div className="grid gap-3">
        {items.map((item, index) => {
          const tone = severityTone(item.severity)
          return (
            <article
              key={`${item.cwe}-${index}`}
              className="rounded-xl border-[2px] border-ink/15 bg-panel/80 p-4 shadow-[4px_4px_0_#8b5cff]"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-md border-[2px] px-2 py-0.5 font-ui text-[10px] font-bold tracking-widest ${tone.className}`}>
                  {tone.label}
                </span>
                <span className="rounded-md border border-ink/20 bg-field px-2 py-0.5 font-mono text-[10px] text-cyan">
                  {item.cwe}
                </span>
                <h3 className="font-display text-xs tracking-[0.12em] text-mist">{item.title}</h3>
              </div>

              {item.change ? (
                <p className="mb-2 font-mono text-[11px] text-amber">{item.change}</p>
              ) : null}

              <p className="text-sm leading-relaxed text-fog">{item.detail}</p>

              {item.reviewerTip ? (
                <p className="mt-3 border-l-[3px] border-violet pl-3 text-xs text-mist">
                  <span className="font-semibold uppercase tracking-wide text-violet">Reviewer hold: </span>
                  {item.reviewerTip}
                </p>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
