import React, { createContext, useState, ReactNode, useEffect, useCallback, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";

export interface TokenPayload {
  sub: string;
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthContextType {
  id: number | null;
  token: string | null;
  email: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null); // ✨ Refatorado: username para email
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setEmail(null); // ✨ Refatorado: setUsername para setEmail
    setId(null);
    setRole(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }, []);

  const decodeTokenAndSetState = useCallback((token: string) => {
    try {
      const decoded: TokenPayload = jwtDecode(token);
      setToken(token);
      setEmail(decoded.sub); // ✨ Refatorado: setUsername para setEmail
      setId(decoded.id);
      setRole(decoded.role);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (e) {
      console.error("Token inválido ou expirado", e);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      decodeTokenAndSetState(savedToken);
    }
    setLoading(false);
  }, [decodeTokenAndSetState]);

  const login = useCallback((newToken: string) => {
    localStorage.setItem("token", newToken);
    decodeTokenAndSetState(newToken);
  }, [decodeTokenAndSetState]);

  const value = { id, token, email, role, login, logout, loading }; // ✨ Refatorado: username para email

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};