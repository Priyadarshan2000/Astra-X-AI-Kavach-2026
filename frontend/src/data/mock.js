export const PLATFORM_STATS = [
  { id: 'threats', label: 'Threats Detected', value: 18472, suffix: '' },
  { id: 'patched', label: 'Vulnerabilities Patched', value: 9631, suffix: '' },
  { id: 'systems', label: 'Secure Systems', value: 412, suffix: '' },
  { id: 'confidence', label: 'AI Confidence', value: 98.4, suffix: '%' },
]

export const ATTACK_ARCS = [
  { from: [77.2, 28.6], to: [-77.0, 38.9], intensity: 0.9, label: 'DEL → IAD' },
  { from: [139.7, 35.7], to: [-0.1, 51.5], intensity: 0.7, label: 'TYO → LON' },
  { from: [37.6, 55.8], to: [103.8, 1.3], intensity: 0.8, label: 'MOW → SIN' },
  { from: [-46.6, -23.5], to: [2.35, 48.8], intensity: 0.6, label: 'SAO → PAR' },
  { from: [121.5, 31.2], to: [-118.2, 34.0], intensity: 0.85, label: 'SHA → LAX' },
  { from: [151.2, -33.9], to: [77.2, 28.6], intensity: 0.5, label: 'SYD → DEL' },
]

export const ALERTS = [
  { id: 'A-2041', level: 'critical', title: 'Unsigned firmware packet on Logistics API', time: '00:04:12' },
  { id: 'A-2040', level: 'high', title: 'Anomalous auth burst — Gateway-7', time: '00:07:33' },
  { id: 'A-2038', level: 'medium', title: 'TLS downgrade attempt blocked', time: '00:12:09' },
  { id: 'A-2034', level: 'low', title: 'Stale session token recycled', time: '00:18:44' },
]

export const TIMELINE = [
  { t: 'T-00:00', title: 'Mission armed', detail: 'ASTRA-X kernel online. Twin mesh synchronized.' },
  { t: 'T-00:08', title: 'Static analysis', detail: 'Pattern engine mapped CWE corpus against source.' },
  { t: 'T-00:19', title: 'Patch synthesis', detail: 'Secure rewrite generated with confidence scoring.' },
  { t: 'T-00:27', title: 'Autonomous fuzz', detail: 'Attack surface simulated before and after patch.' },
  { t: 'T-00:41', title: 'Regression lock', detail: 'Five tactical suites validated green.' },
]

export const HEALTH = [
  { name: 'Inference Core', value: 97 },
  { name: 'Twin Mesh', value: 92 },
  { name: 'Uplink', value: 88 },
  { name: 'Vault', value: 99 },
]

export const SAMPLE_CODE = {
  c: `// comms_gateway.c — insecure prototype
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void handle_packet(char *input) {
    char buffer[32];
    strcpy(buffer, input);          // unbounded copy
    printf(input);                  // format string
    system(input);                  // command injection
}

int authenticate(char *user, char *pass) {
    char query[256];
    sprintf(query, "SELECT * FROM users WHERE name='%s' AND pass='%s'", user, pass);
    return 1;
}
`,
  python: `# drone_parser.py — insecure telemetry ingest
import os, pickle, sqlite3

def load_mission(blob):
    return pickle.loads(blob)       # insecure deserialization

def run_cmd(name):
    os.system("ping " + name)       # command injection

def find_asset(asset_id):
    db = sqlite3.connect("fleet.db")
    q = "SELECT * FROM drones WHERE id = '%s'" % asset_id
    return db.execute(q).fetchall()
`,
  java: `// AuthGateway.java
import java.sql.*;
class AuthGateway {
  void login(String user, String pass) throws Exception {
    Connection c = DriverManager.getConnection("jdbc:mysql://localhost/astra");
    Statement s = c.createStatement();
    s.execute("SELECT * FROM users WHERE u='" + user + "' AND p='" + pass + "'");
    Runtime.getRuntime().exec("sh -c " + user);
  }
}
`,
  cpp: `// logistics.cpp
#include <cstring>
#include <cstdlib>
void ingest(char* payload) {
    char slot[16];
    strcat(slot, payload);
    char dest[8];
    memcpy(dest, payload, 64);
}
`,
}

