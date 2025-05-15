import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    await fetch("/api/session", {
      credentials: "include"
    }).then(res => res.json())
      .then(data => {
        console.log("Session check response:", data.loggedIn);
        setIsAuthenticated(data.loggedIn)
        setLoading(false)
      })
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
