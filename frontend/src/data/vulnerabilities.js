export const VULN_CARDS = [
  {
    id: 'sqli',
    title: 'SQL Injection',
    cwe: 'CWE-89',
    detect: 'Pattern match on string concatenation in SQL queries and template literals with user input.',
    patch: 'Parameterized queries with bound placeholders — PreparedStatement / PDO bind params.',
    test: 'Regression suite validates query layer; fuzz corpus includes injection strings.',
  },
  {
    id: 'xss',
    title: 'Cross-Site Scripting',
    cwe: 'CWE-79',
    detect: 'innerHTML, document.write, and unescaped DOM sinks flagged in JavaScript corpora.',
    patch: 'Replace with textContent or schema-validated sanitization (DOMPurify pattern).',
    test: 'Lab fuzz injects script payloads; patched build rejects all variants.',
  },
  {
    id: 'csrf',
    title: 'CSRF',
    cwe: 'CWE-352',
    detect: 'State-changing endpoints without CSRF token validation flagged in API gateway review.',
    patch: 'Synchronizer token pattern + SameSite cookie hardening on auth endpoints.',
    test: 'API regression validates token requirement on mutating routes.',
  },
  {
    id: 'bof',
    title: 'Buffer Overflow',
    cwe: 'CWE-120',
    detect: 'Unbounded strcpy, sprintf, strcat, memcpy without capacity checks in C/C++.',
    patch: 'Bounded copies — strncpy, snprintf, strncat with explicit destination size.',
    test: 'Fuzz harness sends oversized payloads; bounded copy rejects overflow.',
  },
  {
    id: 'cmdi',
    title: 'Command Injection',
    cwe: 'CWE-78',
    detect: 'system(), exec(), os.system(), Runtime.exec() with string concatenation.',
    patch: 'Remove shell paths; use allowlisted ProcessBuilder / spawn argument arrays.',
    test: 'Injection corpus in lab sandbox — no shell spawn on patched build.',
  },
]

export const AI_PIPELINE = [
  { step: '01', title: 'Static Analysis', detail: 'Regex + AST-pattern engine maps CWE classes with line numbers and confidence.' },
  { step: '02', title: 'Context Assembly', detail: 'Mission state, findings, and source corpus packaged for reasoning engine.' },
  { step: '03', title: 'Tactical Reasoning', detail: 'ASTRA-X generates defensive rewrite strategy and reviewer-facing explanation.' },
  { step: '04', title: 'Patch Validation', detail: 'Diff review, confidence scoring, risk reduction metric computed.' },
  { step: '05', title: 'Regression Testing', detail: 'Five tactical suites + lab fuzz confirm hardened build before certification.' },
]
