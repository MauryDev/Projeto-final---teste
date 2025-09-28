import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { VagaService, RecursoResponse, RecursoRequest } from "../api/vagaService";
import { VagaFormModal } from "../components/VagaFormModal";
import { VagasGrid } from "../components/VagasGrid";

// --- INJETO DE ESTILOS CSS DA TELA DE VAGAS ---
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

      const sortedData = data.sort((a, b) => {
        const numA = parseInt(a.nome.match(/\d+/)?.[0] || '0', 10);
        const numB = parseInt(b.nome.match(/\d+/)?.[0] || '0', 10);
        return numA - numB;
      });

      setRecursos(sortedData);
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
        <style>{customStyles}</style>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <style>{customStyles}</style>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-custom p-4 p-sm-5 text-dark">
      <style>{customStyles}</style>
      <div className="container-fluid vagas-container">

        <header className="text-center mb-5 p-4 rounded-3 shadow-lg parking-header">
          <h1 className="fs-3 fw-bolder text-primary d-flex align-items-center justify-content-center">
            <span className="fs-4 me-3">⚙️</span>
            Gestão de Vagas
          </h1>
          <p className="text-muted mt-2 lead">
            Edite ou exclua vagas de estacionamento.
          </p>
        </header>

        <div className="d-flex justify-content-end align-items-center mb-4">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <i className="bi bi-plus-circle me-2"></i> Adicionar Vaga
          </button>
        </div>

        {recursos.length === 0 && (
          <div className="text-center p-5 rounded-3 shadow-lg mt-4" style={{ backgroundColor: '#f8f8f8', border: '1px solid #ddd' }}>
            <span className="fs-2 text-muted mb-3 d-block">😔</span>
            <p className="fs-5 text-dark">Nenhuma vaga cadastrada ou disponível.</p>
          </div>
        )}

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