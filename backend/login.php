<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$input = json_input();
$email = strtolower(trim((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    json_fail('Clearance ID and passphrase required.');
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id, name, email, role, password_hash FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_fail('Invalid credentials.', 401);
}

json_ok(['user' => public_user($user), 'token' => issue_token($user)]);
