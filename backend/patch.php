<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = db();
$user = require_user($pdo);
$input = json_input();

$code = (string) ($input['code'] ?? '');
$language = strtolower((string) ($input['language'] ?? 'c'));
$scanId = (int) ($input['scan_id'] ?? 0);
$projectId = (int) ($input['project_id'] ?? 0);

if (trim($code) === '') {
    json_fail('Source corpus is empty.');
}

$patch = generate_patch($code, $language);

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
