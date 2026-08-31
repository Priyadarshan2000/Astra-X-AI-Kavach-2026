<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

json_ok([
    'service' => 'ASTRA-X REST API',
    'version' => '1.0.0',
    'endpoints' => [
        'GET health.php' => 'Database and table readiness check',
        'POST login.php' => 'JWT authentication',
        'POST register.php' => 'Operator registration',
        'POST upload.php' => 'Source file ingest (JWT)',
        'POST scan.php' => 'Static CWE analysis (JWT)',
        'POST patch.php' => 'Secure rewrite (JWT)',
        'POST fuzz.php' => 'Lab fuzz simulation (JWT)',
        'POST regression.php' => 'Tactical test suites (JWT)',
        'GET reports.php' => 'After-action dossier (JWT)',
        'POST chat.php' => 'ASTRA-X agent chat',
    ],
]);
