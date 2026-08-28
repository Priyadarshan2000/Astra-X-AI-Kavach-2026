import { nextAction, loopSteps } from './missionLoop.js'

const GREETINGS = /^(hi|hello|hey|namaste|jai hind|start|help|\?)$/i

function includesAny(text, words) {
  return words.some((w) => text.includes(w))
}

function missionSummary(mission) {
  const steps = loopSteps(mission)
  const done = steps.filter((s) => s.done).length
  const next = nextAction(mission)
  const twin = mission.twin?.name || 'No twin armed'
  const score = mission.scan?.score ?? '—'
  const findings = mission.scan?.findings?.length ?? 0
  return { steps, done, next, twin, score, findings }
}

export function agentGreeting(isAuthed) {
  if (isAuthed) {
    return {
      text: 'Jai Hind. ASTRA-X online on the Bharat defence mesh. I can read your mission state, guide the twin → scan → patch loop, and answer Kavach 2026 reviewer questions. What do you need, Command?',
      suggestions: ['Mission status', 'What is next?', 'How to run scan?', 'Kavach 2026 brief'],
    }
  }
  return {
    text: 'Jai Hind. I am ASTRA-X — Autonomous Security Tactical Reasoning Agent for Kavach 2026. I guide Indian Army cyber reviewers through defensive scan, patch, and certification. Log in to arm the mission loop, or ask me about the platform.',
    suggestions: ['What is ASTRA-X?', 'Kavach 2026', 'Mission loop', 'Demo login'],
  }
}

