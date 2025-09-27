import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/api";
import AuthLayout from "../components/AuthLayout";

type FormValues = {
  username: string;
  password: string;
  nome: string;
  cpf: string;
  telefone: string;
};

export default function Cadastro() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await api.post('/usuarios', { username: data.username, password: data.password });
      const loginResponse = await api.post('/auth', { username: data.username, password: data.password });
      localStorage.setItem('token', loginResponse.data.token);
      await api.post('/clientes', { nome: data.nome, cpf: data.cpf, telefone: data.telefone });

      Swal.fire({
        icon: "success",
        title: "Cadastro realizado",
        text: "Usuário e cliente criados com sucesso!",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/login");

    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao cadastrar. Verifique sua conexão ou tente novamente.";
      Swal.fire({ icon: "error", title: "Falha no cadastro", text: message });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setValue('cpf', value, { shouldValidate: true });
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 15);
    setValue('telefone', value, { shouldValidate: true });
  };

  return (
    <AuthLayout
      title="Criar Conta"
      subtitle="Cadastre-se para usar o sistema"
      iconColor="#28a745"
      subtitleStyle={{ marginBottom: '0rem' }} // diminui distância até o primeiro input
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ gap: '0.25rem' }}>
        <div className="mb-0.5">
          <label htmlFor="username" className="form-label">Usuário</label>
          <input
            id="username"
            className="form-control"
            type="text"
            placeholder="Digite seu usuário"
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

        <div className="mb-0.5">
          <label htmlFor="nome" className="form-label">Nome Completo</label>
          <input
            id="nome"
            className="form-control"
            type="text"
            placeholder="Digite seu nome"
            {...register("nome", {
              required: "Nome é obrigatório",
              minLength: { value: 5, message: "Nome precisa ter no mínimo 5 caracteres" },
            })}
            disabled={loading}
          />
          {errors.nome && <p className="text-danger mb-0">{errors.nome.message}</p>}
        </div>

        <div className="mb-0.5">
          <label htmlFor="cpf" className="form-label">CPF</label>
          <input
            id="cpf"
            className="form-control"
            type="text"
            placeholder="Apenas números"
            {...register("cpf", {
              required: "CPF é obrigatório",
              minLength: { value: 11, message: "CPF deve ter 11 dígitos" },
              maxLength: { value: 11, message: "CPF deve ter 11 dígitos" },
            })}
            onChange={handleCpfChange}
            disabled={loading}
          />
          {errors.cpf && <p className="text-danger mb-0">{errors.cpf.message}</p>}
        </div>

        <div className="mb-0.5">
          <label htmlFor="telefone" className="form-label">Telefone</label>
          <input
            id="telefone"
            className="form-control"
            type="text"
            placeholder="Apenas números"
            {...register("telefone", {
              required: "Telefone é obrigatório",
              minLength: { value: 11, message: "Telefone deve ter no mínimo 11 dígitos" },
              maxLength: { value: 15, message: "Telefone deve ter no máximo 15 dígitos" },
            })}
            onChange={handleTelefoneChange}
            disabled={loading}
          />
          {errors.telefone && <p className="text-danger mb-0">{errors.telefone.message}</p>}
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
