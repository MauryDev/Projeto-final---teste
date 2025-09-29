import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { ClienteService, ClienteForm } from "../api/clienteService";
import Swal from "sweetalert2";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { AxiosError } from "axios";

// Interface para o DTO de requisição
interface ClienteRequestDto {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

// Componente para exibir e editar campos de informação
const InfoField = ({ label, name, value, onChange, isEditing, type = "text" }: {
  label: string;
  name: keyof ClienteForm;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  type?: string;
}) => (
  <div className="col-md-6">
    <label className="form-label fw-semibold text-muted">{label}</label>
    <div className="input-group mb-3">
      <input
        type={type}
        name={name}
        className={`form-control form-control-lg ${isEditing ? "border-primary" : "border-0 bg-light"}`}
        value={value}
        onChange={onChange}
        readOnly={!isEditing}
      />
    </div>
  </div>
);

export default function PerfilUsuario() {
  const { id: userId, email: userEmail, loading: authLoading } = useAuth();
  const [cliente, setCliente] = useState<ClienteForm | null>(null);
  const [formData, setFormData] = useState<ClienteForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Usa useCallback para memorizar a função e evitar que ela seja recriada em cada render
  const fetchCliente = useCallback(async () => {
    if (!userId || authLoading) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await ClienteService.fetchClienteByUsuarioId(userId);
      setCliente(data);
      setFormData(data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response && axiosError.response.status === 404) {
        setCliente(null);
        setFormData({ nome: '', cpf: '', telefone: '', email: userEmail || '' });
        setIsEditing(true);
        setError(null);
      } else {
        console.error("Erro ao carregar cliente:", err);
        setError("Erro ao carregar dados do cliente.");
      }
    } finally {
      setLoading(false);
    }
  }, [userId, authLoading, userEmail]);

  // useEffect que executa a função de busca apenas quando suas dependências mudam
  useEffect(() => {
    fetchCliente();
  }, [fetchCliente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!formData || !userId) return;
    setLoading(true);

    try {
      if (cliente) {
        await ClienteService.updateCliente(formData);
      } else {
        const payload: ClienteRequestDto = {
          nome: formData.nome,
          cpf: formData.cpf,
          telefone: formData.telefone,
          email: formData.email || '',
        };
        await ClienteService.createCliente(payload);
      }

      // Após salvar, recarrega os dados para garantir que a interface reflita o estado atual
      fetchCliente();

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Perfil salvo com sucesso!',
        showConfirmButton: false,
        timer: 1500,
      });

    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError;
      let errorMessage = 'Erro ao salvar perfil. Tente novamente.';

      if (axiosError.response && axiosError.response.status === 409) {
        errorMessage = 'O CPF informado já está cadastrado no sistema.';
      } else {
        console.error("Erro ao salvar cliente:", err);
      }

      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
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

  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!formData) return <p className="text-center mt-5">Dados do formulário não disponíveis.</p>;

  const isNewProfile = !cliente;

  return (
    <>
      <div className="container mt-5">
        <div
          className="card shadow-lg border-0 rounded-4"
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          <div className="card-header bg-primary text-dark d-flex justify-content-between align-items-center rounded-top-4 p-4">
            <h4 className="mb-0 fw-bold">{isNewProfile ? 'Completar Perfil' : 'Meu Perfil'}</h4>
            <span className={`badge rounded-pill ${isEditing ? "bg-warning" : "bg-light"} text-dark`}>
              {isEditing ? "Modo Edição" : "Visualização"}
            </span>
          </div>
          <div className="card-body p-4">
            <div className="row g-4">
              <InfoField
                label="Nome"
                name="nome"
                value={formData.nome || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <InfoField
                label="CPF"
                name="cpf"
                value={formData.cpf || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <InfoField
                label="Telefone"
                name="telefone"
                value={formData.telefone || ""}
                onChange={handleChange}
                isEditing={isEditing}
              />
              <InfoField
                label="E-mail"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                isEditing={isEditing}
                type="email"
              />
            </div>

            <div className="d-flex justify-content-between flex-wrap mt-4">
              {!isEditing ? (
                <>
                  <button
                    className="btn btn-outline-primary shadow-sm me-2 mb-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bi bi-pencil-square me-2"></i> Editar Perfil
                  </button>
                  <button
                    className="btn btn-outline-secondary shadow-sm mb-2"
                    onClick={handleChangePassword}
                  >
                    <i className="bi bi-lock me-2"></i> Alterar Senha
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-success shadow-sm me-2 mb-2"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <i className="bi bi-check-circle me-2"></i> Salvar Perfil
                  </button>
                  <button
                    className="btn btn-danger shadow-sm me-2 mb-2"
                    onClick={() => {
                      if (cliente) {
                        setFormData(cliente);
                      }
                      setIsEditing(false);
                    }}
                    disabled={loading}
                  >
                    <i className="bi bi-x-circle me-2"></i> Cancelar
                  </button>
                </>
              )}
            </div>

            {isEditing && (
              <p className="mt-3 text-center text-muted fst-italic">
                <i className="bi bi-info-circle me-2"></i>
                Preencha os campos e clique em "Salvar" para atualizar seu perfil.
              </p>
            )}
          </div>
        </div>
      </div>

      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}