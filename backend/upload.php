<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$pdo = db();
$user = require_user($pdo);

if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    json_fail('Source file missing.');
}

$file = $_FILES['file'];
$allowed = ['c', 'h', 'cpp', 'cc', 'cxx', 'hpp', 'py', 'java'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed, true)) {
    json_fail('Unsupported language. Use C, C++, Python or Java.');
}
if ($file['size'] > 512 * 1024) {
    json_fail('File exceeds 512KB limit.');
}

if (!is_dir(ASTRA_UPLOAD_DIR)) {
    mkdir(ASTRA_UPLOAD_DIR, 0755, true);
}

$safe = bin2hex(random_bytes(8)) . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $file['name']);
$dest = ASTRA_UPLOAD_DIR . '/' . $safe;
if (!move_uploaded_file($file['tmp_name'], $dest)) {
    json_fail('Failed to store upload.', 500);
}

$projectId = (int) ($_POST['project_id'] ?? 0);
if ($projectId < 1) {
    $stmt = $pdo->prepare('INSERT INTO projects (user_id, name, twin_unit) VALUES (?, ?, ?)');
    $stmt->execute([(int) $user['id'], 'Ad-hoc ingest', 'SCAN']);
    $projectId = (int) $pdo->lastInsertId();
}

json_ok([
    'fileName' => $file['name'],
    'storedAs' => $safe,
    'projectId' => $projectId,
    'size' => (int) $file['size'],
]);
