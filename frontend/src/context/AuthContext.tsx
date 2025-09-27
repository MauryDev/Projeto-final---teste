import React, { createContext, useState, ReactNode, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export interface TokenPayload {
  sub: string; // username
  id: number;  // userId
  role?: string;
  iat: number;
  exp: number;
}

export interface AuthContextType {
  id: number | null;
  token: string | null;
  username: string | null;
  login: (token: string) => void;
  logout: () => void;
  setUsername: (username: string) => void; // adicionar esta função
  loading: boolean;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      try {
        const decoded: TokenPayload = jwtDecode(savedToken);
        setToken(savedToken);
        setUsername(decoded.sub);
        setId(decoded.id);

        localStorage.setItem("username", decoded.sub);
        localStorage.setItem("id", decoded.id.toString());
      } catch {
        setToken(null);
        setUsername(null);
        setId(null);
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded: TokenPayload = jwtDecode(newToken);
      setToken(newToken);
      setUsername(decoded.sub);
      setId(decoded.id);

      localStorage.setItem("token", newToken);
      localStorage.setItem("username", decoded.sub);
      localStorage.setItem("id", decoded.id.toString());
    } catch {
      setToken(null);
      setUsername(null);
      setId(null);
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
  };

  return (
    <AuthContext.Provider value={{ id, token, username, login, logout, setUsername, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const AuthContext = createContext<AuthContextType | null>(null);