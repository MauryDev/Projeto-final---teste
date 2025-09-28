import React, { useEffect, useState } from 'react';
import { ReservaResponseDto, tipoVagaMap } from '../types/Reserva';
import { format, isValid, differenceInMinutes, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CarCardProps {
  reserva: ReservaResponseDto;
  onIniciarEstadia: (reservaId: number) => Promise<void>;
  onFinalizarReserva: (reservaId: number) => Promise<void>;
}

const CarCard: React.FC<CarCardProps> = ({ reserva, onIniciarEstadia, onFinalizarReserva }) => {
  const [elapsedTime, setElapsedTime] = useState('');

  // ✨ O estado local agora é removido. Usaremos diretamente `reserva.statusRecurso`
  // para determinar qual botão exibir.

  const startTime = reserva.horarioInicio ? parse(reserva.horarioInicio, 'dd-MM-yyyy HH:mm:ss', new Date()) : null;
  const isValidDate = startTime ? isValid(startTime) : false;

  useEffect(() => {
    // Só atualiza o tempo se a vaga estiver 'occupied'
    if (reserva.statusRecurso !== 'occupied' || !isValidDate) {
      setElapsedTime('Tempo não disponível');
      return;
    }

    const updateTime = () => {
      const now = new Date();
      const diffInMinutes = differenceInMinutes(now, startTime!);
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      setElapsedTime(`${hours}h ${minutes}min`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [startTime, isValidDate, reserva.statusRecurso]); // Adicione a dependência do status

  const handleButtonClick = async () => {
    try {
      if (reserva.statusRecurso === 'reserved') {
        await onIniciarEstadia(reserva.id);
      } else if (reserva.statusRecurso === 'occupied') {
        await onFinalizarReserva(reserva.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formattedHorarioInicio = startTime && isValidDate
    ? format(startTime, 'dd/MM/yyyy HH:mm', { locale: ptBR })
    : 'Data inválida';

  const vagaConfig = tipoVagaMap[reserva.tipoVaga];
  const vagaEmoji = vagaConfig?.icon || '🅿️';
  const vagaColor = vagaConfig?.color || 'text-dark';

  const isButtonDisabled = reserva.statusRecurso === 'available';
  const buttonText =
    reserva.statusRecurso === 'reserved' ? 'Iniciar Estadia' :
      reserva.statusRecurso === 'occupied' ? 'Finalizar Estadia' :
        'Disponível';
  const buttonVariant =
    reserva.statusRecurso === 'reserved' ? 'success' :
      reserva.statusRecurso === 'occupied' ? 'danger' :
        'secondary';

  return (
    <div className="car-card bg-white rounded-3 shadow-sm border border-secondary p-2 position-relative d-flex flex-column justify-content-between">
      <div className="text-center mb-3">
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

        {reserva.statusRecurso === 'occupied' && (
          <>
            <hr className="my-2" />
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-hourglass-split me-2 text-primary" style={{ fontSize: '1.2rem' }}></i>
              <div>
                <p className="mb-0 fw-bold">Tempo Estacionado</p>
                <p className="mb-0 text-muted small">{elapsedTime}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        className={`btn btn-${buttonVariant} mt-auto fw-bold w-100`}
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default CarCard;