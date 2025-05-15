<?php
require_once '../src/flight.php';

class Database
{
  private PDO $pdo;

  public function __construct()
  {
    $this->connect();
  }

  public function connect(): void
  {
    #TODO: Move to .env
    $host = "postgres";
    $port = 5432;
    $db = "mydb";
    $user = "user";
    $pass = "password";

    $dsn = "pgsql:host=$host;port=$port;dbname=$db";

    try {
      $this->pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
      ]);
    } catch (PDOException $e) {
      die("Database connection failed: " . $e->getMessage());
    }
  }

  public function getPassword(string $username): string|null
  {
    $stmt = $this->pdo->prepare("SELECT password_hash FROM users WHERE username = ?");

    if (!$stmt->execute([$username])) {
      $errorInfo = $stmt->errorInfo();
      throw new RuntimeException("DB error: " . implode(" | ", $errorInfo));
    }

    $passwordHash = $stmt->fetchColumn();

    if ($passwordHash === false)
      return null;

    return $passwordHash;
  }

  public function registerUser(string $username, #[\SensitiveParameter] string $hashedPassword): bool
  {
    $stmt = $this->pdo->prepare("INSERT INTO users(username, password_hash) VALUES (?,?);");

    if (!$stmt->execute([$username, $hashedPassword])) {
      $errorInfo = $stmt->errorInfo();
      throw new RuntimeException("DB error: " . implode(" | ", $errorInfo));
      return false;
    }

    return true;
  }

  public function getFlights(): array
  {
    $flights = [];
    $result = $this->pdo->query("SELECT * FROM flights");

    foreach ($result as $row) {
      $flights[] = new Flight(
        $row['flight_number'],
        new DateTime($row['departure_time']),
        new DateTime($row['arrival_time']),
        $row['origin'],
        $row['destination'],
        (float)$row['price']
      );
    }

    return $flights;
  }

  public function bookFlight(string $username, string $flightNumber): bool
  {
    $stmt = $this->pdo->prepare("
      SELECT COUNT(*) FROM bookings
      WHERE user_id = (SELECT id FROM users WHERE username = ?)
      AND flight_id = (SELECT id FROM flights WHERE flight_number = ?)
    ");

    if (!$stmt->execute([$username, $flightNumber])) {
      $errorInfo = $stmt->errorInfo();
      throw new RuntimeException("DB error: " . implode(" | ", $errorInfo));
    }

    $exists = $stmt->fetchColumn() > 0;

    if ($exists) {
      echo "Flight already booked!";
      exit;
    }

    $stmt = $this->pdo->prepare("
      INSERT INTO bookings(user_id, flight_id) 
      VALUES (
        (SELECT id FROM users WHERE username = ?),
        (SELECT id FROM flights WHERE flight_number = ?)
      )
    ");

    if (!$stmt->execute([$username, $flightNumber])) {
      $errorInfo = $stmt->errorInfo();
      throw new RuntimeException("DB error: " . implode(" | ", $errorInfo));
    }

    return true;
  }

  public function getBookings($username): array
  {
    $stmt = $this->pdo->prepare("
      SELECT 
        f.flight_number, 
        f.departure_time, 
        f.arrival_time, 
        f.origin, 
        f.destination, 
        f.price
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN flights f ON b.flight_id = f.id
      WHERE u.username = ?
    ");

    if (!$stmt->execute([$username]))
      throw new RuntimeException("DB error: " . implode(" | ", $stmt->errorInfo()));

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $flightBookings = [];

    foreach ($rows as $row) {
      $flightBookings[] = new Flight(
        $row['flight_number'],
        new DateTime($row['departure_time']),
        new DateTime($row['arrival_time']),
        $row['origin'],
        $row['destination'],
        (float)$row['price']
      );
    }

    return $flightBookings;
  }
}
