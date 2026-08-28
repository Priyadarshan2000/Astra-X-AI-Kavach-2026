import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  CheckCircle2,
  XCircle,
  Bot,
  ExternalLink,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import GlassPanel from '../components/ui/GlassPanel.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import MissionStrip from '../components/ui/MissionStrip.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import StatCounter from '../components/ui/StatCounter.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { PLATFORM_STATS } from '../data/mock.js'
import { COMMAND_THEATRES, HERO_BADGES } from '../data/landing.js'
import {
  CAPABILITIES,
  MISSION_PHASES,
  CWE_SUPPORT,
  TECH_STACK,
  DOCTRINE,
  PROOF,
  AGENT_FEATURES,
  REVIEWER_STEPS,
  DEMO_CREDS,
} from '../data/about.js'

const STAT_TONES = ['pop-cyan', 'pop-violet', 'pop-magenta', 'pop-yellow']

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

export default function About() {
  const navigate = useNavigate()
  const { isAuthed } = useAuth()
  const launch = () => navigate(isAuthed ? '/dashboard' : '/login')

  return (
    <main className="relative mx-auto max-w-7xl px-5 pb-20 pt-24">
      <PageHeader
        kicker="Platform doctrine"
        title="ABOUT ASTRA-X"
        detail="Autonomous Security Tactical Reasoning Agent — defence-grade AI copilot for Kavach 2026. Scan. Patch. Certify. Never weaponize."
        extra={
          <div className="flex flex-wrap justify-end gap-2">
            {HERO_BADGES.map((b) => (
              <span key={b.label} className={`sticker ${b.tone}`}>
                {b.label}
              </span>
            ))}
          </div>
        }
      />

      <MissionStrip />

      {/* Manifesto */}
      <GlassPanel className="relative overflow-hidden p-6 sm:p-8" hover={false} tone="cyan" delay={0.02}>
        <div className="tricolor-ribbon absolute inset-x-0 top-0" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="relative mt-2 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="hindi-kicker text-base sm:text-lg">राष्ट्रीय साइबर कवच — भारतीय सेना</p>
            <h2 className="mt-3 font-display text-2xl tracking-[0.12em] text-mist sm:text-3xl">
              MISSION SOFTWARE ASSURANCE
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fog sm:text-lg">
              ASTRA-X (<strong className="text-mist">A</strong>utonomous{' '}
              <strong className="text-mist">S</strong>ecurity{' '}
              <strong className="text-mist">T</strong>actical{' '}
              <strong className="text-mist">R</strong>easoning{' '}
              <strong className="text-mist">A</strong>gent) is a defence-tech command platform built for{' '}
              <strong className="text-mist">Kavach 2026</strong>. It demonstrates how an AI copilot can ingest
              mission-critical field software, map vulnerability classes to the CWE taxonomy, synthesize defensive
              patches, and certify builds through lab fuzzing and regression — without ever becoming an offensive
              toolkit.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fog">
              Twin first, deploy never blind. Every build is exercised across the Bharat defence mesh before it
              reaches Northern, Western, Southern, or Eastern Command theatre nodes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <NeonButton onClick={launch}>Enter Command Deck</NeonButton>
              <NeonButton variant="ghost" onClick={() => window.open('https://astra-x-ai-kavach-2026.vercel.app/', '_blank')}>
                Live Deploy ↗
              </NeonButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-5">
            {PLATFORM_STATS.map((stat, i) => (
              <div
                key={stat.id}
                className={`rounded-xl border-[2px] border-ink bg-panel px-3 py-4 shadow-[4px_4px_0_#8b5cff] ${STAT_TONES[i]}`}
              >
                <p className="font-display text-xl text-mist sm:text-2xl">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-widest text-fog">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* Core capabilities */}
      <motion.section {...fadeUp} className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="hud-label">Platform capabilities</p>
            <h2 className="mt-3 font-display text-2xl tracking-[0.16em] text-mist md:text-3xl">SIX STATIONS. ONE HOLD.</h2>
            <p className="hindi-kicker mt-2 text-sm">ट्विन → स्कैन → पैच → फज़ → परीक्षण → प्रमाणन</p>
          </div>
          <p className="max-w-md text-sm text-fog">
            End-to-end defensive pipeline from digital twin deployment to certified after-action report.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon
            return (
              <GlassPanel key={cap.title} className="p-5" tone={cap.tone.replace('pop-', '')} delay={i * 0.04}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg border-[2.5px] border-ink bg-cyan text-ink shadow-[3px_3px_0_#ff2e97]">
                    <Icon className={`h-5 w-5 ${cap.iconTone}`} />
                  </div>
                  <span className="font-display text-[9px] tracking-[0.2em] text-fog">{cap.hindi}</span>
                </div>
                <h3 className="font-display text-sm tracking-widest text-mist">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{cap.copy}</p>
              </GlassPanel>
            )
          })}
        </div>
      </motion.section>

      {/* Mission phases timeline */}
      <motion.section {...fadeUp} className="mt-16">
        <GlassPanel className="p-6 sm:p-8" hover={false} tone="violet">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hud-label">Five-phase mission</p>
              <h2 className="mt-2 font-display text-2xl tracking-[0.14em] text-mist">KAVACH MISSION TIMELINE</h2>
            </div>
            <span className="sticker sticker-yellow">
              <span className="live-dot" /> CERT KAVACH-2026-ASTRA-7741
            </span>
          </div>
          <div className="relative space-y-0">
            {MISSION_PHASES.map((phase, i) => (
              <div key={phase.n} className="relative flex gap-4 pb-8 last:pb-0">
                {i < MISSION_PHASES.length - 1 && (
                  <span
                    className="absolute left-[19px] top-10 h-[calc(100%-16px)] w-[2px] bg-ink/20"
                    aria-hidden
                  />
                )}
                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-lg border-[2.5px] border-ink bg-amber font-display text-xs text-ink shadow-[3px_3px_0_#ff2e97]">
                  {phase.n}
                </span>
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-sm tracking-widest text-mist">{phase.phase}</h3>
                    <span className="text-xs text-fog">· {phase.hindi}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-fog">{phase.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.section>

      {/* CWE + Tech stack */}
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <motion.div {...fadeUp}>
          <GlassPanel className="h-full p-6" hover={false} tone="magenta">
            <p className="hud-label">Vulnerability intelligence</p>
            <h2 className="mt-2 font-display text-xl tracking-[0.14em] text-mist">CWE TAXONOMY</h2>
            <p className="mt-2 text-sm text-fog">
              Pattern engine aligned with Army software assurance doctrine. Supports C, C++, Python and Java.
            </p>
            <div className="mt-5 space-y-2">
              {CWE_SUPPORT.map((cwe) => (
                <div
                  key={cwe.code}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border-[2px] border-ink bg-field px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[10px] tracking-widest text-cyan">{cwe.code}</span>
                    <span className="text-sm text-mist">{cwe.label}</span>
                  </div>
                  <span className="sticker text-[9px]">{cwe.langs}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div {...fadeUp}>
          <GlassPanel className="h-full p-6" hover={false} tone="yellow">
            <p className="hud-label">Engineering stack</p>
            <h2 className="mt-2 font-display text-xl tracking-[0.14em] text-mist">TECHNOLOGY</h2>
            <p className="mt-2 text-sm text-fog">
              Modern React command deck with PHP REST API. Frontend deploys to Vercel; API runs on XAMPP or PHP
              built-in server.
            </p>
            <div className="mt-5 space-y-3">
              {TECH_STACK.map((row) => (
                <div key={row.layer} className="rounded-lg border-[2px] border-ink bg-panel px-3 py-3">
                  <p className="font-display text-[10px] tracking-[0.2em] text-violet">{row.layer}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fog">{row.items}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Defensive doctrine */}
      <motion.section {...fadeUp} className="mt-16">
        <div className="mb-6">
          <p className="hud-label">Operational boundaries</p>
          <h2 className="mt-2 font-display text-2xl tracking-[0.14em] text-mist">DEFENSIVE DOCTRINE</h2>
          <p className="hindi-kicker mt-2 text-sm">केवल रक्षात्मक — कभी हथियार नहीं</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <GlassPanel className="p-6" hover={false} tone="cyan">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald" />
              <h3 className="font-display text-sm tracking-widest text-mist">WHAT ASTRA-X HOLDS</h3>
            </div>
            <ul className="space-y-3">
              {DOCTRINE.holds.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-fog">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
          <GlassPanel className="p-6" hover={false} tone="magenta">
            <div className="mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-crimson" />
              <h3 className="font-display text-sm tracking-widest text-mist">WHAT ASTRA-X NEVER DOES</h3>
            </div>
            <ul className="space-y-3">
              {DOCTRINE.never.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-fog">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-crimson/80" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      </motion.section>

      {/* Why Kavach reviewers */}
      <motion.section {...fadeUp} className="mt-16">
        <p className="hud-label">Evaluation readiness</p>
        <h2 className="mt-2 font-display text-2xl tracking-[0.14em] text-mist">BUILT FOR KAVACH REVIEW</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PROOF.map((card) => {
            const Icon = card.icon
            return (
              <GlassPanel key={card.title} className="p-6" tone={card.tone}>
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg border-[2.5px] border-ink bg-cyan text-ink shadow-[3px_3px_0_#ff2e97]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-sm tracking-widest text-mist">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{card.copy}</p>
              </GlassPanel>
            )
          })}
        </div>
      </motion.section>

      {/* Command theatres */}
      <motion.section {...fadeUp} className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="hud-label">Theatre status</p>
            <h2 className="mt-2 font-display text-2xl tracking-[0.14em] text-mist">ARMY COMMAND NODES</h2>
            <p className="hindi-kicker mt-2 text-sm">चार कमान — एक राष्ट्रीय जाल</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMMAND_THEATRES.map((cmd, i) => (
            <GlassPanel key={cmd.code} className="p-5" tone={cmd.tone.replace('pop-', '')} delay={i * 0.04}>
              <div className="mb-3 flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg border-[2.5px] border-ink bg-amber font-display text-xs text-ink shadow-[3px_3px_0_#ff2e97]">
                  {cmd.code}
                </span>
                <span className="sticker sticker-yellow">{cmd.status}</span>
              </div>
              <h3 className="font-display text-sm tracking-widest text-mist">{cmd.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-fog">
                <MapPin className="h-3 w-3" /> HQ {cmd.hq}
              </p>
              <p className="mt-2 text-sm text-fog">{cmd.sector}</p>
            </GlassPanel>
          ))}
        </div>
      </motion.section>

      {/* ASTRA-X Agent */}
      <motion.section {...fadeUp} className="mt-16">
        <GlassPanel className="p-6 sm:p-8" hover={false} tone="violet">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl border-[2.5px] border-ink bg-violet text-ink shadow-[4px_4px_0_#00e5ff]">
                <Bot className="h-7 w-7" />
              </div>
              <p className="hud-label">AI copilot</p>
              <h2 className="mt-2 font-display text-xl tracking-[0.14em] text-mist sm:text-2xl">ASTRA-X AGENT</h2>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                Context-aware chat assistant in the bottom-right corner. Ask about mission status, next steps, Kavach
                2026 brief, or demo credentials — available on every page.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid gap-2 sm:grid-cols-2">
                {AGENT_FEATURES.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 rounded-lg border-[2px] border-ink bg-field px-3 py-2.5 text-sm text-fog"
                  >
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                    {feat}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-fog">
                Try: &ldquo;Mission status&rdquo; · &ldquo;What is next?&rdquo; · &ldquo;Kavach 2026 brief&rdquo; ·
                &ldquo;Demo login&rdquo;
              </p>
            </div>
          </div>
        </GlassPanel>
      </motion.section>

      {/* Reviewer walkthrough + demo creds */}
      <motion.section {...fadeUp} className="mt-16">
        <GlassPanel className="overflow-hidden p-0" hover={false} tone="cyan">
          <div className="tricolor-ribbon" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <div className="grid lg:grid-cols-12">
            <div className="border-b-[2px] border-ink p-6 lg:col-span-5 lg:border-b-0 lg:border-r-[2px]">
              <p className="hud-label">Reviewer walkthrough</p>
              <h2 className="mt-2 font-display text-xl tracking-[0.14em] text-mist">5-MINUTE EVALUATION</h2>
              <p className="mt-3 text-sm text-fog">
                Follow the highlighted next action on the command deck or status bar after login.
              </p>
              <div className="mt-5 space-y-3">
                {REVIEWER_STEPS.map((s) => (
                  <div key={s.step} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border-[2px] border-ink bg-amber font-display text-[10px] text-ink">
                      {s.step}
                    </span>
                    <div>
                      <p className="font-display text-[11px] tracking-widest text-mist">{s.label}</p>
                      <p className="text-xs text-fog">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-6 p-6 lg:col-span-7">
              <div>
                <p className="hud-label">Demo clearance</p>
                <h3 className="mt-2 font-display text-lg tracking-[0.12em] text-mist">ARMED FOR KAVACH REVIEW</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border-[2px] border-ink bg-field px-4 py-3">
                    <p className="font-display text-[9px] tracking-[0.18em] text-fog">CLEARANCE ID</p>
                    <p className="mt-1 font-mono text-sm text-mist">{DEMO_CREDS.id}</p>
                  </div>
                  <div className="rounded-xl border-[2px] border-ink bg-field px-4 py-3">
                    <p className="font-display text-[9px] tracking-[0.18em] text-fog">PASSPHRASE</p>
                    <p className="mt-1 font-mono text-sm text-mist">{DEMO_CREDS.pass}</p>
                  </div>
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs text-fog">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live deploy:{' '}
                  <a
                    href="https://astra-x-ai-kavach-2026.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan underline-offset-2 hover:underline"
                  >
                    astra-x-ai-kavach-2026.vercel.app
                  </a>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <NeonButton onClick={launch}>Enter Command Deck</NeonButton>
                <NeonButton variant="ghost" onClick={() => navigate('/login')}>
                  Demo Login
                </NeonButton>
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.section>

      {/* Footer CTA */}
      <motion.div {...fadeUp} className="cta-band mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl p-6 md:flex-row md:items-center">
        <div>
          <p className="font-display text-[10px] tracking-[0.22em] uppercase">Kavach 2026</p>
          <h2 className="mt-2 font-display text-2xl tracking-[0.12em] md:text-3xl">TWIN FIRST. DEPLOY NEVER BLIND.</h2>
          <p className="hindi-kicker mt-2 text-sm">रक्षात्मक होल्ड — प्रयोगशाला सैंडबॉक्स मात्र</p>
        </div>
        <NeonButton onClick={launch}>Launch Mission</NeonButton>
      </motion.div>
    </main>
  )
}
