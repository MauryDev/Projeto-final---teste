// src/components/VagasGrid.tsx

import React from "react";
import { RecursoResponse } from "../api/vagaService";

interface VagasGridProps {
  recursos: RecursoResponse[];
  onEdit: (recurso: RecursoResponse) => void;
  onDelete: (id: number) => void;
}

const getStatusDetails = (status: string) => {
  switch (status) {
    case "available":
      return { label: "Disponível", icon: "✅" };
    case "occupied":
      return { label: "Ocupada", icon: "❌" };
    case "reserved":
      return { label: "Reservada", icon: "⏳" };
    default:
      return { label: "Desconhecido", icon: "❓" };
  }
};

const getTipoDetails = (tipo: string) => {
  switch (tipo) {
    case 'CARRO_PEQUENO': return { label: 'Pequeno', emoji: '🚗', colorClass: 'info-badge-default' };
    case 'CARRO_GRANDE': return { label: 'Grande', emoji: '🚗', colorClass: 'info-badge-default' };
    case 'MOTO': return { label: 'Moto', emoji: '🏍️', colorClass: 'info-badge-default' };
    case 'VAGA_PCD': return { label: 'Acessível', emoji: '♿', colorClass: 'info-badge-pcd' };
    case 'VAGA_PRIORIDADE': return { label: 'Prioridade', emoji: '⭐', colorClass: 'info-badge-priority' };
    case 'VAGA_ELETRICA': return { label: 'Elétrica', emoji: '⚡', colorClass: 'info-badge-electric' };
    default: return { label: 'Padrão', emoji: '🅿️', colorClass: 'info-badge-default' };
  }
};

const VagaCard: React.FC<any> = ({ recurso, onEdit, onDelete }) => {
  const statusDetails = getStatusDetails(recurso.status);
  const tipoDetails = getTipoDetails(recurso.tipo);

  return (
    <div className={`parking-spot ${recurso.status}`}>
      <div className="spot-header">
        <span className="spot-number">
          {recurso.nome}
        </span>
        <span className="spot-status-badge">
          {statusDetails.icon} {statusDetails.label}
        </span>
      </div>

      <div className={`spot-info ${tipoDetails.colorClass}`}>
        <div className="d-flex align-items-center">
          <span className="spot-emoji">{tipoDetails.emoji}</span>
          <span className="spot-type">{tipoDetails.label}</span>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3 gap-2">
        <button
          className="btn btn-primary w-50"
          onClick={() => onEdit(recurso)}
        >
          <i className="bi bi-pencil-square me-1"></i> Editar
        </button>
        <button
          className="btn btn-danger w-50"
          onClick={() => onDelete(recurso.id!)}
        >
          <i className="bi bi-trash me-1"></i> Excluir
        </button>
      </div>
    </div>
  );
};

export const VagasGrid: React.FC<VagasGridProps> = ({ recursos, onEdit, onDelete }) => {
  return (
    <div className="parking-lot-grid">
      {recursos.map((recurso) => (
        <VagaCard key={recurso.id} recurso={recurso} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};