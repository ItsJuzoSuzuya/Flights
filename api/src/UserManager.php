<?php
require_once "../secure/Database.php";

class UserManager
{
  public function verifyLogin(string $username, #[\SensitiveParameter] string $password): bool
  {
    $db = new Database();
    $dbPassword = $db->getPassword($username);

    if ($dbPassword === null)
      return false;

    return password_verify($password, $dbPassword);
  }

  public function register(string $username, #[\SensitiveParameter] string $password): bool
  {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $db = new Database();
    $success = $db->registerUser($username, $hashedPassword);

    return $success;
  }
}
