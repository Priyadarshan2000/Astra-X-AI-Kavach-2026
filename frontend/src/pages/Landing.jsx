import { lazy, Suspense, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Radio, ShieldCheck, Cpu, Globe2, ChevronDown, Lock, Crosshair, Fingerprint } from 'lucide-react'
import ParticleField from '../components/effects/ParticleField.jsx'
import ThreatRadar from '../components/effects/ThreatRadar.jsx'
import AttackMap from '../components/effects/AttackMap.jsx'
import HexRings from '../components/effects/HexRings.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import StatCounter from '../components/ui/StatCounter.jsx'
import SimCinematic from '../components/ui/SimCinematic.jsx'
import { PLATFORM_STATS } from '../data/mock.js'
import { useAuth } from '../context/AuthContext.jsx'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Shield3D = lazy(() => import('../components/effects/Shield3D.jsx'))

const TICKER = [
  'THREAT MESH SYNCHRONIZED',
  'CWE CORPUS LOCKED',
  'TWIN SIGNALS NOMINAL',
  'FUZZ HARNESS STANDBY',
  'ZERO-TRUST HOP ACTIVE',
  'ASTRA KERNEL 7.4 ONLINE',
  'DEFENSIVE HOLD ONLY',
]

const TITLE = 'ASTRA-X'
const STAT_TONES = ['pop-cyan', 'pop-violet', 'pop-magenta', 'pop-yellow']
const LOOP_TONES = ['pop-cyan', 'pop-violet', 'pop-magenta', 'pop-yellow']
const LOOP_ICONS = ['text-cyan', 'text-violet', 'text-magenta', 'text-amber']
const CHIPS = [
  { label: 'Scan', tone: '' },
  { label: 'Patch', tone: 'sticker-violet' },
  { label: 'Fuzz', tone: 'sticker-magenta' },
  { label: 'Certify', tone: 'sticker-yellow' },
]
const LOOP = [
  { icon: Radio, title: 'Ingest', copy: 'Arm a digital twin. Source or firmware packet enters the mesh.', n: '01' },
  { icon: Cpu, title: 'Reason', copy: 'Pattern engine maps CWE classes with confidence scoring.', n: '02' },
  { icon: ShieldCheck, title: 'Harden', copy: 'Secure rewrite synthesized in-place. Exec paths removed.', n: '03' },
  { icon: Globe2, title: 'Certify', copy: 'Lab fuzz + five tactical suites lock the mission green.', n: '04' },
]
const PROOF = [
  {
    icon: Lock,
    title: 'Defensive hold',
    copy: 'Static analysis and secure rewrite only. No exploit payloads. No live targeting.',
    tone: 'cyan',
  },
  {
    icon: Crosshair,
    title: 'Twin first',
    copy: 'Every packet is exercised against a digital twin before it reaches the field.',
    tone: 'violet',
  },
  {
    icon: Fingerprint,
    title: 'Lab lock',
    copy: 'Fuzz + regression certify the patch. Reviewers see the loop, not a slide.',
    tone: 'magenta',
  },
]

