import { TIMELINE } from '../../data/mock.js'

export default function MissionTimeline() {
  return (
    <ol className="space-y-2.5">
      {TIMELINE.map((item, i) => {
        const current = i === 0
        return (
          <li
            key={item.t}
            className={`flex gap-3 rounded-lg border-[2px] px-3 py-2 ${
              current ? 'border-ink bg-ink text-white shadow-[3px_3px_0_#ffe44d]' : 'border-ink/15 bg-field'
            }`}
          >
            <div className="flex flex-col items-center pt-1">
              <span
                className={`h-3 w-3 rounded-sm border-[2px] border-ink ${current ? 'bg-amber' : 'bg-cyan'} shadow-[2px_2px_0_#ff2e97]`}
              />
              {i < TIMELINE.length - 1 && <span className="mt-1 w-[3px] flex-1 min-h-4 bg-amber" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={`font-display text-[10px] tracking-[0.2em] ${current ? 'text-amber' : 'text-violet'}`}>
                  {item.t}
                </p>
                {current ? <span className="font-display text-[9px] tracking-[0.18em] text-amber">NOW</span> : null}
              </div>
              <p className={`text-sm font-medium ${current ? 'text-white' : 'text-mist'}`}>{item.title}</p>
              <p className={`text-xs ${current ? 'text-white/70' : 'text-fog'}`}>{item.detail}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
