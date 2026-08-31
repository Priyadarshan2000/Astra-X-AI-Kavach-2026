<?php
declare(strict_types=1);

$secrets = __DIR__ . '/secrets.php';
if (is_file($secrets)) {
    require $secrets;
}

if (!defined('ASTRA_DB_HOST')) {
    define('ASTRA_DB_HOST', getenv('ASTRA_DB_HOST') ?: '127.0.0.1');
}
if (!defined('ASTRA_DB_PORT')) {
    define('ASTRA_DB_PORT', getenv('ASTRA_DB_PORT') ?: '3306');
}
if (!defined('ASTRA_DB_NAME')) {
    define('ASTRA_DB_NAME', getenv('ASTRA_DB_NAME') ?: 'astra_x');
}
if (!defined('ASTRA_DB_USER')) {
    define('ASTRA_DB_USER', getenv('ASTRA_DB_USER') ?: 'root');
}
if (!defined('ASTRA_DB_PASS')) {
    define('ASTRA_DB_PASS', getenv('ASTRA_DB_PASS') ?: '');
}
if (!defined('ASTRA_JWT_SECRET')) {
    define('ASTRA_JWT_SECRET', getenv('ASTRA_JWT_SECRET') ?: 'change-me-in-production-astra-x-kavach-2026');
}
if (!defined('ASTRA_JWT_TTL')) {
    define('ASTRA_JWT_TTL', 60 * 60 * 12);
}
if (!defined('ASTRA_UPLOAD_DIR')) {
    define('ASTRA_UPLOAD_DIR', dirname(__DIR__) . '/uploads');
}
if (!defined('ASTRA_CORS_ORIGINS')) {
    $cors = getenv('ASTRA_CORS_ORIGINS') ?: '';
    define('ASTRA_CORS_ORIGINS', $cors !== '' ? $cors : 'https://astra-x-ai-kavach-2026.vercel.app,http://localhost:5173');
}
if (!defined('ASTRA_SETUP_KEY')) {
    define('ASTRA_SETUP_KEY', getenv('ASTRA_SETUP_KEY') ?: '');
}
