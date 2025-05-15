import { useEffect, useState } from "react";
import { Button, Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import { Navigate, useNavigate } from "react-router-dom";

function Flight() {
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/flights");
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error("Error fetching flight data:", error);
      }
    };

    fetchData();
  }, []);

  async function handleBookFlight(flightNumber) {
    const response = await fetch(`/api/flights/${flightNumber}/book`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error("Network response was not ok");

    const data = await response.json();

    if (data.success)
      console.log("Flight booked successfully");
    else
      console.error("Error booking flight:", data.message);
  }

  return (
    <div>
      <IconButton
        sx={{ position: "absolute", top: 16, right: 16 }}
        onClick={() => navigate("/account/bookings")}>
        <AirplaneTicketIcon />
      </IconButton>
      <h1> Flights </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}> Flight </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}> Origin </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}> Destination </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}> Departure </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}> Arrival </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}> Price </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight) => (
              <TableRow key={flight.flightNumber}>
                <TableCell> {flight.flightNumber}</TableCell>
                <TableCell> {flight.origin}</TableCell>
                <TableCell> {flight.destination}</TableCell>
                <TableCell> {flight.departureTime.date.slice(0, 16)}</TableCell>
                <TableCell> {flight.arrivalTime.date.slice(0, 16)}</TableCell>
                <TableCell> {flight.price}€</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginLeft: 2 }}
                    onClick={() => handleBookFlight(flight.flightNumber)}
                  > Book </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Flight;
