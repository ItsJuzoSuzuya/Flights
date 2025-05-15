<?php
require_once '../secure/Database.php';
session_start();

$flightNumber = $_GET['flightNumber'] ?? null;
$user = $_SESSION['username'] ?? null;

if (!$user || !$flightNumber) {
  http_response_code(400);
  echo '400 Bad Request';
  exit;
}

$db = new Database();
$success = $db->bookFlight($user, $flightNumber);

if ($success) {
  echo "Flight booked successfully!";
} else {
  http_response_code(500);
  echo '500 Internal Server Error';
}
