import { TIMELINE } from '../../data/mock.js'

export default function MissionTimeline() {
  return (
    <ol className="space-y-4">
      {TIMELINE.map((item, i) => (
        <li key={item.t} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="h-3 w-3 rounded-sm border-[2px] border-void bg-cyan shadow-[2px_2px_0_#ff2e97]" />
            {i < TIMELINE.length - 1 && <span className="mt-1 w-[3px] flex-1 bg-amber" />}
          </div>
          <div className="-mt-1">
            <p className="font-display text-[10px] tracking-[0.2em] text-violet">{item.t}</p>
            <p className="text-sm text-mist">{item.title}</p>
            <p className="text-xs text-fog/80">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
