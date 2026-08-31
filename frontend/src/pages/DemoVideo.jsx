import { Play, Film } from 'lucide-react'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import { DEMO_TIMELINE, NARRATOR_SCRIPT } from '../data/demoVideo.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function DemoVideo() {
  const navigate = useNavigate()
  const { isAuthed } = useAuth()

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-24">
      <PageHeader
        kicker="90-second walkthrough"
        title="DEMO VIDEO"
        detail="Timeline, key moments, and narrator script for Kavach 2026 presentation."
      />

      <GlassPanel className="mt-8 p-8" tone="magenta" hover={false}>
        <div className="grid aspect-video place-items-center rounded-xl border-[2.5px] border-dashed border-ink/30 bg-code">
          <div className="text-center">
            <Film className="mx-auto h-12 w-12 text-violet" />
            <p className="mt-4 font-display text-lg tracking-widest text-mist">DEMO RECORDING PLACEHOLDER</p>
            <p className="mt-2 text-sm text-fog">Record 90s walkthrough using script below · MP4 embed here</p>
            <NeonButton className="mt-6" onClick={() => navigate(isAuthed ? '/dashboard' : '/login')}>
              <Play className="mr-1 inline h-4 w-4" /> Launch Live Demo
            </NeonButton>
          </div>
        </div>
      </GlassPanel>

      <section className="mt-10">
        <p className="hud-label">Timeline</p>
        <div className="mt-4 space-y-3">
          {DEMO_TIMELINE.map((step) => (
            <GlassPanel key={step.t} className="flex gap-4 p-4" tone="cyan">
              <span className="font-mono text-sm text-amber">{step.t}</span>
              <div>
                <p className="font-display text-sm tracking-widest text-mist">{step.title}</p>
                <p className="mt-1 text-sm text-fog">{step.detail}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <p className="hud-label">Narrator script</p>
        <GlassPanel className="mt-4 p-6" tone="yellow" hover={false}>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-mist">{NARRATOR_SCRIPT}</pre>
        </GlassPanel>
      </section>
    </main>
  )
}
