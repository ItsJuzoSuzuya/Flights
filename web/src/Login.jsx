import { Button, Input } from "@mui/material";
import { useState } from "react";
import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const { setIsAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' })
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  useState(() => {
    console.log("Login component mounted")
  }, [])

  async function register() {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData)
      }).then(res => res.json())
      return response
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  async function login() {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData)
      })

      if (!response.ok)
        throw new Error("Login failed: HTTP ${response.status}")

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        navigate("/")
      } else {
        console.log("Login failed: ", data.message)
      }
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  return (
    <div className="login" style={{ display: "flex", flexDirection: "column" }}>
      <h1> Check24 Flight </h1>
      <form id="login" onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", marginBottom: 50, alignItems: "center" }}>
        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          sx={{ width: 300, marginBottom: 3 }}
          required />

        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          sx={{ width: 300, marginBottom: 5 }}
          required />

        <div className="buttons">
          <Button
            type="submit"
            variant="contained"
            onClick={login}> Log In </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={register}> Register</Button>
        </div>
      </form>
    </div>
  );


}

export default Login;
