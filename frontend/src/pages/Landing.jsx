import { lazy, Suspense, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Radio, ShieldCheck, Cpu, Globe2, ChevronDown } from 'lucide-react'
import ParticleField from '../components/effects/ParticleField.jsx'
import ThreatRadar from '../components/effects/ThreatRadar.jsx'
import AttackMap from '../components/effects/AttackMap.jsx'
import HexRings from '../components/effects/HexRings.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import StatCounter from '../components/ui/StatCounter.jsx'
import SimCinematic from '../components/ui/SimCinematic.jsx'
import { PLATFORM_STATS } from '../data/mock.js'
import { useAuth } from '../context/AuthContext.jsx'

gsap.registerPlugin(useGSAP)

const Shield3D = lazy(() => import('../components/effects/Shield3D.jsx'))

const TICKER = [
  'THREAT MESH SYNCHRONIZED',
  'CWE CORPUS LOCKED',
  'TWIN SIGNALS NOMINAL',
  'FUZZ HARNESS STANDBY',
  'ZERO-TRUST HOP ACTIVE',
  'ASTRA KERNEL 7.4 ONLINE',
]

const TITLE = 'ASTRA-X'
const STAT_TONES = ['pop-cyan', 'pop-violet', 'pop-magenta', 'pop-yellow']
const LOOP_TONES = ['pop-cyan', 'pop-violet', 'pop-magenta', 'pop-yellow']
const LOOP_ICONS = ['text-cyan', 'text-violet', 'text-magenta', 'text-amber']

export default function Landing() {
  const root = useRef(null)
  const navigate = useNavigate()
  const { isAuthed } = useAuth()
  const [sim, setSim] = useState(false)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-kicker', { y: 16, autoAlpha: 0, duration: 0.5 })
        .from('.hero-char', { y: 56, autoAlpha: 0, rotateX: -50, stagger: 0.055, duration: 0.72 }, '-=0.18')
        .from('.hero-sub', { y: 16, autoAlpha: 0, duration: 0.48 }, '-=0.35')
        .from('.hero-cta', { y: 12, autoAlpha: 0, stagger: 0.08, duration: 0.4 }, '-=0.18')
        .from('.hero-stat', { y: 18, autoAlpha: 0, stagger: 0.06, duration: 0.42 }, '-=0.16')
        .from('.hero-stage', { autoAlpha: 0, scale: 0.92, duration: 1.1 }, 0.1)
    },
    { scope: root },
  )

  const launch = () => navigate(isAuthed ? '/dashboard' : '/login')

  return (
    <main ref={root} className="relative overflow-hidden">
      <section className="relative flex min-h-svh flex-col justify-center pt-20 pb-10">
        <ParticleField count={90} />

        <div className="hero-stage pointer-events-none absolute inset-0 flex items-center justify-center">
          <HexRings className="absolute h-[78vmin] w-[78vmin] max-w-[820px] opacity-50" />
          <div className="absolute h-[68vmin] w-[68vmin] max-w-[700px] opacity-90">
            <Suspense fallback={null}>
              <Shield3D className="h-full w-full" />
            </Suspense>
          </div>
          <div className="absolute h-[42vmin] w-[42vmin] rounded-full bg-magenta/20 blur-3xl" />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_8%,#07040f_82%)]" />

        <ThreatRadar className="pointer-events-none absolute top-24 right-4 hidden h-32 w-32 opacity-75 md:block lg:right-10 lg:h-44 lg:w-44" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center" style={{ perspective: 900 }}>
          <p className="hero-kicker hud-label">
            <span className="live-dot inline-block align-middle" /> National cyber command // classified demo
          </p>
          <h1 className="hero-title title-pop mt-6 font-display text-6xl tracking-[0.16em] sm:text-8xl lg:text-9xl">
            {TITLE.split('').map((ch, i) => (
              <span key={`${ch}-${i}`} className="hero-char">
                {ch}
              </span>
            ))}
          </h1>
          <p className="hero-sub mx-auto mt-5 max-w-2xl text-base text-fog sm:text-lg">
            Autonomous Security Tactical Reasoning Agent — a defence-grade AI that scans, patches, fuzzes and certifies
            mission software before it ever reaches the field.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <div className="hero-cta cta-halo">
              <NeonButton onClick={launch}>Launch Mission</NeonButton>
            </div>
            <div className="hero-cta">
              <NeonButton variant="ghost" onClick={() => setSim(true)}>
                Watch Simulation
              </NeonButton>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-amber"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      <div className="relative overflow-hidden border-y-[3px] border-void bg-amber py-3">
        <div className="flex w-max animate-[ticker_28s_linear_infinite] gap-10 whitespace-nowrap px-6 font-display text-[11px] tracking-[0.28em] text-void">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={`${item}-${i}`}>// {item}</span>
          ))}
        </div>
      </div>

      <section className="relative mx-auto max-w-7xl px-5 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl tracking-[0.2em] text-mist text-glow"
        >
          TACTICAL LOOP
        </motion.h2>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            { icon: Radio, title: 'Ingest', copy: 'Source, twin, or firmware packet enters the mesh.', n: '01' },
            { icon: Cpu, title: 'Reason', copy: 'ASTRA maps CWE classes with confidence scoring.', n: '02' },
            { icon: ShieldCheck, title: 'Harden', copy: 'Secure rewrite synthesized in-place.', n: '03' },
            { icon: Globe2, title: 'Certify', copy: 'Fuzz + regression lock the mission green.', n: '04' },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`glass ${LOOP_TONES[i]} widget-ticks can-lift rounded-2xl p-5`}
            >
              <div className="mb-4 flex items-center justify-between">
                <card.icon className={`h-6 w-6 ${LOOP_ICONS[i]}`} />
                <span className="sticker sticker-yellow">{card.n}</span>
              </div>
              <h3 className="font-display text-sm tracking-widest text-mist">{card.title}</h3>
              <p className="mt-2 text-sm text-fog">{card.copy}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass pop-magenta mt-10 rounded-2xl p-5"
        >
          <p className="hud-label mb-3">Global attack fabric</p>
          <AttackMap className="h-44 sm:h-56" idPrefix="hero" />
        </motion.div>
      </section>

      <AnimatePresence>
        {sim && <SimCinematic onClose={() => setSim(false)} onLaunch={launch} />}
      </AnimatePresence>
    </main>
  )
}
