<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = db();
$user = require_user($pdo);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $input = json_input();
    $projectId = (int) ($input['project_id'] ?? 0);
    $summary = (string) ($input['executive'] ?? 'ASTRA-X completed an autonomous defensive assessment.');
    $risk = (int) ($input['riskScore'] ?? 72);
    $body = json_encode($input);

    if ($projectId < 1) {
        json_fail('project_id required to persist a report.');
    }

    $stmt = $pdo->prepare(
        'INSERT INTO reports (project_id, user_id, classification, executive_summary, risk_score, body_json)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $projectId,
        (int) $user['id'],
        'RESTRICTED // ASTRA-X',
        $summary,
        $risk,
        $body,
    ]);

    json_ok(['reportId' => (int) $pdo->lastInsertId()], 201);
}

$stmt = $pdo->prepare(
    'SELECT r.id, r.classification, r.executive_summary, r.risk_score, r.body_json, r.created_at, p.name AS project
     FROM reports r
     JOIN projects p ON p.id = r.project_id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC
     LIMIT 25'
);
$stmt->execute([(int) $user['id']]);
$rows = $stmt->fetchAll();

foreach ($rows as &$row) {
    $row['body'] = json_decode($row['body_json'] ?? '[]', true);
    unset($row['body_json']);
}

json_ok(['reports' => $rows]);
