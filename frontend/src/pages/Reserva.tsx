import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

// Interface para os dados do formulário de veículo
type VeiculoFormValues = {
  placa: string;
  marca: string;
  modelo: string;
};

// Interfaces do backend
interface Vaga {
  id: number;
  numeroVaga: number;
  tipo: string;
}

interface JwtPayload {
  id: number;
  sub: string;
  role: string;
  exp: number;
}

const Reserva: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<VeiculoFormValues>();

  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Efeito para carregar os detalhes da vaga
  useEffect(() => {
    const fetchVaga = async () => {
      try {
        const response = await api.get(`/recursos/${id}`);
        setVaga(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os detalhes da vaga.');
        setLoading(false);
      }
    };
    fetchVaga();
  }, [id]);

  // Função para formatar o tipo da vaga
  const formatTipoVaga = (tipo: string): string => {
    return tipo
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const onSubmit = async (data: VeiculoFormValues) => {
    setError(null);

    // Obtém o ID do usuário do token JWT
    const token = localStorage.getItem('token');
    let usuarioId: number | null = null;
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        usuarioId = decodedToken.id;
      } catch (err) {
        setError('Token de autenticação inválido.');
        console.error(err);
        return;
      }
    } else {
      setError('Usuário não autenticado.');
      return;
    }

    // Objeto de dados completo para a reserva
    const reservaData = {
      recursoId: id,
      placaVeiculo: data.placa,
      marcaVeiculo: data.marca,
      modeloVeiculo: data.modelo,
      usuarioId: usuarioId,
    };

    try {
      await api.post('/reservas', reservaData);
      alert('Reserva e cadastro do veículo efetuados com sucesso!');
      navigate('/vagas');
    } catch (err: any) {
      setError('Erro ao efetuar a reserva: ' + (err.response?.data?.message || 'Erro de rede.'));
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!vaga) {
    return <div className="text-center mt-5">Vaga não encontrada.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Reservar Vaga {vaga.numeroVaga}</h2>
        <p className="text-center">Tipo da Vaga: <strong>{formatTipoVaga(vaga.tipo)}</strong></p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo Placa */}
          <div className="mb-3">
            <label htmlFor="placa" className="form-label">Placa do Veículo</label>
            <input
              type="text"
              className="form-control"
              id="placa"
              {...register("placa", {
                required: "A placa é obrigatória",
                minLength: {
                  value: 7,
                  message: "A placa deve ter 7 caracteres"
                },
                maxLength: {
                  value: 7,
                  message: "A placa deve ter 7 caracteres"
                }
              })}
              onChange={(e) => e.target.value = e.target.value.toUpperCase()}
            />
            {errors.placa && <p className="text-danger">{errors.placa.message}</p>}
          </div>

          {/* Campo Marca */}
          <div className="mb-3">
            <label htmlFor="marca" className="form-label">Marca</label>
            <input
              type="text"
              className="form-control"
              id="marca"
              {...register("marca", { required: "A marca é obrigatória" })}
            />
            {errors.marca && <p className="text-danger">{errors.marca.message}</p>}
          </div>

          {/* Campo Modelo */}
          <div className="mb-3">
            <label htmlFor="modelo" className="form-label">Modelo</label>
            <input
              type="text"
              className="form-control"
              id="modelo"
              {...register("modelo", { required: "O modelo é obrigatório" })}
            />
            {errors.modelo && <p className="text-danger">{errors.modelo.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Confirmar Reserva
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reserva;