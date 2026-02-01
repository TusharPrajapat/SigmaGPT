import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  //check auth on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/thread`, {
          credentials: "include",
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
