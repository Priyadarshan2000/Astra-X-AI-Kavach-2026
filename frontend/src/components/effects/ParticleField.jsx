import { useEffect, useRef } from 'react'

export default function ParticleField({ count = 70 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00045,
      a: Math.random() * 0.5 + 0.15,
    }))

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      ctx.clearRect(0, 0, width, height)
      if (!width) {
        raf = requestAnimationFrame(draw)
        return
      }

      ctx.lineWidth = 0.6
      const light = document.documentElement.getAttribute('data-theme') === 'light'
      const line = light ? '18,16,26' : '0,229,255'
      const dot = light ? '18,16,26' : '0,229,255'
      const lineA = light ? 0.16 : 0.12
      const dotBoost = light ? 0.55 : 1
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = (particles[i].x - particles[j].x) * width
          const dy = (particles[i].y - particles[j].y) * height
          const dist = Math.hypot(dx, dy)
          if (dist < 88) {
            ctx.strokeStyle = `rgba(${line},${lineA * (1 - dist / 88)})`
            ctx.beginPath()
            ctx.moveTo(particles[i].x * width, particles[i].y * height)
            ctx.lineTo(particles[j].x * width, particles[j].y * height)
            ctx.stroke()
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
        ctx.beginPath()
        ctx.fillStyle = `rgba(${dot},${p.a * dotBoost})`
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />
}
