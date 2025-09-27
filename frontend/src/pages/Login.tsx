import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth";
import { login as loginAPI } from "../api/authService";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Preencha todos os campos",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await loginAPI(username, password); // retorna { token, sub }

      // Usa diretamente 'username' ou 'sub' retornado pelo backend
      login(null, res.token, res.sub || username);

      Swal.fire({
        icon: "success",
        title: "Login efetuado",
        text: `Bem-vindo, ${res.sub || username}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/home");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Erro ao conectar com o servidor, tente novamente";
      Swal.fire({
        icon: "error",
        title: "Falha no login",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Estacionamento Inteligente" subtitle="Acesse sua conta">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Usuário
          </label>
          <input
            id="username"
            className="form-control"
            type="text"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Senha
          </label>
          <input
            id="password"
            className="form-control"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <button
          className="btn w-100"
          type="submit"
          style={{ backgroundColor: "#ffc107", color: "#1e3c72", fontWeight: "bold" }}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
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
