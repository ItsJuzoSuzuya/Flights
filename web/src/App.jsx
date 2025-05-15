import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Flight from './Flight'
import React from 'react'
import { AuthProvider, useAuth } from './auth'
import { BookingsPage } from './BookingsPage'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return <div>Loading...</div>

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Flight />
            </PrivateRoute>
          } />
          <Route path='/account/bookings' element={
            <PrivateRoute>
              <BookingsPage />
            </PrivateRoute>
          } />
        </Routes >
      </Router>
    </AuthProvider>
  )
}

export default App
