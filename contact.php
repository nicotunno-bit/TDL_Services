<?php
header('Content-Type: application/json');

// Récupération des données JSON POST
$data = json_decode(file_get_contents('php://input'), true);

$name    = htmlspecialchars($data['name']    ?? '');
$email   = htmlspecialchars($data['email']   ?? '');
$message = htmlspecialchars($data['message'] ?? '');
$phone   = htmlspecialchars($data['phone']   ?? '');
$type    = htmlspecialchars($data['type']    ?? '');

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Tous les champs sont requis']);
    exit;
}

$to      = "contact@tdlservices.fr";
$subject = "Demande de devis via site";
$body    = "Nom: $name\nEmail: $email";
if ($phone)   $body .= "\nTéléphone: $phone";
if ($type)    $body .= "\nProfil: $type";
$body .= "\nMessage:\n$message";

$headers = "From: $email\r\nReply-To: $email\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => 'Message envoyé']);
} else {
    http_response_code(500);
    echo json_encode(['error' => "Erreur lors de l'envoi"]);
}
