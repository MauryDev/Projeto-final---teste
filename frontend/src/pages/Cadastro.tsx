import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUsuario } from "../api/usuarioService";
import AuthLayout from "../components/AuthLayout";

type FormValues = {
  username: string;
  password: string;
};

export default function Cadastro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      await createUsuario(data.username, data.password);
      alert("Usuário criado com sucesso!");
      navigate("/login");
    } catch (err) {
      alert("Erro ao cadastrar usuário");
    }
  };

  return (
    <AuthLayout
      title="Criar Conta"
      subtitle="Cadastre-se para usar o sistema"
      iconColor="#28a745"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Usuário"
          {...register("username", { required: "Usuário é obrigatório" })}
        />
        {errors.username && (
          <p className="text-danger">{errors.username.message}</p>
        )}

        <input
          className="form-control mb-2"
          type="password"
          placeholder="Senha"
          {...register("password", {
            required: "Senha é obrigatória",
            minLength: {
              value: 6,
              message: "Senha precisa ter no mínimo 6 caracteres",
            },
          })}
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}

        <button
          className="btn w-100 mt-2"
          type="submit"
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Cadastrar
        </button>
      </form>

      <p className="text-center mt-3 mb-0">
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
