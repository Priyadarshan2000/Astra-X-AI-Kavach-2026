<?php
declare(strict_types=1);

function astra_ai_system_prompt(array $context): string
{
    return <<<'PROMPT'
You are ASTRA-X — Autonomous Security Tactical Reasoning Agent for Kavach 2026 Indian Army cyber demonstration.

Role: Guide defence reviewers through digital twin → static CWE scan → secure patch → lab fuzz → regression certification.

Rules:
- Defensive hold only. Never suggest exploits, live attacks, weaponization, or offensive tooling.
- Be concise (2–5 sentences unless listing mission steps). Professional military-cyber tone. Jai Hind when greeting.
- Use mission context when provided: twin name, scan score, findings count, patch/fuzz/test state, current route.
- Recommend the next highlighted action from the mission loop when asked.
- Demo clearance when asked: operator@astra.mil / AstraX#2026
- Never mention Google, Gemini, OpenAI, ChatGPT, Claude, or any third-party AI vendor. You are ASTRA-X only.
PROMPT
        . "\n\nMission context JSON:\n"
        . json_encode($context, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

function astra_ai_chat(string $message, array $context, string $apiKey): ?string
{
    $models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];

    foreach ($models as $model) {
        $reply = astra_ai_request($message, $context, $apiKey, $model);
        if ($reply !== null && trim($reply) !== '') {
            return trim($reply);
        }
    }

    return null;
}

function astra_ai_request(string $message, array $context, string $apiKey, string $model): ?string
{
    $system = astra_ai_system_prompt($context);
    return astra_ai_raw_request($system, $message, $apiKey, $model, 512);
}

function astra_ai_raw_request(
    string $system,
    string $message,
    string $apiKey,
    string $model,
    int $maxTokens = 512
): ?string {
    $url = sprintf(
        'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s',
        rawurlencode($model),
        rawurlencode($apiKey)
    );

    $payload = json_encode([
        'systemInstruction' => [
            'parts' => [['text' => $system]],
        ],
        'contents' => [
            [
                'role' => 'user',
                'parts' => [['text' => $message]],
            ],
        ],
        'generationConfig' => [
            'temperature' => 0.35,
            'maxOutputTokens' => $maxTokens,
            'topP' => 0.92,
        ],
        'safetySettings' => [
            ['category' => 'HARM_CATEGORY_HARASSMENT', 'threshold' => 'BLOCK_ONLY_HIGH'],
            ['category' => 'HARM_CATEGORY_HATE_SPEECH', 'threshold' => 'BLOCK_ONLY_HIGH'],
            ['category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold' => 'BLOCK_ONLY_HIGH'],
            ['category' => 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold' => 'BLOCK_ONLY_HIGH'],
        ],
    ], JSON_UNESCAPED_UNICODE);

    if ($payload === false) {
        return null;
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
    ]);

    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($raw === false || $code < 200 || $code >= 300) {
        return null;
    }

    $data = json_decode((string) $raw, true);
    if (!is_array($data)) {
        return null;
    }

    $parts = $data['candidates'][0]['content']['parts'] ?? [];
    $text = '';
    foreach ($parts as $part) {
        if (isset($part['text'])) {
            $text .= (string) $part['text'];
        }
    }

    return $text !== '' ? $text : null;
}

function astra_ai_suggestions(string $message, array $context): array
{
    $q = strtolower($message);
    $isAuthed = (bool) ($context['isAuthed'] ?? false);

    if (str_contains($q, 'status') || str_contains($q, 'mission')) {
        return ['Next step', 'How to scan?', 'Kavach 2026'];
    }
    if (str_contains($q, 'scan') || str_contains($q, 'cwe')) {
        return ['Synthesize patch', 'Mission status'];
    }
    if (str_contains($q, 'patch')) {
        return ['Run fuzz', 'Mission status'];
    }
    if (str_contains($q, 'fuzz')) {
        return ['Run tests', 'Open report'];
    }
    if (!$isAuthed) {
        return ['Demo login', 'Mission loop', 'Kavach 2026'];
    }
    return ['Mission status', 'Next step', 'Defensive doctrine', 'Kavach 2026'];
}

function astra_ai_parse_json(string $text): ?array
{
    $text = trim($text);
    if (preg_match('/```(?:json)?\s*(.*?)```/s', $text, $m)) {
        $text = trim($m[1]);
    }
    $data = json_decode($text, true);
    return is_array($data) ? $data : null;
}

function astra_ai_resolve_key(): string
{
    if (defined('ASTRA_AI_KEY') && ASTRA_AI_KEY !== '' && ASTRA_AI_KEY !== 'replace-with-ai-key') {
        return (string) ASTRA_AI_KEY;
    }
    if (defined('ASTRA_OPENAI_KEY') && ASTRA_OPENAI_KEY !== '' && ASTRA_OPENAI_KEY !== 'replace-with-openai-key') {
        return (string) ASTRA_OPENAI_KEY;
    }
    return '';
}

function astra_ai_patch_explain(
    string $original,
    string $patched,
    string $language,
    array $notes,
    array $findings,
    string $apiKey
): ?array {
    $system = <<<'PROMPT'
You are ASTRA-X patch analyst for Kavach 2026 Indian Army cyber assurance.
Explain defensive code rewrites to military software reviewers in clear tactical language.

Return ONLY valid JSON (no markdown, no code fences):
{
  "summary": "2-3 sentence executive briefing on what was hardened and overall risk reduction",
  "items": [
    {
      "title": "Short finding title",
      "cwe": "CWE-XXX",
      "severity": "critical|high|medium|low",
      "change": "before → after one-liner",
      "detail": "2-3 sentences: attack surface closed, defensive rationale, theatre impact",
      "reviewerTip": "One actionable line for Kavach evaluator"
    }
  ]
}

Rules:
- Map each patch note to one item. Include CWE IDs when applicable.
- Defensive hold only. Never suggest exploits or offensive steps.
- Never mention Google, Gemini, OpenAI, or any AI vendor. You are ASTRA-X.
PROMPT;

    $user = json_encode([
        'language' => $language,
        'patchNotes' => $notes,
        'findings' => array_slice($findings, 0, 8),
        'originalExcerpt' => mb_substr($original, 0, 2500),
        'patchedExcerpt' => mb_substr($patched, 0, 2500),
    ], JSON_UNESCAPED_UNICODE);

    $models = ['gemini-2.0-flash', 'gemini-1.5-flash'];

    foreach ($models as $model) {
        $raw = astra_ai_raw_request($system, $user, $apiKey, $model, 900);
        if ($raw === null) {
            continue;
        }
        $parsed = astra_ai_parse_json($raw);
        if ($parsed && !empty($parsed['items']) && is_array($parsed['items'])) {
            $parsed['items'] = array_values(array_map(static function ($item) {
                return [
                    'title' => (string) ($item['title'] ?? 'Hardening applied'),
                    'cwe' => (string) ($item['cwe'] ?? 'CWE-000'),
                    'severity' => (string) ($item['severity'] ?? 'medium'),
                    'change' => (string) ($item['change'] ?? ''),
                    'detail' => (string) ($item['detail'] ?? ''),
                    'reviewerTip' => (string) ($item['reviewerTip'] ?? ''),
                ];
            }, $parsed['items']));
            $parsed['summary'] = (string) ($parsed['summary'] ?? '');
            $parsed['engine'] = 'live';
            return $parsed;
        }
    }

    return null;
}

function astra_ai_patch_explain_fallback(array $notes, array $findings): array
{
    $items = [];
    foreach ($notes as $i => $note) {
        $finding = $findings[$i] ?? null;
        $items[] = [
            'title' => is_array($finding) ? (string) ($finding['title'] ?? 'Defensive rewrite') : 'Defensive rewrite',
            'cwe' => is_array($finding) ? (string) ($finding['cwe'] ?? 'CWE-000') : 'CWE-000',
            'severity' => is_array($finding) ? (string) ($finding['severity'] ?? 'medium') : 'medium',
            'change' => (string) $note,
            'detail' => (string) $note,
            'reviewerTip' => 'Confirm hardened path in lab fuzz before theatre clearance.',
        ];
    }

    return [
        'summary' => $items
            ? 'ASTRA-X applied bounded defensive rewrites to close identified attack surfaces. Review each change against the twin corpus before fuzz validation.'
            : 'No automated rewrites were required. Continue with fuzz and regression to validate residual risk.',
        'items' => $items,
        'engine' => 'local',
    ];
}
