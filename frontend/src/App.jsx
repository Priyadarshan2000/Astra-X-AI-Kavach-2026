import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/nav/Navbar.jsx'
import AmbientOrbs from './components/effects/AmbientOrbs.jsx'
import PageTransition from './components/ui/PageTransition.jsx'
import Loader from './components/ui/Loader.jsx'
import HudFrame from './components/ui/HudFrame.jsx'
import StatusBar from './components/ui/StatusBar.jsx'
import AgentChat from './components/agent/AgentChat.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { useEffect, useState } from 'react'

const Landing = lazy(() => import('./pages/Landing.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Scan = lazy(() => import('./pages/Scan.jsx'))
const DigitalTwin = lazy(() => import('./pages/DigitalTwin.jsx'))
const Patch = lazy(() => import('./pages/Patch.jsx'))
const Fuzzing = lazy(() => import('./pages/Fuzzing.jsx'))
const Regression = lazy(() => import('./pages/Regression.jsx'))
const Reports = lazy(() => import('./pages/Reports.jsx'))
const About = lazy(() => import('./pages/About.jsx'))

function Guard({ children }) {
  const { isAuthed } = useAuth()
  if (!isAuthed) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const location = useLocation()
  const [boot, setBoot] = useState(true)
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => Math.min(100, p + 4)), 110)
    const done = setTimeout(() => setBoot(false), 3200)
    return () => {
      clearInterval(t)
      clearTimeout(done)
    }
  }, [])

  if (boot) return <Loader progress={progress} />

  return (
    <div className="page-shell">
      <AmbientOrbs />
      <div className="pointer-events-none fixed inset-0 cyber-grid" />
      <HudFrame />
      <Navbar />
      <Suspense fallback={<Loader progress={64} label="SYNCING TACTICAL VIEW" />}>
        <PageTransition routeKey={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
            <Route path="/scan" element={<Guard><Scan /></Guard>} />
            <Route path="/twin" element={<Guard><DigitalTwin /></Guard>} />
            <Route path="/patch" element={<Guard><Patch /></Guard>} />
            <Route path="/fuzz" element={<Guard><Fuzzing /></Guard>} />
            <Route path="/regression" element={<Guard><Regression /></Guard>} />
            <Route path="/reports" element={<Guard><Reports /></Guard>} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </Suspense>
      <StatusBar />
      <AgentChat />
    </div>
  )
}
