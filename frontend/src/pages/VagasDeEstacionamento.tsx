import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ReservationFeedback } from '../types/ReservationFeedback';

interface Vaga {
  id: number;
  numeroVaga: number;
  nome: string;
  status: 'available' | 'occupied';
  tipo: 'CARRO_PEQUENO' | 'CARRO_GRANDE' | 'MOTO' | 'VAGA_PRIORIDADE' | 'VAGA_PCD' | 'VAGA_ELETRICA';
}

// --- DEFINIÇÃO DE TIPOS E ESTILOS INLINE ---
const customStyles = `
    /* Corrigindo a largura mínima do card para não ficar 'estreito' */
    .parking-lot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; } 

    /* Estilos Globais e Fundo (Light Mode) */
    body { background-color: #ffffff; } /* Fundo Branco */
    .bg-dark-custom { background-color: #ffffff !important; color: #000000; min-height: 100vh; } /* Fundo Branco, Texto Preto */
    .vagas-container { max-width: 1400px; margin: auto; }

    /* Estilo do Header: PADRÃO PRETO, HOVER BRANCO (REVERSO) */
    .parking-header {
        background-color: #2c2c2c; /* PADRÃO: Fundo escuro (Preto) */
        color: #fff; /* Texto branco no modo escuro padrão */
        border-bottom: 4px solid #0d6efd;
        transition: all 0.3s ease;
    }
    .parking-header .text-primary {
        color: #0d6efd !important; /* Mantém o texto principal azul no padrão */
    }
    .parking-header .text-muted {
        color: #aaa !important; /* Texto mudo cinza claro no padrão */
    }
    
    .parking-header:hover {
        background-color: #ffffff !important; /* HOVER: Fundo BRANCO */
        color: #000 !important; /* Texto preto no hover */
        box-shadow: 0 0 15px rgba(0, 13, 253, 0.4); 
    }
    .parking-header:hover .text-primary {
        color: #0d6efd !important; /* Mantém o azul no hover */
    }
    .parking-header:hover .text-muted {
        color: #666 !important; /* Volta para cinza escuro no hover */
    }

    /* Estilo da Vaga (Card - Padrão Light) */
    .parking-spot { 
        background-color: #ffffff; /* Fundo Branco */
        border: 2px solid #ddd; /* Borda cinza claro */
        padding: 18px; 
        border-radius: 12px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
        transition: all 0.3s ease; 
        color: #000000; /* Texto Preto */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
    }

    /* Estilos Disponível/Ocupada */
    .parking-spot.available { 
        border-color: #198754; 
    }
    .parking-spot.available:hover {
        background-color: #1a1a1a; /* Card hover para preto */
        box-shadow: 0 0 20px rgba(0,0,0, 0.7);
        color: #fff; /* Texto branco no hover */
    }
    .parking-spot.available:hover .spot-number, 
    .parking-spot.available:hover .text-muted {
        color: #fff !important;
    }
    
    .parking-spot.occupied { 
        border-color: #dc3545; 
        opacity: 0.8;
        cursor: not-allowed;
    }

    /* Classes de Cores para Tipos (Badges/Info Box) */
    .info-badge-pcd { background-color: #0d6efd15; border-left-color: #0d6efd; color: #0d6efd; border-left: 4px solid; padding: 10px; border-radius: 8px; }
    .info-badge-priority { background-color: #ffc10715; border-left-color: #ffc107; color: #ffc107; border-left: 4px solid; padding: 10px; border-radius: 8px; }
    .info-badge-electric { background-color: #0dcaf015; border-left-color: #0dcaf0; color: #0dcaf0; border-left: 4px solid; padding: 10px; border-radius: 8px; }
    .info-badge-default { background-color: #6c757d15; border-left-color: #6c757d; color: #6c757d; border-left: 4px solid; padding: 10px; border-radius: 8px; }
    
    /* Outros elementos */
    .spot-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .spot-number { font-size: 1.5rem; font-weight: bold; color: #000; } /* Texto Preto */
    .spot-status-badge { padding: 4px 8px; border-radius: 10px; font-size: 0.8rem; font-weight: bold; }
    .parking-spot.available .spot-status-badge { background-color: #198754; color: #fff; } /* Texto branco no badge verde */
    .parking-spot.occupied .spot-status-badge { background-color: #dc3545; color: #fff; }
    .spot-info { display: flex; align-items: center; }
    .spot-emoji { font-size: 2rem; margin-right: 10px; }
    .spot-type { font-weight: 600; font-size: 0.9rem; }
    .text-muted { color: #666 !important; } /* Corrigido para cor cinza escura em Light Mode */

    .btn-primary { 
        background-color: #0d6efd !important; 
        border-color: #0d6efd !important; 
        color: #fff !important; 
        font-weight: bold;
        transition: background-color 0.2s ease;
    }
    .btn-primary:hover {
        background-color: #0b5ed7 !important;
    }
`;

