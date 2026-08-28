import { useRef } from 'react'
import { Shield } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function Loader({ progress = 0, label = 'ARMING ASTRA-X KERNEL' }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.boot-ring', { scale: 0.6, autoAlpha: 0, stagger: 0.12, duration: 0.7 })
        .from('.boot-shield', { scale: 0.5, autoAlpha: 0, rotate: -8, duration: 0.5 }, '-=0.35')
        .from('.boot-copy', { y: 12, autoAlpha: 0, duration: 0.4 }, '-=0.2')
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-[80] grid place-items-center bg-void">
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="scanlines absolute inset-0" />
      <div className="noise absolute inset-0" />
      <div className="relative grid place-items-center">
        <div className="boot-ring absolute h-56 w-56 rounded-full border-[3px] border-cyan/40 animate-pulse-ring" />
        <div className="boot-ring absolute h-72 w-72 rounded-full border-[3px] border-magenta/40 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />
        <div className="boot-shield relative grid h-36 w-36 place-items-center rounded-2xl border-[3px] border-ink bg-cyan text-ink shadow-[10px_10px_0_#ff2e97]">
          <Shield className="h-16 w-16" />
        </div>
      </div>
      <div className="boot-copy absolute bottom-16 left-1/2 w-[min(420px,90vw)] -translate-x-1/2">
        <p className="hud-label mb-3 w-full text-center">{label}</p>
        <div className="h-3 overflow-hidden rounded-md border-[2.5px] border-ink bg-panel shadow-[4px_4px_0_#8b5cff]">
          <div
            className="h-full bg-gradient-to-r from-cyan via-amber to-magenta"
            style={{ width: `${Math.min(100, progress)}%`, transition: 'width 180ms linear' }}
          />
        </div>
        <p className="mt-2 text-center font-display text-[10px] tracking-[0.4em] text-amber">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
