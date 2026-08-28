<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$input = json_input();
$name = trim((string) ($input['name'] ?? ''));
$email = strtolower(trim((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
    json_fail('Name, valid email and 8+ character passphrase required.');
}

$pdo = db();
$exists = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$exists->execute([$email]);
if ($exists->fetch()) {
    json_fail('Clearance ID already registered.', 409);
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
$stmt->execute([$name, $email, $hash, 'COMMAND']);

$user = [
    'id' => (int) $pdo->lastInsertId(),
    'name' => $name,
    'email' => $email,
    'role' => 'COMMAND',
];

json_ok(['user' => public_user($user), 'token' => issue_token($user)], 201);
