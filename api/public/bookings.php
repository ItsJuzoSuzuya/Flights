<?php
require_once "../secure/Database.php";

session_start();

$username = $_SESSION["username"] ?? null;

if (!$username) {
  echo json_encode([
    "error" => "You must be logged in to view your bookings."
  ]);
  exit;
}

$db = new Database();
$bookings = $db->getBookings($username);

if (!$bookings) {
  echo json_encode([
    'error' => 'No bookings found for this user.'
  ]);
  exit;
}

echo json_encode([
  'bookings' => $bookings
]);
