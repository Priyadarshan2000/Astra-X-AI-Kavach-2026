<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/includes/ai.php';

$pdo = db();
$user = require_user($pdo);
$input = json_input();

$code = (string) ($input['code'] ?? '');
$language = strtolower((string) ($input['language'] ?? 'c'));
$scanId = (int) ($input['scan_id'] ?? 0);
$projectId = (int) ($input['project_id'] ?? 0);
$findings = is_array($input['findings'] ?? null) ? $input['findings'] : [];

if (trim($code) === '') {
    json_fail('Source corpus is empty.');
}

$patch = generate_patch($code, $language);

$aiKey = astra_ai_resolve_key();
if ($aiKey !== '') {
    $explanation = astra_ai_patch_explain(
        $code,
        $patch['patched'],
        $language,
        $patch['notes'],
        $findings,
        $aiKey
    );
    if ($explanation !== null) {
        $patch['explanation'] = $explanation;
    }
}

if (!isset($patch['explanation'])) {
    $patch['explanation'] = astra_ai_patch_explain_fallback($patch['notes'], $findings);
}

if ($projectId > 0) {
    $stmt = $pdo->prepare(
        'INSERT INTO patches (scan_id, project_id, user_id, original_code, patched_code, notes_json, confidence, risk_reduction)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $scanId ?: null,
        $projectId,
        (int) $user['id'],
        $code,
        $patch['patched'],
        json_encode($patch['notes']),
        $patch['confidence'],
        $patch['riskReduction'],
    ]);
    $patch['patchId'] = (int) $pdo->lastInsertId();
}

json_ok($patch);
