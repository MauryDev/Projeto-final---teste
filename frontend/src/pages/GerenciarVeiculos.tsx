import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { VeiculoService } from "../api/veiculoService";
import { Veiculo } from "../types/Veiculo";
import { VeiculoRequestDto } from "../types/VeiculoRequestDto";

const initialFormState: VeiculoRequestDto = {
  placa: '',
  marca: '',
  modelo: '',
};


const GerenciarVeiculos: React.FC = () => {
  // hook de autenticação
  const { token, loading: authLoading } = useAuth();

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [formState, setFormState] = useState<VeiculoRequestDto>(initialFormState);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(false); // Loading geral da lista
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // Loading de ações específicas

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [veiculoToDelete, setVeiculoToDelete] = useState<Veiculo | null>(null);

  // Função de fetch que usa o Service (GET)
  const fetchVeiculos = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setMessage(null);
    try {
      const data = await VeiculoService.fetchVeiculos();
      setVeiculos([...data]);
    } catch (error) {
      let errorText = 'Erro ao carregar a lista de veículos. Tente novamente.';
      const axiosError = error as any;
      if (axios.isAxiosError(error) && (axiosError.response?.status === 403 || axiosError.response?.status === 401)) {
        errorText = 'Sessão expirada. Por favor, realize o login.';
      }
      setMessage({ type: 'danger', text: errorText });
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Efeito para carregar os dados
  useEffect(() => {
    if (!authLoading && token) {
      fetchVeiculos();
    }
  }, [authLoading, token, fetchVeiculos]);

  // Limpa a mensagem de feedback após 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name === 'placa' ? value.toUpperCase().slice(0, 7) : value }));
  };

  const handleEditClick = (veiculo: Veiculo) => {
    setFormState({
      placa: veiculo.placa,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
    });
    setIsEditing(veiculo.id);
    setMessage(null);
    // Rola para o topo do formulário no mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormState(initialFormState);
  };

  // Fluxo de Exclusão (DELETE)
  const handleDeleteClick = (veiculo: Veiculo) => {
    setVeiculoToDelete(veiculo);
    setShowConfirmModal(true);
  };

  const deleteVehicleApi = async (id: number) => {
    setLoadingAction(`delete-${id}`);
    setMessage(null);
    try {
      await VeiculoService.deleteVeiculo(id); // Usa o Service
      setMessage({ type: 'success', text: 'Veículo removido com sucesso!' });
      setVeiculos(prev => prev.filter(v => v.id !== id));
      if (isEditing === id) {
        handleCancelEdit();
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Erro ao remover o veículo. Sua sessão pode ter expirado.' });
      console.error('Erro ao deletar veículo:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleModalConfirm = () => {
    if (veiculoToDelete) {
      deleteVehicleApi(veiculoToDelete.id);
    }
    setShowConfirmModal(false);
    setVeiculoToDelete(null);
  };

  // Função principal de submissão (POST/PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formState.placa || !formState.marca || !formState.modelo) {
      setMessage({ type: 'danger', text: 'Todos os campos são obrigatórios.' });
      return;
    }
    if (formState.placa.length !== 7) {
      setMessage({ type: 'danger', text: 'A placa deve ter 7 caracteres.' });
      return;
    }

    const actionType = isEditing ? 'edit' : 'create';
    setLoadingAction(actionType);

    try {
      let data: Veiculo = {} as Veiculo;
      if (isEditing) {
        // Edição (PUT)
        data = await VeiculoService.updateVeiculo(isEditing, formState); // Usa o Service
        setMessage({ type: 'success', text: 'Veículo atualizado com sucesso!' });
        setVeiculos(prev => prev.map(v => v.id === isEditing ? data : v));
      } else {
        // Criação (POST)
        data = await VeiculoService.createVeiculo(formState); // Usa o Service
        setMessage({ type: 'success', text: 'Novo veículo adicionado com sucesso!' });
        setVeiculos(prev => [...prev, data]);
      }
      handleCancelEdit();
    } catch (error) {
      let errorText = 'Ocorreu um erro na operação. Verifique os dados e tente novamente.';
      const axiosError = error as any;
      if (axios.isAxiosError(error) && axiosError.response) {
        if (axiosError.response?.status === 409) {
          errorText = 'Conflito: Já existe um veículo com esta placa. A placa deve ser única.';
        } else if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
          errorText = 'Acesso negado. Sua sessão pode ter expirado.';
        }
      }
      setMessage({ type: 'danger', text: errorText });
      console.error('Erro na submissão:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  // --- MODAL DE CONFIRMAÇÃO (Estrutura Bootstrap) ---
  const ConfirmationModal: React.FC = () => {
    if (!showConfirmModal || !veiculoToDelete) return null;

    return (
      <>
        {/* Backdrop e Modal */}
        <div
          className={`modal fade ${showConfirmModal ? 'show d-block' : ''}`}
          style={{ display: showConfirmModal ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          tabIndex={-1}
          role="dialog"
          aria-hidden={!showConfirmModal}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header bg-danger text-white rounded-top-3">
                <h5 className="modal-title fw-bold" id="modal-title">
                  Confirmar Exclusão
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowConfirmModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-start">
                  {/* Ícone de Alerta usando Bootstrap Icons */}
                  <i className="bi bi-exclamation-triangle-fill fs-4 text-danger me-3 flex-shrink-0"></i>
                  <div>
                    <p className="mb-0 text-dark">
                      Você tem certeza que deseja remover o veículo <strong className="text-danger">{veiculoToDelete.placa}</strong> ({veiculoToDelete.marca} / {veiculoToDelete.modelo})? Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-end p-3 bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center"
                  onClick={handleModalConfirm}
                >
                  {loadingAction === `delete-${veiculoToDelete?.id}` ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Excluindo...
                    </>
                  ) : (
                    <>
                      {/* Ícone de Lixeira usando Bootstrap Icons */}
                      <i className="bi bi-trash3 me-1"></i> Excluir Veículo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // --- TELAS DE ESTADO (Carregando e Acesso Negado) ---
  if (authLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center p-5 bg-white rounded shadow-lg">
          <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="h4 text-secondary">Carregando autenticação...</h2>
          <p className="text-muted mt-1">Verificando sua sessão.</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center p-5 bg-white rounded shadow-lg border-top border-5 border-danger">
          {/* Ícone de Cadeado usando Bootstrap Icons */}
          <i className="bi bi-lock-fill fs-1 text-danger mb-4 mx-auto"></i>
          <h2 className="h3 fw-bold text-dark">Acesso Negado</h2>
          <p className="lead text-secondary mt-2">Você precisa estar logado para gerenciar seus veículos.</p>
          <p className="text-muted mt-1">Por favor, faça o login para continuar.</p>
        </div>
      </div>
    );
  }
  // --- FIM DAS TELAS DE ESTADO ---


  // --- RENDERIZAÇÃO DO LAYOUT PRINCIPAL (Com Divisão de Colunas) ---
  return (
    <div className="bg-light pt-5 pb-5 min-vh-100">
      <div className="container" style={{ maxWidth: '1000px' }}> {/* Container um pouco mais largo */}

        {/* Cabeçalho da Página */}
        <header className="card text-center mb-4 shadow border-top border-4 border-primary rounded-3">
          <div className="card-body p-4">
            <h1 className="h3 fw-bolder text-dark mb-0 d-flex align-items-center justify-content-center">
              {/* Ícone de Carro usando Bootstrap Icons */}
              <i className="bi bi-car-front-fill fs-4 text-primary me-3"></i>
              Gestão de Veículos
            </h1>
            <p className="text-secondary mt-2 mb-0">
              Adicione, edite ou remova seus veículos para agilizar as reservas de estacionamento.
            </p>
          </div>
        </header>

        {/* Mensagens de Feedback (Acima do Conteúdo Principal) */}
        {message && (
          <div className={`alert alert-${message.type} shadow mb-4 rounded-3`} role="alert">
            {message.text}
          </div>
        )}

        {/* --- CONTEÚDO PRINCIPAL DIVIDIDO EM DUAS COLUNAS --- */}
        <div className="row">

          {/* COLUNA ESQUERDA: FORMULÁRIO DE CADASTRO/EDIÇÃO */}
          <div className="col-12 col-md-5 mb-4 mb-md-0">
            <div className="card shadow-lg rounded-3 border-0">
              <div className="card-body p-4 p-md-4">
                <h2 className="card-title h5 text-primary mb-4 fw-bold">
                  {isEditing ? `Atualizar Veículo: ${veiculos.find(v => v.id === isEditing)?.placa}` : 'Cadastrar Novo Veículo'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="placa" className="form-label fw-bold small">Placa (7 Caracteres)</label>
                    <input
                      type="text"
                      id="placa"
                      name="placa"
                      value={formState.placa}
                      onChange={handleInputChange}
                      required
                      className="form-control text-uppercase"
                      style={{ letterSpacing: '0.15em' }}
                      maxLength={7}
                      pattern="[A-Z0-9]{7}"
                      title="A placa deve ter 7 caracteres alfanuméricos."
                      disabled={!!loadingAction}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="marca" className="form-label fw-bold small">Marca</label>
                    <input
                      type="text"
                      id="marca"
                      name="marca"
                      value={formState.marca}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      disabled={!!loadingAction}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="modelo" className="form-label fw-bold small">Modelo</label>
                    <input
                      type="text"
                      id="modelo"
                      name="modelo"
                      value={formState.modelo}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      disabled={!!loadingAction}
                    />
                  </div>

                  {/* Botões de Ação do Formulário */}
                  <div className="d-flex justify-content-end">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn btn-outline-secondary btn-sm me-2"
                        disabled={!!loadingAction}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm d-flex align-items-center"
                      disabled={!!loadingAction}
                    >
                      {loadingAction === 'create' || loadingAction === 'edit' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {isEditing ? 'Atualizando...' : 'Adicionando...'}
                        </>
                      ) : (
                        isEditing ? 'Salvar Alterações' : 'Adicionar'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>


          {/* COLUNA DIREITA: LISTA DE VEÍCULOS CADASTROS */}
          <div className="col-12 col-md-7">
            <h2 className="h5 fw-bold text-dark mb-3 border-bottom pb-2">
              Seus Veículos Cadastrados ({veiculos.length})
            </h2>

            {loading ? (
              <div className="text-center p-5 bg-white rounded shadow-sm">
                <p className="lead text-primary fw-medium">Carregando veículos...</p>
              </div>
            ) : veiculos.length === 0 ? (
              <div className="text-center p-4 bg-white rounded shadow-sm border border-secondary-subtle">
                <p className="text-muted mb-0">Nenhum veículo encontrado. Adicione o primeiro ao lado!</p>
              </div>
            ) : (
              <ul className="list-group shadow-sm">
                {veiculos.map((v) => (
                  <li
                    key={v.id}
                    className={`list-group-item d-flex align-items-center justify-content-between p-3 ${isEditing === v.id ? 'border-primary border-3' : ''}`}
                  >
                    <div className="d-flex align-items-center">
                      {/* Ícone de Carro usando Bootstrap Icons */}
                      <i className="bi bi-car-front-fill fs-5 text-primary me-3 flex-shrink-0"></i>
                      <div>
                        <p className="mb-0 fw-bold text-dark text-uppercase" style={{ letterSpacing: '0.05em' }}>{v.placa}</p>
                        <small className="text-muted">{v.marca} / {v.modelo}</small>
                      </div>
                    </div>

                    <div className="btn-group">
                      {/* Botão de Edição - Pencil */}
                      <button
                        onClick={() => handleEditClick(v)}
                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                        title="Editar Veículo"
                        disabled={!!loadingAction}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      {/* Botão de Exclusão - Trash3 */}
                      <button
                        onClick={() => handleDeleteClick(v)}
                        className="btn btn-sm btn-outline-danger ms-2 d-flex align-items-center"
                        title="Remover Veículo"
                        disabled={!!loadingAction}
                      >
                        {loadingAction === `delete-${v.id}` ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <i className="bi bi-trash3"></i>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer Style Element */}
        <footer className="mt-5 text-center text-secondary-emphasis">
          <small>Smart Park IoT Management System</small>
        </footer>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmationModal />
    </div>
  );
};

export default GerenciarVeiculos;