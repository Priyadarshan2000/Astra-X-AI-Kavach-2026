import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Fingerprint, Shield } from 'lucide-react'
import ParticleField from '../components/effects/ParticleField.jsx'
import ThreatRadar from '../components/effects/ThreatRadar.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('operator@astra.mil')
  const [password, setPassword] = useState('AstraX#2026')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || password.length < 6) {
      setError('Clearance fields incomplete.')
      return
    }
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials.')
    }
  }

  return (
    <main className="relative grid min-h-svh place-items-center px-5 pt-20 pb-10">
      <ParticleField count={72} />
      <div className="relative z-10 grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <p className="hud-label">Kavach 2026</p>
          <h1 className="title-pop mt-4 font-display text-5xl tracking-[0.14em]">CLEARANCE</h1>
          <p className="mt-4 max-w-md text-fog">
            Authorize to arm the twin mesh. Scan, patch, fuzz and certify — defensive hold only.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="sticker">Demo armed</span>
            <span className="sticker sticker-violet">No live targeting</span>
            <span className="sticker sticker-yellow">Kernel 7.4</span>
          </div>
          <div className="viz-well mt-6 !min-h-0 grid place-items-center p-4">
            <ThreatRadar className="h-44 w-44" idPrefix="login" />
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong relative w-full rounded-2xl p-8"
        >
          <div className="scan-y" />
          <div className="mb-6 flex items-center justify-between">
            <Shield className="h-10 w-10 text-cyan animate-float" />
            <div className="relative grid h-12 w-12 place-items-center">
              <span className="absolute inset-0 rounded-full border border-violet/40 animate-pulse-ring" />
              <Fingerprint className="h-10 w-10 text-violet animate-flicker" />
            </div>
          </div>
          <p className="hud-label">Secure access</p>
          <h2 className="mt-2 font-display text-2xl tracking-[0.18em] title-pop">OPERATOR LOGIN</h2>
          <label className="mt-6 block text-xs uppercase tracking-widest text-fog">Clearance ID</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="field mt-2" autoComplete="username" />
          <label className="mt-4 block text-xs uppercase tracking-widest text-fog">Passphrase</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field mt-2" autoComplete="current-password" />
          {error && <p className="mt-3 text-sm text-crimson">{error}</p>}
          <div className="mt-6">
            <NeonButton type="submit" className="w-full">
              {loading ? 'Authenticating…' : 'Authorize'}
            </NeonButton>
          </div>
          <p className="mt-4 text-center text-sm text-fog">
            New operator?{' '}
            <Link to="/register" className="text-cyan hover:underline">
              Request clearance
            </Link>
          </p>
        </motion.form>
      </div>
    </main>
  )
}
