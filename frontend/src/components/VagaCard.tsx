import React from "react";
import { RecursoResponse } from "../api/vagaService";

interface VagaCardProps {
  recurso: RecursoResponse;
  onEdit: (recurso: RecursoResponse) => void;
  onDelete: (id: number) => void;
}

const getStatusDetails = (status: string) => {
  switch (status) {
    case "available":
      return { label: "Disponível", icon: "bi-check-circle-fill", color: "text-success" };
    case "occupied":
      return { label: "Ocupada", icon: "bi-x-circle-fill", color: "text-danger" };
    case "reserved":
      return { label: "Reservada", icon: "bi-info-circle-fill", color: "text-warning" };
    default:
      return { label: "Desconhecido", icon: "bi-question-circle-fill", color: "text-secondary" };
  }
};

const getTipoVagaDetails = (tipo: string) => {
  switch (tipo) {
    case "CARRO_PEQUENO":
      return { label: "Carro Pequeno", icon: "bi-car-front-fill" };
    case "CARRO_GRANDE":
      return { label: "Carro Grande", icon: "bi-truck" };
    case "MOTO":
      return { label: "Moto", icon: "bi-motorbike" };
    case "VAGA_PCD":
      return { label: "PCD", icon: "bi-person-wheelchair" };
    case "VAGA_ELETRICA":
      return { label: "Elétrica", icon: "bi-ev-front-fill" };
    case "VAGA_PRIORIDADE":
      return { label: "Prioridade", icon: "bi-arrow-through-heart-fill" };
    default:
      return { label: "Não Identificado", icon: "bi-question-square" };
  }
};

export const VagaCard: React.FC<VagaCardProps> = ({ recurso, onEdit, onDelete }) => {
  const status = getStatusDetails(recurso.status);
  const tipo = getTipoVagaDetails(recurso.tipo);

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className={`card h-100 shadow-sm border-0 rounded-4 overflow-hidden`}>
        <div className={`card-header ${status.color} bg-light py-3 border-0`}>
          <h5 className="card-title fw-bold mb-0 text-center">
            <i className={`bi ${tipo.icon} me-2 ${status.color}`}></i>
            <span className="text-secondary">{recurso.nome}</span>
          </h5>
        </div>
        <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
          <div className="mb-2">
            <i className={`bi ${status.icon} ${status.color} display-5`}></i>
          </div>
          <p className={`fw-bold text-uppercase fs-5 ${status.color}`}>{status.label}</p>
          <p className="text-muted mb-0">{tipo.label}</p>
        </div>
        <div className="card-footer bg-light border-0 d-flex justify-content-around py-3">
          <button
            className="btn btn-sm btn-outline-info rounded-pill"
            onClick={() => onEdit(recurso)}
          >
            <i className="bi bi-pencil-square me-1"></i> Editar
          </button>
          <button
            className="btn btn-sm btn-outline-danger rounded-pill"
            onClick={() => onDelete(recurso.id!)}
          >
            <i className="bi bi-trash me-1"></i> Excluir
          </button>
        </div>
      </div>
    </div>
  );
};