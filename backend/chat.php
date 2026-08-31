<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/includes/ai.php';

$input = json_input();
$message = trim((string) ($input['message'] ?? ''));
$context = is_array($input['context'] ?? null) ? $input['context'] : [];

if ($message === '') {
    json_fail('Message required.');
}

$aiKey = defined('ASTRA_AI_KEY') ? (string) ASTRA_AI_KEY : '';
if ($aiKey === '' && defined('ASTRA_OPENAI_KEY')) {
    $aiKey = (string) ASTRA_OPENAI_KEY;
}

if ($aiKey !== '' && $aiKey !== 'replace-with-ai-key') {
    $reply = astra_ai_chat($message, $context, $aiKey);
    if ($reply !== null) {
        json_ok([
            'reply' => $reply,
            'suggestions' => astra_ai_suggestions($message, $context),
            'engine' => 'live',
        ]);
    }
}

json_ok([
    'reply' => astra_rule_reply($message, $context),
    'suggestions' => astra_ai_suggestions($message, $context),
    'engine' => 'local',
]);

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
