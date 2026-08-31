<?php
declare(strict_types=1);

function astra_api_catalog(): array
{
    return [
        'service' => 'ASTRA-X REST API',
        'version' => '1.0.0',
        'tagline' => 'Defence-grade API for Kavach 2026 — twin, scan, patch, fuzz, certify.',
        'frontend' => 'https://astra-x-ai-kavach-2026.vercel.app/',
        'github' => 'https://github.com/Priyadarshan2000/Astra-X-AI-Kavach-2026',
        'demo' => [
            'email' => 'operator@astra.mil',
            'password' => 'AstraX#2026',
        ],
        'groups' => [
            [
                'title' => 'Public — No auth',
                'tone' => 'cyan',
                'items' => [
                    ['method' => 'GET', 'path' => 'health.php', 'auth' => false, 'desc' => 'Database and table readiness check', 'try' => true],
                    ['method' => 'GET', 'path' => 'index.php', 'auth' => false, 'desc' => 'API portal (this page) · JSON via ?format=json', 'try' => false],
                    ['method' => 'POST', 'path' => 'login.php', 'auth' => false, 'desc' => 'JWT authentication for demo operator', 'try' => false, 'sample' => '{"email":"operator@astra.mil","password":"AstraX#2026"}'],
                    ['method' => 'POST', 'path' => 'register.php', 'auth' => false, 'desc' => 'Operator registration', 'try' => false],
                    ['method' => 'POST', 'path' => 'chat.php', 'auth' => false, 'desc' => 'ASTRA-X tactical agent — live inference', 'try' => false],
                    ['method' => 'POST', 'path' => 'explain.php', 'auth' => false, 'desc' => 'Patch analysis — CWE cards and reviewer tips', 'try' => false],
                ],
            ],
            [
                'title' => 'Mission loop — JWT required',
                'tone' => 'violet',
                'items' => [
                    ['method' => 'POST', 'path' => 'upload.php', 'auth' => true, 'desc' => 'Source file ingest (multipart)', 'try' => false],
                    ['method' => 'POST', 'path' => 'scan.php', 'auth' => true, 'desc' => 'Static CWE analysis on source corpus', 'try' => false],
                    ['method' => 'POST', 'path' => 'patch.php', 'auth' => true, 'desc' => 'Secure rewrite synthesis + ASTRA analysis', 'try' => false],
                    ['method' => 'POST', 'path' => 'fuzz.php', 'auth' => true, 'desc' => 'Lab fuzz simulation — before/after', 'try' => false],
                    ['method' => 'POST', 'path' => 'regression.php', 'auth' => true, 'desc' => 'Five tactical test suites', 'try' => false],
                    ['method' => 'GET', 'path' => 'reports.php', 'auth' => true, 'desc' => 'After-action mission dossiers', 'try' => false],
                ],
            ],
        ],
    ];
}

function astra_wants_json(): bool
{
    if (isset($_GET['format']) && $_GET['format'] === 'json') {
        return true;
    }
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    return str_contains($accept, 'application/json') && !str_contains($accept, 'text/html');
}

function astra_api_json_payload(): array
{
    $catalog = astra_api_catalog();
    $endpoints = [];
    foreach ($catalog['groups'] as $group) {
        foreach ($group['items'] as $item) {
            $key = $item['method'] . ' ' . $item['path'];
            $endpoints[$key] = $item['desc'];
        }
    }

    return [
        'service' => $catalog['service'],
        'version' => $catalog['version'],
        'endpoints' => $endpoints,
    ];
}
