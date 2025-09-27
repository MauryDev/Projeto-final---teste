import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ClienteService, ClienteForm } from "../api/clienteService";
import Swal from "sweetalert2"; // Importa o SweetAlert2

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
  const { id: userId, loading: authLoading, setUsername } = useAuth();
  const [cliente, setCliente] = useState<ClienteForm | null>(null);
  const [formData, setFormData] = useState<ClienteForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!userId) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }

    const fetchCliente = async () => {
      try {
        const data = await ClienteService.fetchClienteByUsuarioId(userId);
        if (!data) setError("Cliente não encontrado");
        else {
          setCliente(data);
          setFormData(data);
        }
      } catch (err) {
        console.error("Erro ao carregar cliente:", err);
        setError("Erro ao carregar dados do cliente");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchCliente();
  }, [userId, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      const payload: ClienteForm = {
        ...formData,
        telefone: formData.telefone ?? "",
        email: formData.email ?? "",
      };

      const updated = await ClienteService.updateCliente(payload);
      setCliente(updated);
      setFormData(updated);
      setIsEditing(false);

      setUsername(updated.email);

      // SweetAlert2 para sucesso
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Perfil atualizado com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });

    } catch (err) {
      console.error(err);
      // SweetAlert2 para erro
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Erro ao atualizar perfil. Tente novamente.',
        showConfirmButton: true
      });
    }
  };

  const handleChangePassword = () => {
    // SweetAlert2 para alerta
    Swal.fire({
      icon: 'info',
      title: 'Atenção',
      text: "A função 'Alterar Senha' ainda não está disponível.",
      showConfirmButton: true
    });
  };

  if (loading || authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!cliente || !formData) return <p className="text-center mt-5">Cliente não encontrado</p>;

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <div className="card-header bg-primary text-dark d-flex justify-content-between align-items-center rounded-top-4 p-4">
          <h4 className="mb-0 fw-bold">Meu Perfil</h4>
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
              <button
                className="btn btn-outline-primary shadow-sm me-2 mb-2"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil-square me-2"></i> Editar Perfil
              </button>
            ) : (
              <button
                className="btn btn-success shadow-sm me-2 mb-2"
                onClick={handleSave}
              >
                <i className="bi bi-check-circle me-2"></i> Salvar Alterações
              </button>
            )}
            <button
              className="btn btn-outline-secondary shadow-sm mb-2"
              onClick={handleChangePassword}
            >
              <i className="bi bi-lock me-2"></i> Alterar Senha
            </button>
          </div>

          {isEditing && (
            <p className="mt-3 text-center text-muted fst-italic">
              <i className="bi bi-info-circle me-2"></i>
              Preencha os campos e clique em "Salvar Alterações" para atualizar seu perfil.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}