<?php
$method = $_SERVER['REQUEST_METHOD'];
$uri  = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);
$path = preg_replace('#^/api#', '', $path);

$flightNumber = null;
if (preg_match('#^/flights/(\d+)/book$#', $path, $matches)) {
  $flightNumber = $matches[1];
  $_GET['flightNumber'] = $flightNumber;
}

$routes = [
  'GET' => [
    '/session' => 'session.php',
    '/flights' => 'flights.php',
    '/bookings' => 'bookings.php',
  ],
  'POST' => [
    '/login' => 'login.php',
    '/register' => 'register.php',
    '/flights/' . $flightNumber . '/book' => 'book.php'
  ],
];


if (array_key_exists($method, $routes) && array_key_exists($path, $routes[$method])) {
  include $routes[$method][$path];
} else {
  http_response_code(404);
  echo '404 Not Found';
}
