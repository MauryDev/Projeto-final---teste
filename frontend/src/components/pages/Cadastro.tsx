import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUsuario } from "../../api/usuarioService";

type FormValues = {
  username: string;
  password: string;
};

export default function Cadastro() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      await createUsuario(data.username, data.password);
      alert("Usuário criado com sucesso!");
      navigate("/login"); // redireciona para login
    } catch (err) {
      alert("Erro ao cadastrar usuário");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cadastrar Usuário</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-3 shadow">
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Usuário"
          {...register("username", { required: "Usuário é obrigatório" })}
        />
        {errors.username && <p className="text-danger">{errors.username.message}</p>}

        <input
          className="form-control mb-2"
          type="password"
          placeholder="Senha"
          {...register("password", {
            required: "Senha é obrigatória",
            minLength: { value: 6, message: "Senha precisa ter no mínimo 6 caracteres" }
          })}
        />
        {errors.password && <p className="text-danger">{errors.password.message}</p>}

        <button className="btn btn-success w-100" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
