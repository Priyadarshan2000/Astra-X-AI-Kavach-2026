<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = db();
$user = require_user($pdo);
$input = json_input();

$code = (string) ($input['code'] ?? '');
$language = strtolower((string) ($input['language'] ?? 'c'));
$fileName = substr((string) ($input['fileName'] ?? 'source.txt'), 0, 120);
$projectId = (int) ($input['project_id'] ?? 0);

if (trim($code) === '') {
    json_fail('Source corpus is empty.');
}
if (!in_array($language, ['c', 'cpp', 'python', 'java', 'javascript'], true)) {
    json_fail('Unsupported language.');
}

$result = analyze_source($code, $language);

if ($projectId < 1) {
    $stmt = $pdo->prepare('INSERT INTO projects (user_id, name, twin_unit) VALUES (?, ?, ?)');
    $stmt->execute([(int) $user['id'], $fileName, strtoupper($language)]);
    $projectId = (int) $pdo->lastInsertId();
}

$stmt = $pdo->prepare(
    'INSERT INTO scans (project_id, user_id, file_name, language, source_code, findings_json, risk_score)
     VALUES (?, ?, ?, ?, ?, ?, ?)'
);
$stmt->execute([
    $projectId,
    (int) $user['id'],
    $fileName,
    $language,
    $code,
    json_encode($result['findings']),
    $result['score'],
]);

json_ok($result + ['scanId' => (int) $pdo->lastInsertId(), 'projectId' => $projectId]);
