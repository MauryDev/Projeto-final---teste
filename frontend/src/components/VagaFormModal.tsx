import React, { useState, useEffect } from "react";
import { RecursoResponse, RecursoRequest } from "../api/vagaService";

interface VagaFormModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (recurso: RecursoRequest) => void;
  recursoToEdit: RecursoResponse | null;
}

export const VagaFormModal: React.FC<VagaFormModalProps> = ({ show, onClose, onSave, recursoToEdit }) => {
  const [formData, setFormData] = useState<RecursoRequest>({
    tipo: "CARRO_PEQUENO",
    status: "available",
  });

  useEffect(() => {
    if (recursoToEdit) {
      setFormData({
        tipo: recursoToEdit.tipo,
        status: recursoToEdit.status,
      });
    } else {
      setFormData({
        tipo: "CARRO_PEQUENO",
        status: "available",
      });
    }
  }, [recursoToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-dark">
            <h5 className="modal-title">{recursoToEdit ? "Editar Vaga" : "Criar Nova Vaga"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="tipo" className="form-label">Tipo</label>
                <select
                  className="form-select"
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value="CARRO_PEQUENO">Carro Pequeno</option>
                  <option value="CARRO_GRANDE">Carro Grande</option>
                  <option value="MOTO">Moto</option>
                  <option value="VAGA_PCD">PCD</option>
                  <option value="VAGA_PRIORIDADE">Prioridade</option>
                  <option value="VAGA_ELETRICA">Elétrica</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="available">Disponível</option>
                  <option value="occupied">Ocupada</option>
                  <option value="reserved">Reservada</option>
                </select>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};