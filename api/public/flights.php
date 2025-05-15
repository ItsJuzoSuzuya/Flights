<?php

require_once '../secure/Database.php';

if ($_SERVER["REQUEST_METHOD"] !== "GET")
  http_response_code(405);

$db = new Database();
$flights = $db->getFlights();

echo json_encode($flights);
