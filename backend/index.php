<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/api_catalog.php';

if (astra_wants_json()) {
    require __DIR__ . '/bootstrap.php';
    json_ok(astra_api_json_payload());
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html; charset=utf-8');

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$base = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/\\');
$baseUrl = $scheme . '://' . $host . ($base && $base !== '/' ? $base : '');

$catalog = astra_api_catalog();
require __DIR__ . '/views/api-portal.php';
