<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/includes/ai.php';

$input = json_input();
$original = (string) ($input['original'] ?? $input['code'] ?? '');
$patched = (string) ($input['patched'] ?? '');
$language = strtolower((string) ($input['language'] ?? 'c'));
$notes = is_array($input['notes'] ?? null) ? $input['notes'] : [];
$findings = is_array($input['findings'] ?? null) ? $input['findings'] : [];

if (trim($original) === '' || trim($patched) === '') {
    json_fail('Original and patched code required.');
}

$aiKey = astra_ai_resolve_key();
$explanation = null;

if ($aiKey !== '') {
    $explanation = astra_ai_patch_explain($original, $patched, $language, $notes, $findings, $aiKey);
}

if ($explanation === null) {
    $explanation = astra_ai_patch_explain_fallback($notes, $findings);
}

json_ok($explanation);
