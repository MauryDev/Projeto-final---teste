import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './VagasDeEstacionamento.css';

interface Vaga {
  id: number;
  numeroVaga: number;
  nome: string;
  status: 'available' | 'occupied';
  tipo: 'CARRO_PEQUENO' | 'CARRO_GRANDE' | 'MOTO' | 'VAGA_PRIORIDADE' | 'VAGA_PCD' | 'VAGA_ELETRICA';
}

const VagasDeEstacionamento: React.FC = () => {
  const navigate = useNavigate();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await api.get('/recursos');
        setVagas(response.data);
      } catch (err) {
        setError('Erro ao carregar as vagas. Por favor, tente novamente.');
        console.error("Erro na requisição da API:", err);
      }
    };
    fetchVagas();
  }, []);

  const handleVagaClick = (id: number, status: string) => {
    if (status === 'available') {
      console.log(`Vaga ${id} selecionada para reserva.`);
      navigate(`/reservar/${id}`);
    } else {
      console.log(`Vaga ${id} está ocupada.`);
    }
  };

  const getTipoEmoji = (tipo: Vaga['tipo']): string => {
    switch (tipo) {
      case 'CARRO_PEQUENO':
      case 'CARRO_GRANDE':
        return '🚗';
      case 'MOTO':
        return '🏍️';
      case 'VAGA_PCD':
        return '♿';
      case 'VAGA_PRIORIDADE':
        return '⭐';
      case 'VAGA_ELETRICA':
        return '⚡';
      default:
        return '🅿️';
    }
  };

  const getTipoLabel = (tipo: Vaga['tipo']) => {
    switch (tipo) {
      case 'CARRO_PEQUENO':
        return 'Pequeno';
      case 'CARRO_GRANDE':
        return 'Grande';
      case 'MOTO':
        return 'Moto';
      case 'VAGA_PCD':
        return 'PCD';
      case 'VAGA_PRIORIDADE':
        return 'Prioridade';
      case 'VAGA_ELETRICA':
        return 'Elétrica';
      default:
        return '';
    }
  };

  return (
    <div className="container mt-4 vagas-container">
      <div className="text-center mb-4">
        <h1>Vagas de Estacionamento</h1>
        <p className="lead">Selecione uma vaga disponível para reservar.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="parking-lot-grid">
        {vagas.map((vaga) => (
          <div
            key={vaga.id}
            className={`parking-spot ${vaga.status === 'available' ? 'available' : 'occupied'}`}
            // O onClick está na div inteira, o que é um comportamento de botão
            onClick={() => handleVagaClick(vaga.id, vaga.status)}
          >
            <div className="spot-header">
              <span className="spot-number">Vaga {vaga.numeroVaga}</span>
              <span className={`spot-status-badge ${vaga.status === 'available' ? 'status-available' : 'status-occupied'}`}>
                {vaga.status === 'available' ? '✅ Livre' : '❌ Ocupada'}
              </span>
            </div>

            <div className="spot-info">
              <span className="spot-emoji">
                {getTipoEmoji(vaga.tipo)}
              </span>
              <span className="spot-type">{getTipoLabel(vaga.tipo)}</span>
            </div>

            {/* Botão visual se a vaga estiver disponível */}
            {vaga.status === 'available' && (
              <button
                className="btn btn-primary mt-2"
                onClick={(e) => {
                  e.stopPropagation(); // Previne que o evento de clique na div pai seja acionado
                  handleVagaClick(vaga.id, vaga.status);
                }}
              >
                Reservar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VagasDeEstacionamento;