<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = db();
$user = require_user($pdo);
$input = json_input();

$findings = $input['findings'] ?? [];
if (!is_array($findings)) {
    $findings = [];
}

$fuzz = simulate_fuzz($findings);
$projectId = (int) ($input['project_id'] ?? 0);
$patchId = (int) ($input['patch_id'] ?? 0);

if ($projectId > 0) {
    $stmt = $pdo->prepare(
        'INSERT INTO fuzz_results (project_id, patch_id, user_id, attacks, rps, crashes_before, crashes_after, defence_after, log_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $projectId,
        $patchId ?: null,
        (int) $user['id'],
        $fuzz['attacks'],
        $fuzz['rps'],
        $fuzz['before']['crashes'],
        $fuzz['after']['crashes'],
        $fuzz['after']['defence'],
        json_encode(['before' => $fuzz['logBefore'], 'after' => $fuzz['logAfter']]),
    ]);
    $fuzz['fuzzId'] = (int) $pdo->lastInsertId();
}

json_ok($fuzz);
