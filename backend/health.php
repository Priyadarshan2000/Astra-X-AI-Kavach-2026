<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$checks = [
    'php' => PHP_VERSION,
    'pdo_mysql' => extension_loaded('pdo_mysql'),
    'uploads_writable' => is_dir(ASTRA_UPLOAD_DIR) && is_writable(ASTRA_UPLOAD_DIR),
];

try {
    $pdo = db();
    $pdo->query('SELECT 1');
    $checks['database'] = true;
    $checks['database_name'] = ASTRA_DB_NAME;

    $tables = ['users', 'projects', 'scans', 'patches', 'fuzz_results', 'regression_tests', 'reports'];
    $missing = [];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE " . $pdo->quote($table));
        if (!$stmt->fetch()) {
            $missing[] = $table;
        }
    }
    $checks['tables_ok'] = $missing === [];
    if ($missing !== []) {
        $checks['missing_tables'] = $missing;
    }

    $userCount = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $checks['users'] = $userCount;
} catch (Throwable $e) {
    $checks['database'] = false;
    $checks['database_error'] = $e->getMessage();
}

$ready = ($checks['database'] ?? false)
    && ($checks['pdo_mysql'] ?? false)
    && ($checks['tables_ok'] ?? false)
    && ($checks['uploads_writable'] ?? false);

json_ok([
    'service' => 'ASTRA-X API',
    'status' => $ready ? 'ready' : 'degraded',
    'checks' => $checks,
]);
