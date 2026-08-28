<?php
declare(strict_types=1);

require __DIR__ . '/../backend/bootstrap.php';

$pdo = db();
$email = 'operator@astra.mil';
$name = 'Operator';
$hash = password_hash('AstraX#2026', PASSWORD_BCRYPT);

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo "Demo operator already exists.\n";
    exit(0);
}

$insert = $pdo->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
$insert->execute([$name, $email, $hash, 'COMMAND']);
echo "Seeded operator@astra.mil / AstraX#2026\n";
