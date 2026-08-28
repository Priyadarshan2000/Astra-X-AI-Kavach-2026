import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Radio,
  ShieldCheck,
  Cpu,
  Globe2,
  ChevronDown,
  Lock,
  Crosshair,
  Fingerprint,
  MapPin,
  Shield,
} from 'lucide-react'
import ParticleField from '../components/effects/ParticleField.jsx'
import IndiaMap from '../components/effects/IndiaMap.jsx'
import AttackMap from '../components/effects/AttackMap.jsx'
import HexRings from '../components/effects/HexRings.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import StatCounter from '../components/ui/StatCounter.jsx'
import SimCinematic from '../components/ui/SimCinematic.jsx'
import { PLATFORM_STATS } from '../data/mock.js'
import { ARMY_TICKER, COMMAND_THEATRES, HERO_BADGES } from '../data/landing.js'
import { useAuth } from '../context/AuthContext.jsx'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Shield3D = lazy(() => import('../components/effects/Shield3D.jsx'))

const STAT_TONES = ['pop-cyan', 'pop-violet', 'pop-magenta', 'pop-yellow']
const LOOP_TONES = ['pop-cyan', 'pop-violet', 'pop-magenta', 'pop-yellow']
const LOOP_ICONS = ['text-cyan', 'text-violet', 'text-magenta', 'text-amber']
const CHIPS = [
  { label: 'Twin', tone: '' },
  { label: 'Scan', tone: 'sticker-violet' },
  { label: 'Patch', tone: 'sticker-magenta' },
  { label: 'Certify', tone: 'sticker-yellow' },
]
const LOOP = [
  {
    icon: Radio,
    title: 'Arm Twin',
    copy: 'Clone field comms or logistics firmware into the Bharat defence mesh — twin first, deploy never blind.',
    n: '01',
  },
  {
    icon: Cpu,
    title: 'Scan',
    copy: 'Static intelligence maps CWE classes on tactical source. Built for Army software assurance reviewers.',
    n: '02',
  },
  {
    icon: ShieldCheck,
    title: 'Harden',
    copy: 'Secure rewrite removes exec paths. Bounded patch staged for lab validation before theatre clearance.',
    n: '03',
  },
  {
    icon: Globe2,
    title: 'Certify',
    copy: 'Fuzz + five regression suites lock the mission green. Demonstrable hold for Kavach evaluation.',
    n: '04',
  },
]
const PROOF = [
  {
    icon: Lock,
    title: 'Defensive doctrine',
    copy: 'Static analysis and secure rewrite only. No exploit payloads. No live targeting — lab sandbox hold.',
    tone: 'cyan',
  },
  {
    icon: Crosshair,
    title: 'Theatre-first',
    copy: 'Northern, Western, Southern and Eastern command nodes exercise every build before field software ships.',
    tone: 'violet',
  },
  {
    icon: Fingerprint,
    title: 'Reviewer-ready',
    copy: 'Press one button — watch the full mission drill. Then run twin → scan → patch live on the command deck.',
    tone: 'magenta',
  },
]