export function thinkAgentReply(message, { mission, isAuthed, pathname }) {
  const raw = (message || '').trim()
  const q = raw.toLowerCase()

  if (!raw) {
    return { text: 'Transmit your query, Command. I am listening on secure channel.', suggestions: ['Mission status', 'Help'] }
  }

  if (GREETINGS.test(q)) {
    return agentGreeting(isAuthed)
  }

  if (includesAny(q, ['kavach', '2026', 'army', 'भारतीय', 'सेना'])) {
    return {
      text: 'Kavach 2026 is the Indian Army cyber defence evaluation framework. ASTRA-X demonstrates defensive hold only: digital twin first, static CWE analysis, secure rewrite, lab fuzz, and regression certification — no live targeting, no exploit payloads. Reviewers can run the mission briefing on the landing page, then execute the full loop on the command deck.',
      suggestions: ['Mission loop', 'Defensive doctrine', 'Enter demo'],
    }
  }

  if (includesAny(q, ['what is astra', 'astra-x', 'astra x', 'who are you', 'about you'])) {
    return {
      text: 'ASTRA-X is the Autonomous Security Tactical Reasoning Agent — a defence-grade command platform for mission software assurance. It maps CWE classes, synthesizes bounded patches, fuzzes in a lab sandbox, and certifies builds before they reach theatre nodes on the national mesh.',
      suggestions: ['Mission loop', 'Twin mesh', 'CWE support'],
    }
  }

  if (includesAny(q, ['login', 'demo', 'credentials', 'password', 'access', 'clearance'])) {
    return {
      text: 'Demo clearance for reviewers:\n• ID: operator@astra.mil\n• Passphrase: AstraX#2026\n\nAfter login, arm the digital twin on /twin, then follow the highlighted next action on the command deck or status bar.',
      suggestions: ['Mission status', 'Next step'],
    }
  }

  if (includesAny(q, ['loop', 'doctrine', 'workflow', 'process', 'stations'])) {
    return {
      text: 'Tactical loop — four stations, one hold:\n1. Twin — arm a digital twin on the Bharat mesh\n2. Scan — static intelligence maps CWE findings\n3. Patch — bounded secure rewrite removes exec paths\n4. Fuzz + Tests — lab validation locks mission green\n\nEvery step is visible to Kavach reviewers. No black boxes.',
      suggestions: ['Next step', 'How to scan?'],
    }
  }

  if (includesAny(q, ['defensive', 'exploit', 'attack', 'offensive', 'live target'])) {
    return {
      text: 'ASTRA-X operates under defensive hold only. Static analysis and secure rewrite — no exploit generation, no live targeting, no external payload delivery. Fuzzing runs in an isolated lab harness against the digital twin. This is software assurance for field systems, not an attack platform.',
      suggestions: ['Mission loop', 'Kavach 2026'],
    }
  }

  if (includesAny(q, ['twin', 'digital twin', 'mesh', 'bharat', 'india map', 'delhi'])) {
    const twin = mission?.twin?.name || 'Secure Communication'
    return {
      text: `The digital twin clones field firmware or source into the Bharat defence mesh before deployment. Current twin: ${twin}. Eight theatre nodes (Delhi HQ, Mumbai, Hyderabad, Bengaluru, Chennai, Kolkata, Guwahati, Ahmedabad) exercise every build. Twin-first doctrine prevents blind field pushes.`,
      suggestions: ['Arm twin', 'Run scan'],
    }
  }

  if (includesAny(q, ['scan', 'cwe', 'vulnerability', 'finding', 'static'])) {
    if (mission?.scan) {
      const list = mission.scan.findings?.slice(0, 3).map((f) => `• ${f.id} ${f.title} (${f.severity})`).join('\n') || 'No findings logged.'
      return {
        text: `Scan complete — score ${mission.scan.score}%, ${mission.scan.findings?.length || 0} findings.\n${list}\n\nNext: synthesize patch on the Patch station.`,
        suggestions: ['Synthesize patch', 'Mission status'],
      }
    }
    return {
      text: 'To run static scan: go to Scan, drop C/C++/Python/Java source or use the lab sample, then press Run Scan. ASTRA maps CWE-120 (buffer overflow), CWE-78 (command injection), CWE-134 (format string), and related classes with confidence scoring.',
      suggestions: ['Go to scan', 'Mission status'],
    }
  }

  if (includesAny(q, ['patch', 'rewrite', 'harden', 'fix'])) {
    if (mission?.patch) {
      return {
        text: `Patch synthesized and staged. Risk reduced ~78%. Exec paths removed via bounded rewrite. Proceed to Fuzz on the twin to validate the hardened build in lab conditions.`,
        suggestions: ['Run fuzz', 'Mission status'],
      }
    }
    if (!mission?.scan) {
      return { text: 'Patch requires a completed scan first. Run static intelligence on your source, then I can guide patch synthesis.', suggestions: ['Run scan', 'Mission status'] }
    }
    return {
      text: 'Open Patch after scan completes. ASTRA generates a secure rewrite in-place — strcpy bounded, system() removed, format strings sanitized. Review the diff pane, then deploy to fuzz harness.',
      suggestions: ['Go to patch', 'Mission status'],
    }
  }

  if (includesAny(q, ['fuzz', 'fuzzing', 'corpus', 'harness'])) {
    if (mission?.fuzz) {
      return {
        text: `Fuzz complete — ${mission.fuzz.rejected ?? '1,240'} attack variants rejected in lab. No critical bypass. Run Regression next to lock five tactical test suites green.`,
        suggestions: ['Run tests', 'Open report'],
      }
    }
    return {
      text: 'Fuzz exercises the patched twin in an isolated lab harness — malformed packets, overflow attempts, injection strings. All rejected variants stay in the sandbox. Open Fuzz after patch synthesis.',
      suggestions: ['Go to fuzz', 'Mission status'],
    }
  }

  if (includesAny(q, ['test', 'regression', 'certif', 'report', 'green'])) {
    if (mission?.tests) {
      return { text: 'Regression suites certified GREEN. Mission report is ready on Reports. Certificate suitable for Kavach reviewer walkthrough.', suggestions: ['Open report', 'Mission status'] }
    }
    return {
      text: 'After fuzz, open Regression to run five tactical test suites. When all pass, ASTRA issues a mission report with scan, patch, and fuzz summary for evaluator review.',
      suggestions: ['Run tests', 'Mission status'],
    }
  }

  if (includesAny(q, ['status', 'mission', 'progress', 'where am i', 'current', 'deck'])) {
    if (!isAuthed) {
      return {
        text: 'You are on the public surface. Log in with demo clearance to arm the mission loop. I can then read twin, scan, patch, and fuzz state in real time.',
        suggestions: ['Demo login', 'Mission loop'],
      }
    }
    const { done, next, twin, score, findings, steps } = missionSummary(mission)
    const stepLine = steps.map((s) => `${s.done ? '✓' : '○'} ${s.label}`).join(' · ')
    return {
      text: `Mission snapshot (${pathname || 'command deck'}):\n• Twin: ${twin}\n• Scan score: ${score}${findings ? ` (${findings} findings)` : ''}\n• Loop: ${stepLine}\n• Next action: ${next.label}\n\n${done}/4 loop stations complete.`,
      suggestions: [next.label, 'Explain CWE', 'Kavach brief'],
    }
  }

  if (includesAny(q, ['next', 'what now', 'what should', 'guide', 'step'])) {
    if (!isAuthed) {
      return { text: 'Next step: request clearance — use demo login operator@astra.mil, then arm the twin on the Twin station.', suggestions: ['Demo login', 'Mission loop'] }
    }
    const { next } = missionSummary(mission)
    const routes = {
      '/twin': 'Open Digital Twin — select Secure Communication or another unit, then arm.',
      '/scan': 'Open Scan — load lab sample or drop source, run static analysis.',
      '/patch': 'Open Patch — review synthesized secure rewrite and apply.',
      '/fuzz': 'Open Fuzz — run lab attack-surface simulation on patched twin.',
      '/regression': 'Open Regression — execute five tactical test suites.',
      '/reports': 'Open Reports — download mission certificate for reviewers.',
    }
    return {
      text: `Recommended next: ${next.label} → ${next.to}\n${routes[next.to] || 'Follow the mission strip on the command deck.'}`,
      suggestions: [next.label, 'Mission status'],
    }
  }

  if (includesAny(q, ['command', 'northern', 'western', 'southern', 'eastern', 'theatre', 'udhampur', 'pune'])) {
    return {
      text: 'Four Army commands sync on the national mesh:\n• Northern Command — Udhampur\n• Western Command — Chandimandir\n• Southern Command — Pune\n• Eastern Command — Kolkata\n\nDelhi HQ orchestrates the Bharat defence grid. Every build is twin-tested before theatre push.',
      suggestions: ['Bharat mesh', 'Mission briefing'],
    }
  }

  if (includesAny(q, ['hindi', 'हिंदी', 'नमस्ते'])) {
    return {
      text: 'नमस्ते, Command. मैं ASTRA-X हूँ — राष्ट्रीय साइबर कवच के लिए टैक्टिकल एआई एजेंट। मिशन स्थिति, स्कैन, पैच या Kavach 2026 के बारे में पूछें। (I can assist in Hindi or English for reviewer briefings.)',
      suggestions: ['Mission status', 'Kavach 2026'],
    }
  }

  return {
    text: `Acknowledged: "${raw}". I handle mission status, twin/scan/patch/fuzz guidance, Kavach 2026 briefings, and defensive doctrine. Try asking about your next step or the tactical loop.`,
    suggestions: ['Mission status', 'Next step', 'Kavach 2026', 'Help'],
  }
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function resolveAgentReply(message, context) {
  try {
    const { api } = await import('../api/client.js')
    const data = await api.chat({
      message,
      context: {
        isAuthed: context.isAuthed,
        pathname: context.pathname,
        mission: {
          twin: context.mission?.twin ? { name: context.mission.twin.name } : null,
          scan: context.mission?.scan
            ? { score: context.mission.scan.score, findings: context.mission.scan.findings?.length }
            : null,
          patch: Boolean(context.mission?.patch),
          fuzz: context.mission?.fuzz ? { rejected: context.mission.fuzz.rejected } : null,
          tests: Boolean(context.mission?.tests),
        },
      },
    })
    if (data?.reply) {
      return { text: data.reply, suggestions: data.suggestions || [] }
    }
  } catch {
    /* local brain fallback */
  }
  await delay(380 + Math.random() * 420)
  return thinkAgentReply(message, context)
}