export default function Landing() {
  const root = useRef(null)
  const navigate = useNavigate()
  const { isAuthed } = useAuth()
  const [sim, setSim] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce } = context.conditions
          if (reduce) {
            gsap.set(
              '.hero-kicker, .hero-char, .hero-sub, .hero-chip, .hero-cta, .hero-stat, .hero-panel, .hero-rail, .hero-stage',
              { autoAlpha: 1, y: 0, rotateX: 0, scale: 1 },
            )
            return
          }

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.from('.hero-rail', { autoAlpha: 0, duration: 0.55 }, 0)
            .from('.hero-kicker', { y: 16, autoAlpha: 0, duration: 0.45 }, 0.05)
            .from('.hero-char', { y: 52, autoAlpha: 0, rotateX: -42, stagger: 0.05, duration: 0.68 }, '-=0.12')
            .from('.hero-sub', { y: 14, autoAlpha: 0, duration: 0.42 }, '-=0.32')
            .from('.hero-chip', { y: 10, autoAlpha: 0, stagger: 0.05, duration: 0.32 }, '-=0.22')
            .from('.hero-cta', { y: 12, autoAlpha: 0, stagger: 0.08, duration: 0.38 }, '-=0.16')
            .from('.hero-panel', { y: 22, autoAlpha: 0, duration: 0.55 }, '-=0.42')
            .from('.hero-stat', { y: 16, autoAlpha: 0, stagger: 0.06, duration: 0.4 }, '-=0.22')
            .from('.hero-stage', { autoAlpha: 0, scale: 0.94, duration: 1.05 }, 0.08)

          gsap.from('.loop-card', {
            y: 28,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.loop-grid', start: 'top 84%' },
          })
          gsap.from('.proof-card', {
            y: 24,
            autoAlpha: 0,
            stagger: 0.1,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.proof-grid', start: 'top 84%' },
          })
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  const launch = () => navigate(isAuthed ? '/dashboard' : '/login')

  return (
    <main ref={root} className="relative overflow-hidden">
      <section className="relative flex min-h-svh flex-col justify-center pt-24 pb-12">
        <ParticleField count={90} />

        <div className="hero-stage pointer-events-none absolute inset-0 flex items-center justify-center lg:translate-x-[16%]">
          <HexRings className="absolute h-[78vmin] w-[78vmin] max-w-[820px] opacity-50" />
          <div className="absolute h-[68vmin] w-[68vmin] max-w-[700px] opacity-90">
            <Suspense fallback={null}>
              <Shield3D className="h-full w-full" />
            </Suspense>
          </div>
          <div className="hero-bloom absolute h-[42vmin] w-[42vmin] rounded-full bg-magenta/20 blur-3xl" />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_8%,var(--void)_82%)]" />

        <p className="hero-rail hero-rail-left">
          <span className="live-dot" /> Theatre Indo-Pac // classified
        </p>
        <p className="hero-rail hero-rail-right">Kernel 7.4 // defensive hold</p>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5" style={{ perspective: 900 }}>
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="text-center lg:col-span-7 lg:text-left">
              <p className="hero-kicker hud-label">
                <span className="live-dot inline-block align-middle" /> Kavach 2026 // national cyber command
              </p>
              <h1 className="hero-title title-pop mt-5 font-display text-5xl tracking-[0.14em] sm:text-7xl lg:text-8xl">
                {TITLE.split('').map((ch, i) => (
                  <span key={`${ch}-${i}`} className="hero-char">
                    {ch}
                  </span>
                ))}
              </h1>
              <p className="hero-sub mx-auto mt-5 max-w-xl text-base text-fog sm:text-lg lg:mx-0">
                Autonomous Security Tactical Reasoning Agent. Scan, patch, fuzz and certify mission software — before it
                ever reaches the field.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                {CHIPS.map((chip) => (
                  <span key={chip.label} className={`hero-chip sticker ${chip.tone}`}>
                    {chip.label}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <div className="hero-cta cta-halo">
                  <NeonButton onClick={launch}>Launch Mission</NeonButton>
                </div>
                <div className="hero-cta">
                  <NeonButton variant="ghost" onClick={() => setSim(true)}>
                    Watch Simulation
                  </NeonButton>
                </div>
              </div>
            </div>

            <div className="hero-panel lg:col-span-5">
              <div className="glass pop-cyan widget-ticks can-lift rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="hud-label">Live picture</p>
                  <span className="sticker sticker-yellow">LIVE</span>
                </div>
                <div className="viz-well !min-h-0 grid place-items-center p-3">
                  <ThreatRadar className="h-44 w-44" idPrefix="hero" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border-[2px] border-ink bg-field px-3 py-2">
                    <p className="font-display text-[9px] tracking-[0.16em] text-fog">TWIN</p>
                    <p className="mt-0.5 text-sm text-mist">Secure Comms</p>
                  </div>
                  <div className="rounded-lg border-[2px] border-ink bg-field px-3 py-2">
                    <p className="font-display text-[9px] tracking-[0.16em] text-fog">HOLD</p>
                    <p className="mt-0.5 font-display text-sm text-mist">91% SCAN</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="sticker">SIG-7</span>
                  <span className="sticker sticker-violet">Mesh sync</span>
                  <span className="sticker sticker-magenta">7 tracks</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PLATFORM_STATS.map((stat, i) => (
              <div key={stat.id} className={`hero-stat glass ${STAT_TONES[i]} widget-ticks can-lift rounded-2xl px-3 py-4`}>
                <p className="font-display text-2xl text-mist sm:text-3xl">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-fog">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-amber"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      <div className="relative overflow-hidden border-y-[3px] border-ink bg-amber py-3">
        <div className="flex w-max animate-[ticker_28s_linear_infinite] gap-10 whitespace-nowrap px-6 font-display text-[11px] tracking-[0.28em] text-ink">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={`${item}-${i}`}>// {item}</span>
          ))}
        </div>
      </div>

      <section className="relative mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="hud-label">Mission doctrine</p>
            <h2 className="mt-3 font-display text-2xl tracking-[0.2em] text-mist text-glow md:text-3xl">TACTICAL LOOP</h2>
          </div>
          <p className="max-w-md text-sm text-fog">
            Four stations. One hold. Reviewers run twin → scan → patch → certify without leaving the mesh.
          </p>
        </div>

        <div className="loop-grid relative mt-10 grid gap-5 md:grid-cols-4">
          <span className="loop-flow" aria-hidden />
          {LOOP.map((card, i) => (
            <div key={card.title} className={`loop-card relative z-10 min-h-[210px] glass ${LOOP_TONES[i]} widget-ticks can-lift rounded-2xl p-5`}>
              <div className="mb-4 flex items-center justify-between">
                <card.icon className={`h-6 w-6 ${LOOP_ICONS[i]}`} />
                <span className="sticker sticker-yellow">{card.n}</span>
              </div>
              <h3 className="font-display text-sm tracking-widest text-mist">{card.title}</h3>
              <p className="mt-2 text-sm text-fog">{card.copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <p className="hud-label">Why it holds</p>
          <h2 className="mt-3 font-display text-2xl tracking-[0.2em] text-mist text-glow">BUILT FOR REVIEW</h2>
          <div className="proof-grid mt-8 grid gap-5 md:grid-cols-3">
            {PROOF.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.title} className={`proof-card glass pop-${card.tone} widget-ticks can-lift rounded-2xl p-6`}>
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg border-[2.5px] border-ink bg-cyan text-ink shadow-[3px_3px_0_#ff2e97]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm tracking-widest text-mist">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{card.copy}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass pop-magenta mt-12 rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="hud-label">Global attack fabric</p>
            <span className="sticker sticker-magenta">6 HOPS</span>
          </div>
          <div className="viz-well !min-h-0 p-3">
            <AttackMap className="h-44 sm:h-56" idPrefix="hero" />
          </div>
        </div>

        <div className="cta-band mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl p-6 md:flex-row md:items-center">
          <div>
            <p className="font-display text-[10px] tracking-[0.22em] uppercase">Request clearance</p>
            <h2 className="mt-2 font-display text-2xl tracking-[0.12em] md:text-3xl">ARM THE TWIN. RUN THE LOOP.</h2>
            <p className="mt-2 max-w-lg text-sm opacity-80">
              Demo login is armed. Scan a lab sample, synthesize a patch, and lock the mission green in minutes.
            </p>
          </div>
          <NeonButton onClick={launch}>Launch Mission</NeonButton>
        </div>
      </section>

      <AnimatePresence>{sim && <SimCinematic onClose={() => setSim(false)} onLaunch={launch} />}</AnimatePresence>
    </main>
  )
}
