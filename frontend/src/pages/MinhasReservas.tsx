import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import CarCard from '../components/CarCard';
import { ReservaResponseDto } from '../types/Reserva';

const MinhasReservas: React.FC = () => {
  const { token, loading: authLoading } = useAuth();
  const location = useLocation();
  const [reservas, setReservas] = useState<ReservaResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const fetchReservas = async () => {
      if (!token) {
        setError('Usuário não autenticado.');
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/reservas/ativas');
        setReservas(response.data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar suas reservas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [token, authLoading]);

  useEffect(() => {
    if (location.state?.novaReserva) {
      setReservas(current => [...current, location.state.novaReserva]);
    }
  }, [location.state]);

  const handleIniciarEstadia = async (reservaId: number) => {
    try {
      const response = await api.put(`/reservas/iniciar/${reservaId}`);
      const reservaAtualizada = response.data;

      setReservas(current =>
        current.map(r => r.id === reservaId ? reservaAtualizada : r)
      );
    } catch (err: any) {
      alert('Erro ao iniciar a estadia: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleFinalizarReserva = async (reservaId: number) => {
    try {
      const response = await api.put(`/reservas/finalizar/${reservaId}`);
      const reservaAtualizada = response.data;

      setReservas(current =>
        current.map(r => r.id === reservaId ? reservaAtualizada : r)
      );
    } catch (err: any) {
      alert('Erro ao finalizar a reserva: ' + (err.response?.data?.message || err.message));
    }
  };

  if (authLoading || loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container reservas-container">
      <h2 className="text-center text-dark">
        <i className="bi bi-car-block-fill me-2"></i> Minhas Vagas Ativas
      </h2>
      <p className="text-center text-muted mb-4">
        Visualize e gerencie suas reservas de estacionamento em tempo real.
      </p>

      {reservas.length === 0 ? (
        <div className="empty-state bg-light rounded-2 p-3 shadow-sm">
          <i className="bi bi-car-fill"></i>
          <p className="lead fw-normal">Nenhuma reserva ativa encontrada.</p>
          <p className="text-muted">Parece que você ainda não estacionou. Que tal encontrar uma vaga agora?</p>
        </div>
      ) : (
        <div className="row justify-content-center gx-4 gy-4">
          {reservas.map((reserva) => (
            <div key={reserva.id} className="col-xxl-3 col-lg-4 col-md-6">
              <CarCard
                key={reserva.id}
                reserva={reserva}
                onIniciarEstadia={handleIniciarEstadia}
                onFinalizarReserva={handleFinalizarReserva}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MinhasReservas;
