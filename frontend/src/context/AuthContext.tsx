import React, { createContext, useState, ReactNode, useEffect } from "react";

export interface AuthContextType {
  id: string | null;
  token: string | null;
  username: string | null;
  login: (id: string | null, token: string, username: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem("id");
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (savedId && savedToken && savedUsername) {
      setId(savedId);
      setToken(savedToken);
      setUsername(savedUsername);
    }
    setLoading(false);
  }, []);

  const login = (newId: string | null, newToken: string, newUsername: string) => {
    setId(newId);
    setToken(newToken);
    setUsername(newUsername);

    if (newId) localStorage.setItem("id", newId);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
  };

  const logout = () => {
    setId(null);
    setToken(null);
    setUsername(null);
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ id, token, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
