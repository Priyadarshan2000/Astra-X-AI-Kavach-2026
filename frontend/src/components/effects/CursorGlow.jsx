import gsap from 'gsap'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function CursorGlow() {
  const ref = useRef(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' })
    const move = (e) => {
      xTo(e.clientX - 180)
      yTo(e.clientY - 180)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, { scope: ref })

  return (
    <div
      ref={ref}
      className="pointer-events-none cursor-glow fixed top-0 left-0 z-40 hidden h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.14),rgba(255,46,151,0.1)_40%,transparent_70%)] mix-blend-screen md:block"
    />
  )
}
