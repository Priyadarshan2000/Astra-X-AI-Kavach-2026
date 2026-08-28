import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Shield, LogOut, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

const LINKS = [
  { to: '/dashboard', label: 'Deck' },
  { to: '/scan', label: 'Scan' },
  { to: '/twin', label: 'Twin' },
  { to: '/patch', label: 'Patch' },
  { to: '/fuzz', label: 'Fuzz' },
  { to: '/regression', label: 'Tests' },
  { to: '/reports', label: 'Reports' },
  { to: '/about', label: 'About' },
]

function clock() {
  return new Date().toISOString().slice(11, 19) + 'Z'
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState(clock)
  const { isAuthed, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTime(clock()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || !isLanding
          ? 'border-b-[2.5px] border-cyan bg-void/95'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
        <button onClick={() => navigate('/')} className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg border-[2.5px] border-void bg-cyan text-void shadow-[3px_3px_0_#ff2e97] transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[5px_5px_0_#ff2e97]">
            <Shield className="h-4 w-4" />
          </span>
          <span className="font-display text-sm tracking-[0.22em] text-mist">ASTRA-X</span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative rounded-lg px-3 py-1.5 font-ui text-[10px] tracking-[0.18em] uppercase transition-colors duration-200 ${
                  isActive ? 'text-void' : 'text-fog hover:text-mist'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg border-[2px] border-void bg-amber shadow-[3px_3px_0_#ff2e97]"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="sticker-yellow hidden items-center gap-2 rounded-lg border-[2.5px] border-void px-3 py-1 shadow-[3px_3px_0_#ff2e97] md:flex">
            <span className="live-dot" />
            <span className="font-display text-[9px] tracking-[0.18em] text-void">ONLINE</span>
            <span className="font-ui text-[10px] text-void/70">{time}</span>
          </div>
          <button
            className="rounded-lg border-[2.5px] border-cyan bg-void p-2 text-cyan shadow-[3px_3px_0_#8b5cff] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          {isAuthed ? (
            <>
              <span className="hidden font-ui text-xs text-fog sm:block">{user?.name}</span>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="rounded-lg border-[2.5px] border-magenta bg-void p-2 text-magenta shadow-[3px_3px_0_#ffe44d] transition hover:-translate-x-0.5 hover:-translate-y-0.5"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="rounded-lg border-[2.5px] border-void bg-magenta px-4 py-1.5 font-display text-[10px] tracking-[0.2em] text-mist shadow-[3px_3px_0_#00e5ff] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#00e5ff]"
            >
              ACCESS
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t-[2.5px] border-cyan bg-void lg:hidden"
          >
            <div className="grid gap-1 px-5 py-3">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm tracking-[0.16em] uppercase ${
                      isActive
                        ? 'border-[2px] border-void bg-amber text-void shadow-[3px_3px_0_#ff2e97]'
                        : 'text-fog'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