export default function Landing() {
  const root = useRef(null)
  const navigate = useNavigate()
  const { isAuthed } = useAuth()
  const [sim, setSim] = useState(false)
  const [meshProgress, setMeshProgress] = useState(62)

  useEffect(() => {
    const id = setInterval(() => {
      setMeshProgress((p) => {
        const next = p + (Math.random() > 0.5 ? 4 : -2)
        return Math.max(48, Math.min(96, next))
      })
    }, 2200)
    return () => clearInterval(id)
  }, [])

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
              '.hero-kicker, .hero-char, .hero-sub, .hero-chip, .hero-cta, .hero-stat, .hero-panel, .hero-rail, .hero-stage, .hero-badges, .chakra-mark',
              { autoAlpha: 1, y: 0, rotateX: 0, scale: 1 },
            )
            return
          }

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
          tl.from('.hero-rail', { autoAlpha: 0, duration: 0.55 }, 0)
            .from('.chakra-mark', { scale: 0.6, autoAlpha: 0, duration: 0.5 }, 0.02)
            .from('.hero-kicker', { y: 16, autoAlpha: 0, duration: 0.45 }, 0.05)
            .from('.hero-hindi', { y: 10, autoAlpha: 0, duration: 0.4 }, '-=0.2')
            .from('.hero-char', { y: 52, autoAlpha: 0, rotateX: -42, stagger: 0.05, duration: 0.68 }, '-=0.12')
            .from('.hero-sub', { y: 14, autoAlpha: 0, duration: 0.42 }, '-=0.32')
            .from('.hero-badges', { y: 10, autoAlpha: 0, duration: 0.35 }, '-=0.28')
            .from('.hero-chip', { y: 10, autoAlpha: 0, stagger: 0.05, duration: 0.32 }, '-=0.22')
            .from('.hero-cta', { y: 12, autoAlpha: 0, stagger: 0.08, duration: 0.38 }, '-=0.16')
            .from('.hero-panel', { y: 22, autoAlpha: 0, duration: 0.55 }, '-=0.42')
            .from('.hero-stat', { y: 16, autoAlpha: 0, stagger: 0.06, duration: 0.4 }, '-=0.22')
            .from('.hero-stage', { autoAlpha: 0, scale: 0.94, duration: 1.05 }, 0.08)

          gsap.from('.command-card', {
            y: 28,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.command-grid', start: 'top 84%' },
          })
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
      <div className="tricolor-ribbon fixed inset-x-0 top-[52px] z-40 sm:top-[56px]" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <section className="relative flex min-h-svh flex-col justify-center pt-28 pb-12">
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
          <span className="live-dot" /> Indo-Pac theatre // Kavach 2026
        </p>
        <p className="hero-rail hero-rail-right">Army cyber command // hold</p>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5" style={{ perspective: 900 }}>
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="text-center lg:col-span-7 lg:text-left">
              <div className="chakra-mark mx-auto mb-4 grid h-14 w-14 place-items-center lg:mx-0" aria-hidden>
                <svg viewBox="0 0 48 48" className="h-full w-full">
                  <circle cx="24" cy="24" r="22" fill="none" stroke="#16131c" strokeWidth="2.5" />
                  <circle cx="24" cy="24" r="4" fill="#16131c" />
                  {Array.from({ length: 24 }, (_, i) => (
                    <line
                      key={i}
                      x1="24"
                      y1="8"
                      x2="24"
                      y2="14"
                      stroke="#087a88"
                      strokeWidth="1.8"
                      transform={`rotate(${i * 15} 24 24)`}
                    />
                  ))}
                </svg>
              </div>

              <p className="hero-kicker hud-label">
                <span className="live-dot inline-block align-middle" /> Kavach 2026 // Indian Army cyber demonstration
              </p>
              <p className="hero-hindi hindi-kicker mt-3 text-lg sm:text-xl">राष्ट्रीय साइबर कवच — ASTRA-X</p>
              <h1 className="hero-title title-pop mt-4 font-display text-5xl tracking-[0.14em] sm:text-7xl lg:text-8xl">
                {'ASTRA-X'.split('').map((ch, i) => (
                  <span key={`${ch}-${i}`} className="hero-char">
                    {ch}
                  </span>
                ))}
              </h1>
              <p className="hero-sub mx-auto mt-5 max-w-xl text-base text-fog sm:text-lg lg:mx-0">
                Autonomous Security Tactical Reasoning Agent for the Indian Army. Scan, patch, fuzz and certify mission
                software on the Bharat defence mesh — before it reaches the field.
              </p>

              <div className="hero-badges mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                {HERO_BADGES.map((b) => (
                  <span key={b.label} className={`sticker ${b.tone}`}>
                    {b.label}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                {CHIPS.map((chip) => (
                  <span key={chip.label} className={`hero-chip sticker ${chip.tone}`}>
                    {chip.label}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <div className="hero-cta cta-halo">
                  <NeonButton onClick={launch}>Enter Command Deck</NeonButton>
                </div>
                <div className="hero-cta">
                  <NeonButton variant="ghost" onClick={() => setSim(true)}>
                    Run Mission Briefing
                  </NeonButton>
                </div>
              </div>
            </div>

            <div className="hero-panel lg:col-span-5">
              <div className="glass pop-cyan widget-ticks can-lift rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="hud-label">Bharat defence mesh</p>
                  <span className="sticker sticker-yellow">
                    <span className="live-dot" /> LIVE
                  </span>
                </div>
                <div className="viz-well !min-h-0 grid place-items-center p-2">
                  <IndiaMap progress={meshProgress} className="h-[min(36vh,280px)] w-full" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border-[2px] border-ink bg-field px-3 py-2">
                    <p className="font-display text-[9px] tracking-[0.16em] text-fog">HQ NODE</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-mist">
                      <MapPin className="h-3 w-3 text-cyan" /> Delhi
                    </p>
                  </div>
                  <div className="rounded-lg border-[2px] border-ink bg-field px-3 py-2">
                    <p className="font-display text-[9px] tracking-[0.16em] text-fog">MESH SYNC</p>
                    <p className="mt-0.5 font-display text-sm text-mist">{Math.round(meshProgress)}% HOLD</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="sticker">8 nodes</span>
                  <span className="sticker sticker-violet">4 commands</span>
                  <span className="sticker sticker-magenta">Defensive</span>
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
        <div className="flex w-max animate-[ticker_32s_linear_infinite] gap-10 whitespace-nowrap px-6 font-display text-[11px] tracking-[0.24em] text-ink">
          {[...ARMY_TICKER, ...ARMY_TICKER].map((item, i) => (
            <span key={`${item}-${i}`}>// {item}</span>
          ))}
        </div>
      </div>

      <section className="relative mx-auto max-w-7xl px-5 py-24">
        <div className="command-grid">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hud-label">Theatre status</p>
              <h2 className="mt-3 font-display text-2xl tracking-[0.2em] text-mist text-glow md:text-3xl">
                ARMY COMMAND NODES
              </h2>
              <p className="hindi-kicker mt-2 text-sm">चार कमान — एक राष्ट्रीय जाल</p>
            </div>
            <p className="max-w-md text-sm text-fog">
              Northern, Western, Southern and Eastern commands sync through the national cyber mesh. Every build is
              exercised before field deployment.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMMAND_THEATRES.map((cmd) => (
              <div key={cmd.code} className={`command-card glass ${cmd.tone} widget-ticks can-lift rounded-2xl p-5`}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border-[2.5px] border-ink bg-amber font-display text-xs text-ink shadow-[3px_3px_0_#ff2e97]">
                    {cmd.code}
                  </span>
                  <span className="sticker sticker-yellow">{cmd.status}</span>
                </div>
                <h3 className="font-display text-sm tracking-widest text-mist">{cmd.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-fog">
                  <Shield className="h-3 w-3" /> HQ {cmd.hq}
                </p>
                <p className="mt-2 text-sm text-fog">{cmd.sector}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="hud-label">Mission doctrine</p>
            <h2 className="mt-3 font-display text-2xl tracking-[0.2em] text-mist text-glow md:text-3xl">TACTICAL LOOP</h2>
            <p className="hindi-kicker mt-2 text-sm">ट्विन → स्कैन → पैच → प्रमाणन</p>
          </div>
          <p className="max-w-md text-sm text-fog">
            Four stations. One hold. Kavach reviewers run the full loop without leaving the mesh — press briefing, then
            live demo.
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
          <h2 className="mt-3 font-display text-2xl tracking-[0.2em] text-mist text-glow">BUILT FOR KAVACH REVIEW</h2>
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

        <div className="glass pop-magenta mt-12 overflow-hidden rounded-2xl">
          <div className="tricolor-ribbon" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="hud-label">Threat ingress map</p>
                <p className="hindi-kicker mt-2 text-sm">भारत नोड्स पर इनबाउंड खतरा — सभी अवरुद्ध</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="sticker sticker-magenta">INDO-PAC FABRIC</span>
                <span className="sticker sticker-yellow">DEFENCE HOLD</span>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fog">
              Simulated attack hops from Shanghai, Tokyo, Moscow, Sydney, Washington and Singapore converge on Delhi HQ.
              ASTRA-X maintains defensive posture — no live targeting in this Kavach 2026 demonstration.
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-12">
              <div className="grid gap-2 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
                {[
                  { val: '6', lbl: 'Inbound hops', tone: 'pop-cyan' },
                  { val: '0', lbl: 'Breaches', tone: 'pop-yellow' },
                  { val: '5', lbl: 'Bharat nodes', tone: 'pop-violet' },
                  { val: '100%', lbl: 'Hold status', tone: 'pop-magenta' },
                ].map((stat) => (
                  <div
                    key={stat.lbl}
                    className={`rounded-xl border-[2px] border-ink bg-panel px-3 py-2.5 shadow-[3px_3px_0_#00c8dc]`}
                  >
                    <p className="font-display text-xl text-mist">{stat.val}</p>
                    <p className="mt-0.5 font-display text-[8px] tracking-[0.16em] text-fog uppercase">{stat.lbl}</p>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-9">
                <div className="viz-well viz-well-tactical min-h-[280px] p-2 sm:min-h-[320px]">
                  <AttackMap variant="hero" className="h-full min-h-[260px] sm:min-h-[300px]" idPrefix="hero" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-band mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl p-6 md:flex-row md:items-center">
          <div>
            <p className="font-display text-[10px] tracking-[0.22em] uppercase">Kavach 2026 clearance</p>
            <h2 className="mt-2 font-display text-2xl tracking-[0.12em] md:text-3xl">ARM THE TWIN. RUN THE LOOP.</h2>
            <p className="hindi-kicker mt-2 text-sm">मिशन ब्रीफिंग देखें, फिर कमान डेक पर लाइव चलाएँ</p>
            <p className="mt-2 max-w-lg text-sm opacity-80">
              Demo login is armed. Run the mission briefing, then scan a lab sample and lock the mission green in
              minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <NeonButton onClick={() => setSim(true)} variant="ghost">
              Mission Briefing
            </NeonButton>
            <NeonButton onClick={launch}>Enter Command Deck</NeonButton>
          </div>
        </div>
      </section>

      <AnimatePresence>{sim && <SimCinematic onClose={() => setSim(false)} onLaunch={launch} />}</AnimatePresence>
    </main>
  )
}
