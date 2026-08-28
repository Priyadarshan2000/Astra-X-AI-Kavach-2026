import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Fingerprint, Shield } from 'lucide-react'
import ParticleField from '../components/effects/ParticleField.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s += 25
  if (/[A-Z]/.test(pw)) s += 25
  if (/\d/.test(pw)) s += 25
  if (/[^A-Za-z0-9]/.test(pw)) s += 25
  return s
}

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const score = useMemo(() => strength(password), [password])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || score < 50) return
    await register(name, email, password)
    navigate('/dashboard')
  }

  return (
    <main className="relative grid min-h-svh place-items-center px-5 pt-20">
      <ParticleField count={64} />
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong relative w-full max-w-md rounded-2xl p-8"
      >
        <div className="scan-y" />
        <div className="mb-6 flex items-center justify-between">
          <Shield className="h-10 w-10 text-cyan animate-float" />
          <Fingerprint className="h-10 w-10 text-violet animate-flicker" />
        </div>
        <p className="hud-label">Clearance request</p>
        <h1 className="mt-2 font-display text-2xl tracking-[0.18em] title-pop">REGISTER OPERATOR</h1>
        <input placeholder="Callsign" value={name} onChange={(e) => setName(e.target.value)} className="field mt-6" />
        <input placeholder="Network email" value={email} onChange={(e) => setEmail(e.target.value)} className="field mt-3" />
        <input type="password" placeholder="Passphrase" value={password} onChange={(e) => setPassword(e.target.value)} className="field mt-3" />
        <div className="mt-3 h-3 overflow-hidden rounded-md border-[2.5px] border-ink bg-panel shadow-[3px_3px_0_#8b5cff]">
          <motion.div
            className="h-full bg-gradient-to-r from-crimson via-amber to-emerald"
            animate={{ width: `${score}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="mt-2 text-[11px] uppercase tracking-widest text-fog">Passphrase integrity {score}%</p>
        <div className="mt-6">
          <NeonButton type="submit" className="w-full">
            {loading ? 'Provisioning…' : 'Issue Token'}
          </NeonButton>
        </div>
        <p className="mt-4 text-center text-sm text-fog">
          Already cleared?{' '}
          <Link to="/login" className="text-cyan hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </main>
  )
}
