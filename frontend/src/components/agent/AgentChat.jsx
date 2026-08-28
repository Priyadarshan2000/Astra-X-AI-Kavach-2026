import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, X, Sparkles, ChevronRight } from 'lucide-react'
import { useMission } from '../../context/MissionContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { agentGreeting, resolveAgentReply } from '../../lib/agentBrain.js'
import { nextAction } from '../../lib/missionLoop.js'

let msgId = 0
function uid() {
  msgId += 1
  return `m-${msgId}`
}

export default function AgentChat() {
  const { mission } = useMission()
  const { isAuthed } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([])
  const logRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      const g = agentGreeting(isAuthed)
      setMessages([{ id: uid(), role: 'agent', text: g.text, suggestions: g.suggestions }])
    }
  }, [open, isAuthed, messages.length])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages, typing])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const pushAgent = (text, suggestions = []) => {
    setMessages((m) => [...m, { id: uid(), role: 'agent', text, suggestions }])
  }

  const send = async (text) => {
    const body = (text ?? input).trim()
    if (!body || typing) return
    setInput('')
    setMessages((m) => [...m, { id: uid(), role: 'user', text: body }])
    setTyping(true)
    try {
      const reply = await resolveAgentReply(body, { mission, isAuthed, pathname })
      pushAgent(reply.text, reply.suggestions)
    } finally {
      setTyping(false)
    }
  }

  const onSuggestion = (label) => {
    const lower = label.toLowerCase()
    if (lower.includes('go to') || lower.includes('open')) {
      const next = nextAction(mission)
      const map = {
        scan: '/scan',
        patch: '/patch',
        fuzz: '/fuzz',
        twin: '/twin',
        test: '/regression',
        report: '/reports',
      }
      const route = Object.entries(map).find(([k]) => lower.includes(k))?.[1] || next.to
      if (isAuthed || route === '/login') navigate(isAuthed ? route : '/login')
      else navigate('/login')
    }
    send(label)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="agent-panel glass pop-cyan widget-ticks fixed right-4 z-[55] flex max-h-[min(72vh,560px)] w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl shadow-[12px_12px_0_#8b5cff]"
            role="dialog"
            aria-label="ASTRA-X agent chat"
          >
            <div className="tricolor-ribbon shrink-0" aria-hidden>
              <span />
              <span />
              <span />
            </div>

            <header className="flex items-center justify-between gap-2 border-b-[2px] border-ink/10 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg border-[2.5px] border-ink bg-cyan text-ink shadow-[3px_3px_0_#ff2e97]">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-[10px] tracking-[0.2em] text-mist">ASTRA-X AGENT</p>
                  <p className="text-[10px] text-fog">Tactical reasoning · Kavach 2026</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border-[2px] border-ink bg-panel p-1.5 text-mist shadow-[2px_2px_0_#ff2e97]"
                aria-label="Close agent"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={logRef} className="agent-log flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[92%] rounded-xl border-[2px] border-ink px-3 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber text-ink shadow-[3px_3px_0_#ff2e97]'
                        : 'bg-panel text-mist shadow-[3px_3px_0_#00c8dc]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.suggestions?.length > 0 && msg.role === 'agent' ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => onSuggestion(s)}
                            className="inline-flex items-center gap-0.5 rounded-md border border-ink/30 bg-field/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fog transition hover:bg-cyan/20"
                          >
                            {s}
                            <ChevronRight className="h-2.5 w-2.5" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              {typing ? (
                <div className="flex justify-start">
                  <div className="agent-typing rounded-xl border-[2px] border-ink bg-panel px-4 py-2.5 shadow-[3px_3px_0_#8b5cff]">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              ) : null}
            </div>

            <form
              className="border-t-[2px] border-ink/10 p-3"
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask ASTRA-X…"
                  className="field !py-2.5 text-sm"
                  autoComplete="off"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[2.5px] border-ink bg-cyan text-ink shadow-[3px_3px_0_#ff2e97] transition enabled:hover:-translate-x-0.5 enabled:hover:-translate-y-0.5 disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="agent-fab fixed right-4 z-[55] flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-magenta px-4 py-2.5 font-display text-[10px] tracking-[0.18em] text-white shadow-[5px_5px_0_#00c8dc] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#00c8dc]"
        aria-expanded={open}
        aria-label={open ? 'Close ASTRA agent' : 'Open ASTRA agent'}
        whileTap={{ scale: 0.97 }}
      >
        {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        <span className="hidden sm:inline">{open ? 'CLOSE' : 'ASTRA AGENT'}</span>
      </motion.button>
    </>
  )
}
