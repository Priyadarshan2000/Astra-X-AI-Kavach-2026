<?php
/**
 * Copy this file to secrets.php and adjust for your XAMPP / MySQL instance.
 */
define('ASTRA_DB_HOST', '127.0.0.1');
define('ASTRA_DB_PORT', '3306');
define('ASTRA_DB_NAME', 'astra_x');
define('ASTRA_DB_USER', 'root');
define('ASTRA_DB_PASS', '');
define('ASTRA_JWT_SECRET', 'replace-with-a-long-random-secret');
define('ASTRA_CORS_ORIGINS', 'https://astra-x-ai-kavach-2026.vercel.app,http://localhost:5173');
define('ASTRA_SETUP_KEY', 'replace-with-one-time-setup-key');
/** Live inference for ASTRA-X agent (chat.php) */
define('ASTRA_AI_KEY', 'replace-with-ai-key');
