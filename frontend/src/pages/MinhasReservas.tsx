import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

interface ReservaResponseDto {
  id: number;
  nomeRecurso: string;
  horarioInicio: string;
  horarioFim: string | null;
}

interface JwtPayload {
  id: number;
  sub: string;
  role: string;
  exp: number;
}

const MinhasReservas: React.FC = () => {
  const [reservas, setReservas] = useState<ReservaResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservas = async () => {
      const token = localStorage.getItem('token');
      const decodedToken = token ? jwtDecode<JwtPayload>(token) : null;
      const usuarioId = decodedToken?.id;

      if (!usuarioId) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }
      try {
        // Endpoint para buscar reservas ativas do usuário
        const response = await api.get(`/reservas/ativas/${usuarioId}`);
        setReservas(response.data);
      } catch (err) {
        setError('Erro ao carregar suas reservas.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []); // A dependência agora é um array vazio, para que o efeito rode apenas uma vez

  const handleFinalizarReserva = async (reservaId: number) => {
    try {
      await api.put(`/reservas/finalizar/${reservaId}`);
      alert('Reserva finalizada com sucesso!');
      setReservas(reservas.filter(reserva => reserva.id !== reservaId));
    } catch (err: any) {
      alert('Erro ao finalizar a reserva: ' + err.response?.data?.message);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Minhas Reservas Ativas</h2>
      {reservas.length === 0 ? (
        <p>Nenhuma reserva ativa no momento.</p>
      ) : (
        <ul className="list-group">
          {reservas.map(reserva => (
            <li key={reserva.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>Vaga {reserva.nomeRecurso} - Início: {new Date(reserva.horarioInicio).toLocaleString()}</span>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleFinalizarReserva(reserva.id)}
                disabled={!!reserva.horarioFim}
              >
                Finalizar Estadia
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MinhasReservas;