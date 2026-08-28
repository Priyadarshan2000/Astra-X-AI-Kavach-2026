<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = db();
$user = require_user($pdo);
$input = json_input();
$projectId = (int) ($input['project_id'] ?? 0);

$tests = simulate_regression();

if ($projectId > 0) {
    $stmt = $pdo->prepare(
        'INSERT INTO regression_tests (project_id, user_id, suite, detail, status, latency_ms)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    foreach ($tests as $test) {
        $stmt->execute([
            $projectId,
            (int) $user['id'],
            $test['name'],
            $test['detail'],
            $test['status'],
            $test['latency'],
        ]);
    }
}

json_ok(['tests' => $tests]);