export function languageFromName(name = '') {
  const ext = name.split('.').pop()?.toLowerCase()
  if (['c', 'h'].includes(ext)) return 'c'
  if (['cpp', 'cc', 'cxx', 'hpp'].includes(ext)) return 'cpp'
  if (['py'].includes(ext)) return 'python'
  if (['java'].includes(ext)) return 'java'
  return 'c'
}

export function analyzeSource(code = '', language = 'c') {
  const findings = []
  const rules = [
    { re: /strcpy\s*\(/, language: ['c', 'cpp'], title: 'Unbounded strcpy', cwe: 'CWE-120', severity: 'critical', risk: 96, confidence: 0.97, fix: 'Replace strcpy with strncpy or memcpy with explicit bounds.' },
    { re: /gets\s*\(/, language: ['c', 'cpp'], title: 'Unsafe gets()', cwe: 'CWE-242', severity: 'critical', risk: 99, confidence: 0.99, fix: 'Use fgets with a fixed buffer size.' },
    { re: /sprintf\s*\(/, language: ['c', 'cpp'], title: 'Unbounded sprintf', cwe: 'CWE-120', severity: 'high', risk: 88, confidence: 0.93, fix: 'Use snprintf with destination capacity.' },
    { re: /strcat\s*\(/, language: ['c', 'cpp'], title: 'Unbounded strcat', cwe: 'CWE-120', severity: 'high', risk: 86, confidence: 0.92, fix: 'Use strncat with remaining buffer length.' },
    { re: /memcpy\s*\([^,]+,[^,]+,\s*\d+\s*\)/, language: ['c', 'cpp'], title: 'Unchecked memcpy length', cwe: 'CWE-805', severity: 'high', risk: 84, confidence: 0.86, fix: 'Clamp copy length to destination size.' },
    { re: /system\s*\(/, language: ['c', 'cpp'], title: 'OS command injection', cwe: 'CWE-78', severity: 'critical', risk: 94, confidence: 0.95, fix: 'Avoid shelling out; use allowlisted execve arguments.' },
    { re: /printf\s*\(\s*[a-zA-Z_]/, language: ['c', 'cpp'], title: 'Format string vulnerability', cwe: 'CWE-134', severity: 'high', risk: 82, confidence: 0.9, fix: 'Use printf("%s", input) or fputs.' },
    { re: /pickle\.loads/, language: ['python'], title: 'Insecure deserialization', cwe: 'CWE-502', severity: 'critical', risk: 97, confidence: 0.98, fix: 'Use json or a signed schema instead of pickle.' },
    { re: /os\.system\s*\(.*\+/, language: ['python'], title: 'Command injection', cwe: 'CWE-78', severity: 'critical', risk: 95, confidence: 0.96, fix: 'Use subprocess.run with a list and shell=False.' },
    { re: /["'].*%s["']\s*%/, language: ['python'], title: 'SQL string interpolation', cwe: 'CWE-89', severity: 'critical', risk: 93, confidence: 0.94, fix: 'Use parameterized queries.' },
    { re: /eval\s*\(|exec\s*\(/, language: ['python'], title: 'Dynamic code execution', cwe: 'CWE-95', severity: 'critical', risk: 98, confidence: 0.97, fix: 'Remove eval/exec; parse with ast.literal_eval if needed.' },
    { re: /execute\s*\(\s*["'].*\+/, language: ['java'], title: 'SQL concatenation', cwe: 'CWE-89', severity: 'critical', risk: 94, confidence: 0.95, fix: 'Use PreparedStatement placeholders.' },
    { re: /Runtime\.getRuntime\(\)\.exec/, language: ['java'], title: 'Runtime.exec injection', cwe: 'CWE-78', severity: 'high', risk: 90, confidence: 0.91, fix: 'Use ProcessBuilder with a fixed argument list.' },
  ]

  rules.forEach((rule, index) => {
    if (!rule.language.includes(language)) return
    if (rule.re.test(code)) {
      findings.push({
        id: `VULN-${String(index + 1).padStart(3, '0')}`,
        ...rule,
        line: guessLine(code, rule.re),
      })
    }
  })

  if (!findings.length) {
    findings.push({
      id: 'VULN-000',
      title: 'No high-confidence pattern match',
      cwe: 'CWE-000',
      severity: 'low',
      risk: 12,
      confidence: 0.54,
      fix: 'Continue with fuzzing and regression to confirm residual risk.',
      line: 1,
    })
  }

  const score = Math.max(8, 100 - Math.round(findings.reduce((s, f) => s + f.risk, 0) / Math.max(findings.length, 1)))
  return { findings, score, language }
}

function guessLine(code, re) {
  const lines = code.split('\n')
  const idx = lines.findIndex((line) => re.test(line))
  return idx >= 0 ? idx + 1 : 1
}

export function generatePatch(code = '', language = 'c') {
  let patched = code
  const notes = []

  if (language === 'c' || language === 'cpp') {
    if (patched.includes('strcpy')) {
      patched = patched.replace(/strcpy\s*\(\s*([^,]+),\s*([^)]+)\)/g, 'strncpy($1, $2, sizeof($1) - 1)')
      notes.push('Hardened unbounded strcpy with strncpy + capacity.')
    }
    if (patched.includes('sprintf')) {
      patched = patched.replace(/sprintf\s*\(\s*([^,]+),/g, 'snprintf($1, sizeof($1),')
      notes.push('Replaced sprintf with snprintf.')
    }
    if (patched.includes('strcat')) {
      patched = patched.replace(/strcat\s*\(\s*([^,]+),\s*([^)]+)\)/g, 'strncat($1, $2, sizeof($1) - strlen($1) - 1)')
      notes.push('Bounded strcat with remaining capacity.')
    }
    if (/system\s*\(/.test(patched)) {
      patched = patched.replace(/system\s*\([^)]*\);/g, '/* command execution removed — use allowlisted execve */')
      notes.push('Removed shell execution path.')
    }
    if (/printf\s*\(\s*[a-zA-Z_]/.test(patched)) {
      patched = patched.replace(/printf\s*\(\s*([a-zA-Z_][\w]*)\s*\)/g, 'printf("%s", $1)')
      notes.push('Neutralized format-string sink.')
    }
    if (/memcpy\s*\(/.test(patched)) {
      patched = patched.replace(/memcpy\s*\(\s*([^,]+),\s*([^,]+),\s*[^)]+\)/g, 'memcpy($1, $2, sizeof($1))')
      notes.push('Clamped memcpy to destination size.')
    }
  }

  if (language === 'python') {
    if (patched.includes('pickle.loads')) {
      patched = patched.replace(/pickle\.loads\([^)]+\)/g, 'json.loads(blob.decode())')
      if (!patched.includes('import json')) patched = 'import json\n' + patched.replace(/,\s*pickle/, '')
      notes.push('Replaced pickle with JSON decoding.')
    }
    if (/os\.system/.test(patched)) {
      patched = patched.replace(/os\.system\([^)]+\)/g, 'subprocess.run(["ping", name], check=False)')
      if (!patched.includes('import subprocess')) patched = 'import subprocess\n' + patched
      notes.push('Switched os.system to subprocess argument list.')
    }
    if (/%s/.test(patched) && /SELECT/.test(patched)) {
      patched = patched.replace(/q = "SELECT \* FROM drones WHERE id = '%s'" % asset_id/, 'q = "SELECT * FROM drones WHERE id = ?"\n    return db.execute(q, (asset_id,)).fetchall()')
      notes.push('Converted SQL interpolation to bound parameters.')
    }
  }

  if (language === 'java') {
    if (patched.includes('createStatement')) {
      patched = patched.replace(
        /Statement s = c\.createStatement\(\);\s*s\.execute\([^;]+;/,
        'PreparedStatement s = c.prepareStatement("SELECT * FROM users WHERE u=? AND p=?");\n    s.setString(1, user);\n    s.setString(2, pass);\n    s.executeQuery();',
      )
      notes.push('Moved SQL to PreparedStatement.')
    }
    if (patched.includes('Runtime.getRuntime()')) {
      patched = patched.replace(/Runtime\.getRuntime\(\)\.exec\([^;]+;/, 'new ProcessBuilder("id").start();')
      notes.push('Replaced Runtime.exec with a fixed ProcessBuilder.')
    }
  }

  const confidence = notes.length ? 0.91 : 0.62
  const riskReduction = notes.length ? 78 : 12
  return { patched, notes, confidence, riskReduction, impact: notes.length ? 'High — memory and injection classes closed' : 'Low — residual review required' }
}

export function simulateFuzz(beforeFindings = []) {
  const attacks = 1280 + beforeFindings.length * 140
  const beforeCrashes = Math.max(18, beforeFindings.length * 11)
  const afterCrashes = Math.max(0, Math.round(beforeCrashes * 0.04))
  return {
    attacks,
    rps: 420,
    before: { crashes: beforeCrashes, success: 12, defence: 41 },
    after: { crashes: afterCrashes, success: 96, defence: 98 },
    logBefore: [
      '[FUZZ] corpus=comms_gateway seed=0xA7F3',
      '[CASE 014] overflow @ handle_packet → SIGSEGV',
      '[CASE 031] format string → stack leak',
      '[CASE 088] system() payload → shell spawn',
      `[STAT] crashes=${beforeCrashes} unique=${Math.max(3, beforeFindings.length)}`,
    ],
    logAfter: [
      '[FUZZ] corpus=comms_gateway.patch seed=0xA7F3',
      '[CASE 014] bounded copy → rejected',
      '[CASE 031] printf sanitized → no leak',
      '[CASE 088] exec path removed → denied',
      `[STAT] crashes=${afterCrashes} defence=HOLD`,
    ],
  }
}

export function simulateRegression() {
  return [
    { id: 'login', name: 'Login', detail: 'JWT handshake + lockout policy', status: 'pass', latency: 42 },
    { id: 'api', name: 'API', detail: 'Authenticated REST contract', status: 'pass', latency: 38 },
    { id: 'comm', name: 'Communication', detail: 'Packet parser bounds + HMAC', status: 'pass', latency: 61 },
    { id: 'drone', name: 'Drone Parser', detail: 'Telemetry schema validation', status: 'pass', latency: 54 },
    { id: 'db', name: 'Database', detail: 'Parameterized queries only', status: 'pass', latency: 29 },
  ]
}

export function buildReport({ scan, patch, fuzz, tests, project }) {
  const risk = scan?.score ?? 72
  return {
    id: `AX-${Date.now().toString().slice(-8)}`,
    classification: 'RESTRICTED // ASTRA-X',
    project: project || 'Digital Twin — Secure Communication',
    generatedAt: new Date().toISOString(),
    executive:
      'ASTRA-X completed an autonomous assessment of the selected digital twin. Critical memory-safety and injection classes were identified, a defensive rewrite was synthesized, and validation suites confirmed residual crash rate collapse.',
    riskScore: risk,
    vulnerabilities: scan?.findings || [],
    patchNotes: patch?.notes || [],
    validation: tests || [],
    fuzz,
    recommendations: [
      'Enforce allowlisted command execution only — never shell interpolation.',
      'Adopt parameterized queries across every data plane.',
      'Gate firmware and telemetry with signed schemas.',
      'Keep fuzzing in CI against the patched corpus.',
    ],
  }
}
