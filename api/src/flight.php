<?php
readonly class Flight
{
  public function __construct(
    public string $flightNumber,
    public DateTime $departureTime,
    public DateTime $arrivalTime,
    public string $origin,
    public string $destination,
    public float $price
  ) {}
}
