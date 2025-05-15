CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL UNIQUE,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    origin VARCHAR(25) NOT NULL,
    destination VARCHAR(25) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO flights(flight_number, departure_time, arrival_time, origin, destination, price) VALUES
  ('4239874237', '2025-05-15 16:30:00', '2025-05-15 18:00:00', 'Bachlor', 'Check24', 24.00),
  ('1846372950', '2025-07-24 7:15:00', '2025-08-24 2:44:00', 'Frankfurt am Main', 'Seoul Airport', 742.00),
  ('1234567890', '2025-09-01 10:00:00', '2025-09-01 12:00:00', 'New York', 'Los Angeles', 300.00),
  ('0987654321', '2025-10-15 14:30:00', '2025-10-15 16:30:00', 'London', 'Paris', 150.00),
  ('1122334455', '2025-11-20 9:00:00', '2025-11-20 11:30:00', 'Tokyo', 'Sydney', 800.00);
  

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'confirmed',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (flight_id) REFERENCES flights(id)
);
