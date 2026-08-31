export const COMPARISON_TABLE = [
  { capability: 'Threat detection', existing: 'Manual / fragmented tools', astra: 'Automated CWE scan across C, C++, Python, Java, JS' },
  { capability: 'Patch generation', existing: 'Manual developer rewrite', astra: 'AI bounded secure synthesis with confidence score' },
  { capability: 'Validation', existing: 'Limited / ad-hoc testing', astra: 'Lab fuzz + 5 regression suites auto-run' },
  { capability: 'Workflow', existing: 'Separate siloed tools', astra: 'Unified agent — twin → scan → patch → certify' },
  { capability: 'Digital twin', existing: 'Rarely exercised pre-deploy', astra: 'Twin-first on Bharat defence mesh' },
  { capability: 'Reviewer evidence', existing: 'Scattered logs & reports', astra: 'Certified mission dossier + API proof chain' },
  { capability: 'Defensive doctrine', existing: 'Varies by team', astra: 'Hard-coded hold — no exploit generation' },
]

export const JUDGE_CHECKLIST = [
  { id: 'stack', label: 'Live full stack verified', detail: 'Frontend + PHP API + MySQL responding', route: '/dashboard' },
  { id: 'loop', label: 'Mission loop complete', detail: 'Twin → Scan → Patch → Fuzz → Tests → Report', route: '/scan' },
  { id: 'cwe', label: 'CWE findings mapped', detail: 'Line numbers, severity, confidence scores', route: '/scan' },
  { id: 'patch', label: 'AI patch analysis', detail: 'ASTRA-X explains every rewrite with reviewer tips', route: '/patch' },
  { id: 'agent', label: 'Tactical agent online', detail: 'Context-aware mission guidance', route: '/dashboard' },
  { id: 'api', label: 'REST API documented', detail: 'Postman collection + curl smoke tests', external: 'README' },
  { id: 'doctrine', label: 'Defensive hold only', detail: 'No live targeting, lab sandbox', route: '/about' },
]

export const ROADMAP = [
  { phase: 'Q3 2026', title: 'Theatre node expansion', detail: '12 additional mesh nodes for border surveillance stacks.' },
  { phase: 'Q4 2026', title: 'SBOM ingest pipeline', detail: 'Supply-chain assurance for field firmware packages.' },
  { phase: '2027', title: 'Command integration API', detail: 'REST bridge for existing Army SOC tooling.' },
]