const VagasDeEstacionamento: React.FC = () => {
  const navigate = useNavigate();

  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<ReservationFeedback | null>(null);

  // Mapeamento de Ícones (Unicode/Emojis)
  const getTipoEmoji = (tipo: Vaga['tipo']): string => {
    switch (tipo) {
      case 'CARRO_PEQUENO':
      case 'CARRO_GRANDE':
        return '🚗'; // Carro
      case 'MOTO':
        return '🏍️'; // Moto
      case 'VAGA_PCD':
        return '♿'; // Acessibilidade
      case 'VAGA_PRIORIDADE':
        return '⭐'; // Prioridade
      case 'VAGA_ELETRICA':
        return '⚡'; // Elétrica
      default:
        return '🅿️'; // Estacionamento
    }
  };

  const getTipoLabel = (tipo: Vaga['tipo']): string => {
    switch (tipo) {
      case 'CARRO_PEQUENO': return 'Pequeno';
      case 'CARRO_GRANDE': return 'Grande';
      case 'MOTO': return 'Moto';
      case 'VAGA_PCD': return 'Acessível';
      case 'VAGA_PRIORIDADE': return 'Prioridade';
      case 'VAGA_ELETRICA': return 'Elétrica';
      default: return 'Padrão';
    }
  };

  // O mapeamento de cores usa as classes do seu CSS (e/ou Bootstrap)
  const getTipoColorClasses = (tipo: Vaga['tipo']): string => {
    switch (tipo) {
      case 'VAGA_PCD': return 'info-badge-pcd';
      case 'VAGA_PRIORIDADE': return 'info-badge-priority';
      case 'VAGA_ELETRICA': return 'info-badge-electric';
      default: return 'info-badge-default';
    }
  };

  const fetchVagas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // USANDO A API
      const response = await api.get('/recursos');
      const sortedVagas = [...response.data].sort((a, b) => a.numeroVaga - b.numeroVaga);
      setVagas(sortedVagas);
    } catch (err) {
      setError('Erro ao carregar as vagas. Por favor, verifique a conexão com a API.');
      console.error("Erro na requisição da API:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVagas();

    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [fetchVagas, feedback]);

  const handleVagaClick = (id: number, status: 'available' | 'occupied') => {
    if (status === 'available') {
      navigate(`/reservar/${id}`);
    } else {
      setFeedback({
        type: 'danger',
        message: `A Vaga ${id} está ocupada e não pode ser reservada.`
      });
    }
  };

  // --- ESTADOS DE RENDERIZAÇÃO (LOADING & ERROR) ---
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff', padding: '20px' }}>
        <style>{customStyles}</style>
        <div style={{ fontSize: '3rem', color: '#0d6efd', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>📡</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0d6efd' }}>Estabelecendo Conexão com o Backend...</h2>
        <p style={{ color: '#aaa', marginTop: '0.5rem' }}>Carregando dados da API.</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#dc3545', color: '#fff', padding: '20px' }}>
        <style>{customStyles}</style>
        <div style={{ fontSize: '3rem', color: '#fff', marginBottom: '1rem' }}>🚨</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Erro Crítico de Conexão</h2>
        <p style={{ marginTop: '0.5rem' }}>{error}</p>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PRINCIPAL (DASHBOARD IOT) ---
  return (
    <div className="bg-dark-custom p-4 p-sm-5 text-light">
      {/* Injetando estilos globais corrigidos */}
      <style>{customStyles}</style>

      <div className="container-fluid vagas-container">

        {/* Cabeçalho - Usando a classe 'parking-header' e removendo o estilo inline que estava anulando o CSS */}
        <header className="text-center mb-5 p-4 rounded-3 shadow-lg parking-header">
          <h1 className="fs-3 fw-bolder text-primary d-flex align-items-center justify-content-center">
            <span className="fs-4 me-3">🅿️</span>
            Monitoramento de Estacionamento
          </h1>
          <p className="text-muted mt-2 lead">
            Status em tempo real das vagas. Clique em uma **Vaga Livre** para reservar.
          </p>
        </header>

        {/* Feedback */}
        {feedback && (
          <div className={`alert alert-${feedback.type === 'success' ? 'success' : 'danger'} border-start border-4 shadow-lg mx-auto mb-4 w-75`} role="alert">
            <p className="mb-0 fw-medium">{feedback.message}</p>
          </div>
        )}

        {vagas.length === 0 && (
          <div className="text-center p-5 rounded-3 shadow-lg mt-4" style={{ backgroundColor: '#f8f8f8', border: '1px solid #ddd' }}>
            <span className="fs-2 text-muted mb-3 d-block">😔</span>
            <p className="fs-5 text-dark">Nenhuma vaga cadastrada ou disponível.</p>
          </div>
        )}

        {/* Grade de Vagas */}
        <div className="parking-lot-grid">
          {vagas.map((vaga) => {
            const isAvailable = vaga.status === 'available';
            const tipoColorClasses = getTipoColorClasses(vaga.tipo);

            return (
              <div
                key={vaga.id}
                className={`parking-spot ${vaga.status}`}
                onClick={() => isAvailable ? handleVagaClick(vaga.id, vaga.status) : setFeedback({ type: 'danger', message: `A Vaga ${vaga.id} está ocupada e não pode ser reservada.` })}
              >
                <div className="spot-header">
                  <span className="spot-number">
                    {vaga.nome && <small className="text-muted ms-1">({vaga.nome})</small>}
                  </span>

                  <span className="spot-status-badge">
                    {isAvailable ? '✅ Livre' : '❌ Ocupada'}
                  </span>
                </div>

                {/* Sensor Data Display */}
                <div className={`spot-info ${tipoColorClasses}`}>
                  <div className="d-flex align-items-center">
                    <span className="spot-emoji">{getTipoEmoji(vaga.tipo)}</span>
                    <span className="spot-type">{getTipoLabel(vaga.tipo)}</span>
                  </div>
                </div>

                {/* Botão de Ação */}
                {isAvailable ? (
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVagaClick(vaga.id, vaga.status);
                    }}
                  >
                    RESERVAR 📲
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary w-100 mt-3"
                    disabled
                  >
                    VAGA INDISPONÍVEL
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VagasDeEstacionamento;