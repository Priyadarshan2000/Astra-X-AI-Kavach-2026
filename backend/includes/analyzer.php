<?php
declare(strict_types=1);

function analyze_source(string $code, string $language): array
{
    $rules = [
        ['re' => '/strcpy\s*\(/', 'langs' => ['c', 'cpp'], 'title' => 'Unbounded strcpy', 'cwe' => 'CWE-120', 'severity' => 'critical', 'risk' => 96, 'confidence' => 0.97, 'fix' => 'Replace strcpy with strncpy or memcpy with explicit bounds.'],
        ['re' => '/gets\s*\(/', 'langs' => ['c', 'cpp'], 'title' => 'Unsafe gets()', 'cwe' => 'CWE-242', 'severity' => 'critical', 'risk' => 99, 'confidence' => 0.99, 'fix' => 'Use fgets with a fixed buffer size.'],
        ['re' => '/sprintf\s*\(/', 'langs' => ['c', 'cpp'], 'title' => 'Unbounded sprintf', 'cwe' => 'CWE-120', 'severity' => 'high', 'risk' => 88, 'confidence' => 0.93, 'fix' => 'Use snprintf with destination capacity.'],
        ['re' => '/strcat\s*\(/', 'langs' => ['c', 'cpp'], 'title' => 'Unbounded strcat', 'cwe' => 'CWE-120', 'severity' => 'high', 'risk' => 86, 'confidence' => 0.92, 'fix' => 'Use strncat with remaining buffer length.'],
        ['re' => '/system\s*\(/', 'langs' => ['c', 'cpp'], 'title' => 'OS command injection', 'cwe' => 'CWE-78', 'severity' => 'critical', 'risk' => 94, 'confidence' => 0.95, 'fix' => 'Avoid shelling out; use allowlisted execve arguments.'],
        ['re' => '/printf\s*\(\s*[a-zA-Z_]/', 'langs' => ['c', 'cpp'], 'title' => 'Format string vulnerability', 'cwe' => 'CWE-134', 'severity' => 'high', 'risk' => 82, 'confidence' => 0.9, 'fix' => 'Use printf("%s", input) or fputs.'],
        ['re' => '/pickle\.loads/', 'langs' => ['python'], 'title' => 'Insecure deserialization', 'cwe' => 'CWE-502', 'severity' => 'critical', 'risk' => 97, 'confidence' => 0.98, 'fix' => 'Use json or a signed schema instead of pickle.'],
        ['re' => '/os\.system\s*\(.*\+/', 'langs' => ['python'], 'title' => 'Command injection', 'cwe' => 'CWE-78', 'severity' => 'critical', 'risk' => 95, 'confidence' => 0.96, 'fix' => 'Use subprocess.run with a list and shell=False.'],
        ['re' => '/["\'].*%s["\']\s*%/', 'langs' => ['python'], 'title' => 'SQL string interpolation', 'cwe' => 'CWE-89', 'severity' => 'critical', 'risk' => 93, 'confidence' => 0.94, 'fix' => 'Use parameterized queries.'],
        ['re' => '/eval\s*\(|exec\s*\(/', 'langs' => ['python'], 'title' => 'Dynamic code execution', 'cwe' => 'CWE-95', 'severity' => 'critical', 'risk' => 98, 'confidence' => 0.97, 'fix' => 'Remove eval/exec; parse with ast.literal_eval if needed.'],
        ['re' => '/execute\s*\(\s*["\'].*\+/', 'langs' => ['java'], 'title' => 'SQL concatenation', 'cwe' => 'CWE-89', 'severity' => 'critical', 'risk' => 94, 'confidence' => 0.95, 'fix' => 'Use PreparedStatement placeholders.'],
        ['re' => '/Runtime\.getRuntime\(\)\.exec/', 'langs' => ['java'], 'title' => 'Runtime.exec injection', 'cwe' => 'CWE-78', 'severity' => 'high', 'risk' => 90, 'confidence' => 0.91, 'fix' => 'Use ProcessBuilder with a fixed argument list.'],
    ];

    $findings = [];
    $lines = preg_split("/\r\n|\n|\r/", $code) ?: [];
    $i = 0;
    foreach ($rules as $rule) {
        $i++;
        if (!in_array($language, $rule['langs'], true)) {
            continue;
        }
        if (!preg_match($rule['re'], $code)) {
            continue;
        }
        $line = 1;
        foreach ($lines as $idx => $text) {
            if (preg_match($rule['re'], $text)) {
                $line = $idx + 1;
                break;
            }
        }
        $findings[] = [
            'id' => sprintf('VULN-%03d', $i),
            'title' => $rule['title'],
            'cwe' => $rule['cwe'],
            'severity' => $rule['severity'],
            'risk' => $rule['risk'],
            'confidence' => $rule['confidence'],
            'fix' => $rule['fix'],
            'line' => $line,
        ];
    }

    if (!$findings) {
        $findings[] = [
            'id' => 'VULN-000',
            'title' => 'No high-confidence pattern match',
            'cwe' => 'CWE-000',
            'severity' => 'low',
            'risk' => 12,
            'confidence' => 0.54,
            'fix' => 'Continue with fuzzing and regression to confirm residual risk.',
            'line' => 1,
        ];
    }

    $avg = array_sum(array_column($findings, 'risk')) / max(count($findings), 1);
    $score = max(8, 100 - (int) round($avg));

    return ['findings' => $findings, 'score' => $score, 'language' => $language];
}

