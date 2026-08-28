<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$input = json_input();
$message = trim((string) ($input['message'] ?? ''));
$context = is_array($input['context'] ?? null) ? $input['context'] : [];

if ($message === '') {
    json_fail('Message required.');
}

$secretsFile = __DIR__ . '/config/secrets.php';
$openaiKey = null;
if (is_file($secretsFile)) {
    require_once $secretsFile;
    $openaiKey = defined('ASTRA_OPENAI_KEY') ? (string) ASTRA_OPENAI_KEY : null;
}

if ($openaiKey && $openaiKey !== '' && $openaiKey !== 'replace-with-openai-key') {
    $reply = astra_openai_chat($message, $context, $openaiKey);
    if ($reply !== null) {
        json_ok(['reply' => $reply, 'suggestions' => astra_suggestions($message)]);
    }
}

json_ok(['reply' => astra_rule_reply($message, $context), 'suggestions' => astra_suggestions($message)]);

function astra_rule_reply(string $message, array $context): string
{
    $q = strtolower($message);
    $mission = is_array($context['mission'] ?? null) ? $context['mission'] : [];
    $isAuthed = (bool) ($context['isAuthed'] ?? false);

    if (preg_match('/^(hi|hello|hey|namaste|jai hind|help)$/i', $q)) {
        return $isAuthed
            ? 'Jai Hind. ASTRA-X online. Ask for mission status, next step, or Kavach 2026 guidance.'
            : 'Jai Hind. I am ASTRA-X for Kavach 2026. Log in with demo clearance to arm the mission loop.';
    }

    if (str_contains($q, 'kavach') || str_contains($q, 'army')) {
        return 'Kavach 2026 evaluates defensive cyber assurance. ASTRA-X demonstrates twin-first scan, patch, fuzz, and certification — no live targeting.';
    }

    if (str_contains($q, 'login') || str_contains($q, 'demo')) {
        return "Demo clearance: operator@astra.mil / AstraX#2026";
    }

    if (str_contains($q, 'status') || str_contains($q, 'mission')) {
        if (!$isAuthed) {
            return 'Log in to read live mission state from the command deck.';
        }
        $twin = (string) ($mission['twin']['name'] ?? 'No twin');
        $score = $mission['scan']['score'] ?? '—';
        return "Twin: {$twin}. Scan score: {$score}. Follow the mission strip for the next action.";
    }

    if (str_contains($q, 'next') || str_contains($q, 'step')) {
        return 'Follow the highlighted action on the mission strip: Twin → Scan → Patch → Fuzz → Tests → Report.';
    }

    if (str_contains($q, 'astra')) {
        return 'ASTRA-X is the Autonomous Security Tactical Reasoning Agent for Indian Army mission software assurance on the Bharat defence mesh.';
    }

    return 'I can assist with mission status, the tactical loop, Kavach 2026, and defensive doctrine. Try "mission status" or "next step".';
}

function astra_suggestions(string $message): array
{
    $q = strtolower($message);
    if (str_contains($q, 'status')) {
        return ['Next step', 'Kavach 2026'];
    }
    return ['Mission status', 'Next step', 'Demo login', 'Kavach 2026'];
}

function astra_openai_chat(string $message, array $context, string $apiKey): ?string
{
    $system = 'You are ASTRA-X, the Autonomous Security Tactical Reasoning Agent for Kavach 2026 Indian Army cyber demonstration. '
        . 'You assist reviewers with defensive software assurance: digital twin, static CWE scan, secure patch, lab fuzz, regression. '
        . 'Never suggest exploits or live attacks. Be concise, professional, use military-cyber tone. '
        . 'Context: ' . json_encode($context);

    $payload = json_encode([
        'model' => 'gpt-4o-mini',
        'messages' => [
            ['role' => 'system', 'content' => $system],
            ['role' => 'user', 'content' => $message],
        ],
        'max_tokens' => 320,
        'temperature' => 0.4,
    ]);

    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        ],
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 12,
    ]);
    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($raw === false || $code < 200 || $code >= 300) {
        return null;
    }

    $data = json_decode((string) $raw, true);
    return $data['choices'][0]['message']['content'] ?? null;
}
