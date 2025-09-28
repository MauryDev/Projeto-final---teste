import React from "react";
import { RecursoResponse } from "../api/vagaService";

interface VagasTableProps {
  recursos: RecursoResponse[];
  onEdit: (recurso: RecursoResponse) => void;
  onDelete: (id: number) => void;
}

export const VagasTable: React.FC<VagasTableProps> = ({ recursos, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success";
      case "occupied":
        return "bg-danger";
      case "reserved":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle table-striped rounded-4 overflow-hidden">
        <thead className="table-primary">
          <tr>
            <th scope="col">Identificador</th>
            <th scope="col">Status</th>
            <th scope="col">Tipo</th>
            <th scope="col" className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {recursos.map((recurso) => (
            <tr key={recurso.id}>
              <td>{recurso.nome}</td>
              <td>
                <span className={`badge ${getStatusColor(recurso.status)}`}>
                  {recurso.status.toUpperCase()}
                </span>
              </td>
              <td>{recurso.tipo}</td>
              <td className="text-center">
                <button
                  className="btn btn-sm btn-outline-info me-2"
                  onClick={() => onEdit(recurso)}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(recurso.id!)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};