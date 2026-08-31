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
    $url = sprintf(
        'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s',
        rawurlencode($model),
        rawurlencode($apiKey)
    );

    $payload = json_encode([
        'systemInstruction' => [
            'parts' => [['text' => astra_ai_system_prompt($context)]],
        ],
        'contents' => [
            [
                'role' => 'user',
                'parts' => [['text' => $message]],
            ],
        ],
        'generationConfig' => [
            'temperature' => 0.35,
            'maxOutputTokens' => 512,
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
