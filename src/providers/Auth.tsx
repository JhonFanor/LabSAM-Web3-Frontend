import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;  // Nuevo estado de carga
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true); // Comenzar a cargar
    try {
      const response = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        await refreshAccessToken();
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error verificando autenticación", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false); // Finalizar carga
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username_or_email: usernameOrEmail, password }),
      });

      if (!response.ok) throw new Error("Error en el inicio de sesión");

      const { access_token } = await response.json();
      localStorage.setItem("access_token", access_token);
      await checkAuthStatus();
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/token/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("No se pudo renovar el token");

      const { access_token } = await response.json();
      localStorage.setItem("access_token", access_token);
      await checkAuthStatus();
    } catch (error) {
      console.error("Error al renovar token:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(console.error);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
