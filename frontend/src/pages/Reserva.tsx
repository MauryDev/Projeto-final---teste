import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Veiculo } from "../types/Veiculo";

// Interfaces do backend
interface Vaga {
  id: number;
  numeroVaga: number;
  tipo: string;
}

const Reserva: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [veiculoSelecionadoId, setVeiculoSelecionadoId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Função para formatar o tipo da vaga
  const formatTipoVaga = (tipo: string): string => {
    if (!tipo) return 'Desconhecido';
    return tipo
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  // Efeito para buscar vaga e veículos do usuário
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado. Faça login para continuar.");
        setLoading(false);
        return;
      }

      try {
        const vagaResponse = await api.get(`/recursos/${id}`);
        setVaga(vagaResponse.data);
        const veiculosResponse = await api.get(`/veiculos`);
        setVeiculos(veiculosResponse.data);

        if (veiculosResponse.data.length > 0) {
          setVeiculoSelecionadoId(veiculosResponse.data[0].id);
        }

      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Erro de rede ou permissão negada.';
        setError(`Erro ao carregar dados: ${errMsg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Submeter reserva
  const handleReserva = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!veiculoSelecionadoId) {
      setError("Selecione um veículo para reservar a vaga.");
      return;
    }

    const veiculo = veiculos.find(v => v.id === veiculoSelecionadoId);
    if (!veiculo) {
      setError("Veículo selecionado não encontrado na sua lista.");
      return;
    }

    setIsSubmitting(true);

    const reservaData = {
      recursoId: id,
      placaVeiculo: veiculo.placa,
      marcaVeiculo: veiculo.marca,
      modeloVeiculo: veiculo.modelo,
    };

    try {
      await api.post("/reservas", reservaData);
      setSuccessMessage('🎉 Reserva efetuada com sucesso! Redirecionando...');

      // ✨ Redireciona para a tela de reservas ativas
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/minhas-reservas');
      }, 3000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro de rede. Verifique o console.';
      if (err.response?.status === 409) {
        setError(`Conflito: ${errorMessage}`);
      } else if (err.response?.status === 401) {
        setError('Sessão expirada. Por favor, faça login novamente.');
      } else {
        setError('Erro ao efetuar a reserva: ' + errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (código de renderização e JSX)

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3 text-secondary">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error && !vaga) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
        <div className="alert alert-danger p-4 rounded-3 shadow-lg border-start border-5 border-danger w-100" style={{ maxWidth: '500px' }} role="alert">
          <p className="fw-bold">Falha Crítica:</p>
          <p>{error}</p>
          <button
            onClick={() => navigate('/vagas')}
            className="btn btn-danger mt-3 w-100"
          >
            Voltar para Vagas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card shadow-lg p-4 p-md-5 w-100" style={{ maxWidth: '500px' }}>

        <h2 className="text-center mb-2 fw-bold fs-3 text-primary">
          Confirmar Reserva
        </h2>
        <p className="text-center text-secondary mb-4">
          Vaga: <strong className="text-dark me-2">{vaga?.numeroVaga}</strong> | Tipo:
          <strong className="text-primary">
            {vaga ? formatTipoVaga(vaga.tipo) : 'Desconhecido'}
          </strong>
        </p>

        {successMessage && (
          <div className="alert alert-success p-3 mb-4 rounded-3 shadow-sm" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i> {successMessage}
          </div>
        )}

        {error && (
          <div className="alert alert-danger p-3 mb-4 rounded-3 shadow-sm" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {veiculos.length === 0 ? (
          <div className="alert alert-warning mb-4" role="alert">
            Você não possui veículos cadastrados. Por favor, cadastre um veículo primeiro.
            <button
              onClick={() => navigate('/gerenciar-veiculos')}
              className="btn btn-sm btn-warning mt-2 d-block w-100"
            >
              Ir para Cadastro de Veículos
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="veiculo" className="form-label fw-bold">
                Selecione o Veículo para a Reserva
              </label>
              <select
                className="form-select form-select-lg p-3"
                id="veiculo"
                value={veiculoSelecionadoId || ""}
                onChange={(e) => setVeiculoSelecionadoId(Number(e.target.value))}
                disabled={isSubmitting}
              >
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.marca} {v.modelo}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleReserva}
              disabled={isSubmitting || !veiculoSelecionadoId}
              className={`btn btn-primary w-100 py-3 fw-bold shadow ${isSubmitting ? 'disabled' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Confirmando Reserva...
                </>
              ) : (
                'Reservar Agora'
              )}
            </button>
          </>
        )}

        <button
          onClick={() => navigate('/vagas')}
          className="btn btn-link text-secondary mt-3 w-100"
        >
          Cancelar e Voltar
        </button>
      </div>
    </div>
  );
};

export default Reserva;