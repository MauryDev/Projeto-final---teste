import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { login as loginAPI } from "../api/authService";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginAPI(username, password);
      login(res.accessToken, username); // Salva token e username
      navigate("/home");
    } catch {
      setError("Credenciais inválidas");
    }
  };

  return (
    <AuthLayout title="Estacionamento Inteligente" subtitle="Acesse sua conta">
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="alert alert-danger">{error}</div>}
        <button
          className="btn w-100"
          type="submit"
          style={{
            backgroundColor: "#ffc107",
            color: "#1e3c72",
            fontWeight: "bold",
          }}
        >
          Entrar
        </button>
      </form>

      <p className="text-center mt-3 mb-0">
        Não tem conta?{" "}
        <span
          style={{ color: "#2a5298", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/cadastro")}
        >
          Cadastre-se
        </span>
      </p>
    </AuthLayout>
  );
}