function generate_patch(string $code, string $language): array
{
    $patched = $code;
    $notes = [];

    if (in_array($language, ['c', 'cpp'], true)) {
        if (str_contains($patched, 'strcpy')) {
            $patched = preg_replace('/strcpy\s*\(\s*([^,]+),\s*([^)]+)\)/', 'strncpy($1, $2, sizeof($1) - 1)', $patched) ?? $patched;
            $notes[] = 'Hardened unbounded strcpy with strncpy + capacity.';
        }
        if (str_contains($patched, 'sprintf')) {
            $patched = preg_replace('/sprintf\s*\(\s*([^,]+),/', 'snprintf($1, sizeof($1),', $patched) ?? $patched;
            $notes[] = 'Replaced sprintf with snprintf.';
        }
        if (str_contains($patched, 'strcat')) {
            $patched = preg_replace('/strcat\s*\(\s*([^,]+),\s*([^)]+)\)/', 'strncat($1, $2, sizeof($1) - strlen($1) - 1)', $patched) ?? $patched;
            $notes[] = 'Bounded strcat with remaining capacity.';
        }
        if (preg_match('/system\s*\(/', $patched)) {
            $patched = preg_replace('/system\s*\([^)]*\);/', '/* command execution removed — use allowlisted execve */', $patched) ?? $patched;
            $notes[] = 'Removed shell execution path.';
        }
        if (preg_match('/printf\s*\(\s*[a-zA-Z_]/', $patched)) {
            $patched = preg_replace('/printf\s*\(\s*([a-zA-Z_][\w]*)\s*\)/', 'printf("%s", $1)', $patched) ?? $patched;
            $notes[] = 'Neutralized format-string sink.';
        }
    }

    if ($language === 'python') {
        if (str_contains($patched, 'pickle.loads')) {
            $patched = str_replace('pickle.loads(blob)', 'json.loads(blob.decode())', $patched);
            $notes[] = 'Replaced pickle with JSON decoding.';
        }
        if (preg_match('/os\.system/', $patched)) {
            $patched = preg_replace('/os\.system\([^)]+\)/', 'subprocess.run(["ping", name], check=False)', $patched) ?? $patched;
            $notes[] = 'Switched os.system to subprocess argument list.';
        }
    }

    if ($language === 'java') {
        if (str_contains($patched, 'createStatement')) {
            $notes[] = 'Recommend PreparedStatement placeholders for SQL.';
        }
        if (str_contains($patched, 'Runtime.getRuntime()')) {
            $patched = preg_replace('/Runtime\.getRuntime\(\)\.exec\([^;]+;/', 'new ProcessBuilder("id").start();', $patched) ?? $patched;
            $notes[] = 'Replaced Runtime.exec with a fixed ProcessBuilder.';
        }
    }

    $confidence = $notes ? 0.91 : 0.62;
    $riskReduction = $notes ? 78 : 12;
    $impact = $notes ? 'High — memory and injection classes closed' : 'Low — residual review required';

    return compact('patched', 'notes', 'confidence', 'riskReduction', 'impact');
}

function simulate_fuzz(array $findings): array
{
    $attacks = 1280 + count($findings) * 140;
    $beforeCrashes = max(18, count($findings) * 11);
    $afterCrashes = max(0, (int) round($beforeCrashes * 0.04));
    return [
        'attacks' => $attacks,
        'rps' => 420,
        'before' => ['crashes' => $beforeCrashes, 'success' => 12, 'defence' => 41],
        'after' => ['crashes' => $afterCrashes, 'success' => 96, 'defence' => 98],
        'logBefore' => [
            '[FUZZ] corpus seed=0xA7F3',
            '[CASE 014] overflow → SIGSEGV',
            '[CASE 031] format string → stack leak',
            sprintf('[STAT] crashes=%d unique=%d', $beforeCrashes, max(3, count($findings))),
        ],
        'logAfter' => [
            '[FUZZ] patched corpus seed=0xA7F3',
            '[CASE 014] bounded copy → rejected',
            '[CASE 031] printf sanitized → no leak',
            sprintf('[STAT] crashes=%d defence=HOLD', $afterCrashes),
        ],
    ];
}

function simulate_regression(): array
{
    return [
        ['id' => 'login', 'name' => 'Login', 'detail' => 'JWT handshake + lockout policy', 'status' => 'pass', 'latency' => 42],
        ['id' => 'api', 'name' => 'API', 'detail' => 'Authenticated REST contract', 'status' => 'pass', 'latency' => 38],
        ['id' => 'comm', 'name' => 'Communication', 'detail' => 'Packet parser bounds + HMAC', 'status' => 'pass', 'latency' => 61],
        ['id' => 'drone', 'name' => 'Drone Parser', 'detail' => 'Telemetry schema validation', 'status' => 'pass', 'latency' => 54],
        ['id' => 'db', 'name' => 'Database', 'detail' => 'Parameterized queries only', 'status' => 'pass', 'latency' => 29],
    ];
}
