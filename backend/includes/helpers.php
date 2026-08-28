<?php
declare(strict_types=1);

function astra_cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Content-Type: application/json; charset=utf-8');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_input(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function json_ok(array $payload, int $code = 200): never
{
    http_response_code($code);
    echo json_encode(['ok' => true] + $payload);
    exit;
}

function json_fail(string $message, int $code = 400, array $extra = []): never
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'message' => $message] + $extra);
    exit;
}

function b64url(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function b64url_decode(string $data): string
{
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return (string) base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode(array $payload, string $secret): string
{
    $header = b64url(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $body = b64url(json_encode($payload));
    $sig = b64url(hash_hmac('sha256', $header . '.' . $body, $secret, true));
    return $header . '.' . $body . '.' . $sig;
}

function jwt_decode(string $token, string $secret): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    [$header, $body, $sig] = $parts;
    $expected = b64url(hash_hmac('sha256', $header . '.' . $body, $secret, true));
    if (!hash_equals($expected, $sig)) {
        return null;
    }
    $payload = json_decode(b64url_decode($body), true);
    if (!is_array($payload)) {
        return null;
    }
    if (isset($payload['exp']) && time() >= (int) $payload['exp']) {
        return null;
    }
    return $payload;
}

function bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/', $header, $m)) {
        return $m[1];
    }
    return null;
}

function require_user(PDO $pdo): array
{
    $token = bearer_token();
    if (!$token) {
        json_fail('Missing authorization token.', 401);
    }
    $payload = jwt_decode($token, ASTRA_JWT_SECRET);
    if (!$payload || empty($payload['sub'])) {
        json_fail('Invalid or expired token.', 401);
    }
    $stmt = $pdo->prepare('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([(int) $payload['sub']]);
    $user = $stmt->fetch();
    if (!$user) {
        json_fail('Operator not found.', 401);
    }
    return $user;
}

function public_user(array $user): array
{
    return [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'] ?? 'COMMAND',
    ];
}

function issue_token(array $user): string
{
    return jwt_encode([
        'sub' => (int) $user['id'],
        'email' => $user['email'],
        'iat' => time(),
        'exp' => time() + ASTRA_JWT_TTL,
    ], ASTRA_JWT_SECRET);
}
