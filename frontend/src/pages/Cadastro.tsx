import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/api";
import AuthLayout from "../components/AuthLayout";

type FormValues = {
  username: string;
  password: string;
  // ✨ Os campos de cliente não são mais necessários aqui
};

export default function Cadastro() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // ✨ Apenas a requisição de cadastro do usuário é necessária
      await api.post('/usuarios', { username: data.username, password: data.password });

      Swal.fire({
        icon: "success",
        title: "Usuário criado!",
        text: "Sua conta foi criada. Faça login para completar seu perfil.",
        timer: 3000,
        showConfirmButton: false,
      });

      // Redireciona para a página de login
      navigate("/login");

    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao cadastrar. Verifique sua conexão ou tente novamente.";
      Swal.fire({ icon: "error", title: "Falha no cadastro", text: message });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Criar Conta"
      subtitle="Cadastre-se para usar o sistema"
      iconColor="#28a745"
      subtitleStyle={{ marginBottom: '0rem' }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ gap: '0.25rem' }}>
        <div className="mb-0.5">
          <label htmlFor="username" className="form-label">Email</label>
          <input
            id="username"
            className="form-control"
            type="text"
            placeholder="Digite seu email"
            {...register("username", { required: "Usuário é obrigatório" })}
            disabled={loading}
          />
          {errors.username && <p className="text-danger mb-0">{errors.username.message}</p>}
        </div>

        <div className="mb-0.5">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            id="password"
            className="form-control"
            type="password"
            placeholder="Digite sua senha"
            {...register("password", {
              required: "Senha é obrigatória",
              minLength: { value: 6, message: "Senha precisa ter no mínimo 6 caracteres" },
            })}
            disabled={loading}
            autoComplete="new-password"
          />
          {errors.password && <p className="text-danger mb-0">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="btn w-100 mt-1"
          style={{ backgroundColor: "#28a745", color: "#fff", fontWeight: "bold" }}
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <p className="text-center mt-1 mb-0">
        Já tem conta?{" "}
        <span
          style={{ color: "#2a5298", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Faça login
        </span>
      </p>
    </AuthLayout>
  );
}