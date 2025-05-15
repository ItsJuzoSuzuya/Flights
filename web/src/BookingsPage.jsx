import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function getBookings() {
      try {
        const response = await fetch("/api/bookings", {
          credentials: "include"
        })

        if (!response.ok)
          throw Error("Failed to fetch bookings: " + response.statusText)

        const data = await response.json()
        const bookings = data["bookings"]
        setBookings(bookings)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      }
    }

    getBookings()
  }, [])

  if (isLoading)
    return <div>Loading...</div>

  return (
    <div>
      <IconButton sx={{ position: "absolute", left: 16, top: 16 }} onClick={() => navigate("/")}>
        <HomeIcon />
      </IconButton>
      <h1>Your Bookings</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}> Origin </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}> Destination </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}> Departure </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}> Arrival </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.flightNumber}>
                <TableCell>{booking.origin}</TableCell>
                <TableCell>{booking.destination}</TableCell>
                <TableCell>{booking.departureTime.date.slice(0, 16)}</TableCell>
                <TableCell>{booking.arrivalTime.date.slice(0, 16)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
