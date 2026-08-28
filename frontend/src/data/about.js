import { Radio, Cpu, ShieldCheck, Globe2, FlaskConical, FileCheck, Bot, Lock, Crosshair, Fingerprint } from 'lucide-react'

export const CAPABILITIES = [
  {
    icon: Radio,
    title: 'Digital Twin',
    hindi: 'डिजिटल ट्विन',
    copy: 'Clone field comms, drone parser, or logistics firmware into the Bharat defence mesh. Exercise packets in lab before theatre clearance.',
    tone: 'pop-cyan',
    iconTone: 'text-cyan',
  },
  {
    icon: Cpu,
    title: 'Static Scan',
    hindi: 'स्थिर विश्लेषण',
    copy: 'Pattern engine maps CWE-120, CWE-78, CWE-89, CWE-502 and more across C, C++, Python and Java source.',
    tone: 'pop-violet',
    iconTone: 'text-violet',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Patch',
    hindi: 'सुरक्षित पुनर्लेखन',
    copy: 'Bounded rewrite removes exec paths and unbounded copies. Confidence scoring and risk reduction metrics for reviewers.',
    tone: 'pop-magenta',
    iconTone: 'text-magenta',
  },
  {
    icon: FlaskConical,
    title: 'Lab Fuzz',
    hindi: 'प्रयोगशाला फज़',
    copy: 'Attack-surface simulation before and after hardening. 1,240+ variants in sandbox — zero critical bypass on certified builds.',
    tone: 'pop-yellow',
    iconTone: 'text-amber',
  },
  {
    icon: FileCheck,
    title: 'Regression',
    hindi: 'प्रतिगमन परीक्षण',
    copy: 'Five tactical test suites validate secure rewrites. Mission locks green only when all suites pass.',
    tone: 'pop-cyan',
    iconTone: 'text-cyan',
  },
  {
    icon: Globe2,
    title: 'Certified Report',
    hindi: 'प्रमाणित रिपोर्ट',
    copy: 'Restricted after-action dossier with certificate ID, findings summary, and patch impact for Army software assurance.',
    tone: 'pop-violet',
    iconTone: 'text-violet',
  },
]

export const MISSION_PHASES = [
  { n: '01', phase: 'Command Uplink', hindi: 'राष्ट्रीय कमान कड़ी', detail: 'ASTRA-X authenticates with Army Cyber Command. Bharat mesh locks across 8 theatre nodes.' },
  { n: '02', phase: 'Digital Twin', hindi: 'डिजिटल ट्विन तैनात', detail: 'Field unit firmware cloned for static scan. Twin first — deploy never blind.' },
  { n: '03', phase: 'Threat Analysis', hindi: 'खतरा विश्लेषण', detail: 'CWE intelligence locked with 94%+ confidence aligned to Army software assurance doctrine.' },
  { n: '04', phase: 'Hardening', hindi: 'सुरक्षित पुनर्लेखन', detail: 'Bounded secure rewrite staged for lab fuzz. Risk score drops up to 78%.' },
  { n: '05', phase: 'Mission Certified', hindi: 'मिशन प्रमाणित', detail: 'Fuzz corpus rejected all attack variants. Five regression suites green. Certificate issued.' },
]

export const CWE_SUPPORT = [
  { code: 'CWE-120', label: 'Buffer overflow', langs: 'C / C++' },
  { code: 'CWE-78', label: 'Command injection', langs: 'C / Python / Java' },
  { code: 'CWE-89', label: 'SQL injection', langs: 'Python / Java' },
  { code: 'CWE-134', label: 'Format string', langs: 'C / C++' },
  { code: 'CWE-502', label: 'Insecure deserialization', langs: 'Python' },
  { code: 'CWE-95', label: 'Dynamic code execution', langs: 'Python' },
]

export const TECH_STACK = [
  { layer: 'Frontend', items: 'React 19 · Vite 8 · Tailwind CSS 4 · Framer Motion · GSAP · React Three Fiber · Recharts' },
  { layer: 'Backend', items: 'PHP 8 REST API · PDO · JWT (HS256)' },
  { layer: 'Database', items: 'MySQL 8 — users, projects, scans, patches, reports' },
  { layer: 'Agent', items: 'Context-aware rule engine · optional OpenAI for live LLM replies' },
  { layer: 'Deploy', items: 'Vercel (frontend) · XAMPP / PHP built-in server (API)' },
]

export const DOCTRINE = {
  holds: [
    'Static CWE pattern analysis only',
    'Bounded secure rewrites with confidence metrics',
    'Lab-only fuzz and regression simulation',
    'JWT auth with PDO prepared statements',
    'Twin-first workflow before field deployment',
  ],
  never: [
    'No exploit payload generation',
    'No live system targeting',
    'No weaponization pathways',
    'No offensive toolkit capabilities',
  ],
}

export const PROOF = [
  {
    icon: Lock,
    title: 'Defensive doctrine',
    copy: 'Static analysis and secure rewrite only. No exploit payloads. Lab sandbox hold — no live targeting.',
    tone: 'cyan',
  },
  {
    icon: Crosshair,
    title: 'Theatre-first',
    copy: 'Northern, Western, Southern and Eastern command nodes exercise every build before field software ships.',
    tone: 'violet',
  },
  {
    icon: Fingerprint,
    title: 'Reviewer-ready',
    copy: 'Full mission loop in minutes. Demo login armed. ASTRA-X agent guides Kavach evaluators step by step.',
    tone: 'magenta',
  },
]

export const AGENT_FEATURES = [
  'Reads live mission state — twin, scan, patch progress',
  'Guides next action on the command deck',
  'Answers Kavach 2026 and defensive doctrine questions',
  'Provides demo credentials and walkthrough hints',
  'Optional OpenAI backend for natural-language replies',
]

export const REVIEWER_STEPS = [
  { step: '1', label: 'Landing', detail: 'Watch boot sequence and India mesh map' },
  { step: '2', label: 'Login', detail: 'operator@astra.mil / AstraX#2026' },
  { step: '3', label: 'Twin', detail: 'Arm Secure Comms or Drone Parser twin' },
  { step: '4', label: 'Scan', detail: 'Load sample or upload source code' },
  { step: '5', label: 'Patch → Fuzz → Tests', detail: 'Follow highlighted next action' },
  { step: '6', label: 'Report', detail: 'Open certified after-action dossier' },
]

export const DEMO_CREDS = {
  id: 'operator@astra.mil',
  pass: 'AstraX#2026',
}
