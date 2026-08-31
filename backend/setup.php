<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$key = (string) ($_GET['key'] ?? '');
if (ASTRA_SETUP_KEY === '' || !hash_equals(ASTRA_SETUP_KEY, $key)) {
    json_fail('Unauthorized setup request.', 401);
}

try {
    $pdo = db();
} catch (Throwable $e) {
    json_fail('Database connection failed: ' . $e->getMessage(), 500);
}

$tables = ['users', 'projects', 'scans', 'patches', 'fuzz_results', 'regression_tests', 'reports'];
$missing = [];
foreach ($tables as $table) {
    $stmt = $pdo->query("SHOW TABLES LIKE " . $pdo->quote($table));
    if (!$stmt->fetch()) {
        $missing[] = $table;
    }
}

if ($missing !== []) {
    json_fail('Import database/schema-hostinger.sql first.', 503, ['missing_tables' => $missing]);
}

$email = 'operator@astra.mil';
$name = 'Operator';
$password = 'AstraX#2026';

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$seeded = false;

if (!$stmt->fetch()) {
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $insert = $pdo->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    $insert->execute([$name, $email, $hash, 'COMMAND']);
    $seeded = true;
}

json_ok([
    'message' => $seeded ? 'Demo operator seeded.' : 'Demo operator already exists.',
    'operator' => [
        'email' => $email,
        'password' => $password,
    ],
    'next' => 'Delete or disable setup.php after first run. Verify with health.php.',
]);
