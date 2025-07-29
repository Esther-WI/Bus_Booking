import { createContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        // Verify token with backend
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get("/api/auth/me");
        if (response.data) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
          setRole(response.data.role);
        } else {
          // Token is invalid, clear storage
          clearAuth();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        clearAuth();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const login = async (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role);
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        login, 
        logout,
        role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};