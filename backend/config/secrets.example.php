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
/** Optional: set for live LLM replies via chat.php */
define('ASTRA_OPENAI_KEY', 'replace-with-openai-key');
