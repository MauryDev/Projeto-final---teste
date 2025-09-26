import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormValues>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      // Step 1: Create the user (Usuario)
      const userResponse = await api.post('/usuarios', {
        username: data.username,
        password: data.password,
      });

      // Step 2: Login to get the JWT token
      const loginResponse = await api.post('/auth', {
        username: data.username,
        password: data.password,
      });

      localStorage.setItem('token', loginResponse.data.token);

      // Step 3: Create the client (Cliente) with the obtained token
      // The token is automatically added by the Axios interceptor
      const clientResponse = await api.post('/clientes', {
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone,
      });

      alert("Usuário e Cliente criados com sucesso!");
      navigate("/vagas");

    } catch (err: any) {
      if (err.response) {
        alert("Erro no cadastro: " + err.response.data.message);
      } else {
        alert("Erro ao cadastrar usuário. Verifique sua conexão ou tente novamente.");
      }
      console.error(err);
    }
  };

  // Função para formatar o CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setValue('cpf', value, { shouldValidate: true });
  };

  // Função para formatar o telefone
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 15);
    setValue('telefone', value, { shouldValidate: true });
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

        <input
          className="form-control mb-2"
          type="text"
          placeholder="Nome Completo"
          {...register("nome", {
            required: "Nome é obrigatório",
            minLength: {
              value: 5,
              message: "Nome precisa ter no mínimo 5 caracteres"
            }
          })}
        />
        {errors.nome && (
          <p className="text-danger">{errors.nome.message}</p>
        )}

        <input
          className="form-control mb-2"
          type="text"
          placeholder="CPF (apenas números)"
          {...register("cpf", {
            required: "CPF é obrigatório",
            minLength: {
              value: 11,
              message: "O CPF deve ter 11 dígitos"
            },
            maxLength: {
              value: 11,
              message: "O CPF deve ter 11 dígitos"
            }
          })}
          onChange={handleCpfChange}
        />
        {errors.cpf && (
          <p className="text-danger">{errors.cpf.message}</p>
        )}

        <input
          className="form-control mb-2"
          type="text"
          placeholder="Telefone (apenas números)"
          {...register("telefone", {
            required: "Telefone é obrigatório",
            minLength: {
              value: 11,
              message: "O Telefone deve ter no mínimo 11 dígitos"
            },
            maxLength: {
              value: 15,
              message: "O Telefone deve ter no máximo 15 dígitos"
            }
          })}
          onChange={handleTelefoneChange}
        />
        {errors.telefone && (
          <p className="text-danger">{errors.telefone.message}</p>
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