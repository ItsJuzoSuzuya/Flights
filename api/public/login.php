<?php

require_once "../src/UserManager.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  exit;
}

$username = trim($_POST["username"] ?? "");
$password = $_POST["password"] ?? "";

if ($username == "") {
  echo json_encode([
    "success" => false,
    "message" => "Username is required."
  ]);
  exit;
}

if ($password == "") {
  echo json_encode([
    "success" => false,
    "message" => "Password is required."
  ]);
  exit;
}

$username = htmlspecialchars($username, ENT_QUOTES, "UTF-8");
$password = htmlspecialchars($password, ENT_QUOTES, "UTF-8");

$userManager = new UserManager();
$success = $userManager->verifyLogin($username, $password);

if ($success) {
  session_start();
  session_regenerate_id(true);

  $_SESSION["username"] = $username;

  echo json_encode([
    "success" => true,
    "message" => "Login successful."
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Invalid username or password."
  ]);
}
