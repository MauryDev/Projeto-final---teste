import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { format, isValid, differenceInMinutes, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { tipoVagaMap } from '../types/Reserva';

interface CarCardProps {
  reserva: {
    id: number;
    recursoId: number;
    nomeRecurso: string;
    tipoVaga: keyof typeof tipoVagaMap;
    placaVeiculo: string;
    marcaVeiculo: string;
    modeloVeiculo: string;
    horarioInicio: string;
    horarioFim: string | null;
  };
  onFinalizarReserva: (reservaId: number) => void;
}

const CarCard: React.FC<CarCardProps> = ({ reserva, onFinalizarReserva }) => {
  const [elapsedTime, setElapsedTime] = useState('');

  const startTime = parse(reserva.horarioInicio, 'dd-MM-yyyy HH:mm:ss', new Date());
  const isValidDate = isValid(startTime);

  useEffect(() => {
    if (!isValidDate) {
      setElapsedTime('Tempo não disponível');
      return;
    }

    const updateTime = () => {
      const now = new Date();
      const diffInMinutes = differenceInMinutes(now, startTime);
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      setElapsedTime(`${hours}h ${minutes}min`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [startTime, isValidDate]);

  const formattedHorarioInicio = isValidDate
    ? format(startTime, 'dd/MM/yyyy HH:mm', { locale: ptBR })
    : 'Data inválida';

  const vagaConfig = tipoVagaMap[reserva.tipoVaga];
  const vagaEmoji = vagaConfig?.icon || '🅿️';
  const vagaColor = vagaConfig?.color || 'text-dark';

  return (
    <div className="car-card bg-white rounded-3 shadow-sm border border-secondary p-2 position-relative d-flex flex-column justify-content-between">
      <div className="text-center mb-3">
        {/* Renderiza o emoji diretamente e aplica a cor */}
        <span className={`card-header-icon ${vagaColor}`} style={{ fontSize: '3rem' }}>
          {vagaEmoji}
        </span>
        <h5 className="mb-1 fw-bold mt-2">{reserva.nomeRecurso}</h5>
        <p className="text-muted small">{reserva.tipoVaga.toLowerCase().replace('_', ' ')}</p>
      </div>
      <hr className="my-2" />
      <div className="card-info my-3">
        <div className="d-flex align-items-center mb-2">
          <i className="bi bi-clock-fill me-2 text-success" style={{ fontSize: '1.2rem' }}></i>
          <div>
            <p className="mb-0 fw-bold">Início</p>
            <p className="mb-0 text-muted small">{formattedHorarioInicio}</p>
          </div>
        </div>
        <hr className="my-2" />
        <div className="d-flex align-items-center mb-2">
          <i className="bi bi-tags-fill me-2 text-warning" style={{ fontSize: '1.2rem' }}></i>
          <div>
            <p className="mb-0 fw-bold">Veículo</p>
            <p className="mb-0 text-muted small">{reserva.marcaVeiculo} - {reserva.modeloVeiculo}</p>
            <p className="mb-0 fw-bold text-danger">{reserva.placaVeiculo}</p>
          </div>
        </div>
        <hr className="my-2" />
        <div className="text-center mt-3">
          <p className="mb-0 fw-bold text-success">
            <i className="bi bi-stopwatch-fill me-2" style={{ fontSize: '1.2rem' }}></i>
            Tempo Decorrido
          </p>
          <p className="display-6 fw-bold text-success">{elapsedTime}</p>
        </div>
      </div>

      <Button
        variant="danger"
        className="w-100 mt-3"
        onClick={() => onFinalizarReserva(reserva.id)}
        disabled={!!reserva.horarioFim}
      >
        <i className="bi bi-box-arrow-right me-2"></i> Finalizar Estadia
      </Button>
    </div>
  );
};

export default CarCard;