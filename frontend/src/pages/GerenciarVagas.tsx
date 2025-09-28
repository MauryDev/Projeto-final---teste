import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { VagaService, RecursoResponse, RecursoRequest } from "../api/vagaService";
import { VagaFormModal } from "../components/VagaFormModal";
import { VagasGrid } from "../components/VagasGrid"; // Importe o novo componente

export default function GerenciarVagas() {
  const [recursos, setRecursos] = useState<RecursoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<RecursoResponse | null>(null);

  const fetchRecursos = async () => {
    try {
      setLoading(true);
      const data = await VagaService.fetchAll();
      setRecursos(data);
    } catch (err) {
      console.error("Erro ao carregar recursos:", err);
      setError("Erro ao carregar as vagas.");
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Não foi possível carregar as vagas.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecursos();
  }, []);

  const handleOpenModal = (recurso?: RecursoResponse) => {
    setEditingRecurso(recurso || null);
    setIsModalOpen(true);
  };

  const handleSaveRecurso = async (formData: RecursoRequest) => {
    try {
      if (editingRecurso) {
        await VagaService.update(editingRecurso.id!, formData);
        Swal.fire('Atualizado!', 'Recurso atualizado com sucesso.', 'success');
      } else {
        await VagaService.create(formData);
        Swal.fire('Criado!', 'Recurso criado com sucesso.', 'success');
      }
      fetchRecursos();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar recurso:", err);
      Swal.fire('Erro!', 'Não foi possível salvar o recurso.', 'error');
    }
  };

  const handleDeleteRecurso = async (id: number) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await VagaService.delete(id);
        fetchRecursos();
        Swal.fire('Deletado!', 'O recurso foi deletado.', 'success');
      } catch (err) {
        console.error("Erro ao deletar recurso:", err);
        Swal.fire('Erro!', 'Não foi possível deletar o recurso.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-5 text-danger">{error}</p>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Gestão de Vagas</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle me-2"></i> Adicionar Vaga
        </button>
      </div>
      <div className="card shadow-lg rounded-4 p-4">
        <VagasGrid
          recursos={recursos}
          onEdit={handleOpenModal}
          onDelete={handleDeleteRecurso}
        />
      </div>

      <VagaFormModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecurso}
        recursoToEdit={editingRecurso}
      />
    </div>
  );
}